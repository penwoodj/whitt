import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ReactFlowProvider } from '@xyflow/react'
import { ThemeProvider } from '../../shared/ThemeProvider'
import { GraphWorkspace } from './GraphWorkspace'

describe('GraphWorkspace', () => {
  it('hosts ReactFlow canvas in composed app', () => {
    render(
      <ThemeProvider>
        <ReactFlowProvider>
          <GraphWorkspace
            nodes={[]}
            edges={[]}
            onNodeSend={() => {}}
            onNodesChange={() => {}}
            onEdgesChange={() => {}}
            onSelectionChange={() => {}}
            setNodes={() => {}}
            selectedNodeIds={[]}
            onFormat={() => false}
            activeNodeId={null}
            onNodeMouseEnter={() => {}}
            onNodeMouseLeave={() => {}}
            onNodeDragStart={() => {}}
            onNodeDragStop={() => {}}
            onConnect={() => {}}
            onCreateNode={() => {}}
            onNodeClick={() => {}}
          />
        </ReactFlowProvider>
      </ThemeProvider>
    )

    expect(screen.getByTestId('react-flow__canvas')).toBeInTheDocument()
  })
})
