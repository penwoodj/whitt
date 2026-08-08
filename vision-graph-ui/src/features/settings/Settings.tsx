import type { SettingsProps } from './settingsTypes'
import { useSettingsState } from './useSettingsState'
import { SettingsLayout, SettingsSection } from './SettingsLayout'
import { AutoAcceptToggle } from './AutoAcceptToggle'
import { VoiceShortcutInput } from './VoiceShortcutInput'
import { ModelEndpointInput } from './ModelEndpointInput'
import { ProjectFolderPicker } from './ProjectFolderPicker'
import merge from 'lodash/fp/merge'

export const Settings = ({ state, updateState }: SettingsProps): JSX.Element => {
  const handleAutoChange = (isAuto: boolean): void => {
    const newState = merge(state, { isAuto })
    updateState(newState)
  }

  const handleShortcutChange = (scTxt: string): void => {
    const newState = merge(state, { scTxt })
    updateState(newState)
  }

  const handleEndpointChange = (eptTxt: string): void => {
    const newState = merge(state, { eptTxt })
    updateState(newState)
  }

  const handleFolderChange = (folderPath: string): void => {
    const newState = merge(state, { folderPath })
    updateState(newState)
  }

  return (
    <SettingsLayout>
      <SettingsSection legend="Auto-Accept">
        <AutoAcceptToggle isAuto={state.isAuto} onChange={handleAutoChange} />
      </SettingsSection>
      <SettingsSection legend="Voice Shortcut">
        <VoiceShortcutInput scTxt={state.scTxt} onChange={handleShortcutChange} />
      </SettingsSection>
      <SettingsSection legend="Model Endpoint">
        <ModelEndpointInput eptTxt={state.eptTxt} onChange={handleEndpointChange} />
      </SettingsSection>
      <SettingsSection legend="Project Folder">
        <ProjectFolderPicker folderPath={state.folderPath} onChange={handleFolderChange} />
      </SettingsSection>
    </SettingsLayout>
  )
}

export const ConnectedSettings = (): JSX.Element => {
  const [state, updateState] = useSettingsState()
  return <Settings state={state} updateState={updateState} />
}
