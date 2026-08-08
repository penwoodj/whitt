import { useState, useEffect } from 'react'
import type { SettingsState } from './settingsTypes'
import { STORAGE_KEY } from './settingsData'
import { persistCfg, readCfg, loadCfg } from './settingsTransforms'

export const useSettingsState = (): [SettingsState, (state: SettingsState) => void] => {
  const [state, setState] = useState<SettingsState>(() => {
    const raw = readCfg(STORAGE_KEY)
    return loadCfg(raw)
  })

  useEffect(() => {
    persistCfg(STORAGE_KEY, state)
  }, [state])

  const updateState = (newState: SettingsState): void => {
    setState(newState)
  }

  return [state, updateState]
}
