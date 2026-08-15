import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { userEvent, within, waitFor, expect } from '@storybook/test'
import { ThemeProvider } from '../../shared/ThemeProvider'
import { NodeModalWrapper } from './NodeModalWrapper'
import { NodeModalBarSlot } from './NodeModalBarSlot'
import { NodeModalContent } from './NodeModalContent'
import { NodeModalHalo } from './NodeModalHalo'
import { useModalState } from './useModalState'
import type { NodeData } from './nodeTypes'

const createNode = (overrides: Partial<NodeData> = {}): NodeData => ({
  id: '1',
  title: 'Test Node',
  status: 'idle',
  type: 'task',
  lifecycle: 'initial',
  nodeViewState: 'collapsed',
  focused: false,
  promptTxt: '',
  todos: [],
  lastUpdate: null,
  detailExpanded: false,
  todosExpanded: false,
  isRec: false,
  isCycleRun: false,
  isStream: false,
  streamedTxt: '',
  ...overrides,
})

function TestModal() {
  const { isModalOpen, openModal, closeModal } = useModalState()

  return (
    <ThemeProvider>
      <div>
        <button
          onClick={() => openModal('1', createNode(), { x: 100, y: 200 })}
        >
          Open Modal
        </button>
        <NodeModalWrapper>
          {isModalOpen && (
            <div style={{ padding: '24px' }}>
              <h2 id={`modal-title-${isModalOpen.nodeId}`}>
                {isModalOpen.node.title}
              </h2>
              <p>Modal content for node {isModalOpen.nodeId}</p>
            </div>
          )}
        </NodeModalWrapper>
      </div>
    </ThemeProvider>
  )
}

const meta: Meta<typeof NodeModalWrapper> = {
  title: 'Features/node/NodeModal',
  component: NodeModalWrapper,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof NodeModalWrapper>

export const EXPC01SingleModal: Story = {
  name: 'slice04 -- EXPC-01 single modal',
  render: () => <TestModal />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const openBtn = canvas.getByText('Open Modal')

    await userEvent.click(openBtn)
    await waitFor(() => {
      expect(canvas.getByText('Modal content for node 1')).toBeInTheDocument()
    })
  },
}

export const EXPC04OriginTransition: Story = {
  name: 'slice04 -- EXPC-04 origin transition',
  render: () => <TestModal />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const openBtn = canvas.getByText('Open Modal')

    await userEvent.click(openBtn)

    await waitFor(
      () => {
        const modal = canvas.getByText('Modal content for node 1').closest(
          'div[role="dialog"]'
        )
        expect(modal).toBeInTheDocument()
        expect(modal).toHaveStyle({
          transformOrigin: '100px 200px',
        })
      },
      { timeout: 500 }
    )
  },
}

export const EXP11CloseTriPathESC: Story = {
  name: 'slice04 -- EXP-11 close tri-path ESC',
  render: () => <TestModal />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const openBtn = canvas.getByText('Open Modal')

    await userEvent.click(openBtn)
    await waitFor(() => {
      expect(canvas.getByText('Modal content for node 1')).toBeInTheDocument()
    })

    await userEvent.keyboard('{Escape}')
    await waitFor(() => {
      expect(canvas.queryByText('Modal content for node 1')).not.toBeInTheDocument()
    })
  },
}

export const EXP11CloseTriPathClickOutside: Story = {
  name: 'slice04 -- EXP-11 close tri-path click-outside',
  render: () => <TestModal />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const openBtn = canvas.getByText('Open Modal')

    await userEvent.click(openBtn)
    await waitFor(() => {
      expect(canvas.getByText('Modal content for node 1')).toBeInTheDocument()
    })

    await userEvent.click(document.body)
    await waitFor(() => {
      expect(canvas.queryByText('Modal content for node 1')).not.toBeInTheDocument()
    })
  },
}

export const EXP11CloseTriPathXButton: Story = {
  name: 'slice04 -- EXP-11 close tri-path X button',
  render: () => <TestModal />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const openBtn = canvas.getByText('Open Modal')

    await userEvent.click(openBtn)
    await waitFor(() => {
      expect(canvas.getByText('Modal content for node 1')).toBeInTheDocument()
    })

    const closeBtn = canvas.getByLabelText('Close modal')
    await userEvent.click(closeBtn)
    await waitFor(() => {
      expect(canvas.queryByText('Modal content for node 1')).not.toBeInTheDocument()
    })
  },
}

