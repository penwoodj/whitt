import { useCallback } from 'react'
import styled, { css } from 'styled-components'
import { recordingPulse } from '../../shared/keyframes'

type NodeMicBtnProps = {
  isRec: boolean
  onToggleRec: () => void
  onStreamTxt?: (txt: string) => void
}

const MicBtn = styled.button<{ $isRec: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: ${({ theme }) => theme.radius.pill};
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ $isRec, theme }) =>
    $isRec ? theme.colors.recording : theme.colors.primary};
  transition: background-color ${({ theme }) => theme.transition.base}, box-shadow ${({ theme }) => theme.transition.base};
  box-shadow: ${({ $isRec, theme }) => ($isRec ? theme.glow.recording : 'none')};
  animation: ${({ $isRec }) => ($isRec ? css`${recordingPulse} 1.5s ease-in-out infinite` : 'none')};
`

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
    <MicBtn
      $isRec={isRec}
      onClick={handleClick}
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
    </MicBtn>
  )
}
