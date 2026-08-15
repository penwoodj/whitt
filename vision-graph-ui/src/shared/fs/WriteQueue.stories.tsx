import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { WriteQueue } from '@/shared/fs/WriteQueue'

const meta: Meta<typeof WriteQueue> = {
  title: 'FS/WriteQueue',
  component: WriteQueue,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof WriteQueue>

export const DebounceVisualization: Story = {
  render: () => {
    const [queue] = useState(() => new WriteQueue((writes) => {
      alert(`Flushed ${writes.length} write(s):\n${writes.map(w => `- ${w.path}: ${w.content}`).join('\n')}`)
    }, 2000))

    const [path, setPath] = useState('test.md')
    const [content, setContent] = useState('')
    const [pendingCount, setPendingCount] = useState(0)

    const handleWrite = () => {
      if (path && content) {
        queue.write(path, content)
        setPendingCount(queue.getPendingWrites().length)
      }
    }

    const handleFlush = () => {
      queue.flush()
      setPendingCount(0)
    }

    const handleCheckPending = () => {
      const pending = queue.getPendingWrites()
      setPendingCount(pending.length)
      alert(`Pending writes: ${pending.length}\n${pending.map(w => `- ${w.path}`).join('\n')}`)
    }

    return (
      <div style={{ padding: '20px', maxWidth: '600px' }}>
        <h3>WriteQueue Debounce Visualization</h3>
        <p className="text-sm text-gray-400 mb-4">
          Rapid writes to same path are coalesced. Flush happens after 2s debounce or manually.
        </p>

        <input
          value={path}
          onChange={(e) => setPath(e.target.value)}
          placeholder="File path (e.g., test.md)"
          style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="File content"
          rows={3}
          style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
        />

        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <button onClick={handleWrite} style={{ padding: '8px 16px' }}>
            Write (2s debounce)
          </button>
          <button onClick={handleFlush} style={{ padding: '8px 16px' }}>
            Flush Now
          </button>
          <button onClick={handleCheckPending} style={{ padding: '8px 16px' }}>
            Check Pending ({pendingCount})
          </button>
        </div>

        <div style={{ fontSize: '12px', color: '#888' }}>
          <strong>Test coalescing:</strong> Write same path multiple times quickly, then wait 2s or flush.
          Only the last write should be flushed.
        </div>
      </div>
    )
  },
}

export const MultiplePaths: Story = {
  render: () => {
    const [queue] = useState(() => new WriteQueue((writes) => {
      alert(`Flushed ${writes.length} files:\n${writes.map(w => `- ${w.path}`).join('\n')}`)
    }, 2000))

    const [writes, setWrites] = useState<Array<{ path: string; content: string }>>([])

    const handleWrite = (path: string, content: string) => {
      queue.write(path, content)
      setWrites([...writes, { path, content }])
    }

    const handleFlush = () => {
      queue.flush()
      setWrites([])
    }

    return (
      <div style={{ padding: '20px', maxWidth: '600px' }}>
        <h3>WriteQueue Multiple Paths</h3>
        <p className="text-sm text-gray-400 mb-4">
          Multiple paths are flushed together in a single batch.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
          <button onClick={() => handleWrite('a.md', 'Content A')} style={{ padding: '8px' }}>
            Write a.md
          </button>
          <button onClick={() => handleWrite('b.md', 'Content B')} style={{ padding: '8px' }}>
            Write b.md
          </button>
          <button onClick={() => handleWrite('c.md', 'Content C')} style={{ padding: '8px' }}>
            Write c.md
          </button>
          <button onClick={() => handleWrite('d.md', 'Content D')} style={{ padding: '8px' }}>
            Write d.md
          </button>
        </div>

        <button onClick={handleFlush} style={{ padding: '8px 16px', marginBottom: '20px' }}>
          Flush All ({queue.getPendingWrites().length} pending)
        </button>

        {writes.length > 0 && (
          <div>
            <h4>Recent Writes:</h4>
            <ul style={{ fontSize: '12px' }}>
              {writes.slice(-5).map((write, index) => (
                <li key={index}>{write.path}: {write.content}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    )
  },
}
