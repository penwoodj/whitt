import { useState, useCallback, useEffect } from 'react'
import { ReactFlow, Background, Controls } from 'reactflow'
import styled from 'styled-components'
import type { Node as FlowNode, Edge } from 'reactflow'
import ProjectPicker from '../project-picker'
import TopBar from '../top-bar'
import MarkdownHighlightMenu from '../markdown-highlight-menu'
import AppShell from '../app-shell'
import { Node } from '../node'
import { useGraphSimLogging } from './useGraphSimLogging'
import type { NodeData } from '../node/nodeTypes'
import { buildSampleProjects } from '../project-picker/projectPickerData'
import type { Project } from '../project-picker/projectPickerTypes'

const Placeholder = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.font.sizeLg};
`

const GraphContainer = styled.div`
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.bg};
`

type SimState = 'picker' | 'graph'

type Snapshot = {
  nodes: FlowNode[]
  edges: Edge[]
  graphTitle: string
}

export default function GraphSim() {
  const simLog = useGraphSimLogging()

  const [simState, setSimState] = useState<SimState>('picker')
  const [activeProjectId, setActiveProjectId] = useState<string>('')
  const [projects] = useState<Project[]>(buildSampleProjects())

  const [nodes, setNodes] = useState<FlowNode[]>([])
  const [edges, setEdges] = useState<Edge[]>([])
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null)
  const [graphTitle, setGraphTitle] = useState('')

  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced' | 'error'>('idle')
  const [lastSyncLabel, setLastSyncLabel] = useState('')

  const [canTravelBack, setCanTravelBack] = useState(false)
  const [canTravelForward, setCanTravelForward] = useState(false)
  const [commitLabel, setCommitLabel] = useState('')
  const [snapshots, setSnapshots] = useState<Snapshot[]>([])
  const [currentSnapshotIndex, setCurrentSnapshotIndex] = useState(-1)

  const [selectedText, setSelectedText] = useState('')
  const [highlightPosition, setHighlightPosition] = useState<{ x: number; y: number } | null>(null)

  const handleProjectSelect = useCallback((id: string) => {
    setActiveProjectId(id)
    setSimState('graph')
    setGraphTitle('New Research')
    setNodes([
      {
        id: 'root',
        type: 'custom',
        position: { x: 0, y: 0 },
        data: {
          id: 'root',
          title: 'Voice Node',
          status: 'idle',
          type: 'task',
          promptTxt: '',
          todos: [],
          lastUpdate: null,
          detailExpanded: false,
          todosExpanded: false,
          isRec: false,
        } as NodeData,
      } as FlowNode,
    ])
    setEdges([])
    setActiveNodeId('root')
    setCanTravelBack(false)
    setCanTravelForward(false)
    setCommitLabel('')
    setSnapshots([])
    setCurrentSnapshotIndex(-1)
    simLog.info('Project selected', { projectId: id })
  }, [simLog])

  const handleNewProject = useCallback(() => {
    simLog.debug('New project clicked')
  }, [simLog])

  const handleSync = useCallback(() => {
    setSyncStatus('syncing')
    simLog.info('Sync started')

    setTimeout(() => {
      setSyncStatus('synced')
      setLastSyncLabel('Synced just now')
      simLog.info('Sync completed')

      setTimeout(() => {
        setLastSyncLabel('Synced 1m ago')
      }, 60000)
    }, 1500)
  }, [simLog])

  const handleTravelBack = useCallback(() => {
    if (currentSnapshotIndex > 0) {
      const newIndex = currentSnapshotIndex - 1
      const snapshot = snapshots[newIndex]
      setNodes(snapshot.nodes)
      setEdges(snapshot.edges)
      setGraphTitle(snapshot.graphTitle)
      setCurrentSnapshotIndex(newIndex)
      setCanTravelBack(newIndex > 0)
      setCanTravelForward(newIndex < snapshots.length - 1)
      simLog.info('Traveled back', { snapshotIndex: newIndex })
    }
  }, [currentSnapshotIndex, snapshots, simLog])

  const handleTravelForward = useCallback(() => {
    if (currentSnapshotIndex < snapshots.length - 1) {
      const newIndex = currentSnapshotIndex + 1
      const snapshot = snapshots[newIndex]
      setNodes(snapshot.nodes)
      setEdges(snapshot.edges)
      setGraphTitle(snapshot.graphTitle)
      setCurrentSnapshotIndex(newIndex)
      setCanTravelBack(newIndex > 0)
      setCanTravelForward(newIndex < snapshots.length - 1)
      simLog.info('Traveled forward', { snapshotIndex: newIndex })
    }
  }, [currentSnapshotIndex, snapshots, simLog])

  const handleOpenSettings = useCallback(() => {
    simLog.debug('Settings opened')
  }, [simLog])

  const handleExpand = useCallback((text: string) => {
    if (!activeNodeId) return

    const childId = `expand-${Date.now()}`
    const childNode: FlowNode = {
      id: childId,
      type: 'custom',
      position: { x: 300, y: 400 },
      data: {
        id: childId,
        title: `Expand: ${text.slice(0, 20)}...`,
        status: 'idle',
        type: 'task',
        promptTxt: '',
        todos: [],
        lastUpdate: new Date(),
        detailExpanded: false,
        todosExpanded: false,
        isRec: false,
      } as NodeData,
    }

    const edge: Edge = {
      id: `${activeNodeId}-${childId}`,
      source: activeNodeId,
      target: childId,
    }

    setNodes((prev) => [...prev, childNode])
    setEdges((prev) => [...prev, edge])

    simLog.info('Expand child spawned', { parentId: activeNodeId, childId, text })
  }, [activeNodeId, simLog])

  const handleRefine = useCallback((text: string) => {
    simLog.debug('Refine clicked (stub)', { text })
  }, [simLog])

  const handleCloseMenu = useCallback(() => {
    setSelectedText('')
    setHighlightPosition(null)
  }, [])

  useEffect(() => {
    const handleMouseUp = () => {
      const selection = window.getSelection()
      const text = selection?.toString() || ''
      if (text.length > 0) {
        const range = selection?.getRangeAt(0)
        if (range) {
          const rect = range.getBoundingClientRect()
          setSelectedText(text)
          setHighlightPosition({ x: rect.left, y: rect.bottom + 10 })
        }
      }
    }

    document.addEventListener('mouseup', handleMouseUp)
    return () => document.removeEventListener('mouseup', handleMouseUp)
  }, [])

  const nodeTypes = {
    custom: Node,
  }

  if (simState === 'picker') {
    return (
      <div style={{ display: 'flex', width: '100vw', height: '100vh' }}>
        <ProjectPicker
          projects={projects}
          activeProjectId={activeProjectId}
          onSelect={handleProjectSelect}
          onNew={handleNewProject}
        />
        <Placeholder>Select or create project</Placeholder>
      </div>
    )
  }

  return (
    <AppShell
      sidebar={
        <ProjectPicker
          projects={projects}
          activeProjectId={activeProjectId}
          onSelect={handleProjectSelect}
          onNew={handleNewProject}
        />
      }
      topbar={
        <TopBar
          graphTitle={graphTitle}
          syncStatus={syncStatus}
          lastSyncLabel={lastSyncLabel}
          canTravelBack={canTravelBack}
          canTravelForward={canTravelForward}
          commitLabel={commitLabel}
          onSync={handleSync}
          onTravelBack={handleTravelBack}
          onTravelForward={handleTravelForward}
          onOpenSettings={handleOpenSettings}
        />
      }
    >
      <GraphContainer>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={(changes) => setNodes((nds) => applyNodeChanges(changes, nds))}
          onEdgesChange={(changes) => setEdges((eds) => applyEdgeChanges(changes, eds))}
          nodeTypes={nodeTypes}
          fitView
        >
          <Background />
          <Controls />
        </ReactFlow>
        <MarkdownHighlightMenu
          selectedText={selectedText}
          position={highlightPosition}
          onExpand={handleExpand}
          onRefine={handleRefine}
          onClose={handleCloseMenu}
        />
      </GraphContainer>
    </AppShell>
  )
}

import { applyNodeChanges, applyEdgeChanges } from 'reactflow'
