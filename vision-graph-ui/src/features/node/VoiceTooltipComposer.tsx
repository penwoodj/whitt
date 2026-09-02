import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import styled, { css } from 'styled-components'
import { Pin, X } from 'lucide-react'
import type { LocalSttEngine } from '../voice-capture/LocalSttEngine'
import { createCapture as defaultCreateCapture, type CaptureFactory, type CaptureHandle } from '../voice-capture/localCapture'
import type { SpeechStatus } from '../voice-capture/speechTypes'
import { chooseDialogPlacement, type Rect, type Viewport } from './voiceDialogPlacement'
import { recordingPulse } from '../../shared/keyframes'
import type { ContextPill, PromptPayload } from '../context-pills/contextPillTypes'

let activeEngine: LocalSttEngine | undefined

type VoiceTooltipComposerProps = {
  readonly nodeId: string
  readonly title: string
  readonly status: string
  readonly value: string
  readonly onChange: (value: string) => void
  readonly onSend: (value: string) => void
  readonly engine?: LocalSttEngine
  readonly captureFactory?: CaptureFactory
  readonly createCapture?: (engine: LocalSttEngine, factory?: CaptureFactory) => Promise<CaptureHandle>
  readonly anchorRect: Rect
  readonly viewport: Viewport
  readonly chatActive?: boolean
  readonly manualFocus?: boolean
  readonly neighbors?: readonly Rect[]
  readonly contextPills?: readonly ContextPill[]
  readonly onRemovePill?: (pillId: string) => void
  readonly onJumpToPill?: (pillId: string) => void
  readonly contextPayload?: PromptPayload
}

const Surface = styled.div<{ $side: 'left' | 'right'; $open: boolean; $isRec: boolean; $amplitude: number; $top: number; $offset: number }>`
  position: fixed;
  top: ${({ $top }) => `${$top}px`};
  ${({ $side }) => ($side === 'right' ? 'left' : 'right')}: ${({ $offset }) => `${$offset}px`};
  width: 280px;
  padding: ${({ theme }) => theme.spacing.md};
  display: ${({ $open }) => ($open ? 'grid' : 'none')};
  gap: ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.colors.bgElevated};
  border: 1px solid ${({ theme, $isRec }) => ($isRec ? theme.colors.recording : theme.colors.border)};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme, $amplitude }) => `${theme.shadow.md}, 0 0 ${8 + $amplitude * 18}px ${theme.colors.gorse}`};
  z-index: ${({ theme }) => theme.zIndex.tooltip};
  &::before { content: ''; position: absolute; top: 28px; ${({ $side }) => ($side === 'right' ? 'left: -6px' : 'right: -6px')}; width: 10px; height: 10px; background: ${({ theme }) => theme.colors.bgElevated}; border-left: 1px solid ${({ theme }) => theme.colors.border}; border-bottom: 1px solid ${({ theme }) => theme.colors.border}; transform: rotate(45deg); }
  @media (prefers-reduced-motion: reduce) { box-shadow: ${({ theme, $isRec }) => ($isRec ? `${theme.shadow.md}, ${theme.glow.recording}` : theme.shadow.md)}; }
`
const Preview = styled.button` text-align: left; color: ${({ theme }) => theme.colors.text}; background: ${({ theme }) => theme.colors.bg}; border: 1px solid ${({ theme }) => theme.colors.border}; border-radius: ${({ theme }) => theme.radius.md}; padding: ${({ theme }) => theme.spacing.sm}; cursor: pointer; `
const Editor = styled.textarea` min-height: 76px; resize: vertical; color: ${({ theme }) => theme.colors.text}; background: ${({ theme }) => theme.colors.bg}; border: 1px solid ${({ theme }) => theme.colors.border}; border-radius: ${({ theme }) => theme.radius.md}; padding: ${({ theme }) => theme.spacing.sm}; font: ${({ theme }) => theme.font.sans}; &:focus { border-color: ${({ theme }) => theme.colors.borderActive}; outline: none; } `
const Actions = styled.div` display: flex; gap: ${({ theme }) => theme.spacing.sm}; `
const Action = styled.button` flex: 1; color: ${({ theme }) => theme.colors.textInverse}; background: ${({ theme }) => theme.colors.primary}; border: 0; border-radius: ${({ theme }) => theme.radius.sm}; padding: ${({ theme }) => theme.spacing.sm}; cursor: pointer; &:disabled { background: ${({ theme }) => theme.colors.bgHover}; cursor: default; } `
const Pills = styled.div` display: flex; flex-wrap: wrap; gap: ${({ theme }) => theme.spacing.xs}; `
const Transcript = styled.div` padding: ${({ theme }) => theme.spacing.sm}; color: ${({ theme }) => theme.colors.textMuted}; background: ${({ theme }) => theme.colors.bg}; border-radius: ${({ theme }) => theme.radius.sm}; font: ${({ theme }) => theme.font.mono}; font-size: ${({ theme }) => theme.font.sizeXs}; `
const Dot = styled.span<{ $isRec: boolean }>` width: 8px; height: 8px; display: inline-block; border-radius: ${({ theme }) => theme.radius.pill}; background: ${({ theme, $isRec }) => ($isRec ? theme.colors.recording : theme.colors.textMuted)}; ${({ $isRec }) => $isRec && css`animation: ${recordingPulse} 1.2s ease-in-out infinite;`} @media (prefers-reduced-motion: reduce) { animation: none; } `
const Header = styled.div` display: flex; align-items: center; justify-content: space-between; color: ${({ theme }) => theme.colors.text }; font-weight: ${({ theme }) => theme.font.weightBold}; `
const Status = styled.span` color: ${({ theme }) => theme.colors.textMuted}; font-size: ${({ theme }) => theme.font.sizeXs}; `
const Alert = styled.div` color: ${({ theme }) => theme.colors.error}; font-size: ${({ theme }) => theme.font.sizeXs}; `
const Hint = styled.span` color: ${({ theme }) => theme.colors.textMuted}; font-size: ${({ theme }) => theme.font.sizeXs}; `
const PillButton = styled.div` color: ${({ theme }) => theme.colors.textMuted}; background: ${({ theme }) => theme.colors.bg}; border: 1px solid ${({ theme }) => theme.colors.border}; border-radius: ${({ theme }) => theme.radius.pill}; padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm}; cursor: pointer; `
const RemovePillButton = styled.button` color: ${({ theme }) => theme.colors.textMuted}; background: transparent; border: 0; cursor: pointer; `

