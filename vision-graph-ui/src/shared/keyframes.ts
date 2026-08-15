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

export const breatheScale = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.02);
  }
`

export const restGlow = keyframes`
  0%, 100% {
    box-shadow: 0 0 8px rgba(106, 153, 85, 0.2);
  }
`

export const morphFade = keyframes`
  0% {
    opacity: 0;
    transform: translateY(4px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`
