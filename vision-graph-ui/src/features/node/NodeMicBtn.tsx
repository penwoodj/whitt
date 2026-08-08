import { useCallback } from 'react'

type NodeMicBtnProps = {
  isRec: boolean
  onToggleRec: () => void
  onStreamTxt?: (txt: string) => void
}

export default function NodeMicBtn({ isRec, onToggleRec, onStreamTxt }: NodeMicBtnProps) {
  const handleClick = useCallback(() => {
    onToggleRec()
    if (isRec && onStreamTxt) {
      const chars = 'abcdefghijklmnopqrstuvwxyz '
      let streamed = ''
      const interval = setInterval(() => {
        const randomChar = chars[Math.floor(Math.random() * chars.length)]
        streamed += randomChar
        onStreamTxt(streamed)
        if (streamed.length > 50) {
          clearInterval(interval)
        }
      }, 100)
    }
  }, [isRec, onToggleRec, onStreamTxt])

  return (
    <button
      onClick={handleClick}
      style={{
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: isRec ? '#ef4444' : '#3b82f6',
        transition: 'background-color 0.2s',
      }}
      title={isRec ? 'Stop recording' : 'Start recording'}
    >
      {isRec ? (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="6" y="6" width="12" height="12" />
        </svg>
      ) : (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
          <line x1="12" y1="19" x2="12" y2="23" />
          <line x1="8" y1="23" x2="16" y2="23" />
        </svg>
      )}
    </button>
  )
}
