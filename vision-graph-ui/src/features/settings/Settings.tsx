import type { SettingsProps } from './settingsTypes'
import { useSettingsState } from './useSettingsState'
import { SettingsLayout, SettingsSection } from './SettingsLayout'
import { AutoAcceptToggle } from './AutoAcceptToggle'
import { VoiceShortcutInput } from './VoiceShortcutInput'
import { ModelEndpointInput } from './ModelEndpointInput'
import { ProjectFolderPicker } from './ProjectFolderPicker'
import { LineNumbersSettingsToggle } from './LineNumbersSettingsToggle'
import merge from 'lodash/fp/merge'

export const Settings = ({ state, updateState }: SettingsProps): React.JSX.Element => {
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
      <SettingsSection legend="File Preview">
        <LineNumbersSettingsToggle />
      </SettingsSection>
    </SettingsLayout>
  )
}

export const ConnectedSettings = (): React.JSX.Element => {
  const [state, updateState] = useSettingsState()
  return <Settings state={state} updateState={updateState} />
}
