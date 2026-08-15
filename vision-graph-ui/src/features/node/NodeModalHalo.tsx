import styled from 'styled-components'
import { breatheScale } from '../../shared/keyframes'
import { useVoiceLevel } from '../light-language/useVoiceLevel'

type HaloProps = {
  state: 'idle' | 'recording' | 'running' | 'done'
  isLive?: boolean
  children?: React.ReactNode
}

const HaloWrap = styled.div<{ $state: HaloProps['state']; $isLive: boolean; $level: number }>`
  position: absolute;
  inset: -8px;
  border-radius: ${({ theme }) => theme.radius.lg};
  border: 2px solid ${({ $state, theme }) => theme.colors[$state]};
  box-shadow: 0 0 12px ${({ $state, theme }) => theme.glow.stateGlow[$state]};
  opacity: 0.6;
  pointer-events: none;
  transform: scale(${({ $level }) => 1 + $level * 0.5});
  animation: ${({ $isLive }) => ($isLive ? `${breatheScale} 2s ease-in-out infinite` : 'none')};
`

export function NodeModalHalo({ state, isLive = false, children }: HaloProps) {
  const mockAnalyser = {
    context: { sampleRate: 44100 },
    frequencyBinCount: 128,
    getByteFrequencyData: () => {},
  } as unknown as AnalyserNode

  const level = useVoiceLevel(mockAnalyser)

  return (
    <HaloWrap $state={state} $isLive={isLive} $level={level} data-testid="modal-halo">
      {children}
    </HaloWrap>
  )
}
