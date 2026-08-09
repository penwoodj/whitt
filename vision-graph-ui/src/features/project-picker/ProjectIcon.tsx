import styled from 'styled-components'
import type { ProjectIconProps } from './projectPickerTypes'

const IconBtn = styled.button<{ $isActive: boolean }>`
  width: 40px;
  height: 40px;
  border: 2px solid ${({ $isActive, theme }) => ($isActive ? theme.colors.primary : 'transparent')};
  border-radius: ${({ theme }) => theme.radius.md};
  background-color: ${({ theme }) => theme.colors.bgElevated};
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.font.sizeLg};
  font-weight: ${({ theme }) => theme.font.weightBold};
  cursor: pointer;
  transition: background-color ${({ theme }) => theme.transition.fast};

  &:hover {
    background-color: ${({ theme }) => theme.colors.bgHover};
  }
`

export default function ProjectIcon({ label, iconLetter, $isActive, onClick }: ProjectIconProps) {
  return (
    <IconBtn $isActive={$isActive} onClick={onClick} aria-label={label} title={label} aria-current={$isActive ? 'true' : 'false'}>
      {iconLetter}
    </IconBtn>
  )
}
