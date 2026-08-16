import { useState, useCallback, useEffect, useMemo } from 'react'
import { ReactFlow, Background, Controls, applyNodeChanges, applyEdgeChanges } from '@xyflow/react'
import styled from 'styled-components'
import type { Node as FlowNode, Edge } from '@xyflow/react'
import ProjectPicker from '../project-picker'
import TopBar from '../top-bar'
import MarkdownHighlightMenu from '../markdown-highlight-menu'
import AppShell from '../app-shell'
import { Node } from '../node'
import SettingsPanel from '../settings-panel'
import NewProjectModal from '../new-project-modal'
import { useAgenticTodoCycle } from '../agentic-todo-cycle'
import { useGraphSimLogging } from './useGraphSimLogging'
import type { NodeData } from '../node/nodeTypes'
import { buildSampleProjects } from '../project-picker/projectPickerData'
import type { Project } from '../project-picker/projectPickerTypes'
import { loadProjectGraph } from '../../shared/fsGraphLoader'
import { FsGraphSync } from '../../shared/fs/FsGraphSync'
import { FakeFsPort } from '../../shared/fs/FakeFsPort'
import { simpleGit } from 'simple-git'

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
  const [projects, setProjects] = useState<Project[]>(buildSampleProjects())

  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false)

  const { todos, startCycle: startTodoCycle } = useAgenticTodoCycle({
    onCycleDone: () => {
      simLog.info('Agentic todo cycle done')
      setNodes((prev) =>
        prev.map((node) =>
          node.id === activeNodeId
            ? {
                ...node,
                data: {
                  ...node.data,
                  lifecycle: 'done',
                  isCycleRun: false,
                  bodyMarkdown: (node.data as any).bodyMarkdown || generatePlaceholderMarkdown(node.data.promptTxt),
                } as NodeData,
              }
            : node
        )
      )
    },
  })

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

  const fsPort = useMemo(() => new FakeFsPort(), [])
  const git = useMemo(() => simpleGit(), [])
  const fsSync = useMemo(
    () =>
      new FsGraphSync(
        fsPort,
        git,
        (event) => {
          simLog.info('External FS change detected', { event })
          simLog.debug('External change would trigger reload', { path: event.path })
        }
      ),
    [fsPort, git, simLog]
  )

  useEffect(() => {
    if (activeNodeId) {
      setNodes((prev) =>
        prev.map((node) =>
          node.id === activeNodeId
            ? {
                ...node,
                data: {
                  ...node.data,
                  todos,
                  todosExpanded: todos.length > 0,
                } as NodeData,
              }
            : node
        )
      )
    }
  }, [activeNodeId, todos])

  const handleProjectSelect = useCallback(async (id: string) => {
    setActiveProjectId(id)
    setSimState('graph')
    
    try {
      const projectId = id as 'ai-frameworks' | 'local-first' | 'whitt-arch'
      const { nodes: loadedNodes, edges: loadedEdges } = await loadProjectGraph(projectId)
      
      setGraphTitle(loadedNodes[0]?.data.title || 'Project Graph')
      setNodes(loadedNodes)
      setEdges(loadedEdges)
      setActiveNodeId(loadedNodes[0]?.id || null)
      setCanTravelBack(false)
      setCanTravelForward(false)
      setCommitLabel('')
      setSnapshots([])
      setCurrentSnapshotIndex(-1)
      
      simLog.info('Project graph loaded', { projectId, nodeCount: loadedNodes.length, edgeCount: loadedEdges.length })
    } catch (error) {
      simLog.error('Failed to load project graph', { projectId: id, error })
      setGraphTitle('Error Loading Project')
      setNodes([])
      setEdges([])
    }
  }, [simLog])

  const handleNewProject = useCallback(() => {
    setIsNewProjectModalOpen(true)
    simLog.debug('New project clicked')
  }, [simLog])

  const handleCreateProject = useCallback(
    ({ name, folder }: { name: string; folder: string }) => {
      const newProject: Project = {
        id: `proj-${Date.now()}`,
        label: name,
        iconLetter: name[0].toUpperCase(),
        lastOpened: new Date(),
      }
      setProjects((prev) => [...prev, newProject])
      setActiveProjectId(newProject.id)
      setIsNewProjectModalOpen(false)
      setSimState('graph')
      setGraphTitle(name)
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
          lifecycle: 'initial',
          nodeViewState: 'collapsed',
          focused: false,
          promptTxt: '',
          todos: [],
          lastUpdate: null,
          detailExpanded: false,
          todosExpanded: false,
          isRec: false,
          isCycleRun: false,
        } as NodeData,
        } as FlowNode,
      ])
      setEdges([])
      setActiveNodeId('root')
      simLog.info('Project created', { name, folder })
    },
    [simLog]
  )

  const handleCancelNewProject = useCallback(() => {
    setIsNewProjectModalOpen(false)
    simLog.debug('New project cancelled')
  }, [simLog])

  const handleCloseSettings = useCallback(() => {
    setIsSettingsOpen(false)
    simLog.debug('Settings closed')
  }, [simLog])

  const handleSync = useCallback(() => {
    setSyncStatus('syncing')
    simLog.info('Sync started')

    fsSync.flush()

    setTimeout(() => {
      setSyncStatus('synced')
      setLastSyncLabel('Synced just now')
      simLog.info('Sync completed')

      setTimeout(() => {
        setLastSyncLabel('Synced 1m ago')
      }, 60000)
    }, 500)
  }, [fsSync, simLog])

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
    setIsSettingsOpen(true)
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
          id: 'root',
          title: 'Voice Node',
          status: 'idle',
          type: 'task',
          lifecycle: 'initial',
          nodeViewState: 'collapsed',
          focused: false,
          promptTxt: '',
          todos: [],
          lastUpdate: null,
          detailExpanded: false,
          todosExpanded: false,
          isRec: false,
          isCycleRun: false,
        } as NodeData,
    }

    const edge: Edge = {
      id: `${activeNodeId}-${childId}`,
      source: activeNodeId,
      target: childId,
      type: 'smoothstep',
      data: { kind: 'PRODUCED' },
    }

    setNodes((prev) => [...prev, childNode])
    setEdges((prev) => [...prev, edge])

    const newSnapshot: Snapshot = {
      nodes: [...nodes, childNode],
      edges: [...edges, edge],
      graphTitle,
    }
    setSnapshots((prev) => [...prev.slice(0, currentSnapshotIndex + 1), newSnapshot])
    setCurrentSnapshotIndex((prev) => prev + 1)
    setCanTravelBack(true)
    setCanTravelForward(false)
    setCommitLabel(`Expand: ${text.slice(0, 20)}...`)

    simLog.info('Expand child spawned', { parentId: activeNodeId, childId, text })
  }, [activeNodeId, nodes, edges, graphTitle, currentSnapshotIndex, simLog])

  const handleRefine = useCallback((text: string) => {
    if (!activeNodeId) return

    const childId = `refine-${Date.now()}`
    const childNode: FlowNode = {
      id: childId,
      type: 'custom',
      position: { x: 300, y: 400 },
        data: {
          id: childId,
          title: `Expand: ${text.slice(0, 20)}...`,
          status: 'idle',
          type: 'task',
          lifecycle: 'initial',
          nodeViewState: 'collapsed',
          focused: false,
          promptTxt: text,
          todos: [],
          lastUpdate: new Date(),
          detailExpanded: false,
          todosExpanded: false,
          isRec: false,
          isCycleRun: false,
        } as NodeData,
    }

    const edge: Edge = {
      id: `${activeNodeId}-${childId}`,
      source: activeNodeId,
      target: childId,
      type: 'smoothstep',
      data: { kind: 'PRODUCED' },
    }

    setNodes((prev) => [...prev, childNode])
    setEdges((prev) => [...prev, edge])

    const newSnapshot: Snapshot = {
      nodes: [...nodes, childNode],
      edges: [...edges, edge],
      graphTitle,
    }
    setSnapshots((prev) => [...prev.slice(0, currentSnapshotIndex + 1), newSnapshot])
    setCurrentSnapshotIndex((prev) => prev + 1)
    setCanTravelBack(true)
    setCanTravelForward(false)
    setCommitLabel(`Refine: ${text.slice(0, 20)}...`)

    simLog.info('Refine child spawned', { parentId: activeNodeId, childId, text })
  }, [activeNodeId, nodes, edges, graphTitle, currentSnapshotIndex, simLog])

  const handleNodeSend = useCallback((txt: string) => {
    if (!activeNodeId) return

    setNodes((prev) =>
      prev.map((node) =>
        node.id === activeNodeId
          ? {
              ...node,
              data: {
                ...node.data,
                lifecycle: 'agentic-running',
                isCycleRun: true,
                promptTxt: txt,
              } as NodeData,
            }
          : node
      )
    )

    startTodoCycle()
    simLog.info('Node prompt sent, cycle started', { nodeId: activeNodeId, txt })
  }, [activeNodeId, startTodoCycle, simLog])

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

