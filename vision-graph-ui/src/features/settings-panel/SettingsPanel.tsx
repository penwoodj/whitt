import { useEffect } from 'react'
import styled from 'styled-components'
import { ConnectedSettings } from '../settings'
import type { SettingsPanelProps } from './settingsPanelTypes'
import { useSettingsPanelLogging } from './useSettingsPanelLogging'

const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: ${({ theme }) => theme.zIndex.overlay};
`

const Panel = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  right: 0;
  width: 400px;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.bgElevated};
  border-left: 1px solid ${({ theme }) => theme.colors.border};
  transform: translateX(${({ $isOpen }) => ($isOpen ? '0' : '100%')});
  transition: transform ${({ theme }) => theme.transition.base};
  z-index: ${({ theme }) => theme.zIndex.modal};
  display: flex;
  flex-direction: column;
`

const PanelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`

const Title = styled.h2`
  margin: 0;
  font-size: ${({ theme }) => theme.font.sizeLg};
  font-weight: ${({ theme }) => theme.font.weightBold};
  color: ${({ theme }) => theme.colors.text};
`

const CloseBtn = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.font.sizeXl};
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.xs};

  &:hover {
    color: ${({ theme }) => theme.colors.text};
  }
`

const PanelContent = styled.div`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.md};
  overflow-y: auto;
`

export default function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const panelLog = useSettingsPanelLogging()

  useEffect(() => {
    const handleEscape = (evt: KeyboardEvent) => {
      if (evt.key === 'Escape') {
        onClose()
        panelLog.debug('Closed via ESC')
      }
    }

    if (isOpen) {
      window.addEventListener('keydown', handleEscape)
      return () => window.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose, panelLog])

  if (!isOpen) return null

  const handleClose = () => {
    onClose()
    panelLog.debug('Closed via X btn')
  }

  return (
    <Backdrop data-testid="settings-backdrop" onClick={onClose}>
      <Panel $isOpen={isOpen} data-testid="settings-panel" onClick={(evt) => evt.stopPropagation()}>
        <PanelHeader>
          <Title>Settings</Title>
          <CloseBtn onClick={handleClose} aria-label="Close settings">
            ×
          </CloseBtn>
        </PanelHeader>
        <PanelContent>
          <ConnectedSettings />
        </PanelContent>
      </Panel>
    </Backdrop>
  )
}
