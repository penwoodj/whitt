export type SettingsState = {
  isAuto: boolean
  scTxt: string
  eptTxt: string
  folderPath: string
}

export type SettingsProps = {
  state: SettingsState
  updateState: (state: SettingsState) => void
}

export type AutoAcceptToggleProps = {
  isAuto: boolean
  onChange: (isAuto: boolean) => void
}

export type VoiceShortcutInputProps = {
  scTxt: string
  onChange: (scTxt: string) => void
}

export type ModelEndpointInputProps = {
  eptTxt: string
  onChange: (eptTxt: string) => void
}

export type ProjectFolderPickerProps = {
  folderPath: string
  onChange: (folderPath: string) => void
}

export type SettingsLayoutProps = {
  children: React.ReactNode
}
