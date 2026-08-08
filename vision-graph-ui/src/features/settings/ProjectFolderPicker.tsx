import { useState, useCallback } from 'react'
import type { ProjectFolderPickerProps } from './settingsTypes'

export const ProjectFolderPicker = ({ folderPath, onChange }: ProjectFolderPickerProps): JSX.Element => {
  const [value, setValue] = useState(folderPath)

  const handleChange = useCallback((evt: React.ChangeEvent<HTMLInputElement>): void => {
    setValue(evt.target.value)
    onChange(evt.target.value)
  }, [onChange])

  const handleBrowse = useCallback((): void => {
  }, [])

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="/path/to/folder"
        style={{ flex: 1 }}
      />
      <button type="button" onClick={handleBrowse}>
        Browse
      </button>
    </div>
  )
}
