import { useState, forwardRef } from 'react'
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
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  &:hover {
    background-color: ${({ theme }) => theme.colors.bgHover};
  }
`

const TitleInput = styled.input`
  position: absolute;
  bottom: -24px;
  left: 50%;
  transform: translateX(-50%);
  background-color: ${({ theme }) => theme.colors.bgElevated};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.sm};
  padding: 4px 8px;
  font-size: ${({ theme }) => theme.font.sizeSm};
  color: ${({ theme }) => theme.colors.text};
  width: 80px;
  text-align: center;
  z-index: 100;
  outline: none;
  
  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`

const getFirstLetter = (text: string): string => {
  return text.trim().charAt(0).toUpperCase() || ''
}

const ProjectIcon = forwardRef<HTMLButtonElement, ProjectIconProps>(
  ({ label, iconLetter, $isActive, onClick }, ref) => {
    const [isEditing, setIsEditing] = useState(false)
    const [title, setTitle] = useState(label)

    const handleIconClick = () => {
      onClick()
    }

    const handleTitleClick = (e: React.MouseEvent) => {
      e.stopPropagation()
      setIsEditing(true)
    }

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setTitle(e.target.value)
    }

    const handleTitleBlur = () => {
      setIsEditing(false)
    }

    const handleTitleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        setIsEditing(false)
      }
    }

    const displayLetter = isEditing ? getFirstLetter(title) : iconLetter

    return (
      <IconBtn 
        ref={ref}
        $isActive={$isActive} 
        onClick={handleIconClick} 
        aria-label={title} 
        title={title} 
        aria-current={$isActive ? 'true' : 'false'}
      >
        {displayLetter}
        {isEditing && (
          <TitleInput
            value={title}
            onChange={handleTitleChange}
            onBlur={handleTitleBlur}
            onKeyDown={handleTitleKeyDown}
            onClick={handleTitleClick}
            autoFocus
          />
        )}
      </IconBtn>
    )
  }
)

ProjectIcon.displayName = 'ProjectIcon'

export default ProjectIcon