export const EXPC02SizeCaps: Story = {
  name: 'slice04 -- EXPC-02 size caps',
  render: () => <TestModal />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const openBtn = canvas.getByText('Open Modal')

    await userEvent.click(openBtn)

    await waitFor(() => {
      const modal = canvas.getByText('Modal content for node 1').closest(
        'div[role="dialog"]'
      )
      expect(modal).toBeInTheDocument()
      expect(modal).toHaveStyle({
        width: '810px',
        maxWidth: '90vw',
        maxHeight: '80vh',
        overflowY: 'auto',
      })
    })
  },
}

function TestModalWithBar() {
  const { isModalOpen, openModal, closeModal } = useModalState()
  const [isRec, setIsRec] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)

  const handleToggleRec = () => {
    setIsRec((prev) => !prev)
  }

  const handleSend = () => {
    console.log('Sending prompt...')
  }

  const handleBarHover = () => {
    setShowTooltip(true)
  }

  return (
    <ThemeProvider>
      <div>
        <button
          onClick={() => openModal('1', createNode(), { x: 100, y: 200 })}
        >
          Open Modal with Bar
        </button>
        <NodeModalWrapper>
          {isModalOpen && (
            <div>
              <NodeModalBarSlot
                state={isRec ? 'recording' : 'idle'}
                isRec={isRec}
                onToggleRec={handleToggleRec}
                onSend={handleSend}
                onHover={handleBarHover}
              />
              {showTooltip && (
                <div
                  style={{
                    position: 'absolute',
                    top: '20px',
                    left: '10px',
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                  }}
                >
                  {isRec ? 'Recording...' : 'Click to record'}
                </div>
              )}
              <NodeModalContent>
                <h2 id={`modal-title-${isModalOpen.nodeId}`}>
                  {isModalOpen.node.title}
                </h2>
                <p>Modal content with bar of light at top</p>
              </NodeModalContent>
            </div>
          )}
        </NodeModalWrapper>
      </div>
    </ThemeProvider>
  )
}

export const EXP04BarOfLight: Story = {
  name: 'slice04 -- EXP-04 bar of light',
  render: () => <TestModalWithBar />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const openBtn = canvas.getByText('Open Modal with Bar')

    await userEvent.click(openBtn)
    await waitFor(() => {
      expect(canvas.getByTestId('bar-slot')).toBeInTheDocument()
    })
  },
}

export const EXP05BarHoverTooltip: Story = {
  name: 'slice04 -- EXP-05 bar hover tooltip',
  render: () => <TestModalWithBar />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const openBtn = canvas.getByText('Open Modal with Bar')

    await userEvent.click(openBtn)
    await waitFor(() => {
      expect(canvas.getByTestId('bar-slot')).toBeInTheDocument()
    })

    const barSlot = canvas.getByTestId('bar-slot')
    await userEvent.hover(barSlot)

    await waitFor(() => {
      expect(canvas.getByText('Click to record')).toBeInTheDocument()
    })
  },
}

export const EXP06BarClickTogglesSTT: Story = {
  name: 'slice04 -- EXP-06 bar click toggles STT',
  render: () => <TestModalWithBar />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const openBtn = canvas.getByText('Open Modal with Bar')

    await userEvent.click(openBtn)
    await waitFor(() => {
      expect(canvas.getByText('Click to record')).toBeInTheDocument()
    })

    const barSlot = canvas.getByTestId('bar-slot')
    await userEvent.click(barSlot)

    await waitFor(() => {
      expect(canvas.getByText('Recording...')).toBeInTheDocument()
    })

    await userEvent.click(barSlot)

    await waitFor(() => {
      expect(canvas.getByText('Click to record')).toBeInTheDocument()
    })
  },
}

export const EXP07BarDblclickSends: Story = {
  name: 'slice04 -- EXP-07 bar dblclick sends',
  render: () => <TestModalWithBar />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const openBtn = canvas.getByText('Open Modal with Bar')

    await userEvent.click(openBtn)
    await waitFor(() => {
      expect(canvas.getByTestId('bar-slot')).toBeInTheDocument()
    })

    const barSlot = canvas.getByTestId('bar-slot')
    await userEvent.dblClick(barSlot)

    await waitFor(() => {
      expect(canvas.getByText('Recording...')).toBeInTheDocument()
    })
  },
}

