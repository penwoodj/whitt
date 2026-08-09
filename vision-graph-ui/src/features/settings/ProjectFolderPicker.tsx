import { useState, useCallback } from 'react'
import styled from 'styled-components'
import type { ProjectFolderPickerProps } from './settingsTypes'

const CfgWrapper = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  align-items: center;
`

const CfgInput = styled.input`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.colors.bg};
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.sm};
  font-family: ${({ theme }) => theme.font.sans};
  font-size: ${({ theme }) => theme.font.sizeMd};
  outline: none;

  &:focus {
    border-color: ${({ theme }) => theme.colors.borderActive};
  }
`

const CfgBtn = styled.button`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.textInverse};
  border: none;
  border-radius: ${({ theme }) => theme.radius.sm};
  font-family: ${({ theme }) => theme.font.sans};
  font-size: ${({ theme }) => theme.font.sizeMd};
  font-weight: ${({ theme }) => theme.font.weightMedium};
  cursor: pointer;
  transition: background ${({ theme }) => theme.transition.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.primaryHover};
  }

  &:active {
    transform: scale(0.98);
  }
`

export const ProjectFolderPicker = ({ folderPath, onChange }: ProjectFolderPickerProps): React.JSX.Element => {
  const [value, setValue] = useState(folderPath)

  const handleChange = useCallback((evt: React.ChangeEvent<HTMLInputElement>): void => {
    setValue(evt.target.value)
    onChange(evt.target.value)
  }, [onChange])

  const handleBrowse = useCallback((): void => {
  }, [])

  return (
    <CfgWrapper>
      <CfgInput
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="/path/to/folder"
      />
      <CfgBtn type="button" onClick={handleBrowse}>
        Browse
      </CfgBtn>
    </CfgWrapper>
  )
}
