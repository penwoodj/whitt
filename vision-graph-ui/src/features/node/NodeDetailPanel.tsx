import { useCallback } from 'react'

type NodeDetailPanelProps = {
  expanded: boolean
  onToggle: () => void
  markdown?: string
}

const defaultMarkdown = `# Node Details

This is a placeholder for the markdown content that will be rendered in the detail panel.

## Features
- Live token streams
- Hook timeline
- Artifact preview
- Template variable values

## Status
The node is currently processing your request.
`

export default function NodeDetailPanel({ expanded, onToggle, markdown = defaultMarkdown }: NodeDetailPanelProps) {
  const handleClick = useCallback(() => {
    onToggle()
  }, [onToggle])

  const renderMarkdown = (txt: string): string => {
    return txt
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^- (.*$)/gim, '<li>$1</li>')
      .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
      .replace(/\n/gim, '<br />')
  }

  return (
    <div style={{ padding: '4px 8px' }}>
      <button
        onClick={handleClick}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 8px',
          borderRadius: '4px',
          border: '1px solid #e5e7eb',
          backgroundColor: '#fff',
          fontSize: '11px',
          fontWeight: 'bold',
          cursor: 'pointer',
          width: '100%',
        }}
      >
        <span style={{ transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
          ▶
        </span>
        <span>Details</span>
      </button>
      {expanded && (
        <div
          style={{
            padding: '8px 0 0 16px',
            fontSize: '11px',
            lineHeight: '1.5',
            color: '#374151',
          }}
          dangerouslySetInnerHTML={{ __html: renderMarkdown(markdown) }}
        />
      )}
    </div>
  )
}
