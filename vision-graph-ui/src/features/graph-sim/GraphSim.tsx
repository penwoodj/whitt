import { useCallback, useState, useEffect } from 'react'
import { ReactFlow, Background, Controls } from 'reactflow'
import styled from 'styled-components'
import SimNode from './SimNode'
import { useLoremStream } from './useLoremStream'
import { useGraphSimLogging } from './useGraphSimLogging'
import { loremIpsum, sampleReportMd } from './graphSimData'
import { getDefaultConfig } from './graphSimTransforms'
import type { NodeData } from '../node/nodeTypes'

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: ${({ theme }) => theme.colors.bg};
`

const defaultConfig = getDefaultConfig()
defaultConfig.source = loremIpsum

export default function GraphSim() {
  const simLog = useGraphSimLogging()
  const { txt, isStream, startStream, stopStream, resetStream } = useLoremStream(defaultConfig)

  const [nodeData, setNodeData] = useState<NodeData>({
    id: 'sim-node',
    title: 'Voice Node',
    status: 'idle',
    type: 'task',
    promptTxt: '',
    todos: [],
    lastUpdate: null,
    detailExpanded: false,
    todosExpanded: false,
    isRec: false,
  })

  const [hasFin, setHasFin] = useState(false)
  const [markdownVisible, setMarkdownVisible] = useState(false)

  const handleMicClick = useCallback(() => {
    if (isStream) {
      stopStream()
      setNodeData((prev) => ({
        ...prev,
        status: 'done',
        isRec: false,
      }))
      setHasFin(true)
      simLog.info('Stream stopped, markdown scheduled')
    } else {
      if (hasFin) {
        resetStream()
        setMarkdownVisible(false)
        setNodeData((prev) => ({
          ...prev,
          status: 'idle',
          promptTxt: '',
          detailExpanded: false,
          isRec: false,
        }))
        setHasFin(false)
        simLog.info('Reset sim')
      }
      startStream()
      setNodeData((prev) => ({
        ...prev,
        status: 'recording',
        isRec: true,
      }))
      simLog.info('Stream started')
    }
  }, [isStream, hasFin, startStream, stopStream, resetStream, simLog])

  useEffect(() => {
    setNodeData((prev) => ({
      ...prev,
      promptTxt: txt,
      lastUpdate: new Date(),
    }))
  }, [txt])

  useEffect(() => {
    if (hasFin && !markdownVisible) {
      const timer = setTimeout(() => {
        setNodeData((prev) => ({
          ...prev,
          detailExpanded: true,
        }))
        setMarkdownVisible(true)
        simLog.info('Markdown panel expanded')
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [hasFin, markdownVisible, simLog])

  const nodes = [
    {
      id: 'sim-node',
      type: 'sim',
      position: { x: 0, y: 0 },
      data: {
        ...nodeData,
        markdown: markdownVisible ? sampleReportMd : undefined,
        onMicClick: handleMicClick,
      } as NodeData & { markdown?: string; onMicClick?: () => void },
    },
  ]

  const nodeTypes = {
    sim: SimNode,
  }

  return (
    <Wrapper>
      <ReactFlow nodes={nodes} nodeTypes={nodeTypes} fitView>
        <Background />
        <Controls />
      </ReactFlow>
    </Wrapper>
  )
}
