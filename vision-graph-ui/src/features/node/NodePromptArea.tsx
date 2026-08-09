import { useCallback, useRef, useEffect } from 'react'
import styled from 'styled-components'

type NodePromptAreaProps = {
  value: string
  onChange: (txt: string) => void
  streamedTxt?: string
  isStream: boolean
}

const PromptInput = styled.textarea<{ $isStream: boolean }>`
  width: 100%;
  min-height: 28px;
  max-height: 144px;
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.radius.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  font-size: ${({ theme }) => theme.font.sizeSm};
  font-family: ${({ theme }) => theme.font.sans};
  line-height: 1.4;
  resize: both;
  overflow-y: auto;
  background-color: ${({ $isStream, theme }) =>
    $isStream ? theme.colors.bgHover : 'transparent'};
  field-sizing: content;
  transition: border-color ${({ theme }) => theme.transition.fast};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.borderActive};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }
`

export default function NodePromptArea({
  value,
  onChange,
  streamedTxt,
  isStream,
}: NodePromptAreaProps) {
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (isStream && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isStream])

  const handleChange = useCallback(
    (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange(evt.target.value)
    },
    [onChange]
  )

  const displayTxt = isStream && streamedTxt ? streamedTxt : value

  return (
    <PromptInput
      ref={inputRef}
      value={displayTxt}
      onChange={handleChange}
      placeholder="Enter prompt..."
      disabled={isStream}
      $isStream={isStream}
    />
  )
}