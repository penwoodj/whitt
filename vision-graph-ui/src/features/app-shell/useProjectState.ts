import { useState, useCallback } from 'react'

export type UseProjectStateOptions = {
  loadGraph: (projectId: string) => Promise<void>
}

export type UseProjectStateReturn = {
  activeProjectId: string | null
  isLoading: boolean
  error: string | null
  selectProject: (projectId: string) => Promise<void>
  resetToNew: () => void
}

export function useProjectState({ loadGraph }: UseProjectStateOptions): UseProjectStateReturn {
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const selectProject = useCallback(async (projectId: string) => {
    setIsLoading(true)
    setError(null)
    
    try {
      await loadGraph(projectId)
      setActiveProjectId(projectId)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load project')
    } finally {
      setIsLoading(false)
    }
  }, [loadGraph])

  const resetToNew = useCallback(() => {
    setActiveProjectId(null)
    setError(null)
  }, [])

  return {
    activeProjectId,
    isLoading,
    error,
    selectProject,
    resetToNew,
  }
}