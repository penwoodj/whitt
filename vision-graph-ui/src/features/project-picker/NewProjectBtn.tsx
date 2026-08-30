import styled from 'styled-components'
import type { NewProjectBtnProps } from './projectPickerTypes'

const NewBtn = styled.button`
  width: 40px;
  height: 40px;
  border: 2px solid transparent;
  border-radius: ${({ theme }) => theme.radius.md};
  background-color: ${({ theme }) => theme.colors.bgElevated};
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.font.sizeXl};
  font-weight: ${({ theme }) => theme.font.weightBold};
  cursor: pointer;
  transition:
    background-color ${({ theme }) => theme.transition.fast},
    box-shadow ${({ theme }) => theme.transition.fast},
    color ${({ theme }) => theme.transition.fast};
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: ${({ theme }) => theme.colors.bgHover};
    color: ${({ theme }) => theme.colors.primary};
    box-shadow: ${({ theme }) => theme.glow.primary};
  }

  &:focus-visible {
    outline: none;
    color: ${({ theme }) => theme.colors.primary};
    box-shadow: ${({ theme }) => theme.glow.primary};
  }
`

export default function NewProjectBtn({ onClick }: NewProjectBtnProps) {
  return (
    <NewBtn onClick={onClick} aria-label="New Project" title="New Project">
      +
    </NewBtn>
  )
}
