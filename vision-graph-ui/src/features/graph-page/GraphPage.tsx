import { ReactFlow, Background, Controls } from 'reactflow'
import 'reactflow/dist/style.css'
import styled from 'styled-components'
import { Node, emptyNode } from '../node'

type GraphPageProps = {
  title?: string
}

const GraphPageWrap = styled.div`
  height: 100vh;
  width: 100vw;
  background-color: ${({ theme }) => theme.colors.bg};
`

const GraphPage = ({ title = 'Start Node' }: GraphPageProps) => {
  const baseNode = emptyNode()
  const nodeWithTitle = { ...baseNode, title }

  const nodes = [
    {
      id: nodeWithTitle.id,
      type: 'whittNode',
      position: { x: 100, y: 100 },
      data: nodeWithTitle,
    },
  ]

  const nodeTypes = { whittNode: Node }

  return (
    <GraphPageWrap>
      <ReactFlow nodes={nodes} nodeTypes={nodeTypes} defaultViewport={{ x: 0, y: 0, zoom: 0.4 }}>
        <Background color="#A6A6A6" gap={20} />
        <Controls />
      </ReactFlow>
    </GraphPageWrap>
  )
}

export default GraphPage
