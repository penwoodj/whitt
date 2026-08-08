import type { NodeStatus } from './nodeTypes'

type NodeStatusProps = {
  status: NodeStatus
}

const getStatusColor = (status: NodeStatus): string => {
  const colorMap = {
    idle: '#9ca3af',
    recording: '#ef4444',
    running: '#3b82f6',
    done: '#22c55e',
  }
  return colorMap[status]
}

const shouldPulse = (status: NodeStatus): boolean => status === 'recording' || status === 'running'

const getStatusLabel = (status: NodeStatus): string => {
  const labelMap = {
    idle: 'Idle',
    recording: 'Recording',
    running: 'Running',
    done: 'Done',
  }
  return labelMap[status]
}

export default function NodeStatus({ status }: NodeStatusProps) {
  const color = getStatusColor(status)
  const pulse = shouldPulse(status)
  const label = getStatusLabel(status)

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        padding: '2px 6px',
        borderRadius: '4px',
        fontSize: '10px',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        color: '#fff',
        backgroundColor: color,
        animation: pulse ? 'pulse 1.5s ease-in-out infinite' : 'none',
      }}
    >
      <span>{label}</span>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  )
}
