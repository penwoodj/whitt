import styled from 'styled-components'
import type { MenuButtonProps } from './markdownHighlightTypes'

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme }) => theme.colors.bgElevated};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.font.sizeSm};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transition.fast};
  white-space: nowrap;

  &:hover {
    background-color: ${({ theme }) => theme.colors.bgHover};
    border-color: ${({ theme }) => theme.colors.borderActive};
    color: ${({ theme }) => theme.colors.primary};
  }

  &:active {
    transform: scale(0.98);
  }
`

export default function MenuButton({ icon, label, onClick }: MenuButtonProps) {
  return (
    <Button onClick={onClick} aria-label={label}>
      <span>{icon}</span>
      <span>{label}</span>
    </Button>
  )
}
