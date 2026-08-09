import type { NodeData } from '../node/nodeTypes'

export type GraphSimState = {
  nodeData: NodeData
  streamTxt: string
  isStream: boolean
  hasFin: boolean
  showMd: boolean
}

export type LoremConfig = {
  source: string
  charsPerTick: number
  msPerTick: number
}

export type GraphSimProps = {}

export type LoremStreamState = {
  txt: string
  isStream: boolean
  startStream: () => void
  stopStream: () => void
  resetStream: () => void
}
