import type { AutoAcceptToggleProps } from './settingsTypes'

export const AutoAcceptToggle = ({ isAuto, onChange }: AutoAcceptToggleProps): JSX.Element => {
  const handleClick = (): void => {
    onChange(!isAuto)
  }

  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <input type="checkbox" checked={isAuto} onChange={handleClick} />
      <span>Auto-accept</span>
    </label>
  )
}
