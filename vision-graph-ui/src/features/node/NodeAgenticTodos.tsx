import { useCallback } from 'react'
import styled from 'styled-components'
import type { Todo } from './nodeTypes'

type NodeAgenticTodosProps = {
  todos: Todo[]
  expanded: boolean
  onToggle: () => void
  showAgentic: boolean
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

const TodosWrap = styled.div<{ $show: boolean }>`
  display: ${({ $show }) => ($show ? 'block' : 'none')};
  padding: 8px 0;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  margin-bottom: 8px;
`

const CompactStrip = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px;
  background-color: ${({ theme }) => theme.colors.bgHover};
  border-radius: ${({ theme }) => theme.radius.sm};
`

const ExpandedHeader = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 4px 8px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: ${({ theme }) => theme.font.sizeSm};
  font-weight: ${({ theme }) => theme.font.weightBold};
  color: ${({ theme }) => theme.colors.text};
`

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`

const Arrow = styled.span<{ $expanded: boolean }>`
  transform: rotate(${({ $expanded }) => ($expanded ? '90deg' : '0deg')});
  transition: transform 0.2s;
`

const Spinner = styled.span`
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
  font-size: ${({ theme }) => theme.font.sizeSm};
`

const StatusDot = styled.span<{ $colorKey: 'idle' | 'recording' | 'running' | 'done' }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: ${({ $colorKey, theme }) => theme.colors[$colorKey]};
`

const SmallSpinner = styled.span`
  width: 8px;
  height: 8px;
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

export default function NodeAgenticTodos({
  todos,
  expanded,
  onToggle,
  showAgentic,
}: NodeAgenticTodosProps) {
  const handleClick = useCallback(() => {
    onToggle()
  }, [onToggle])

  const runningTodo = todos.find((todo) => todo.status === 'running')
  const hasRunning = !!runningTodo

  if (!showAgentic) {
    return null
  }

  if (!expanded && hasRunning) {
    return (
      <TodosWrap $show={showAgentic}>
        <CompactStrip>
          <StatusDot $colorKey={getStatusColor(runningTodo.status)} />
          <span>{runningTodo.label}</span>
          <SmallSpinner />
        </CompactStrip>
      </TodosWrap>
    )
  }

  return (
    <TodosWrap $show={showAgentic}>
      <ExpandedHeader onClick={handleClick}>
        <HeaderLeft>
          <Arrow $expanded={expanded}>▶</Arrow>
          <span>Agentic Tasks ({todos.length})</span>
        </HeaderLeft>
        {hasRunning && <Spinner />}
      </ExpandedHeader>
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