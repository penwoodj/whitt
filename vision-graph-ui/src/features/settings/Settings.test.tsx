import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ConnectedSettings } from './Settings'
import { STORAGE_KEY } from './settingsData'

describe('Settings', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('persists to localStorage', () => {
    render(<ConnectedSettings />)
    const checkbox = screen.getByRole('checkbox')
    fireEvent.click(checkbox)
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
    render(<ConnectedSettings />)
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).not.toBeChecked()
  })

  it('uses defaults when localStorage empty', () => {
    render(<ConnectedSettings />)
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toBeChecked()
  })
})
