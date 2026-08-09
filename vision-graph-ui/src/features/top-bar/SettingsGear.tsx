import styled from 'styled-components'
import type { SettingsGearProps } from './topBarTypes'

const GearButton = styled.button`
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.font.sizeLg};
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.radius.md};
  transition: all ${({ theme }) => theme.transition.fast};
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: ${({ theme }) => theme.colors.bgHover};
    color: ${({ theme }) => theme.colors.primary};
  }
`

export default function SettingsGear({ onClick }: SettingsGearProps) {
  return (
    <GearButton onClick={onClick} aria-label="Settings" title="Settings">
      ⚙
    </GearButton>
  )
}
