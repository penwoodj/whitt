import { useCallback } from 'react'
import type { Todo } from './nodeTypes'

type NodeAgenticTodosProps = {
  todos: Todo[]
  expanded: boolean
  onToggle: () => void
}

const getStatusColor = (status: Todo['status']): string => {
  const colorMap = {
    queued: '#9ca3af',
    running: '#3b82f6',
    done: '#22c55e',
    failed: '#ef4444',
  }
  return colorMap[status]
}

export default function NodeAgenticTodos({ todos, expanded, onToggle }: NodeAgenticTodosProps) {
  const handleClick = useCallback(() => {
    onToggle()
  }, [onToggle])

  const hasRunning = todos.some((todo) => todo.status === 'running')

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
        }}
      >
        <span style={{ transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
          ▶
        </span>
        <span>Agentic Tasks ({todos.length})</span>
        {hasRunning && (
          <span
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              border: '2px solid #3b82f6',
              borderTopColor: 'transparent',
              animation: 'spin 1s linear infinite',
            }}
          />
        )}
      </button>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
      {expanded && (
        <ul
          style={{
            listStyle: 'none',
            padding: '8px 0 0 16px',
            margin: 0,
          }}
        >
          {todos.map((todo, idx) => (
            <li
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 0',
                fontSize: '11px',
              }}
            >
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: getStatusColor(todo.status),
                }}
              />
              <span>{todo.label}</span>
              {todo.status === 'running' && (
                <span
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    border: '2px solid #3b82f6',
                    borderTopColor: 'transparent',
                    animation: 'spin 1s linear infinite',
                  }}
                />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
