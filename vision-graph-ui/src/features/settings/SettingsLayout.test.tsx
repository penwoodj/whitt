import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SettingsLayout, SettingsSection } from './SettingsLayout'

describe('SettingsLayout', () => {
  it('renders AutoAccept section', () => {
    render(
      <SettingsLayout>
        <SettingsSection legend="Auto-Accept">
          <span>Content</span>
        </SettingsSection>
        <SettingsSection legend="Voice Shortcut">
          <span>Content</span>
        </SettingsSection>
        <SettingsSection legend="Model Endpoint">
          <span>Content</span>
        </SettingsSection>
        <SettingsSection legend="Project Folder">
          <span>Content</span>
        </SettingsSection>
      </SettingsLayout>
    )
    const legend = screen.getByText('Auto-Accept')
    expect(legend).toBeInTheDocument()
  })

  it('renders VoiceShortcut section', () => {
    render(
      <SettingsLayout>
        <SettingsSection legend="Auto-Accept">
          <span>Content</span>
        </SettingsSection>
        <SettingsSection legend="Voice Shortcut">
          <span>Content</span>
        </SettingsSection>
        <SettingsSection legend="Model Endpoint">
          <span>Content</span>
        </SettingsSection>
        <SettingsSection legend="Project Folder">
          <span>Content</span>
        </SettingsSection>
      </SettingsLayout>
    )
    const legend = screen.getByText('Voice Shortcut')
    expect(legend).toBeInTheDocument()
  })

  it('renders ModelEndpoint section', () => {
    render(
      <SettingsLayout>
        <SettingsSection legend="Auto-Accept">
          <span>Content</span>
        </SettingsSection>
        <SettingsSection legend="Voice Shortcut">
          <span>Content</span>
        </SettingsSection>
        <SettingsSection legend="Model Endpoint">
          <span>Content</span>
        </SettingsSection>
        <SettingsSection legend="Project Folder">
          <span>Content</span>
        </SettingsSection>
      </SettingsLayout>
    )
    const legend = screen.getByText('Model Endpoint')
    expect(legend).toBeInTheDocument()
  })

  it('renders ProjectFolder section', () => {
    render(
      <SettingsLayout>
        <SettingsSection legend="Auto-Accept">
          <span>Content</span>
        </SettingsSection>
        <SettingsSection legend="Voice Shortcut">
          <span>Content</span>
        </SettingsSection>
        <SettingsSection legend="Model Endpoint">
          <span>Content</span>
        </SettingsSection>
        <SettingsSection legend="Project Folder">
          <span>Content</span>
        </SettingsSection>
      </SettingsLayout>
    )
    const legend = screen.getByText('Project Folder')
    expect(legend).toBeInTheDocument()
  })
})
