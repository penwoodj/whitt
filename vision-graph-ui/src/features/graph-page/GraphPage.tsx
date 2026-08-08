import { ReactFlow, Background, Controls } from 'reactflow'
import 'reactflow/dist/style.css'
import { Node, emptyNode } from '../node'

type GraphPageProps = {
  title?: string
}

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
    <div style={{ height: '100vh', width: '100vw' }}>
      <ReactFlow nodes={nodes} nodeTypes={nodeTypes} fitView>
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  )
}

export default GraphPage
