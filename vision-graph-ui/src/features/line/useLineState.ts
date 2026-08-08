import { useState, useCallback } from 'react'
import type { LineStatus } from './lineTypes'
import { log } from '../../shared/logger'

const lineLog = log('useLineState')

export const useLineState = (initialStatus: LineStatus = 'idle') => {
  const [status, setStatus] = useState<LineStatus>(initialStatus)

  const setStatusLoading = useCallback(() => {
    setStatus('loading')
    lineLog.debug('Status set to loading')
  }, [])

  const setStatusDone = useCallback(() => {
    setStatus('done')
    lineLog.debug('Status set to done')
  }, [])

  const setStatusError = useCallback(() => {
    setStatus('error')
    lineLog.debug('Status set to error')
  }, [])

  const resetStatus = useCallback(() => {
    setStatus('idle')
    lineLog.debug('Status reset to idle')
  }, [])

  return {
    status,
    setStatus,
    setStatusLoading,
    setStatusDone,
    setStatusError,
    resetStatus,
  }
}
