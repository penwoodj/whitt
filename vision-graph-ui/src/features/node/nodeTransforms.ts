import flow from 'lodash/fp/flow'
import filter from 'lodash/fp/filter'
import map from 'lodash/fp/map'
import sortBy from 'lodash/fp/sortBy'
import take from 'lodash/fp/take'

import type { NodeData } from './nodeTypes'
import { isBusy, isIdle, isRunning, isRecording } from './nodePredicates'

export const filterBusyNodes = (nodes: NodeData[]): NodeData[] => filter(isBusy)(nodes)

export const filterIdleNodes = (nodes: NodeData[]): NodeData[] => filter(isIdle)(nodes)

export const filterRecordingNodes = (nodes: NodeData[]): NodeData[] => filter(isRecording)(nodes)

export const filterRunningNodes = (nodes: NodeData[]): NodeData[] => filter(isRunning)(nodes)

export const sortNodesByLastUpdate = (nodes: NodeData[]): NodeData[] =>
  sortBy((node: NodeData) => node.lastUpdate?.getTime() ?? 0)(nodes)

export const sortNodesByTitle = (nodes: NodeData[]): NodeData[] => sortBy((node: NodeData) => node.title)(nodes)

export const mapNodeTitles = (nodes: NodeData[]): string[] => map((node: NodeData) => node.title)(nodes)

export const getTopNNodes = (n: number) => (nodes: NodeData[]): NodeData[] => take(n)(nodes)

export const getRecentBusyNodes = flow([filterBusyNodes, sortNodesByLastUpdate])

export const getRecentIdleNodes = flow([filterIdleNodes, sortNodesByLastUpdate])

export const getTopNBusyNodes = (n: number) => flow([filterBusyNodes, sortNodesByLastUpdate, getTopNNodes(n)])
