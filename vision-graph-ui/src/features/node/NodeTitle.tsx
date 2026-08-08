import { useState, useCallback } from 'react'

type NodeTitleProps = {
  title: string
  onTitleChange?: (title: string) => void
}

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
      <input
        type="text"
        value={editTitle}
        onChange={(evt) => setEditTitle(evt.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        autoFocus
        style={{
          border: '1px solid #ccc',
          borderRadius: '4px',
          padding: '4px 8px',
          fontSize: '14px',
          width: '120px',
        }}
      />
    )
  }

  return (
    <span
      onDoubleClick={handleDblClick}
      style={{
        fontWeight: 'bold',
        fontSize: '14px',
        cursor: 'pointer',
        userSelect: 'none',
      }}
    >
      {title}
    </span>
  )
}
