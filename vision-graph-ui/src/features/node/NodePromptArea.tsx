import React from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import NodeMicBtn from './NodeMicBtn'
import type { ContextPill } from '../context-pills/contextPillTypes'

type NodePromptAreaProps = {
  value: string
  onChange: (txt: string) => void
  streamedTxt?: string
  isStream: boolean
  isRec: boolean
  isCycleRun: boolean
  onToggleRec: () => void
  onStreamTxt?: (txt: string) => void
  onSend: () => void
  contextPills?: ContextPill[]
  onRemovePill?: (pillId: string) => void
}

const MAX_HEIGHT = 154
const LINE_HEIGHT = 22
const MAX_VISIBLE_PILLS = 6

const PillRow = styled.div<{ $showOverflow: boolean }>`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.bg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`

const Pill = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme }) => theme.colors.bgElevated};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.pill};
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.font.sizeXs};
  cursor: pointer;
  transition: background-color ${({ theme }) => theme.transition.fast};

  &:hover {
    background-color: ${({ theme }) => theme.colors.bgHover};
  }
`

const PillText = styled.span`
  font-family: ${({ theme }) => theme.font.mono};
`

const RemoveBtn = styled.button`
  display: none;
  width: 16px;
  height: 16px;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.textMuted};
  cursor: pointer;
  font-size: 14px;
  line-height: 1;
  border-radius: 2px;

  ${Pill}:hover & {
    display: flex;
  }

  &:hover {
    background-color: ${({ theme }) => theme.colors.bgHover};
    color: ${({ theme }) => theme.colors.error};
  }
`

const OverflowPill = styled(Pill)`
  justify-content: center;
  cursor: pointer;
`

const OverflowList = styled.div<{ $visible: boolean }>`
  grid-column: 1 / -1;
  display: ${({ $visible }) => ($visible ? 'grid' : 'none')};
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.spacing.sm};
  padding-top: ${({ theme }) => theme.spacing.sm};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`

const Composer = styled.div<{ $multi: boolean }>`
  position: relative;
  display: flex;
  align-items: flex-end;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.bgElevated};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ $multi }) => ($multi ? '20px' : '28px')};
  box-shadow: ${({ theme }) => theme.shadow.md};
  transition: min-height 160ms ease, max-height 160ms ease, border-radius 160ms ease, box-shadow 160ms ease;
`

const PromptInput = styled.textarea`
  flex: 1;
  resize: none;
  border: none;
  outline: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.text};
  font: ${({ theme }) => theme.font.sans};
  font-size: ${({ theme }) => theme.font.sizeMd};
  line-height: 22px;
  min-height: 22px;
  max-height: ${MAX_HEIGHT}px;
  overflow-y: hidden;
  padding: 4px 8px 4px 0;

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }
`

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
  padding-bottom: 1px;
`

const SendBtn = styled.button<{ $disabled: boolean }>`
  width: 25px;
  height: 25px;
  display: grid;
  place-items: center;
  border: none;
  border-radius: 6px;
  background-color: ${({ $disabled }) => ($disabled ? 'rgba(255,255,255,0.25)' : 'white')};
  color: black;
  cursor: ${({ $disabled }) => ($disabled ? 'default' : 'pointer')};
  transition: transform 120ms ease, opacity 120ms ease;

  &:hover:not(:disabled) {
    transform: scale(1.05);
  }
`

const SendIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
`

export default function NodePromptArea({
  value,
  onChange,
  streamedTxt,
  isStream,
  isRec,
  isCycleRun,
  onToggleRec,
  onStreamTxt,
  onSend,
  contextPills = [],
  onRemovePill,
}: NodePromptAreaProps) {
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const [isMulti, setIsMulti] = useState(false)
  const [showOverflow, setShowOverflow] = useState(false)

  const displayTxt = isStream && streamedTxt ? streamedTxt : value

  const canSend = !isStream && !isCycleRun && displayTxt.trim().length > 0

  const visiblePills = contextPills.slice(0, MAX_VISIBLE_PILLS)
  const overflowPills = contextPills.slice(MAX_VISIBLE_PILLS)

  const hasOverflow = contextPills.length > MAX_VISIBLE_PILLS

  const handleChange = useCallback(
    (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange(evt.target.value)
    },
    [onChange]
  )

  const handleSendClick = useCallback(() => {
    onSend()
  }, [onSend])

  const handleOverflowClick = useCallback(() => {
    setShowOverflow((prev) => !prev)
  }, [])

  useEffect(() => {
    if (!inputRef.current) return

    const txt = inputRef.current
    txt.style.height = 'auto'
    const scrollH = txt.scrollHeight
    const nextHeight = Math.min(scrollH, MAX_HEIGHT)
    txt.style.height = `${nextHeight}px`
    txt.style.overflowY = scrollH > MAX_HEIGHT ? 'auto' : 'hidden'

    setIsMulti(scrollH > LINE_HEIGHT)
  }, [value, streamedTxt, isStream])

  useEffect(() => {
    if (isStream && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isStream])

  return (
    <>
      {contextPills && contextPills.length > 0 && (
        <PillRow data-testid="context-pills-container" $showOverflow={hasOverflow}>
          {visiblePills.map((pill) => (
            <Pill
              key={pill.id}
              data-testid={`context-pill-${pill.id}`}
              data-line-range={pill.lineRange}
            >
              <PillText>{pill.lineRange}</PillText>
              {onRemovePill && (
                <RemoveBtn
                  type="button"
                  data-testid={`remove-${pill.id}`}
                  onClick={() => onRemovePill(pill.id)}
                >
                  ×
                </RemoveBtn>
              )}
            </Pill>
          ))}
          {hasOverflow && (
            <OverflowPill
              data-testid="overflow-pill"
              onClick={handleOverflowClick}
            >
              <PillText>+{overflowPills.length} more</PillText>
            </OverflowPill>
          )}
        </PillRow>
      )}
      {hasOverflow && showOverflow && (
        <OverflowList $visible={showOverflow} data-testid="overflow-list">
          {overflowPills.map((pill) => (
            <Pill
              key={pill.id}
              data-testid={`context-pill-${pill.id}`}
              data-line-range={pill.lineRange}
            >
              <PillText>{pill.lineRange}</PillText>
              {onRemovePill && (
                <RemoveBtn
                  type="button"
                  data-testid={`remove-${pill.id}`}
                  onClick={() => onRemovePill(pill.id)}
                >
                  ×
                </RemoveBtn>
              )}
            </Pill>
          ))}
        </OverflowList>
      )}
      <Composer $multi={isMulti}>
        <PromptInput
          ref={inputRef}
          value={displayTxt}
          onChange={handleChange}
          placeholder="Ask anything..."
          disabled={isStream}
        />
        <Actions>
          <NodeMicBtn
            isRec={isRec}
            onToggleRec={onToggleRec}
            onStreamTxt={onStreamTxt}
          />
          <SendBtn
            $disabled={!canSend}
            onClick={handleSendClick}
            disabled={!canSend}
            aria-label={isCycleRun ? 'Stop generation' : 'Send prompt'}
          >
            <SendIcon>
              {isCycleRun ? (
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  stroke="none"
                  aria-hidden="true"
                >
                  <rect x="6" y="6" width="12" height="12" />
                </svg>
              ) : (
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5 12h14" />
                  <path d="M12 5l7 7-7 7" />
                </svg>
              )}
            </SendIcon>
          </SendBtn>
        </Actions>
      </Composer>
    </>
  )
}