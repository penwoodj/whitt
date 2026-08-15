import styled from 'styled-components'
import { breatheScale, restGlow } from '../../shared/keyframes'
import { useVoiceLevel } from './useVoiceLevel'

type BarOfLightProps = {
  state: 'idle' | 'recording' | 'running' | 'done'
  width?: number
  height?: number
}

const getAnimation = (state: BarOfLightProps['state']) => {
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

const BarWrap = styled.div<{
  $state: BarOfLightProps['state']
  $width: number
  $height: number
  $level: number
}>`
  width: ${({ $width }) => $width}px;
  height: ${({ $height }) => $height}px;
  border-radius: ${({ theme }) => theme.radius.md};
  background-color: ${({ $state, theme }) => theme.colors[$state]};
  box-shadow: ${({ $state, theme }) => theme.glow.stateGlow[$state]};
  transform: ${({ $level }) => `scale(${1 + $level})`};
  animation: ${({ $state }) => getAnimation($state)};
  transition: background-color 200ms ease, box-shadow 200ms ease, opacity 200ms ease,
    filter 200ms ease;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
    filter: brightness(1.1);
  }
`

export function BarOfLight({ state, width = 200, height = 4 }: BarOfLightProps) {
  const mockAnalyser = {
    context: { sampleRate: 44100 },
    frequencyBinCount: 128,
    getByteFrequencyData: () => {},
  } as unknown as AnalyserNode

  const level = useVoiceLevel(mockAnalyser)

  return <BarWrap $state={state} $width={width} $height={height} $level={level} />
}

