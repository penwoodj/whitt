import flow from 'lodash/fp/flow'
import take from 'lodash/fp/take'
import split from 'lodash/fp/split'
import join from 'lodash/fp/join'
import type { LoremConfig } from './graphSimTypes'

export const chunkLorem = (txt: string, charsPerTick: number): string =>
  flow([split(''), take(charsPerTick), join('')])(txt)

export const createStreamChunk = (source: string, offset: number, charsPerTick: number): string => {
  const start = offset
  const end = offset + charsPerTick
  return source.slice(start, end)
}

export const getDefaultConfig = (): LoremConfig => ({
  source: '',
  charsPerTick: 10,
  msPerTick: 1000,
})
