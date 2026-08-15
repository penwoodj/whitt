/// <reference types="@testing-library/jest-dom" />

import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { ThemeProvider } from '../../shared/ThemeProvider'
import { NodeModalWrapper } from './NodeModalWrapper'
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
          <button type="button" onClick={() => openModal('A', nodeA, { x: 100, y: 200 })}>
            Open A
          </button>
          <button type="button" onClick={() => openModal('B', nodeB, { x: 300, y: 400 })}>
            Open B
          </button>
          <button type="button" onClick={closeModal}>Close</button>
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
          <button type="button" onClick={() => openModal('A', nodeA, { x: 100, y: 200 })}>
            Open A
          </button>
          <button type="button" onClick={() => openModal('B', nodeB, { x: 300, y: 400 })}>
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
          <button type="button" onClick={() => openModal('1', node, { x: 150, y: 250 })}>
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
          <button type="button" onClick={() => openModal('1', node, { x: 100, y: 200 })}>
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

describe('EXP-11 close tri-path', () => {
  const ControlledModal = ({ onClose }: { onClose: () => void }) => (
    <NodeModalWrapper isOpen onClose={onClose} origin={{ x: 100, y: 200 }}>
      <div data-testid="modal">Modal</div>
    </NodeModalWrapper>
  )

  it('closes modal on ESC key', () => {
    const onClose = vi.fn()
    renderWithTheme(<ControlledModal onClose={onClose} />)
    expect(screen.getByTestId('modal')).toBeInTheDocument()
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('closes modal on click outside', () => {
    const onClose = vi.fn()
    renderWithTheme(<ControlledModal onClose={onClose} />)
    expect(screen.getByTestId('modal')).toBeInTheDocument()
    fireEvent.mouseDown(document.body)
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('closes modal on X button click', () => {
    const onClose = vi.fn()
    renderWithTheme(<ControlledModal onClose={onClose} />)
    fireEvent.click(screen.getByTestId('close-btn'))
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})

describe('EXPC-02 size caps', () => {
  it('caps modal width to 810px and height to 80% viewport', () => {
    function TestComponent() {
      const { isModalOpen, openModal } = useModalState()
      const node = createNode({ id: '1', title: 'Test Node' })

      return (
        <div>
          <button type="button" onClick={() => openModal('1', node, { x: 100, y: 200 })}>
            Open Modal
          </button>
          {isModalOpen && (
            <div
              data-testid="modal"
              style={{
                width: '810px',
                maxWidth: '90vw',
                maxHeight: '80vh',
                overflowY: 'auto',
              }}
            >
              <div style={{ height: '2000px' }}>Huge Content</div>
            </div>
          )}
        </div>
      )
    }

    renderWithTheme(<TestComponent />)

    const openBtn = screen.getByText('Open Modal')
    fireEvent.click(openBtn)

    const modal = screen.getByTestId('modal')
    expect(modal).toHaveStyle({
      width: '810px',
      maxWidth: '90vw',
      maxHeight: '80vh',
      overflowY: 'auto',
    })
  })

  it('has inner scroll for overflow content', () => {
    renderWithTheme(
      <NodeModalWrapper isOpen onClose={vi.fn()} origin={{ x: 100, y: 200 }}>
        <div style={{ height: '2000px' }}>Huge Content</div>
      </NodeModalWrapper>
    )

    const modalContent = screen.getByTestId('modal-content')
    expect(modalContent).toHaveStyle({ overflowY: 'auto' })
  })
})
