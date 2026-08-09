import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeProvider } from '../../shared/ThemeProvider'
import NewProjectModal from './NewProjectModal'

const mockOnCreate = vi.fn()
const mockOnCancel = vi.fn()

const renderWithTheme = (ui: React.JSX.Element) => {
  return render(<ThemeProvider>{ui}</ThemeProvider>)
}

describe('NewProjectModal', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders hidden when isOpen=false', () => {
    renderWithTheme(<NewProjectModal isOpen={false} onCreate={mockOnCreate} onCancel={mockOnCancel} />)

    const backdrop = screen.queryByTestId('modal-backdrop')
    expect(backdrop).not.toBeInTheDocument()
  })

  it('renders visible when isOpen=true', () => {
    renderWithTheme(<NewProjectModal isOpen={true} onCreate={mockOnCreate} onCancel={mockOnCancel} />)

    const backdrop = screen.getByTestId('modal-backdrop')
    expect(backdrop).toBeInTheDocument()

    const modal = screen.getByTestId('new-project-modal')
    expect(modal).toBeInTheDocument()
  })

  it('shows name and folder inputs when open', () => {
    renderWithTheme(<NewProjectModal isOpen={true} onCreate={mockOnCreate} onCancel={mockOnCancel} />)

    expect(screen.getByLabelText(/project name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/folder path/i)).toBeInTheDocument()
  })

  it('disables Create btn with empty inputs', () => {
    renderWithTheme(<NewProjectModal isOpen={true} onCreate={mockOnCreate} onCancel={mockOnCancel} />)

    const createBtn = screen.getByRole('button', { name: /create/i })
    expect(createBtn).toBeDisabled()
  })

  it('enables Create btn with valid inputs', () => {
    renderWithTheme(<NewProjectModal isOpen={true} onCreate={mockOnCreate} onCancel={mockOnCancel} />)

    const nameInput = screen.getByLabelText(/project name/i)
    const folderInput = screen.getByLabelText(/folder path/i)
    const createBtn = screen.getByRole('button', { name: /create/i })

    fireEvent.change(nameInput, { target: { value: 'My Graph' } })
    fireEvent.change(folderInput, { target: { value: '/tmp/graph' } })

    expect(createBtn).toBeEnabled()
  })

  it('calls onCreate with data when Create clicked', () => {
    renderWithTheme(<NewProjectModal isOpen={true} onCreate={mockOnCreate} onCancel={mockOnCancel} />)

    const nameInput = screen.getByLabelText(/project name/i)
    const folderInput = screen.getByLabelText(/folder path/i)
    const createBtn = screen.getByRole('button', { name: /create/i })

    fireEvent.change(nameInput, { target: { value: 'My Graph' } })
    fireEvent.change(folderInput, { target: { value: '/tmp/graph' } })
    fireEvent.click(createBtn)

    expect(mockOnCreate).toHaveBeenCalledWith({ name: 'My Graph', folder: '/tmp/graph' })
  })

  it('calls onCancel when Cancel clicked', () => {
    renderWithTheme(<NewProjectModal isOpen={true} onCreate={mockOnCreate} onCancel={mockOnCancel} />)

    const cancelBtn = screen.getByRole('button', { name: /cancel/i })
    fireEvent.click(cancelBtn)

    expect(mockOnCancel).toHaveBeenCalledTimes(1)
  })

  it('calls onCancel when backdrop clicked', () => {
    renderWithTheme(<NewProjectModal isOpen={true} onCreate={mockOnCreate} onCancel={mockOnCancel} />)

    const backdrop = screen.getByTestId('modal-backdrop')
    fireEvent.click(backdrop)

    expect(mockOnCancel).toHaveBeenCalledTimes(1)
  })
})
