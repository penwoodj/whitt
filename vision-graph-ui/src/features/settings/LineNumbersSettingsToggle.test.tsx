import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { LineNumbersSettingsToggle } from './LineNumbersSettingsToggle'
import { ThemeProvider } from '../../shared/ThemeProvider'

describe('LineNumbersSettingsToggle', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
  })

  function renderWithTheme(component: React.ReactElement) {
    return render(<ThemeProvider>{component}</ThemeProvider>)
  }

  describe('FILX-02 settings toggle default on', () => {
    it('renders toggle with Line Numbers label', () => {
      renderWithTheme(<LineNumbersSettingsToggle />)

      const label = screen.getByText('Line Numbers')
      expect(label).toBeInTheDocument()

      const toggle = screen.getByTestId('line-numbers-toggle')
      expect(toggle).toBeInTheDocument()
      expect(toggle.tagName).toBe('INPUT')
      expect(toggle.getAttribute('type')).toBe('checkbox')
    })

    it('toggle is checked by default', () => {
      renderWithTheme(<LineNumbersSettingsToggle />)

      const toggle = screen.getByTestId('line-numbers-toggle') as HTMLInputElement
      expect(toggle.checked).toBe(true)
    })

    it('toggles from on to off on click', () => {
      renderWithTheme(<LineNumbersSettingsToggle />)

      const toggle = screen.getByTestId('line-numbers-toggle') as HTMLInputElement
      expect(toggle.checked).toBe(true)

      fireEvent.click(toggle)
      expect(toggle.checked).toBe(false)
    })

    it('toggles from off to on on click', () => {
      localStorage.setItem('whitt-file-preview-line-numbers', 'false')

      renderWithTheme(<LineNumbersSettingsToggle />)

      const toggle = screen.getByTestId('line-numbers-toggle') as HTMLInputElement
      expect(toggle.checked).toBe(false)

      fireEvent.click(toggle)
      expect(toggle.checked).toBe(true)
    })

    it('persists on state across remount', () => {
      const { unmount } = renderWithTheme(<LineNumbersSettingsToggle />)

      const toggle = screen.getByTestId('line-numbers-toggle') as HTMLInputElement
      expect(toggle.checked).toBe(true)

      unmount()

      renderWithTheme(<LineNumbersSettingsToggle />)
      const remountedToggle = screen.getByTestId('line-numbers-toggle') as HTMLInputElement
      expect(remountedToggle.checked).toBe(true)
    })

    it('persists off state across remount', () => {
      const { unmount } = renderWithTheme(<LineNumbersSettingsToggle />)

      const toggle = screen.getByTestId('line-numbers-toggle') as HTMLInputElement
      fireEvent.click(toggle)
      expect(toggle.checked).toBe(false)

      unmount()

      renderWithTheme(<LineNumbersSettingsToggle />)
      const remountedToggle = screen.getByTestId('line-numbers-toggle') as HTMLInputElement
      expect(remountedToggle.checked).toBe(false)
    })

    it('uses seeded localStorage value on initial render', () => {
      localStorage.setItem('whitt-file-preview-line-numbers', 'false')

      renderWithTheme(<LineNumbersSettingsToggle />)

      const toggle = screen.getByTestId('line-numbers-toggle') as HTMLInputElement
      expect(toggle.checked).toBe(false)
    })
  })
})