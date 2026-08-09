import { useCallback } from 'react'
import styled from 'styled-components'
import NodeMicBtn from './NodeMicBtn'

type NodeFooterProps = {
  isRec: boolean
  isStream: boolean
  isCycleRun: boolean
  promptTxt: string
  onToggleRec: () => void
  onStreamTxt?: (txt: string) => void
  onSend: () => void
}

const FooterWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.sm};
`

const SendBtn = styled.button<{ $disabled: boolean }>`
  padding: 6px 12px;
  border-radius: ${({ theme }) => theme.radius.sm};
  border: none;
  background-color: ${({ $disabled, theme }) =>
    $disabled ? theme.colors.textMuted : theme.colors.primary};
  color: ${({ theme }) => theme.colors.textInverse};
  font-size: 12px;
  font-weight: ${({ theme }) => theme.font.weightBold};
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  transition: background-color ${({ theme }) => theme.transition.base};
  display: flex;
  align-items: center;
  gap: 6px;

  &:hover:not([disabled]) {
    background-color: ${({ theme }) => theme.colors.primaryHover};
  }
`

const SendIcon = styled.span<{ $isRunning: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
`

export default function NodeFooter({
  isRec,
  isStream,
  isCycleRun,
  promptTxt,
  onToggleRec,
  onStreamTxt,
  onSend,
}: NodeFooterProps) {
  const handleSendClick = useCallback(() => {
    onSend()
  }, [onSend])

  const canSend = !isStream && !isCycleRun && promptTxt.trim().length > 0
  const isRunning = isCycleRun

  return (
    <FooterWrap>
      <NodeMicBtn
        isRec={isRec}
        onToggleRec={onToggleRec}
        onStreamTxt={onStreamTxt}
      />
      <SendBtn $disabled={!canSend} onClick={handleSendClick} disabled={!canSend}>
        <SendIcon $isRunning={isRunning}>
          {isRunning ? (
            <svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="currentColor"
              stroke="none"
            >
              <rect x="6" y="6" width="12" height="12" />
            </svg>
          ) : (
            <svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="M12 5l7 7-7 7" />
            </svg>
          )}
        </SendIcon>
        {isRunning ? 'Stop' : 'Send'}
      </SendBtn>
    </FooterWrap>
  )
}