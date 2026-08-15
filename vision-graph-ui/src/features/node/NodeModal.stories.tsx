import type { Meta, StoryObj } from '@storybook/react'
import { userEvent, within, waitFor, expect } from '@storybook/test'
import { ThemeProvider } from '../../shared/ThemeProvider'
import { NodeModalWrapper } from './NodeModalWrapper'
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
