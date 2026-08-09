import styled from 'styled-components'
import type { AutoAcceptToggleProps } from './settingsTypes'

const CfgLabel = styled.label`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`

const CfgText = styled.span`
  color: ${({ theme }) => theme.colors.text};
`

export const AutoAcceptToggle = ({ isAuto, onChange }: AutoAcceptToggleProps): React.JSX.Element => {
  const handleClick = (): void => {
    onChange(!isAuto)
  }

  return (
    <CfgLabel>
      <input type="checkbox" checked={isAuto} onChange={handleClick} />
      <CfgText>Auto-accept</CfgText>
    </CfgLabel>
  )
}
