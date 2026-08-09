import { useCallback, useState } from 'react'
import styled from 'styled-components'

type NodePromptAreaProps = {
  value: string
  onChange: (txt: string) => void
  onSend: () => void
  streamedTxt?: string
}

const PromptWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: ${({ theme }) => theme.spacing.sm};
`

const PromptInput = styled.textarea`
  width: 100%;
  min-height: 60px;
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.radius.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  font-size: ${({ theme }) => theme.font.sizeSm};
  font-family: ${({ theme }) => theme.font.sans};
  resize: vertical;
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
  align-self: flex-end;
`

export default function NodePromptArea({ value, onChange, onSend, streamedTxt }: NodePromptAreaProps) {
  const [isStreaming] = useState(false)

  const handleChange = useCallback(
    (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange(evt.target.value)
    },
    [onChange]
  )

  const handleKeyDown = useCallback(
    (evt: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (evt.key === 'Enter' && !evt.shiftKey) {
        evt.preventDefault()
        onSend()
      }
    },
    [onSend]
  )

  const handleSendClick = useCallback(() => {
    onSend()
  }, [onSend])

  const displayTxt = isStreaming && streamedTxt ? streamedTxt : value
  const isDisabled = isStreaming || !displayTxt.trim()

  return (
    <PromptWrap>
      <PromptInput
        value={displayTxt}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Enter prompt..."
        disabled={isStreaming}
      />
      <SendBtn $disabled={isDisabled} onClick={handleSendClick} disabled={isDisabled}>
        {isStreaming ? 'Streaming...' : 'Send'}
      </SendBtn>
    </PromptWrap>
  )
}
