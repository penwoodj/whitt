import styled from 'styled-components'
import { useLineNumbers } from '../file-visualization/useLineNumbers'

const CfgLabel = styled.label`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`

const CfgText = styled.span`
  color: ${({ theme }) => theme.colors.text};
`

export const LineNumbersSettingsToggle = (): React.JSX.Element => {
  const { showLineNumbers, toggleLineNumbers } = useLineNumbers()

  const handleClick = (): void => {
    toggleLineNumbers()
  }

  return (
    <CfgLabel>
      <input type="checkbox" checked={showLineNumbers} onChange={handleClick} data-testid="line-numbers-toggle" />
      <CfgText>Line Numbers</CfgText>
    </CfgLabel>
  )
}