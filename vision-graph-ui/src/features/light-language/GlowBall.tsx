import styled from 'styled-components'
import { breatheScale } from '../../shared/keyframes'
import { useVoiceLevel } from './useVoiceLevel'

type GlowBallProps = {
  state: 'idle' | 'recording' | 'running' | 'done'
  size?: number
  reducedMotion?: boolean
}

const BallWrap = styled.div<{ $state: GlowBallProps['state']; $size: number; $level: number; $reducedMotion: boolean }>`
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  border-radius: 50%;
  background-color: ${({ $state, theme }) => theme.colors[$state]};
  box-shadow: ${({ $state, theme }) => theme.glow.stateGlow[$state]};
  transform: ${({ $level }) => `scale(${1 + $level})`};
  animation: ${({ $state, $reducedMotion }) =>
    !$reducedMotion && ($state === 'recording' || $state === 'running')
      ? `${breatheScale} 2s ease-in-out infinite`
      : 'none';
  transition: background-color 200ms ease, box-shadow 200ms ease;
`

export function GlowBall({ state, size = 32, reducedMotion = false }: GlowBallProps) {
  const mockAnalyser = {
    context: { sampleRate: 44100 },
    frequencyBinCount: 128,
    getByteFrequencyData: () => {},
  } as unknown as AnalyserNode

  const level = useVoiceLevel(mockAnalyser)

  return <BallWrap $state={state} $size={size} $level={level} $reducedMotion={reducedMotion} />
}

const BallWrap = styled.div<{ $state: GlowBallProps['state']; $size: number; $level: number; $reducedMotion: boolean }>`
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  border-radius: 50%;
  background-color: ${({ $state, theme }) => theme.colors[$state]};
  box-shadow: ${({ $state, theme }) => theme.glow.stateGlow[$state]};
  transform: ${({ $level }) => `scale(${1 + $level})`};
  animation: ${({ $state, $reducedMotion }) =>
    !$reducedMotion && ($state === 'recording' || $state === 'running')
      ? `${breatheScale} 2s ease-in-out infinite`
      : 'none'};
  transition: background-color 200ms ease, box-shadow 200ms ease;
`

export function GlowBall({ state, size = 32 }: GlowBallProps) {
  const mockAnalyser = {
    context: { sampleRate: 44100 },
    frequencyBinCount: 128,
    getByteFrequencyData: () => {},
  } as unknown as AnalyserNode

  const level = useVoiceLevel(mockAnalyser)

  return <BallWrap $state={state} $size={size} $level={level} />
}

