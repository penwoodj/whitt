import { useState, useCallback } from 'react'
import type { ModelEndpointInputProps } from './settingsTypes'
import { hasValidEndpoint } from './settingsPredicates'

export const ModelEndpointInput = ({ eptTxt, onChange }: ModelEndpointInputProps): JSX.Element => {
  const [isTouched, setIsTouched] = useState(false)
  const [value, setValue] = useState(eptTxt)

  const isValid = hasValidEndpoint(value)
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
        placeholder="http://localhost:8080"
      />
    </div>
  )
}
