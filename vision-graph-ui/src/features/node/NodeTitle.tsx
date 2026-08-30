import { useState, useCallback } from 'react'
import styled from 'styled-components'

type NodeTitleProps = {
  title: string
  onTitleChange?: (title: string) => void
}

const TitleInput = styled.input`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.sm};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.font.sizeSm};
  width: 120px;
`

const TitleSpan = styled.span`
  font-weight: ${({ theme }) => theme.font.weightBold};
  font-size: ${({ theme }) => theme.font.sizeMd};
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  user-select: none;
`

export default function NodeTitle({ title, onTitleChange }: NodeTitleProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(title)

  const handleDblClick = useCallback(() => {
    setEditTitle(title)
    setIsEditing(true)
  }, [title])

  const handleBlur = useCallback(() => {
    setIsEditing(false)
    if (editTitle.trim() && onTitleChange) {
      onTitleChange(editTitle.trim())
    }
  }, [editTitle, onTitleChange])

  const handleKeyDown = useCallback(
    (evt: React.KeyboardEvent<HTMLInputElement>) => {
      if (evt.key === 'Enter') {
        evt.currentTarget.blur()
      }
    },
    []
  )

  if (isEditing) {
    return (
      <TitleInput
        type="text"
        value={editTitle}
        onChange={(evt) => setEditTitle(evt.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        autoFocus
      />
    )
  }

  return <TitleSpan onDoubleClick={handleDblClick}>{title}</TitleSpan>
}
