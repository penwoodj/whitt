import { useState, useCallback, useRef, useEffect, useMemo } from 'react'
import type { Node as FlowNode } from '@xyflow/react'

type PhysicsNode = FlowNode & {
  vx?: number
  vy?: number
  fx?: number | null
  fy?: number | null
}

type PhysicsConfig = {
  centerStrength: number
  collisionPad: number
  velocityDecay: number
  maxVelocity: number
  alphaTarget: number
  autoSleepThreshold: number
}

const DEFAULT_CONFIG: PhysicsConfig = {
  centerStrength: 0.05,
  collisionPad: 50,
  velocityDecay: 0.9,
  maxVelocity: 10,
  alphaTarget: 0.01,
  autoSleepThreshold: 0.1,
}

export function usePhysicsSim(nodes: FlowNode[], config: Partial<PhysicsConfig> = {}) {
  const finalConfig = useMemo(() => ({ ...DEFAULT_CONFIG, ...config }), [config])
  const physicsNodesRef = useRef<PhysicsNode[]>([])
  const animationFrameRef = useRef<number | null>(null)
  const alphaRef = useRef(1)
  const isRunningRef = useRef(false)
  const iterationCountRef = useRef(0)
  const maxIterations = 100

  const [simulatedNodes, setSimulatedNodes] = useState<FlowNode[]>(nodes)
  const [isRunning, setIsRunning] = useState(false)

  const initializeNodes = useCallback((inputNodes: FlowNode[]) => {
    return inputNodes.map(node => ({
      ...node,
      vx: 0,
      vy: 0,
      fx: null,
      fy: null,
    }))
  }, [])

  const applyForces = useCallback((currentNodes: PhysicsNode[]): PhysicsNode[] => {
    const canvasCenter = { x: 400, y: 300 }

    return currentNodes.map(node => {
      let { vx = 0, vy = 0 } = node

      const dx = canvasCenter.x - node.position.x
      const dy = canvasCenter.y - node.position.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance > 0) {
        vx += (dx / distance) * finalConfig.centerStrength
        vy += (dy / distance) * finalConfig.centerStrength
      }

      currentNodes.forEach(other => {
        if (node.id === other.id) return

        const ox = node.position.x - other.position.x
        const oy = node.position.y - other.position.y
        const odist = Math.sqrt(ox * ox + oy * oy)

        if (odist < finalConfig.collisionPad && odist > 0) {
          const force = (finalConfig.collisionPad - odist) / odist
          vx += ox * force * 0.5
          vy += oy * force * 0.5
        }
      })

      const speed = Math.sqrt(vx * vx + vy * vy)
      if (speed > finalConfig.maxVelocity) {
        vx = (vx / speed) * finalConfig.maxVelocity
        vy = (vy / speed) * finalConfig.maxVelocity
      }

      vx *= finalConfig.velocityDecay
      vy *= finalConfig.velocityDecay

      return {
        ...node,
        vx,
        vy,
        position: {
          x: node.position.x + vx,
          y: node.position.y + vy,
        },
      }
    })
  }, [finalConfig])

  const step = useCallback(() => {
    if (!isRunningRef.current) return

    physicsNodesRef.current = applyForces(physicsNodesRef.current)

    const totalVelocity = physicsNodesRef.current.reduce(
      (sum, node) => sum + Math.sqrt((node.vx || 0) ** 2 + (node.vy || 0) ** 2),
      0
    )

    alphaRef.current = totalVelocity / physicsNodesRef.current.length
    iterationCountRef.current++

    setSimulatedNodes(
      physicsNodesRef.current.map(({ vx, vy, fx, fy, ...rest }) => rest as FlowNode)
    )

    if (alphaRef.current < finalConfig.autoSleepThreshold || iterationCountRef.current >= maxIterations) {
      isRunningRef.current = false
      setIsRunning(false)
      return
    }

    animationFrameRef.current = window.setTimeout(() => step(), 1)
  }, [applyForces, finalConfig.autoSleepThreshold])

  const startSimulation = useCallback(() => {
    if (!isRunningRef.current) {
      isRunningRef.current = true
      setIsRunning(true)
      alphaRef.current = 1
      iterationCountRef.current = 0

      setTimeout(() => {
        step()
      }, 0)
    }
  }, [step])

  const reheat = useCallback(() => {
    alphaRef.current = 1
    if (!isRunningRef.current) {
      startSimulation()
    }
  }, [startSimulation])

  const stopSimulation = useCallback(() => {
    isRunningRef.current = false
    if (animationFrameRef.current) {
      window.clearTimeout(animationFrameRef.current)
      animationFrameRef.current = null
    }
  }, [])

  useEffect(() => {
    physicsNodesRef.current = initializeNodes(nodes)
    setSimulatedNodes(nodes)

    const timer = window.setTimeout(() => {
      startSimulation()
    }, 0)

    return () => {
      window.clearTimeout(timer)
      stopSimulation()
    }
  }, [nodes, initializeNodes, startSimulation, stopSimulation])

  return {
    nodes: simulatedNodes,
    reheat,
    stop: stopSimulation,
    isRunning,
  }
}