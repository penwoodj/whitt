import { useCallback } from 'react'
import styled from 'styled-components'
import type { Todo } from './nodeTypes'

type NodeAgenticTodosProps = {
  todos: Todo[]
  expanded: boolean
  onToggle: () => void
}

const getStatusColor = (status: Todo['status']): 'idle' | 'recording' | 'running' | 'done' => {
  const colorKeyMap: Record<Todo['status'], 'idle' | 'recording' | 'running' | 'done'> = {
    queued: 'idle',
    running: 'running',
    done: 'done',
    failed: 'recording',
  }
  return colorKeyMap[status]
}

const TodosWrap = styled.div`
  padding: 4px 8px;
`

const ToggleBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border-radius: ${({ theme }) => theme.radius.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.bgElevated};
  font-size: 11px;
  font-weight: ${({ theme }) => theme.font.weightBold};
  cursor: pointer;
`

const Arrow = styled.span<{ $expanded: boolean }>`
  transform: rotate(${({ $expanded }) => ($expanded ? '90deg' : '0deg')});
  transition: transform 0.2s;
`

const Spinner = styled.span`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid ${({ theme }) => theme.colors.primary};
  border-top-color: transparent;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`

const TodoList = styled.ul`
  list-style: none;
  padding: 8px 0 0 16px;
  margin: 0;
`

const TodoItem = styled.li`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 0;
  font-size: 11px;
`

const StatusDot = styled.span<{ $colorKey: 'idle' | 'recording' | 'running' | 'done' }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${({ $colorKey, theme }) => theme.colors[$colorKey]};
`

const SmallSpinner = styled.span`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 2px solid ${({ theme }) => theme.colors.primary};
  border-top-color: transparent;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`

export default function NodeAgenticTodos({ todos, expanded, onToggle }: NodeAgenticTodosProps) {
  const handleClick = useCallback(() => {
    onToggle()
  }, [onToggle])

  const hasRunning = todos.some((todo) => todo.status === 'running')

  return (
    <TodosWrap>
      <ToggleBtn onClick={handleClick}>
        <Arrow $expanded={expanded}>▶</Arrow>
        <span>Agentic Tasks ({todos.length})</span>
        {hasRunning && <Spinner />}
      </ToggleBtn>
      {expanded && (
        <TodoList>
          {todos.map((todo, idx) => (
            <TodoItem key={idx}>
              <StatusDot $colorKey={getStatusColor(todo.status)} />
              <span>{todo.label}</span>
              {todo.status === 'running' && <SmallSpinner />}
            </TodoItem>
          ))}
        </TodoList>
      )}
    </TodosWrap>
  )
}
