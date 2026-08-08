import flow from 'lodash/fp/flow'
import pick from 'lodash/fp/pick'
import merge from 'lodash/fp/merge'
import type { SettingsState } from './settingsTypes'

export const toggleAuto = (state: SettingsState): SettingsState =>
  merge(state, { isAuto: !state.isAuto })

export const saveSettings = (state: SettingsState): string => JSON.stringify(state)

export const loadCfg = (raw: string | null): SettingsState => {
  if (!raw) return { isAuto: true, scTxt: 'Ctrl+Space', eptTxt: 'http://localhost:8080', folderPath: '' }
  try {
    return flow([JSON.parse, pick(['isAuto', 'scTxt', 'eptTxt', 'folderPath'])])(raw) as SettingsState
  } catch {
    return { isAuto: true, scTxt: 'Ctrl+Space', eptTxt: 'http://localhost:8080', folderPath: '' }
  }
}

export const persistCfg = (key: string, state: SettingsState): void => {
  try {
    localStorage.setItem(key, saveSettings(state))
  } catch {
  }
}

export const readCfg = (key: string): string | null => {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}
