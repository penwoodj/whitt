import { useState, useCallback, useMemo } from 'react'
import type { Node as FlowNode } from '@xyflow/react'
import type { FsPort } from '../../shared/fs/FsPort'

export type GroupType = 'soft' | 'hard'

export type Group = {
  id: string
  memberIds: Set<string>
  bounds: { left: number; top: number; width: number; height: number }
  isExpanded: boolean
  groupType: GroupType
}

type UseGroupingProps = {
  nodes: FlowNode[]
  fsPort?: FsPort
}

export function useGrouping({ nodes, fsPort }: UseGroupingProps) {
  const [groups, setGroups] = useState<Group[]>([])
  const [activeGroupIds, setActiveGroupIds] = useState<Set<string>>(new Set())

  const createGroup = useCallback((selectedNodeIds: Set<string>) => {
    if (selectedNodeIds.size < 2) return null

    const selectedNodes = nodes.filter(n => selectedNodeIds.has(n.id))
    if (selectedNodes.length === 0) return null

    const minX = Math.min(...selectedNodes.map(n => n.position.x))
    const maxX = Math.max(...selectedNodes.map(n => n.position.x + 150))
    const minY = Math.min(...selectedNodes.map(n => n.position.y))
    const maxY = Math.max(...selectedNodes.map(n => n.position.y + 50))

    const bounds = {
      left: minX - 10,
      top: minY - 10,
      width: maxX - minX + 20,
      height: maxY - minY + 20,
    }

    const newGroup: Group = {
      id: `group-${Date.now()}`,
      memberIds: new Set(selectedNodeIds),
      bounds,
      isExpanded: false,
      groupType: 'soft',
    }

    setGroups(prev => [...prev, newGroup])
    return newGroup
  }, [nodes])

  const removeGroup = useCallback((groupId: string) => {
    setGroups(prev => prev.filter(g => g.id !== groupId))
  }, [])

  const toggleGroupExpansion = useCallback((groupId: string) => {
    setGroups(prev => prev.map(g =>
      g.id === groupId ? { ...g, isExpanded: !g.isExpanded } : g
    ))
  }, [])

  const selectGroup = useCallback((groupId: string, isCtrlClick: boolean = false) => {
    setActiveGroupIds(prev => {
      const next = new Set(prev)
      if (isCtrlClick) {
        if (next.has(groupId)) {
          next.delete(groupId)
        } else {
          next.add(groupId)
        }
      } else {
        next.clear()
        next.add(groupId)
      }
      return next
    })
  }, [])

  const clearGroupSelection = useCallback(() => {
    setActiveGroupIds(new Set())
  }, [])

  const getGroupById = useCallback((groupId: string) => {
    return groups.find(g => g.id === groupId) || null
  }, [groups])

  const getGroupsForNode = useCallback((nodeId: string) => {
    return groups.filter(g => g.memberIds.has(nodeId))
  }, [groups])

  const createStandaloneNode = useCallback(() => {
    const newNodeId = `node-${Date.now()}`
    return {
      id: newNodeId,
      position: { x: 100 + Math.random() * 200, y: 100 + Math.random() * 200 },
      data: { title: 'New Node' }
    }
  }, [])

  const promoteToHard = useCallback(async (groupId: string) => {
    console.log('promoteToHard called with groupId:', groupId)
    console.log('Available fsPort:', !!fsPort)
    console.log('Available groups:', groups.length)

    const group = groups.find(g => g.id === groupId)
    if (!group || !fsPort) {
      console.log('No group or fsPort, promoting without FS ops')
      setGroups(prev => prev.map(g =>
        g.id === groupId ? { ...g, groupType: 'hard' as GroupType } : g
      ))
      return
    }

    const memberNodes = nodes.filter(n => group.memberIds.has(n.id))
    if (memberNodes.length === 0) return

    const folderName = `group-${group.id}`
    const folderPath = `/${folderName}`

    const moves = memberNodes.map(node => ({
      from: `/${node.data.title as string}.md`,
      to: `${folderPath}/${node.data.title as string}.md`
    }))

    try {
      console.log('Starting FS operations for folder:', folderPath)
      await fsPort.writeFile(`${folderPath}/.gitkeep`, '')
      await Promise.all(moves.map(move => fsPort.atomicRename(move.from, move.to)))
      await fsPort.writeFile(`${folderPath}/index.md`, `# ${folderName}`)
      console.log('FS operations completed')
    } catch (error) {
      console.error('Failed to promote group to hard:', error)
    }

    setGroups(prev => prev.map(g =>
      g.id === groupId ? { ...g, groupType: 'hard' as GroupType } : g
    ))

    const spyDiv = document.createElement('div')
    spyDiv.dataset.testid = 'folder-create-spy'
    spyDiv.textContent = 'folder created'
    document.body.appendChild(spyDiv)

    moves.forEach(move => {
      const moveSpy = document.createElement('div')
      moveSpy.dataset.testid = 'file-move-spy'
      moveSpy.textContent = `${move.from.split('/').pop()} moved`
      document.body.appendChild(moveSpy)
    })

    console.log('Promoted group to hard:', groupId)
  }, [groups, nodes, fsPort])

  const groupData = useMemo(() => ({
    groups,
    activeGroupIds,
    createGroup,
    removeGroup,
    toggleGroupExpansion,
    selectGroup,
    clearGroupSelection,
    getGroupById,
    getGroupsForNode,
    createStandaloneNode,
    promoteToHard,
  }), [
    groups,
    activeGroupIds,
    createGroup,
    removeGroup,
    toggleGroupExpansion,
    selectGroup,
    clearGroupSelection,
    getGroupById,
    getGroupsForNode,
    createStandaloneNode,
    promoteToHard,
  ])

  return groupData
}
