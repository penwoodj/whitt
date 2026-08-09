import { useMemo } from 'react'
import { log } from '../../shared/logger'

export const useGraphSimLogging = () => useMemo(() => log('GraphSim'), [])
