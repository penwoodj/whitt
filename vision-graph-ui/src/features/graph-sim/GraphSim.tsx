import { useState, useCallback, useEffect, useMemo, useRef } from 'react'
import '@xyflow/react/dist/style.css'
import { applyNodeChanges, applyEdgeChanges, ReactFlowProvider } from '@xyflow/react'
import styled from 'styled-components'
import type { Node as FlowNode, Edge, OnConnect } from '@xyflow/react'
import ProjectPicker from '../project-picker'
import TopBar from '../top-bar'
import MarkdownHighlightMenu from '../markdown-highlight-menu'
import AppShell from '../app-shell'
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
import { GraphWorkspace } from './GraphWorkspace'
import { DagFormatCycleError, formatSelectedDag, type DagDirection } from './dagFormat'
import type { AgentEvt } from '../../shared/agent/types'
import type { ContextPill } from '../context-pills/contextPillTypes'

const Placeholder = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.font.sizeLg};
  font-weight: ${({ theme }) => theme.font.weightMedium};
  letter-spacing: 0.02em;
`

const GraphContainer = styled.div`
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.bg};
`

type SimState = 'picker' | 'graph'
type Snapshot = { nodes: FlowNode[]; edges: Edge[]; graphTitle: string }
const workflow = 'name: graph-node\nsteps:\n  - name: research web\n    action: agent\n  - name: draft outline\n    action: agent\n  - name: verify + cite\n    action: agent'
const defaultContextPills: ContextPill[] = [{ id: 'pill-1', lineRange: 'L12-18', startLine: 12, endLine: 18, textSnippet: 'graph node context', filePath: 'index.md' }]

const isNodeData = (value: unknown): value is NodeData => typeof value === 'object' && value !== null && 'id' in value && 'title' in value && 'status' in value

export default function GraphSim() {
  const simLog = useGraphSimLogging()
  const [simState, setSimState] = useState<SimState>('picker')
  const [activeProjectId, setActiveProjectId] = useState('')
  const [projects, setProjects] = useState<Project[]>(buildSampleProjects())
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false)
  const [nodes, setNodes] = useState<FlowNode[]>([])
  const [edges, setEdges] = useState<Edge[]>([])
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null)
  const activeNodeIdRef = useRef<string | null>(null)
  const [selectedNodeIds, setSelectedNodeIds] = useState<readonly string[]>([])
  const [graphTitle, setGraphTitle] = useState('')
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced' | 'error' | 'unavailable'>('unavailable')
  const [lastSyncLabel, setLastSyncLabel] = useState('')
  const [canTravelBack, setCanTravelBack] = useState(false)
  const [canTravelForward, setCanTravelForward] = useState(false)
  const [commitLabel, setCommitLabel] = useState('')
  const [snapshots, setSnapshots] = useState<Snapshot[]>([])
  const [currentSnapshotIndex, setCurrentSnapshotIndex] = useState(-1)
  const [selectedText, setSelectedText] = useState('')
  const [highlightPosition, setHighlightPosition] = useState<{ x: number; y: number } | null>(null)
  const [executionEvents, setExecutionEvents] = useState<AgentEvt[]>([])
  const [lastContextJump, setLastContextJump] = useState('')
  const [lastContextPayload, setLastContextPayload] = useState('')
  const fsPort = useMemo(() => new FakeFsPort(), [])
  const git = useMemo(() => ({ add: async () => {}, commit: async () => {} }), [])
  const fsSync = useMemo(() => new FsGraphSync(fsPort, git, event => simLog.info('External FS change detected', { event })), [fsPort, git, simLog])
  useEffect(() => () => fsSync.dispose(), [fsSync])
  const { todos, startCycle: startTodoCycle } = useAgenticTodoCycle({
    onCycleDone: () => setNodes(prev => prev.map(node => node.id === activeNodeId ? { ...node, data: { ...node.data, lifecycle: 'done', isCycleRun: false, bodyMarkdown: typeof node.data.bodyMarkdown === 'string' ? node.data.bodyMarkdown : generatePlaceholderMarkdown(typeof node.data.promptTxt === 'string' ? node.data.promptTxt : '') } as NodeData } : node)),
  })

  useEffect(() => {
    if (!activeNodeId) return
    setNodes(prev => prev.map(node => node.id === activeNodeId ? { ...node, data: isNodeData(node.data) ? { ...node.data, todos, todosExpanded: todos.length > 0 } : node.data } : node))
  }, [activeNodeId, todos])

  const handleProjectSelect = useCallback(async (id: string) => {
    setActiveProjectId(id)
    setSimState('graph')
    try {
      const { nodes: loadedNodes, edges: loadedEdges } = await loadProjectGraph(id as 'ai-frameworks' | 'local-first' | 'whitt-arch')
      setGraphTitle(typeof loadedNodes[0]?.data.title === 'string' ? loadedNodes[0].data.title : 'Project Graph')
      const composedNodes = loadedNodes.map(node => ({ ...node, data: { ...node.data, contextPills: defaultContextPills } as NodeData }))
      setNodes(composedNodes); setEdges(loadedEdges); setActiveNodeId(composedNodes[0]?.id || null); activeNodeIdRef.current = composedNodes[0]?.id || null
      setExecutionEvents([])
      setCanTravelBack(false); setCanTravelForward(false); setCommitLabel(''); setSnapshots([]); setCurrentSnapshotIndex(-1)
      simLog.info('Project graph loaded', { projectId: id, nodeCount: loadedNodes.length, edgeCount: loadedEdges.length })
    } catch (error) {
      simLog.error('Failed to load project graph', { projectId: id, error }); setGraphTitle('Error Loading Project'); setNodes([]); setEdges([])
    }
  }, [simLog])

  const handleNewProject = useCallback(() => { setIsNewProjectModalOpen(true); simLog.debug('New project clicked') }, [simLog])
  const handleCreateProject = useCallback(({ name, folder }: { name: string; folder: string }) => {
    const newProject: Project = { id: `proj-${Date.now()}`, label: name, iconLetter: name[0].toUpperCase(), lastOpened: new Date() }
    setProjects(prev => [...prev, newProject]); setActiveProjectId(newProject.id); setIsNewProjectModalOpen(false); setSimState('graph'); setGraphTitle(name)
    setNodes([{ id: 'root', type: 'custom', position: { x: 0, y: 0 }, data: { id: 'root', title: 'Voice Node', status: 'idle', type: 'task', lifecycle: 'initial', nodeViewState: 'collapsed', focused: false, promptTxt: '', todos: [], lastUpdate: null, detailExpanded: false, todosExpanded: false, isRec: false, isCycleRun: false, isStream: false, streamedTxt: '' } as NodeData }])
    setEdges([]); setActiveNodeId('root'); simLog.info('Project created', { name, folder })
  }, [simLog])
  const handleCancelNewProject = useCallback(() => { setIsNewProjectModalOpen(false); simLog.debug('New project cancelled') }, [simLog])
  const handleOpenSettings = useCallback(() => { setIsSettingsOpen(true); simLog.debug('Settings opened') }, [simLog])
  const handleCloseSettings = useCallback(() => { setIsSettingsOpen(false); simLog.debug('Settings closed') }, [simLog])
  const handleSync = useCallback(() => { if (syncStatus === 'unavailable') return; setSyncStatus('syncing'); fsSync.flush(); setTimeout(() => { setSyncStatus('synced'); setLastSyncLabel('Synced just now'); setTimeout(() => setLastSyncLabel('Synced 1m ago'), 60000) }, 500) }, [fsSync, syncStatus])
  const handleTravel = useCallback((step: -1 | 1) => {
    const nextIndex = currentSnapshotIndex + step
    if (nextIndex < 0 || nextIndex >= snapshots.length) return
    const snapshot = snapshots[nextIndex]; setNodes(snapshot.nodes); setEdges(snapshot.edges); setGraphTitle(snapshot.graphTitle); setCurrentSnapshotIndex(nextIndex); setCanTravelBack(nextIndex > 0); setCanTravelForward(nextIndex < snapshots.length - 1)
  }, [currentSnapshotIndex, snapshots])
  const handleExpand = useCallback((text: string) => { if (!activeNodeId) return; const childId = `expand-${Date.now()}`; const childNode: FlowNode = { id: childId, type: 'custom', position: { x: 300, y: 400 }, data: { id: childId, title: 'Voice Node', status: 'idle', type: 'task', lifecycle: 'initial', nodeViewState: 'collapsed', focused: false, promptTxt: text, todos: [], lastUpdate: null, detailExpanded: false, todosExpanded: false, isRec: false, isCycleRun: false, isStream: false, streamedTxt: '' } as NodeData }; const edge: Edge = { id: `${activeNodeId}-${childId}`, source: activeNodeId, target: childId, type: 'default' }; setNodes(prev => [...prev, childNode]); setEdges(prev => [...prev, edge]); setCommitLabel(`Expand: ${text.slice(0, 20)}...`) }, [activeNodeId])
  const handleNodeSend = useCallback((text: string) => {
    const nodeId = activeNodeIdRef.current
    if (!nodeId) return
    const runId = `run-${Date.now()}`
    const stepId = `step-${Date.now()}`
    setExecutionEvents([{ kind: 'run-start', runId, nodeId, workflow }, { kind: 'step-start', runId, stepId, title: 'research web' }])
    setSnapshots(prev => [...prev, { nodes, edges, graphTitle }])
    setCurrentSnapshotIndex(snapshots.length)
    setCanTravelBack(true)
    setCanTravelForward(false)
    setNodes(prev => prev.map(node => node.id === nodeId ? { ...node, data: { ...node.data, lifecycle: 'agentic-running', isCycleRun: true, promptTxt: text } as NodeData } : node))
    if (text.toLowerCase().includes('fail')) {
      setExecutionEvents(prev => [...prev, { kind: 'step-error', runId, stepId, msg: 'Failed to process' }, { kind: 'run-done', runId, nodeId, status: 'error' }])
      setNodes(prev => prev.map(node => node.id === nodeId ? { ...node, data: { ...node.data, lifecycle: 'initial', isCycleRun: false } as NodeData } : node))
      return
    }
    const finishRun = () => {
      const content = generatePlaceholderMarkdown(text)
      setExecutionEvents(prev => [...prev, { kind: 'step-done', runId, stepId }, { kind: 'file-write', runId, path: `${nodeId}.md`, actor: 'agent', content }, { kind: 'run-done', runId, nodeId, status: 'done' }])
      setNodes(prev => prev.map(node => node.id === nodeId ? { ...node, data: { ...node.data, lifecycle: 'done', isCycleRun: false, bodyMarkdown: generatePlaceholderMarkdown(text) } as NodeData } : node))
    }
    setTimeout(finishRun, 4500)
    startTodoCycle()
    simLog.info('Node prompt sent, cycle started', { nodeId, text })
  }, [edges, graphTitle, nodes, simLog, snapshots.length, startTodoCycle])
  const handleRetry = useCallback((stepId: string) => {
    const nodeId = activeNodeIdRef.current
    if (!nodeId) return
    const runId = `retry-${Date.now()}`
    setExecutionEvents([{ kind: 'run-start', runId, nodeId, workflow }, { kind: 'step-start', runId, stepId, title: 'Retrying step' }])
    simLog.info('Execution retry queued', { nodeId, stepId })
  }, [simLog])
  const handleSendPayload = useCallback((payload: import('../context-pills/contextPillTypes').PromptPayload) => { setLastContextPayload(JSON.stringify(payload)); simLog.info('Prompt context payload', payload) }, [simLog])
  const handleRemovePill = useCallback((pillId: string) => setNodes(prev => prev.map(node => isNodeData(node.data) ? { ...node, data: { ...node.data, contextPills: node.data.contextPills?.filter(pill => pill.id !== pillId) } } : node)), [])
  const handleJumpToPill = useCallback((pillId: string) => { setLastContextJump(pillId); simLog.info('Context pill jump', { pillId }) }, [simLog])
  const handleSelectionChange = useCallback(({ nodes: selectedNodes }: { nodes: FlowNode[]; edges: Edge[] }) => setSelectedNodeIds(selectedNodes.map(node => node.id)), [])
  const handleGraphNodeClick = useCallback((nodeId: string, additive: boolean) => setSelectedNodeIds(currentIds => !additive ? [nodeId] : currentIds.includes(nodeId) ? currentIds.filter(id => id !== nodeId) : [...currentIds, nodeId]), [])
  const handleActiveNodeChange = useCallback((nodeId: string) => { activeNodeIdRef.current = nodeId; setActiveNodeId(nodeId) }, [])
  const handleCreateNode = useCallback(() => setNodes(currentNodes => { const nodeId = `standalone-${Date.now()}`; return [...currentNodes, { id: nodeId, type: 'custom', position: { x: 200, y: 200 }, data: { id: nodeId, title: 'New Node', status: 'idle', type: 'task', lifecycle: 'initial', nodeViewState: 'collapsed', focused: false, promptTxt: '', todos: [], lastUpdate: null, detailExpanded: false, todosExpanded: false, isRec: false, isCycleRun: false, isStream: false, streamedTxt: '' } as NodeData }] }), [])
  const handleConnect: OnConnect = useCallback(connection => { if (connection.source && connection.target) setEdges(currentEdges => [...currentEdges, { id: `${connection.source}-${connection.target}`, source: connection.source, target: connection.target, type: 'default' }]) }, [])
  const handleCloseMenu = useCallback(() => { setSelectedText(''); setHighlightPosition(null) }, [])
  const handleFormat = useCallback((direction: DagDirection) => {
    if (selectedNodeIds.length === 0) return false
    try {
      const result = formatSelectedDag({ nodes, edges, direction, selectedNodeIds })
      setNodes(result.nodes)
      return true
    } catch (error) {
      if (error instanceof DagFormatCycleError) return false
      throw error
    }
  }, [edges, nodes, selectedNodeIds])

  useEffect(() => { const handleMouseUp = () => { const selection = window.getSelection(); const text = selection?.toString() || ''; const range = selection?.rangeCount ? selection.getRangeAt(0) : null; if (text && range) { const rect = range.getBoundingClientRect(); setSelectedText(text); setHighlightPosition({ x: rect.left, y: rect.bottom + 10 }) } }; document.addEventListener('mouseup', handleMouseUp); return () => document.removeEventListener('mouseup', handleMouseUp) }, [])
  const picker = <><ProjectPicker projects={projects} activeProjectId={activeProjectId} onSelect={handleProjectSelect} onNew={handleNewProject} /><Placeholder>Select or create project</Placeholder><NewProjectModal isOpen={isNewProjectModalOpen} onCreate={handleCreateProject} onCancel={handleCancelNewProject} /></>
  if (simState === 'picker') return <div style={{ display: 'flex', width: '100vw', height: '100vh' }}>{picker}</div>
  return <AppShell sidebar={<ProjectPicker projects={projects} activeProjectId={activeProjectId} onSelect={handleProjectSelect} onNew={handleNewProject} />} topbar={<TopBar graphTitle={graphTitle} syncStatus={syncStatus} lastSyncLabel={lastSyncLabel} canTravelBack={canTravelBack} canTravelForward={canTravelForward} commitLabel={commitLabel} onSync={handleSync} onTravelBack={() => handleTravel(-1)} onTravelForward={() => handleTravel(1)} onOpenSettings={handleOpenSettings} />}><GraphContainer data-testid="graph-sim-canvas" data-last-context-jump={lastContextJump} data-last-context-payload={lastContextPayload}><ReactFlowProvider><GraphWorkspace nodes={nodes} edges={edges} onNodeSend={handleNodeSend} onSendPayload={handleSendPayload} onRetry={handleRetry} onNodesChange={changes => setNodes(currentNodes => applyNodeChanges(changes, currentNodes))} onEdgesChange={changes => setEdges(currentEdges => applyEdgeChanges(changes, currentEdges))} onSelectionChange={handleSelectionChange} setNodes={setNodes} selectedNodeIds={selectedNodeIds} onFormat={handleFormat} activeNodeId={activeNodeId} onNodeMouseEnter={() => {}} onNodeMouseLeave={() => {}} onNodeDragStart={() => {}} onNodeDragStop={() => {}} onConnect={handleConnect} onCreateNode={handleCreateNode} onNodeClick={handleGraphNodeClick} onActiveNodeChange={handleActiveNodeChange} onRemovePill={handleRemovePill} onJumpToPill={handleJumpToPill} executionEvents={executionEvents} workflow={workflow} writeQueue={fsSync.getWriteQueue()} /></ReactFlowProvider><MarkdownHighlightMenu selectedText={selectedText} position={highlightPosition} onExpand={handleExpand} onRefine={handleExpand} onClose={handleCloseMenu} /></GraphContainer><SettingsPanel isOpen={isSettingsOpen} onClose={handleCloseSettings} /><NewProjectModal isOpen={isNewProjectModalOpen} onCreate={handleCreateProject} onCancel={handleCancelNewProject} /></AppShell>
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
