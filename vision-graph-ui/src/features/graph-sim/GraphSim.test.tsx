import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ThemeProvider } from '../../shared/ThemeProvider'
import GraphSim from './GraphSim'
import type { GraphSimProps } from './graphSimTypes'

const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeProvider>{ui}</ThemeProvider>)
}

describe('GraphSim', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Scenario: Initial render shows idle Node', () => {
    it('renders single Node with idle status', () => {
      renderWithTheme(<GraphSim />)

      const node = screen.getByText('Voice Node')
      expect(node).toBeInTheDocument()

      const status = screen.getByText('Idle')
      expect(status).toBeInTheDocument()
    })
  })

  describe('Scenario: Mic click starts lorem stream', () => {
    it('starts recording and streams lorem text', async () => {
      renderWithTheme(<GraphSim />)

      const micBtn = screen.getByTitle('Start recording')
      fireEvent.click(micBtn)

      const initialPrompt = screen.queryByRole('textbox')
      expect(initialPrompt).toBeInTheDocument()
      expect(initialPrompt?.value).toBe('')

      vi.advanceTimersByTime(1000)
      await waitFor(() => {
        const promptAfter1s = screen.getByRole('textbox')
        expect(promptAfter1s.value.length).toBeGreaterThan(0)
      })
    })

    it('prompt grows over time', async () => {
      renderWithTheme(<GraphSim />)

      const micBtn = screen.getByTitle('Start recording')
      fireEvent.click(micBtn)

      const prompt1s = screen.getByRole('textbox')
      const txt1s = prompt1s.value

      vi.advanceTimersByTime(2000)
      await waitFor(() => {
        const prompt3s = screen.getByRole('textbox')
        expect(prompt3s.value.length).toBeGreaterThan(txt1s.length)
      })
    })
  })

  describe('Scenario: Mic click again stops stream', () => {
    it('stops stream and freezes prompt text', async () => {
      renderWithTheme(<GraphSim />)

      const micBtn = screen.getByTitle('Start recording')
      fireEvent.click(micBtn)

      vi.advanceTimersByTime(2000)
      await waitFor(() => {
        const prompt = screen.getByRole('textbox')
        expect(prompt.value.length).toBeGreaterThan(0)
      })

      const frozenTxt = screen.getByRole('textbox').value

      fireEvent.click(micBtn)

      vi.advanceTimersByTime(1000)
      await waitFor(() => {
        const promptAfterStop = screen.getByRole('textbox')
        expect(promptAfterStop.value).toBe(frozenTxt)
      })
    })
  })

  describe('Scenario: Stop triggers markdown render', () => {
    it('expands detail panel after 500ms', async () => {
      renderWithTheme(<GraphSim />)

      const micBtn = screen.getByTitle('Start recording')
      fireEvent.click(micBtn)

      vi.advanceTimersByTime(1000)
      await waitFor(() => {
        const prompt = screen.getByRole('textbox')
        expect(prompt.value.length).toBeGreaterThan(0)
      })

      fireEvent.click(micBtn)

      const detailsBtn = screen.queryByText('Details')
      expect(detailsBtn).not.toBeInTheDocument()

      vi.advanceTimersByTime(500)
      await waitFor(() => {
        const detailsBtnAfter = screen.queryByText('Details')
        expect(detailsBtnAfter).toBeInTheDocument()
      })
    })

    it('shows markdown with headers, lists, code', async () => {
      renderWithTheme(<GraphSim />)

      const micBtn = screen.getByTitle('Start recording')
      fireEvent.click(micBtn)
      fireEvent.click(micBtn)

      vi.advanceTimersByTime(500)
      await waitFor(() => {
        const h1 = screen.queryByText(/Graph Viz Libs/)
        const list = screen.queryByText(/React native/)
        const code = screen.queryByText(/typescript/)

        expect(h1 || list || code).toBeTruthy()
      })
    })
  })

  describe('Scenario: Reset cycle on next mic click', () => {
    it('clears prompt and hides markdown', async () => {
      renderWithTheme(<GraphSim />)

      const micBtn = screen.getByTitle('Start recording')

      fireEvent.click(micBtn)
      vi.advanceTimersByTime(1000)
      await waitFor(() => {
        const prompt = screen.getByRole('textbox')
        expect(prompt.value.length).toBeGreaterThan(0)
      })

      fireEvent.click(micBtn)
      vi.advanceTimersByTime(500)
      await waitFor(() => {
        const detailsBtn = screen.queryByText('Details')
        expect(detailsBtn).toBeInTheDocument()
      })

      fireEvent.click(micBtn)

      await waitFor(() => {
        const prompt = screen.getByRole('textbox')
        expect(prompt.value).toBe('')
      })

      await waitFor(() => {
        const detailsBtn = screen.queryByText('Details')
        expect(detailsBtn).not.toBeInTheDocument()
      })
    })

    it('starts recording and streams again', async () => {
      renderWithTheme(<GraphSim />)

      const micBtn = screen.getByTitle('Start recording')

      fireEvent.click(micBtn)
      vi.advanceTimersByTime(1000)
      await waitFor(() => {
        const prompt = screen.getByRole('textbox')
        expect(prompt.value.length).toBeGreaterThan(0)
      })

      fireEvent.click(micBtn)
      vi.advanceTimersByTime(500)
      await waitFor(() => {
        const detailsBtn = screen.queryByText('Details')
        expect(detailsBtn).toBeInTheDocument()
      })

      fireEvent.click(micBtn)

      vi.advanceTimersByTime(1000)
      await waitFor(() => {
        const prompt = screen.getByRole('textbox')
        expect(prompt.value.length).toBeGreaterThan(0)
      })
    })
  })
})
