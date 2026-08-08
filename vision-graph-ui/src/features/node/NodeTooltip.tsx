import type { NodeData } from './nodeTypes'

type NodeTooltipProps = {
  node: NodeData
  children: React.ReactNode
}

export default function NodeTooltip({ node, children }: NodeTooltipProps) {
  const lastUpdateTxt = node.lastUpdate ? node.lastUpdate.toLocaleTimeString() : 'Never'

  return (
    <div
      style={{
        position: 'relative',
        display: 'inline-block',
      }}
    >
      {children}
      <div
        style={{
          position: 'absolute',
          bottom: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          marginBottom: '8px',
          padding: '8px 12px',
          backgroundColor: '#1f2937',
          color: '#fff',
          borderRadius: '4px',
          fontSize: '11px',
          whiteSpace: 'nowrap',
          opacity: 0,
          visibility: 'hidden',
          transition: 'opacity 0.2s, visibility 0.2s',
          zIndex: 1000,
          pointerEvents: 'none',
        }}
        className="node-tooltip"
      >
        <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{node.title}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ textTransform: 'capitalize' }}>{node.status}</span>
          <span style={{ color: '#9ca3af' }}>•</span>
          <span style={{ color: '#9ca3af' }}>Updated: {lastUpdateTxt}</span>
        </div>
      </div>
      <style>{`
        .node-tooltip:hover {
          opacity: 1 !important;
          visibility: visible !important;
        }
      `}</style>
    </div>
  )
}