export const EXP08BarBreathes: Story = {
  name: 'slice04 -- EXP-08 bar breathes',
  render: () => <TestModalWithBar />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const openBtn = canvas.getByText('Open Modal with Bar')

    await userEvent.click(openBtn)
    await waitFor(() => {
      expect(canvas.getByTestId('bar-slot')).toBeInTheDocument()
    })

    const barSlot = canvas.getByTestId('bar-slot')
    await userEvent.click(barSlot)

    await waitFor(() => {
      expect(barSlot).toHaveStyle({
        animation: expect.stringContaining('breatheScale'),
      })
    })
  },
}

function TestModalWithHalo() {
  const { isModalOpen, openModal } = useModalState()
  const [isRec, setIsRec] = useState(false)
  const [isRunning, setIsRunning] = useState(false)

  return (
    <ThemeProvider>
      <div>
        <button
          onClick={() => {
            const node = createNode({ status: isRunning ? 'running' : 'idle' })
            openModal('1', node, { x: 100, y: 200 })
            setIsRunning(true)
          }}
        >
          Open Modal with Halo
        </button>
        <NodeModalWrapper>
          {isModalOpen && (
            <NodeModalHalo state={isRunning ? 'running' : 'idle'} isLive={isRunning}>
              <div style={{ padding: '24px' }}>
                <h2>Modal with Halo</h2>
                <p>Halo shows {isRunning ? 'running' : 'idle'} state</p>
                <button onClick={() => setIsRunning(!isRunning)}>
                  Toggle Running State
                </button>
              </div>
            </NodeModalHalo>
          )}
        </NodeModalWrapper>
      </div>
    </ThemeProvider>
  )
}

export const EXP01SendExpands: Story = {
  name: 'slice04 -- EXP-01 send expands',
  render: () => <TestModalWithBar />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const openBtn = canvas.getByText('Open Modal with Bar')

    await userEvent.click(openBtn)
    await waitFor(() => {
      expect(canvas.getByTestId('bar-slot')).toBeInTheDocument()
    })

    const barSlot = canvas.getByTestId('bar-slot')
    await userEvent.dblClick(barSlot)

    await waitFor(() => {
      expect(canvas.getByText('Recording...')).toBeInTheDocument()
    })
  },
}

export const EXP02BallBecomesHalo: Story = {
  name: 'slice04 -- EXP-02 ball becomes halo',
  render: () => <TestModalWithHalo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const openBtn = canvas.getByText('Open Modal with Halo')

    await userEvent.click(openBtn)
    await waitFor(() => {
      expect(canvas.getByTestId('modal-halo')).toBeInTheDocument()
      expect(canvas.getByText('Halo shows running state')).toBeInTheDocument()
    })
  },
}

export const EXP03ExpandAutoRecords: Story = {
  name: 'slice04 -- EXP-03 expand auto-records',
  render: () => <TestModalWithBar />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const openBtn = canvas.getByText('Open Modal with Bar')

    await userEvent.click(openBtn)
    await waitFor(() => {
      expect(canvas.getByTestId('bar-slot')).toBeInTheDocument()
    })

    const barSlot = canvas.getByTestId('bar-slot')
    await userEvent.dblClick(barSlot)

    await waitFor(() => {
      expect(canvas.getByText('Recording...')).toBeInTheDocument()
      expect(barSlot).toHaveStyle({
        animation: expect.stringContaining('breatheScale'),
      })
    })
  },
}

export const EXP09RightClickNoSTT: Story = {
  name: 'slice04 -- EXP-09 right click no STT',
  render: () => <TestModalWithBar />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const openBtn = canvas.getByText('Open Modal with Bar')

    await userEvent.click(openBtn)
    await waitFor(() => {
      expect(canvas.getByTestId('bar-slot')).toBeInTheDocument()
      expect(canvas.getByText('Click to record')).toBeInTheDocument()
    })
  },
}

export const EXP10BallRunningState: Story = {
  name: 'slice04 -- EXP-10 ball running state',
  render: () => <TestModalWithHalo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const openBtn = canvas.getByText('Open Modal with Halo')

    await userEvent.click(openBtn)
    await waitFor(() => {
      expect(canvas.getByTestId('modal-halo')).toBeInTheDocument()
      expect(canvas.getByText('Halo shows running state')).toBeInTheDocument()
    })

    const halo = canvas.getByTestId('modal-halo')
    expect(halo).toHaveStyle({
      borderColor: '#4FC1FF',
    })
  },
}
