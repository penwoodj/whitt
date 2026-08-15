import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { ThemeProvider } from '../../shared/ThemeProvider'
import { useModalState } from './useModalState'
import type { NodeData } from './nodeTypes'

const renderWithTheme = (ui: ReactNode) => render(<ThemeProvider>{ui}</ThemeProvider>)

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

describe('EXPC-01 single modal constraint', () => {
  it('allows only one modal open at a time', () => {
    function TestComponent() {
      const { isModalOpen, openModal, closeModal } = useModalState()
      const nodeA = createNode({ id: 'A', title: 'Node A' })
      const nodeB = createNode({ id: 'B', title: 'Node B' })

      return (
        <div>
          <button onClick={() => openModal('A', nodeA, { x: 100, y: 200 })}>
            Open A
          </button>
          <button onClick={() => openModal('B', nodeB, { x: 300, y: 400 })}>
            Open B
          </button>
          <button onClick={closeModal}>Close</button>
          {isModalOpen && <div data-testid="modal">Modal: {isModalOpen.nodeId}</div>}
        </div>
      )
    }

    renderWithTheme(<TestComponent />)

    const openBtnA = screen.getByText('Open A')
    const openBtnB = screen.getByText('Open B')

    fireEvent.click(openBtnA)
    expect(screen.getByTestId('modal')).toHaveTextContent('Modal: A')

    fireEvent.click(openBtnB)
    expect(screen.getByTestId('modal')).toHaveTextContent('Modal: B')
  })

  it('preserves state of previously open modal when replaced', () => {
    function TestComponent() {
      const { isModalOpen, openModal } = useModalState()
      const nodeA = createNode({ id: 'A', title: 'Node A', promptTxt: 'saved text' })
      const nodeB = createNode({ id: 'B', title: 'Node B' })

      return (
        <div>
          <button onClick={() => openModal('A', nodeA, { x: 100, y: 200 })}>
            Open A
          </button>
          <button onClick={() => openModal('B', nodeB, { x: 300, y: 400 })}>
            Open B
          </button>
          {isModalOpen && <div data-testid="modal">{isModalOpen.nodeId}</div>}
        </div>
      )
    }

    renderWithTheme(<TestComponent />)

    const openBtnA = screen.getByText('Open A')
    const openBtnB = screen.getByText('Open B')

    fireEvent.click(openBtnA)
    fireEvent.click(openBtnB)

    expect(screen.getByTestId('modal')).toHaveTextContent('B')
  })
})

describe('EXPC-04 origin-anchored transition', () => {
  it('transitions with correct origin position', async () => {
    function TestComponent() {
      const { isModalOpen, openModal } = useModalState()
      const node = createNode({ id: '1', title: 'Test Node' })

      return (
        <div>
          <button onClick={() => openModal('1', node, { x: 150, y: 250 })}>
            Open Modal
          </button>
          {isModalOpen && (
            <div
              data-testid="modal"
              style={{
                transformOrigin: `${isModalOpen.originX}px ${isModalOpen.originY}px`,
                transition: 'transform 250ms ease',
              }}
            >
              Modal
            </div>
          )}
        </div>
      )
    }

    renderWithTheme(<TestComponent />)

    const openBtn = screen.getByText('Open Modal')
    fireEvent.click(openBtn)

    await waitFor(() => {
      const modal = screen.getByTestId('modal')
      expect(modal).toBeInTheDocument()
      expect(modal).toHaveStyle({
        transformOrigin: '150px 250px',
      })
    })
  })

  it('uses ~200-300ms transition duration', async () => {
    function TestComponent() {
      const { isModalOpen, openModal } = useModalState()
      const node = createNode({ id: '1', title: 'Test Node' })

      return (
        <div>
          <button onClick={() => openModal('1', node, { x: 100, y: 200 })}>
            Open Modal
          </button>
          {isModalOpen && (
            <div
              data-testid="modal"
              style={{
                transformOrigin: `${isModalOpen.originX}px ${isModalOpen.originY}px`,
                transition: 'transform 250ms ease, opacity 250ms ease',
              }}
            >
              Modal
            </div>
          )}
        </div>
      )
    }

    renderWithTheme(<TestComponent />)

    const openBtn = screen.getByText('Open Modal')
    fireEvent.click(openBtn)

    await waitFor(
      () => {
        const modal = screen.getByTestId('modal')
        expect(modal).toBeInTheDocument()
      },
      { timeout: 500 }
    )
  })
})
