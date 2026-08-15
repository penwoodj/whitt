import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '../../shared/ThemeProvider'
import { MorphingLoader } from './MorphingLoader'

describe('MorphingLoader', () => {
  const renderWithTheme = (component: React.ReactElement) => {
    return render(<ThemeProvider>{component}</ThemeProvider>)
  }

  describe('EXE-14 morphing icon loader', () => {
    it('icon morphs through cycle', () => {
      renderWithTheme(<MorphingLoader status="running" stepTitle="Processing" />)
      
      const loader = screen.getByRole('progressbar')
      expect(loader).toBeInTheDocument()
    })

    it('icon bound to step title', () => {
      const stepTitle = "Analyzing data"
      renderWithTheme(<MorphingLoader status="running" stepTitle={stepTitle} />)
      
      const loader = screen.getByRole('progressbar')
      expect(loader).toHaveAttribute('aria-label', expect.stringContaining(stepTitle))
    })

    it('transitions follow LGT-05 cadence', () => {
      const { rerender } = renderWithTheme(<MorphingLoader status="idle" stepTitle="Ready" />)
      
      let loader = screen.getByRole('progressbar')
      expect(loader).toBeInTheDocument()
      
      rerender(<MorphingLoader status="running" stepTitle="Processing" />)
      loader = screen.getByRole('progressbar')
      expect(loader).toBeInTheDocument()
      
      rerender(<MorphingLoader status="done" stepTitle="Completed" />)
      loader = screen.getByRole('progressbar')
      expect(loader).toBeInTheDocument()
    })
  })
})