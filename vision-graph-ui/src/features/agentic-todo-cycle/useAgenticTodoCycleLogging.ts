import { useMemo } from 'react'
import { log } from '../../shared/logger'

export const useAgenticTodoCycleLogging = () => useMemo(() => log('AgenticTodoCycle'), [])
