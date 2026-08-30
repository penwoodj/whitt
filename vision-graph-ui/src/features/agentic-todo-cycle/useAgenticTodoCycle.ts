import { useState, useEffect, useCallback, useRef } from 'react'
import type { AgenticTodo, UseAgenticTodoCycle, UseAgenticTodoCycleOpts } from './agenticTodoCycleTypes'
import { useAgenticTodoCycleLogging } from './useAgenticTodoCycleLogging'

const DEFAULT_TODOS: AgenticTodo[] = [
  { id: '1', label: 'research web', status: 'queued' },
  { id: '2', label: 'draft outline', status: 'queued' },
  { id: '3', label: 'verify + cite', status: 'queued' },
]

export const useAgenticTodoCycle = (opts?: UseAgenticTodoCycleOpts): UseAgenticTodoCycle => {
  const cycleLog = useAgenticTodoCycleLogging()
  const timeoutRefs = useRef<ReturnType<typeof setTimeout>[]>([])
  const optsRef = useRef<UseAgenticTodoCycleOpts | undefined>(opts)

  useEffect(() => {
    optsRef.current = opts
  }, [opts])

  const [todos, setTodos] = useState<AgenticTodo[]>(DEFAULT_TODOS)
  const [isCycleDone, setIsCycleDone] = useState(false)

  const resetCycle = useCallback(() => {
    timeoutRefs.current.forEach((id) => {
      clearTimeout(id)
    })
    timeoutRefs.current = []
    setTodos(DEFAULT_TODOS)
    setIsCycleDone(false)
    cycleLog.debug('Cycle reset')
  }, [cycleLog])

  const startCycle = useCallback(() => {
    resetCycle()
    cycleLog.info('Cycle started')

    const runTodoAtIndex = (index: number) => {
      if (index >= DEFAULT_TODOS.length) {
        setIsCycleDone(true)
        cycleLog.info('Cycle done')
        optsRef.current?.onCycleDone?.()
        return
      }

      setTodos((prev) =>
        prev.map((todo, idx) =>
          idx === index ? { ...todo, status: 'running' as const } : todo
        )
      )
      cycleLog.debug(`Todo running: ${DEFAULT_TODOS[index].label}`)

      const timeoutId = setTimeout(() => {
        setTodos((prev) =>
          prev.map((todo, idx) =>
            idx === index ? { ...todo, status: 'done' as const } : todo
          )
        )
        cycleLog.debug(`Todo done: ${DEFAULT_TODOS[index].label}`)
        runTodoAtIndex(index + 1)
      }, 1500)

      timeoutRefs.current.push(timeoutId)
    }

    runTodoAtIndex(0)
  }, [resetCycle, cycleLog])

  useEffect(() => {
    return () => {
      timeoutRefs.current.forEach((id) => {
        clearTimeout(id)
      })
    }
  }, [])

  return { todos, isCycleDone, startCycle, resetCycle }
}
