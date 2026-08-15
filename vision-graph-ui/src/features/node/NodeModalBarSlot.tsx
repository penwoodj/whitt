import styled from 'styled-components'
import { breatheScale, restGlow } from '../../shared/keyframes'
import { useVoiceLevel } from '../light-language/useVoiceLevel'

type BarSlotProps = {
  state: 'idle' | 'recording' | 'running' | 'done'
  isRec: boolean
  onToggleRec?: () => void
  onSend?: () => void
  onHover?: () => void
  reducedMotion?: boolean
}

const getAnimation = (state: BarSlotProps['state'], reducedMotion: boolean) => {
  if (reducedMotion) return 'none'
  switch (state) {
    case 'idle':
      return `${restGlow} 3s ease-in-out infinite`
    case 'recording':
    case 'running':
      return `${breatheScale} 2s ease-in-out infinite`
    default:
      return 'none'
  }
}

const BarSlot = styled.div<{
  $state: BarSlotProps['state']
  $level: number
  $reducedMotion: boolean
}>`
  width: 100%;
  height: 4px;
  border-radius: ${({ theme }) => theme.radius.md};
  background-color: ${({ $state, theme }) => theme.colors[$state]};
  box-shadow: ${({ $state, theme }) => theme.glow.stateGlow[$state]};
  transform: ${({ $level }) => `scale(${1 + $level})`};
  animation: ${({ $state, $reducedMotion }) => getAnimation($state, $reducedMotion)};
  transition: background-color 200ms ease, box-shadow 200ms ease, opacity 200ms ease,
    filter 200ms ease;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
    filter: brightness(1.1);
  }
`

export function NodeModalBarSlot({
  state,
  isRec,
  onToggleRec,
  onSend,
  onHover,
  reducedMotion = false,
}: BarSlotProps) {
  const mockAnalyser = {
    context: { sampleRate: 44100 },
    frequencyBinCount: 128,
    getByteFrequencyData: () => {},
  } as unknown as AnalyserNode

  const level = useVoiceLevel(mockAnalyser)

  const handleClick = () => {
    if (onToggleRec) {
      onToggleRec()
    }
  }

  const handleDoubleClick = () => {
    if (onSend) {
      onSend()
    }
  }

  const handleMouseEnter = () => {
    if (onHover) {
      onHover()
    }
  }

  return (
    <BarSlot
      $state={state}
      $level={level}
      $reducedMotion={reducedMotion}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onMouseEnter={handleMouseEnter}
      data-testid="bar-slot"
      role="button"
      aria-label={isRec ? 'Stop recording' : 'Start recording'}
      tabIndex={0}
    />
  )
}
