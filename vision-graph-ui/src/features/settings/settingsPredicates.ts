import type { SettingsState } from './settingsTypes'

export const isAutoAccept = (state: SettingsState): boolean => state.isAuto

export const isValidShortcut = (scTxt: string): boolean =>
  scTxt.includes('Ctrl') || scTxt.includes('Cmd') || scTxt.includes('Alt') || scTxt.includes('Shift')

export const hasValidEndpoint = (eptTxt: string): boolean =>
  eptTxt.startsWith('http://') || eptTxt.startsWith('https://')

export const hasFolder = (state: SettingsState): boolean => state.folderPath.length > 0
