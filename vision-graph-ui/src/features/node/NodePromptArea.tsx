import { useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import NodeMicBtn from './NodeMicBtn'

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
}

const MAX_HEIGHT = 154
const LINE_HEIGHT = 22

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
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  border: none;
  border-radius: 50%;
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
}: NodePromptAreaProps) {
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const [isMulti, setIsMulti] = useState(false)

  const displayTxt = isStream && streamedTxt ? streamedTxt : value

  const canSend = !isStream && !isCycleRun && displayTxt.trim().length > 0

  const handleChange = useCallback(
    (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange(evt.target.value)
    },
    [onChange]
  )

  const handleSendClick = useCallback(() => {
    onSend()
  }, [onSend])

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
  )
}
