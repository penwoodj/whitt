import { useState, useCallback } from 'react'

export interface Intervention {
  nodeId: string
  correction: string
}

export type ExecutionStatus = 'running' | 'interrupted' | 'stopped'

export function useIntervention() {
  const [queue, setQueue] = useState<Intervention[]>([])
  const [executionStatus, setExecutionStatus] = useState<ExecutionStatus>('running')

  const queueIntervention = useCallback((nodeId: string, correction: string) => {
    setQueue(prev => [...prev, { nodeId, correction }])
    setExecutionStatus('interrupted')
  }, [])

  const getQueue = useCallback((): Intervention[] => {
    return queue
  }, [queue])

  const processNextIntervention = useCallback(() => {
    setQueue(prev => prev.slice(1))
    if (queue.length <= 1) {
      setExecutionStatus('running')
    }
  }, [queue.length])

  const getStatusMessage = useCallback((): string => {
    switch (executionStatus) {
      case 'interrupted':
        return 'Interrupted by user'
      case 'stopped':
        return 'Stopped by user'
      default:
        return 'Running'
    }
  }, [executionStatus])

  const isInputBlocked = useCallback((): boolean => {
    return false
  }, [])

  const sendCorrection = useCallback((
    nodeId: string,
    correction: string,
    onSend: (nodeId: string, correction: string) => void
  ) => {
    onSend(nodeId, correction)
    queueIntervention(nodeId, correction)
  }, [queueIntervention])

  const stopExecution = useCallback((onStop: () => void) => {
    setExecutionStatus('stopped')
    setQueue([])
    onStop()
  }, [])

  return {
    queueIntervention,
    getQueue,
    processNextIntervention,
    executionStatus,
    getStatusMessage,
    isInputBlocked,
    sendCorrection,
    stopExecution,
  }
}