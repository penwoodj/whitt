import { useState, useRef } from 'react'
import { WriteQueue } from '../../shared/fs/WriteQueue'

type FileEditState = {
  isEditing: boolean
  originalContent: string
  content: string
}

export function useFileEdit(
  initialContent: string,
  writeQueue: WriteQueue | undefined,
  filePath: string
): FileEditState & {
  toggleEdit: () => void
  saveOnBlur: (newContent: string) => void
} {
  const pendingContentRef = useRef(initialContent)
  const [state, setState] = useState<FileEditState>({
    isEditing: false,
    originalContent: initialContent,
    content: initialContent
  })

  const toggleEdit = () => {
    setState(prev => {
      const wasEditing = prev.isEditing

      if (wasEditing && pendingContentRef.current !== prev.originalContent && writeQueue) {
        writeQueue.write(filePath, pendingContentRef.current)
        return {
          ...prev,
          isEditing: false,
          content: pendingContentRef.current,
          originalContent: pendingContentRef.current
        }
      }

      return {
        ...prev,
        isEditing: !prev.isEditing
      }
    })
  }

  const saveOnBlur = (newContent: string) => {
    pendingContentRef.current = newContent
  }

  return {
    ...state,
    toggleEdit,
    saveOnBlur
  }
}