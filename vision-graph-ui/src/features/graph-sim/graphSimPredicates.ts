import type { GraphSimState } from './graphSimTypes'

export const isStreaming = (state: GraphSimState): boolean => state.isStream

export const hasFinishedStream = (state: GraphSimState): boolean => state.hasFin

export const shouldShowMarkdown = (state: GraphSimState): boolean => state.showMd