const nodeTypes = useMemo(() => ({
  custom: (props: any) => <Node {...props} onSend={handleNodeSend} />,
}), [handleNodeSend])

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
        <NewProjectModal
          isOpen={isNewProjectModalOpen}
          onCreate={handleCreateProject}
          onCancel={handleCancelNewProject}
        />
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
          defaultViewport={{ x: 0, y: 0, zoom: 0.4 }}
          minZoom={0.1}
          maxZoom={2.5}
          zoomOnScroll={true}
          zoomOnPinch={true}
          panOnScroll={false}
          panOnDrag={true}
          panActivationKeyCode={' '}
          selectionOnDrag={true}
        >
          <Background color="#A6A6A6" gap={20} />
          <Controls showFitView={true} />
        </ReactFlow>
        <MarkdownHighlightMenu
          selectedText={selectedText}
          position={highlightPosition}
          onExpand={handleExpand}
          onRefine={handleRefine}
          onClose={handleCloseMenu}
        />
      </GraphContainer>
      <SettingsPanel isOpen={isSettingsOpen} onClose={handleCloseSettings} />
      <NewProjectModal
        isOpen={isNewProjectModalOpen}
        onCreate={handleCreateProject}
        onCancel={handleCancelNewProject}
      />
    </AppShell>
  )
}

function generatePlaceholderMarkdown(promptTxt: string): string {
  return `# Response

Based on your prompt: "${promptTxt}"

## Key findings
- Analysis completed successfully
- Relevant information gathered
- Synthesis of key concepts

## Sources
- [Internal Knowledge Base](#)
- [Research Database](#)
- [Documentation Archive](#)

## Next Steps
- Review findings
- Expand on specific topics
- Generate follow-up questions
`
}
