import { useState, useCallback } from 'react'
import type { VoiceShortcutInputProps } from './settingsTypes'
import { isValidShortcut } from './settingsPredicates'

export const VoiceShortcutInput = ({ scTxt, onChange }: VoiceShortcutInputProps): JSX.Element => {
  const [isTouched, setIsTouched] = useState(false)
  const [value, setValue] = useState(scTxt)

  const isValid = isValidShortcut(value)
  const showError = isTouched && !isValid

  const handleChange = useCallback((evt: React.ChangeEvent<HTMLInputElement>): void => {
    setValue(evt.target.value)
    onChange(evt.target.value)
  }, [onChange])

  const handleBlur = useCallback((): void => {
    setIsTouched(true)
  }, [])

  const inputStyle = showError ? { border: '2px solid red' } : {}

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        style={inputStyle}
        placeholder="Ctrl+Space"
      />
      {showError && <span style={{ color: 'red', fontSize: 12 }}>must contain modifier key</span>}
    </div>
  )
}
