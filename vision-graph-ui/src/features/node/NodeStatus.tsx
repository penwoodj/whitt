import type { NodeStatus as NodeStatusType } from './nodeTypes'
import styled from 'styled-components'

type NodeStatusProps = {
  status: NodeStatusType
}

const getStatusColor = (status: NodeStatusType): 'idle' | 'recording' | 'running' | 'done' => {
  const colorKeyMap: Record<NodeStatusType, 'idle' | 'recording' | 'running' | 'done'> = {
    idle: 'idle',
    recording: 'recording',
    running: 'running',
    done: 'done',
  }
  return colorKeyMap[status]
}

const shouldPulse = (status: NodeStatusType): boolean => status === 'recording' || status === 'running'

const getStatusLabel = (status: NodeStatusType): string => {
  const labelMap = {
    idle: 'Idle',
    recording: 'Recording',
    running: 'Running',
    done: 'Done',
  }
  return labelMap[status]
}

const StatusWrap = styled.div<{ $pulse: boolean; $status: NodeStatusType }>`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 2px 6px;
  border-radius: ${({ theme }) => theme.radius.sm};
  font-size: ${({ theme }) => theme.font.sizeXs};
  font-weight: ${({ theme }) => theme.font.weightBold};
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textInverse};
  background-color: ${({ $status, theme }) => theme.colors[getStatusColor($status)]};
  animation: ${({ $pulse }) => ($pulse ? 'pulse 1.5s ease-in-out infinite' : 'none')};

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
`

export default function NodeStatus({ status }: NodeStatusProps) {
  const pulse = shouldPulse(status)
  const label = getStatusLabel(status)

  return (
    <StatusWrap $pulse={pulse} $status={status}>
      <span>{label}</span>
    </StatusWrap>
  )
}
