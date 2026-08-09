import { keyframes } from 'styled-components'

export const pulseGlow = keyframes`
  0%, 100% {
    box-shadow: 0 0 12px rgba(74, 158, 255, 0.4);
  }
  50% {
    box-shadow: 0 0 20px rgba(74, 158, 255, 0.6);
  }
`

export const recordingPulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
`
