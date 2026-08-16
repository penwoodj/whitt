import { useState, useCallback, useMemo, useEffect } from 'react'
import type { Node as FlowNode } from '@xyflow/react'
import type { FsPort } from '../../shared/fs/FsPort'

export type GroupType = 'soft' | 'hard'

const LOCAL_STORAGE_KEY = 'softGroups'
const WHITT_GROUPS_FILE = '.whitt/groups.json'

const toDashCase = (str: string): string => {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export type FsOps = {
  folderCreated: boolean
  movedNames: string[]
}

export type Group = {
  id: string
  memberIds: Set<string>
  bounds: { left: number; top: number; width: number; height: number }
  isExpanded: boolean
  isFocused: boolean
  groupType: GroupType
  title?: string
}

type UseGroupingProps = {
  nodes: FlowNode[]
  fsPort?: FsPort
}

export function useGrouping({ nodes, fsPort }: UseGroupingProps) {
  const [groups, setGroups] = useState<Group[]>([])
  const [activeGroupIds, setActiveGroupIds] = useState<Set<string>>(new Set())
  const [fsOps, setFsOps] = useState<FsOps>({ folderCreated: false, movedNames: [] })

  const serializeGroup = useCallback((group: Group) => ({
    id: group.id,
    memberIds: Array.from(group.memberIds),
    bounds: group.bounds,
    isExpanded: group.isExpanded,
    isFocused: group.isFocused,
    groupType: group.groupType,
    title: group.title
  }), [])

  const deserializeGroup = useCallback((data: any): Group => ({
    id: data.id,
    memberIds: new Set(data.memberIds),
    bounds: data.bounds,
    isExpanded: data.isExpanded,
    isFocused: data.isFocused || false,
    groupType: data.groupType,
    title: data.title
  }), [])

  useEffect(() => {
    const loadGroups = async () => {
      const loadedGroups: Group[] = []

      try {
        const localStorageData = localStorage.getItem(LOCAL_STORAGE_KEY)
        if (localStorageData) {
          const parsedGroups = JSON.parse(localStorageData)
          const localGroups = parsedGroups
            .filter((g: any) => g.groupType === 'soft')
            .map(deserializeGroup)
          loadedGroups.push(...localGroups)
        }
      } catch {}

      if (fsPort) {
        try {
          const whittData = await fsPort.readFile(WHITT_GROUPS_FILE)
          if (whittData && whittData.trim() !== '') {
            const parsedGroups = JSON.parse(whittData)
            const whittGroups = parsedGroups.map(deserializeGroup)
            
            const existingIds = new Set(loadedGroups.map(g => g.id))
            whittGroups.forEach((group: Group) => {
              if (!existingIds.has(group.id)) {
                loadedGroups.push(group)
              }
            })
          }
        } catch {}
      }

      if (loadedGroups.length > 0) {
        setGroups(loadedGroups)
      }
    }

    loadGroups()
  }, [fsPort, deserializeGroup])

  useEffect(() => {
    if (groups.length === 0) return

    try {
      const serializedGroups = groups.map(serializeGroup)
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(serializedGroups))
    } catch {}

    if (fsPort) {
      try {
        const serializedGroups = groups.map(serializeGroup)
        fsPort.writeFile(WHITT_GROUPS_FILE, JSON.stringify(serializedGroups, null, 2))
      } catch {}
    }
  }, [groups, fsPort, serializeGroup])

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
      isFocused: false,
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

  const focusGroup = useCallback((groupId: string) => {
    setGroups(prev => prev.map(g =>
      g.id === groupId ? { ...g, isFocused: true, isExpanded: true } : { ...g, isFocused: false }
    ))
    setActiveGroupIds(new Set([groupId]))
  }, [])

  const unfocusGroup = useCallback((groupId: string) => {
    setGroups(prev => prev.map(g =>
      g.id === groupId ? { ...g, isFocused: false, isExpanded: false } : g
    ))
  }, [])

  const updateGroupTitle = useCallback(async (groupId: string, newTitle: string) => {
    const dashCaseTitle = toDashCase(newTitle)
    const group = groups.find(g => g.id === groupId)
    
    if (!group) return

    if (group.groupType === 'hard' && fsPort && group.title) {
      await fsPort.atomicRename(`/${group.title}`, `/${dashCaseTitle}`)
    }

    setGroups(prev => prev.map(g =>
      g.id === groupId ? { ...g, title: dashCaseTitle } : g
    ))
  }, [groups, fsPort])

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
    const group = groups.find(g => g.id === groupId)
    if (!group) return

    const promoteGroup = () => {
      setGroups(prev => prev.map(g =>
        g.id === groupId ? { ...g, groupType: 'hard' as GroupType } : g
      ))
    }

    if (!fsPort) {
      promoteGroup()
      return
    }

    const memberNodes = nodes.filter(n => group.memberIds.has(n.id))
    if (memberNodes.length === 0) {
      promoteGroup()
      return
    }

    const folderName = `group-${group.id}`
    const folderPath = `/${folderName}`

    await fsPort.writeFile(`${folderPath}/.gitkeep`, '')
    await Promise.all(memberNodes.map(node =>
      fsPort.atomicRename(`/${node.data.title as string}.md`, `${folderPath}/${node.data.title as string}.md`)
    ))
    await fsPort.writeFile(`${folderPath}/index.md`, `# ${folderName}`)

    promoteGroup()
    setFsOps({
      folderCreated: true,
      movedNames: memberNodes.map(n => `${n.data.title as string} moved`),
    })
  }, [groups, nodes, fsPort])

  const groupData = useMemo(() => ({
    groups,
    activeGroupIds,
    fsOps,
    createGroup,
    removeGroup,
    toggleGroupExpansion,
    selectGroup,
    clearGroupSelection,
    getGroupById,
    getGroupsForNode,
    createStandaloneNode,
    promoteToHard,
    focusGroup,
    unfocusGroup,
    updateGroupTitle,
  }), [
    groups,
    activeGroupIds,
    fsOps,
    createGroup,
    removeGroup,
    toggleGroupExpansion,
    selectGroup,
    clearGroupSelection,
    getGroupById,
    getGroupsForNode,
    createStandaloneNode,
    promoteToHard,
    focusGroup,
    unfocusGroup,
    updateGroupTitle,
  ])

  return groupData
}
