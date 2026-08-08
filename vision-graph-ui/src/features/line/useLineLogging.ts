import { useCallback } from 'react'
import { log } from '../../shared/logger'

const lineLog = log('useLineLogging')

export const useLineLogging = (lineId: string) => {
  const logRender = useCallback(() => {
    lineLog.debug(`Line ${lineId} rendered`)
  }, [lineId])

  const logClick = useCallback((kind: string) => {
    lineLog.info(`Line ${lineId} clicked, kind: ${kind}`)
  }, [lineId])

  const logStatusChange = useCallback((oldStatus: string, newStatus: string) => {
    lineLog.debug(`Line ${lineId} status: ${oldStatus} -> ${newStatus}`)
  }, [lineId])

  return {
    logRender,
    logClick,
    logStatusChange,
  }
}
