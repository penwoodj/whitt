import styled from 'styled-components'
import { breatheScale } from '../../shared/keyframes'

type BreathingEdgeProps = {
  state: 'idle' | 'executing' | 'done'
}

const EdgeWrap = styled.svg<{ $state: BreathingEdgeProps['state'] }>`
  animation: ${({ $state }) => $state === 'executing' ? `${breatheScale} 2s ease-in-out infinite` : 'none'};
  transition: stroke 200ms ease;
`

export function BreathingEdge({ state }: BreathingEdgeProps) {
  return (
    <EdgeWrap
      $state={state}
      width="100%"
      height="100%"
      viewBox="0 0 100 100"
      data-testid="breathing-edge"
    >
      <line
        x1="10"
        y1="10"
        x2="90"
        y2="90"
        stroke="currentColor"
        strokeWidth="2"
      />
    </EdgeWrap>
  )
}
