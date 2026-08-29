import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ConnectedSettings } from './Settings'
import { ThemeProvider } from '../../shared/ThemeProvider'
import { STORAGE_KEY } from './settingsData'

const renderWithTheme = (ui: React.ReactElement) => render(<ThemeProvider>{ui}</ThemeProvider>)

describe('Settings', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('persists to localStorage', () => {
    renderWithTheme(<ConnectedSettings />)
    const checkboxes = screen.getAllByRole('checkbox')
    const autoAcceptCheckbox = checkboxes.find(cb => cb.nextElementSibling?.textContent === 'Auto-accept') as HTMLInputElement
    expect(autoAcceptCheckbox).toBeDefined()
    fireEvent.click(autoAcceptCheckbox)
    const stored = localStorage.getItem(STORAGE_KEY)
    expect(stored).toBeTruthy()
    const parsed = JSON.parse(stored || '{}')
    expect(parsed.isAuto).toBe(false)
  })

  it('restores from localStorage on reload', () => {
    const state = {
      isAuto: false,
      scTxt: 'Ctrl+Space',
      eptTxt: 'http://localhost:8080',
      folderPath: '',
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    renderWithTheme(<ConnectedSettings />)
    const checkboxes = screen.getAllByRole('checkbox')
    const autoAcceptCheckbox = checkboxes.find(cb => cb.nextElementSibling?.textContent === 'Auto-accept') as HTMLInputElement
    expect(autoAcceptCheckbox).not.toBeChecked()
  })

  it('uses defaults when localStorage empty', () => {
    renderWithTheme(<ConnectedSettings />)
    const checkboxes = screen.getAllByRole('checkbox')
    const autoAcceptCheckbox = checkboxes.find(cb => cb.nextElementSibling?.textContent === 'Auto-accept') as HTMLInputElement
    expect(autoAcceptCheckbox).toBeDefined()
    expect(autoAcceptCheckbox).toBeChecked()
  })
})
