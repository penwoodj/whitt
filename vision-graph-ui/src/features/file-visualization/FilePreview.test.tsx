import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import FilePreview from './FilePreview'
import { ThemeProvider } from '../../shared/ThemeProvider'

describe('FilePreview', () => {
  function renderWithTheme(component: React.ReactElement) {
    return render(<ThemeProvider>{component}</ThemeProvider>)
  }

  describe('FIL-01 area present', () => {
    it('shows preview area under execution area w/ content', () => {
      const content = '# Test Markdown\n\nSome content'
      renderWithTheme(<FilePreview content={content} />)

      const previewArea = screen.getByTestId('file-preview-area')
      expect(previewArea).toBeInTheDocument()
      expect(screen.getByText('Test Markdown')).toBeInTheDocument()
    })
  })

  describe('FIL-02 markdown preview', () => {
    it('renders headings as h2 elements, not raw md', () => {
      const markdown = '# Heading 1\n\n## Heading 2\n\nSome content'
      renderWithTheme(<FilePreview content={markdown} />)

      const h1 = screen.getByRole('heading', { level: 1 })
      const h2 = screen.getByRole('heading', { level: 2 })

      expect(h1).toBeInTheDocument()
      expect(h1).toHaveTextContent('Heading 1')
      expect(h2).toBeInTheDocument()
      expect(h2).toHaveTextContent('Heading 2')

      expect(screen.queryByText('# Heading 1')).not.toBeInTheDocument()
    })
  })

  describe('FIL-04 edit toggle', () => {
    it('shows CodeMirror editor on edit click', () => {
      const content = '# Test\n\nContent'
      renderWithTheme(<FilePreview content={content} />)

      const editBtn = screen.getByRole('button', { name: 'Edit' })
      expect(editBtn).toBeInTheDocument()
      fireEvent.click(editBtn)

      const editorContainer = screen.getByTestId('file-preview-area')
      expect(editorContainer).toBeInTheDocument()
      expect(editorContainer.innerHTML).toContain('cm-editor')
      expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument()
    })
  })

  describe('FIL-05 blur saves', () => {
    it('save button toggles back to preview mode', () => {
      const content = '# Test\n\nContent'
      renderWithTheme(<FilePreview content={content} />)

      const editBtn = screen.getByRole('button', { name: 'Edit' })
      fireEvent.click(editBtn)

      const saveBtn = screen.getByRole('button', { name: 'Save' })
      expect(saveBtn).toBeInTheDocument()

      fireEvent.click(saveBtn)

      expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: 'Save' })).not.toBeInTheDocument()
    })
  })
})