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
  transition: background-color ${({ theme }) => theme.transition.fast};
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: ${({ theme }) => theme.colors.bgHover};
  }
`

export default function NewProjectBtn({ onClick }: NewProjectBtnProps) {
  return (
    <NewBtn onClick={onClick} aria-label="New Project" title="New Project">
      +
    </NewBtn>
  )
}
