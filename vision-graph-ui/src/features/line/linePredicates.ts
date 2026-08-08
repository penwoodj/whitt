import type { LineStatus } from './lineTypes'

export const isAct = (isActive?: boolean): boolean => !!isActive

export const hasErr = (status?: LineStatus): boolean => status === 'error'

export const isPend = (status?: LineStatus): boolean => status === 'loading'

export const isDone = (status?: LineStatus): boolean => status === 'done'
