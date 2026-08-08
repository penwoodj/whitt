import { useCallback, useState } from 'react'

type NodePromptAreaProps = {
  value: string
  onChange: (txt: string) => void
  onSend: () => void
  streamedTxt?: string
}

export default function NodePromptArea({ value, onChange, onSend, streamedTxt }: NodePromptAreaProps) {
  const [isStreaming, setIsStreaming] = useState(false)

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

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        padding: '8px',
      }}
    >
      <textarea
        value={displayTxt}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Enter prompt..."
        disabled={isStreaming}
        style={{
          width: '100%',
          minHeight: '60px',
          padding: '8px',
          borderRadius: '4px',
          border: '1px solid #e5e7eb',
          fontSize: '13px',
          fontFamily: 'inherit',
          resize: 'vertical',
        }}
      />
      <button
        onClick={handleSendClick}
        disabled={isStreaming || !displayTxt.trim()}
        style={{
          padding: '6px 12px',
          borderRadius: '4px',
          border: 'none',
          backgroundColor: isStreaming || !displayTxt.trim() ? '#9ca3af' : '#3b82f6',
          color: '#fff',
          fontSize: '12px',
          fontWeight: 'bold',
          cursor: isStreaming || !displayTxt.trim() ? 'not-allowed' : 'pointer',
          alignSelf: 'flex-end',
        }}
      >
        {isStreaming ? 'Streaming...' : 'Send'}
      </button>
    </div>
  )
}
