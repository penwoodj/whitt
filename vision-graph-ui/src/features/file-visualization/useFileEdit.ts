import { useState, useRef } from 'react'
import { WriteQueue } from '../../shared/fs/WriteQueue'

type FileEditState = {
  isEditing: boolean
  originalContent: string
  content: string
  saveError: Error | null
}

export function useFileEdit(
  initialContent: string,
  writeQueue: WriteQueue | undefined,
  filePath: string
): FileEditState & {
  toggleEdit: () => void
  saveOnBlur: (newContent: string) => void
  retrySave: () => void
} {
  const pendingContentRef = useRef(initialContent)
  const [state, setState] = useState<FileEditState>({
    isEditing: false,
    originalContent: initialContent,
    content: initialContent,
    saveError: null
  })

  const toggleEdit = () => {
    setState(prev => {
      const wasEditing = prev.isEditing

      if (wasEditing && pendingContentRef.current !== prev.originalContent) {
        if (writeQueue) {
          try {
            writeQueue.write(filePath, pendingContentRef.current)
            return {
              ...prev,
              isEditing: false,
              content: pendingContentRef.current,
              originalContent: pendingContentRef.current,
              saveError: null
            }
          } catch (err) {
            return {
              ...prev,
              saveError: err instanceof Error ? err : new Error('Save failed')
            }
          }
        }
      }

      return {
        ...prev,
        isEditing: !prev.isEditing,
        saveError: null
      }
    })
  }

  const saveOnBlur = (newContent: string) => {
    pendingContentRef.current = newContent
  }

  const retrySave = () => {
    setState(prev => {
      if (!writeQueue || !prev.saveError) return prev

      try {
        writeQueue.write(filePath, pendingContentRef.current)
        return {
          ...prev,
          isEditing: false,
          content: pendingContentRef.current,
          originalContent: pendingContentRef.current,
          saveError: null
        }
      } catch (err) {
        return {
          ...prev,
          saveError: err instanceof Error ? err : new Error('Save failed')
        }
      }
    })
  }

  return {
    ...state,
    toggleEdit,
    saveOnBlur,
    retrySave
  }
}