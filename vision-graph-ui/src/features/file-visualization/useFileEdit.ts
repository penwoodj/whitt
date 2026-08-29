import { useState, useRef } from 'react'
import { WriteQueue } from '../../shared/fs/WriteQueue'

type FileEditState = {
  isEditing: boolean
  originalContent: string
  content: string
  saveError: Error | null
  conflict: boolean
  diskContent: string
}

export function useFileEdit(
  initialContent: string,
  writeQueue: WriteQueue | undefined,
  filePath: string,
  onExternalChange?: (event: { type: string; path: string }) => void
): FileEditState & {
  toggleEdit: () => void
  saveOnBlur: (newContent: string) => void
  retrySave: () => void
  handleDiskChange: (newContent: string) => void
  keepMine: () => void
} {
  const pendingContentRef = useRef(initialContent)
  const [state, setState] = useState<FileEditState>({
    isEditing: false,
    originalContent: initialContent,
    content: initialContent,
    saveError: null,
    conflict: false,
    diskContent: initialContent
  })

  const toggleEdit = () => {
    setState(prev => {
      if (prev.saveError) {
        return prev
      }

      const wasEditing = prev.isEditing

      if (wasEditing && writeQueue) {
        try {
          writeQueue.write(filePath, pendingContentRef.current)
          return {
            ...prev,
            isEditing: false,
            content: pendingContentRef.current,
            originalContent: pendingContentRef.current,
            saveError: null,
            conflict: false
          }
        } catch (err) {
          return {
            ...prev,
            saveError: err instanceof Error ? err : new Error('Save failed'),
            isEditing: true
          }
        }
      }

      return {
        ...prev,
        isEditing: !prev.isEditing,
        saveError: null,
        conflict: false
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

  const handleDiskChange = (newContent: string) => {
    if (state.isEditing && newContent !== pendingContentRef.current) {
      setState(prev => ({
        ...prev,
        conflict: true,
        diskContent: newContent
      }))
      if (onExternalChange) {
        onExternalChange({ type: 'change', path: filePath })
      }
    } else {
      setState(prev => ({
        ...prev,
        content: newContent,
        originalContent: newContent,
        diskContent: newContent
      }))
    }
  }

  const keepMine = () => {
    setState(prev => ({
      ...prev,
      conflict: false,
      diskContent: pendingContentRef.current
    }))
  }

  return {
    ...state,
    toggleEdit,
    saveOnBlur,
    retrySave,
    handleDiskChange,
    keepMine
  }
}