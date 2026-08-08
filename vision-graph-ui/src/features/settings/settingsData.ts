import type { SettingsState } from './settingsTypes'

export const defaultSettings: SettingsState = {
  isAuto: true,
  scTxt: 'Ctrl+Space',
  eptTxt: 'http://localhost:8080',
  folderPath: '',
}

export const STORAGE_KEY = 'whitt-graph-ui-settings'
