import { useState, useCallback, useMemo, useEffect } from 'react'
import type { Node as FlowNode } from '@xyflow/react'
import type { FsPort } from '../../shared/fs/FsPort'

export type GroupType = 'soft' | 'hard'

const LOCAL_STORAGE_KEY = 'softGroups'
const WHITT_GROUPS_FILE = '.whitt/groups.json'

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
    groupType: group.groupType
  }), [])

  const deserializeGroup = useCallback((data: any): Group => ({
    id: data.id,
    memberIds: new Set(data.memberIds),
    bounds: data.bounds,
    isExpanded: data.isExpanded,
    isFocused: data.isFocused || false,
    groupType: data.groupType
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
      } catch (error) {
        console.warn('Failed to load groups from localStorage:', error)
      }

      if (fsPort) {
        try {
          const whittData = await fsPort.readFile(WHITT_GROUPS_FILE)
          if (whittData && whittData.trim() !== '') {
            const parsedGroups = JSON.parse(whittData)
            const whittGroups = parsedGroups
              .filter((g: any) => g.groupType === 'soft')
              .map(deserializeGroup)
            
            const existingIds = new Set(loadedGroups.map(g => g.id))
            whittGroups.forEach((group: Group) => {
              if (!existingIds.has(group.id)) {
                loadedGroups.push(group)
              }
            })
          }
        } catch (error) {
          console.warn('Failed to load groups from .whitt folder:', error)
        }
      }

      if (loadedGroups.length > 0) {
        setGroups(loadedGroups)
      }
    }

    loadGroups()
  }, [fsPort, deserializeGroup])

  useEffect(() => {
    const softGroups = groups.filter(g => g.groupType === 'soft')
    if (softGroups.length === 0) return

    try {
      const serializedGroups = softGroups.map(serializeGroup)
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(serializedGroups))
    } catch (error) {
      console.warn('Failed to save groups to localStorage:', error)
    }

    if (fsPort) {
      try {
        const serializedGroups = softGroups.map(serializeGroup)
        fsPort.writeFile(WHITT_GROUPS_FILE, JSON.stringify(serializedGroups, null, 2))
      } catch (error) {
        console.warn('Failed to save groups to .whitt folder:', error)
      }
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
  ])

  return groupData
}