const prefersReducedMotion = (): boolean => typeof window !== 'undefined' && typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function VoiceTooltipComposer({ nodeId, title, status, value, onChange, onSend, engine, captureFactory, createCapture = defaultCreateCapture, anchorRect, viewport, chatActive = true, manualFocus = false, neighbors = [], contextPills = [], onRemovePill, onJumpToPill, contextPayload }: VoiceTooltipComposerProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [pinned, setPinned] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [speechState, setSpeechState] = useState<SpeechStatus>('idle')
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState('')
  const [amplitude, setAmplitude] = useState(0)
  const editorRef = useRef<HTMLTextAreaElement>(null)
  const captureRef = useRef<CaptureHandle | null>(null)
  const placement = useMemo(() => chooseDialogPlacement(anchorRect, viewport, 280, neighbors), [anchorRect, neighbors, viewport])
  const isRec = speechState === 'listening' || speechState === 'permission-pending'
  const isOpen = !dismissed && (chatActive || manualFocus || pinned)
  const statusLabel = speechState === 'listening' ? 'Listening…' : speechState === 'processing' ? 'Processing…' : speechState === 'permission-pending' ? 'Requesting microphone…' : speechState === 'denied' ? 'Microphone denied' : speechState === 'error' ? 'Voice error' : status
  const dialogTop = Math.max(8, anchorRect.top)
  const dialogOffset = placement.side === 'right' ? anchorRect.right + 12 : viewport.width - anchorRect.left + 12

  useEffect(() => { if (isEditing) editorRef.current?.focus() }, [isEditing])
  useEffect(() => { if (manualFocus) setIsEditing(true) }, [manualFocus])
  useEffect(() => { if (chatActive) setDismissed(false) }, [chatActive])
  useEffect(() => { const close = (evt: MouseEvent) => { const target = evt.target; if (target instanceof Element && !target.closest(`[data-composer-node="${nodeId}"]`) && !pinned) setDismissed(true) }; const handleEscape = (evt: KeyboardEvent) => { if (evt.key === 'Escape' && !pinned) setDismissed(true) }; document.addEventListener('mousedown', close); document.addEventListener('keydown', handleEscape); return () => { document.removeEventListener('mousedown', close); document.removeEventListener('keydown', handleEscape) } }, [nodeId, pinned])
  useEffect(() => () => {
    captureRef.current?.cancel()
    captureRef.current = null
    if (activeEngine === engine) activeEngine = undefined
    engine?.dispose()
  }, [engine])

  useEffect(() => {
    if (speechState !== 'listening' || !captureRef.current) return undefined
    if (prefersReducedMotion()) {
      setAmplitude(0)
      return undefined
    }
    let frame = 0
    const sampleAmplitude = (): void => {
      const capture = captureRef.current
      if (!capture) return
      setAmplitude(capture.readAmplitude())
      frame = window.requestAnimationFrame(sampleAmplitude)
    }
    frame = window.requestAnimationFrame(sampleAmplitude)
    return () => window.cancelAnimationFrame(frame)
  }, [speechState])

  const toggleRec = useCallback(async () => {
    if (!engine) { setSpeechState('error'); setError('Local microphone unavailable'); return }
    if (isRec) {
      const capture = captureRef.current
      if (!capture) return
      captureRef.current = null
      if (activeEngine === engine) activeEngine = undefined
      setSpeechState('processing')
      try {
        for await (const segment of capture.stop()) {
          setTranscript((current) => `${current} ${segment.text}`.trim())
          onChange(`${value}${value ? ' ' : ''}${segment.text}`)
        }
        setSpeechState('stopped')
      } catch (caught) {
        setSpeechState('error')
        setError(caught instanceof Error ? caught.message : 'Voice input failed')
      }
      return
    }
    setError(''); setSpeechState('permission-pending')
    try {
      const capture = await createCapture(engine, captureFactory)
      captureRef.current = capture
      activeEngine = engine
      setSpeechState('listening')
    } catch (caught) { setSpeechState('error'); setError(caught instanceof Error ? caught.message : 'Voice input failed') }
  }, [captureFactory, createCapture, engine, isRec, onChange, value])
  const send = useCallback(() => { if (value.trim() && speechState !== 'processing') onSend(value.trim()) }, [onSend, speechState, value])
  const handleKeyDown = useCallback((evt: React.KeyboardEvent<HTMLTextAreaElement>) => { if (evt.key === 'Enter' && !evt.shiftKey) { evt.preventDefault(); send() } }, [send])
  const displayTranscript = transcript

  return <div data-composer-node={nodeId}>
    <Surface data-testid="voice-composer-surface" data-context-payload={JSON.stringify(contextPayload ?? { text: value, contextPills })} data-amplitude-state={amplitude > 0 ? 'active' : 'quiet'} id={`voice-composer-${nodeId}`} role="dialog" aria-label={`${title} voice composer`} aria-expanded={isOpen} $side={placement.side} $open={isOpen} $isRec={isRec} $amplitude={amplitude} $top={dialogTop} $offset={dialogOffset}>
      <Header><span>{title}</span><span><button type="button" aria-label="Pin composer" aria-pressed={pinned} onClick={() => setPinned((current) => !current)}><Pin aria-hidden="true" size={16} /></button><button type="button" aria-label="Close composer" onClick={() => { setPinned(false); setDismissed(true) }}><X aria-hidden="true" size={16} /></button></span></Header>
      {!isEditing && <Preview type="button" aria-label="Open prompt" onClick={() => { setDismissed(false); setIsEditing(true); setPinned(true) }}>{value || 'Speak or type a prompt…'}</Preview>}
      {isOpen && isEditing && <Editor ref={editorRef} placeholder="Ask anything..." aria-label="Prompt" value={value} onChange={(evt) => onChange(evt.target.value)} onKeyDown={handleKeyDown} />}
       <Pills>{contextPills.map((pill) => <PillButton key={pill.id} role="button" tabIndex={0} data-testid={`context-pill-${pill.id}`} data-line-range={pill.lineRange} data-file-path={pill.filePath} title={pill.textSnippet} onClick={() => onJumpToPill?.(pill.id)} onKeyDown={(evt) => { if (evt.key === 'Enter' || evt.key === ' ') onJumpToPill?.(pill.id) }}>{pill.filePath ? `${pill.filePath} ` : ''}{pill.lineRange} {pill.textSnippet}{onRemovePill && <RemovePillButton type="button" aria-label={`Remove ${pill.lineRange}`} data-testid={`remove-pill-${pill.id}`} onClick={(evt) => { evt.stopPropagation(); onRemovePill(pill.id) }}><X aria-hidden="true" size={12} /></RemovePillButton>}</PillButton>)}</Pills>
      <Actions><Action type="button" aria-label={isRec ? 'Stop microphone' : 'Start microphone'} onClick={() => void toggleRec()}><Dot data-testid="recording-indicator" data-motion={prefersReducedMotion() ? 'static' : 'animated'} aria-hidden="true" $isRec={isRec} /> {isRec ? 'Stop' : 'Mic'}</Action><Action type="button" aria-label="Send prompt" disabled={!value.trim()} onClick={send}>Send</Action></Actions>
      <Status role="status">{statusLabel}</Status>
      {displayTranscript && <Transcript aria-label="Live transcript">{displayTranscript}</Transcript>}
      {isRec && <Hint>Hold Space to speak</Hint>}
      {error && <Alert role="alert">{error}</Alert>}
    </Surface>
  </div>
}

export { chooseDialogPlacement }
