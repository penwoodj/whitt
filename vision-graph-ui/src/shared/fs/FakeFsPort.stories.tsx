import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { FakeFsPort } from './FakeFsPort'

const meta: Meta<typeof FakeFsPort> = {
  title: 'FS/FakeFsPort',
  component: FakeFsPort,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof FakeFsPort>

export const ReadWrite: Story = {
  render: () => {
    const [port] = useState(() => new FakeFsPort())
    const [content, setContent] = useState('')
    const [path, setPath] = useState('test.md')

    const handleWrite = async () => {
      await port.writeFile(path, content)
      alert(`Written to ${path}`)
    }

    const handleRead = async () => {
      try {
        const data = await port.readFile(path)
        setContent(data)
      } catch (error) {
        alert(`Error: ${(error as Error).message}`)
      }
    }

    return (
      <div style={{ padding: '20px', maxWidth: '600px' }}>
        <h3>FakeFsPort Read/Write</h3>
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
          rows={6}
          style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
        />
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={handleWrite} style={{ padding: '8px 16px' }}>
            Write
          </button>
          <button onClick={handleRead} style={{ padding: '8px 16px' }}>
            Read
          </button>
        </div>
      </div>
    )
  },
}

export const DirectoryList: Story = {
  render: () => {
    const [port] = useState(() => {
      const p = new FakeFsPort()
      p.writeFile('a.md', 'Content A')
      p.writeFile('b.md', 'Content B')
      p.writeFile('c.md', 'Content C')
      return p
    })
    const [files, setFiles] = useState<string[]>([])

    const handleList = async () => {
      const fileList = await port.listDir('/')
      setFiles(fileList)
    }

    return (
      <div style={{ padding: '20px', maxWidth: '600px' }}>
        <h3>FakeFsPort Directory List</h3>
        <button onClick={handleList} style={{ padding: '8px 16px', marginBottom: '10px' }}>
          List Directory (/)
        </button>
        {files.length > 0 && (
          <ul>
            {files.map((file) => (
              <li key={file}>{file}</li>
            ))}
          </ul>
        )}
      </div>
    )
  },
}

export const WatchEvents: Story = {
  render: () => {
    const [port] = useState(() => new FakeFsPort())
    const [events, setEvents] = useState<Array<{ type: string; path: string }>>([])

    const handleStartWatch = () => {
      port.watch('/', (event) => {
        setEvents((prev) => [...prev, event])
      })
      alert('Watching / for changes')
    }

    const handleTriggerChange = async () => {
      await port.writeFile('watched.md', `Updated at ${new Date().toISOString()}`)
    }

    return (
      <div style={{ padding: '20px', maxWidth: '600px' }}>
        <h3>FakeFsPort Watch Events</h3>
        <button onClick={handleStartWatch} style={{ padding: '8px 16px', marginRight: '10px' }}>
          Start Watch
        </button>
        <button onClick={handleTriggerChange} style={{ padding: '8px 16px' }}>
          Trigger Change
        </button>
        {events.length > 0 && (
          <div style={{ marginTop: '20px' }}>
            <h4>Events:</h4>
            <ul>
              {events.map((event, index) => (
                <li key={index}>
                  {event.type}: {event.path}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    )
  },
}
