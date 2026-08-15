import styled from 'styled-components'
import { Loader, CheckCircle, AlertCircle, Play } from 'lucide-react'

const LoaderContainer = styled.div<{ $status: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  color: ${({ theme, $status }) => {
    if (!theme?.colors) return '#666'
    switch ($status) {
      case 'running':
        return theme.colors.running
      case 'done':
        return theme.colors.done
      case 'error':
        return theme.colors.error
      default:
        return theme.colors.idle
    }
  }};
  transition: color ${({ theme }) => theme?.transition?.base || '200ms ease'}, transform ${({ theme }) => theme?.transition?.base || '200ms ease'};
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  ${({ $status }) => $status === 'running' && `
    animation: spin 1s linear infinite;
  `}
  
  ${({ $status }) => $status === 'done' && `
    animation: pulse 0.5s ease-in-out;
  `}
`

export interface MorphingLoaderProps {
  status: 'idle' | 'running' | 'done' | 'error'
  stepTitle: string
}

export function MorphingLoader({ status, stepTitle }: MorphingLoaderProps) {
  const getIcon = () => {
    switch (status) {
      case 'running':
        return <Loader size={20} />
      case 'done':
        return <CheckCircle size={20} />
      case 'error':
        return <AlertCircle size={20} />
      default:
        return <Play size={20} />
    }
  }

  return (
    <LoaderContainer 
      $status={status} 
      role="progressbar" 
      aria-label={`${stepTitle} - ${status}`}
      aria-valuenow={status === 'running' ? 50 : status === 'done' ? 100 : 0}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      {getIcon()}
    </LoaderContainer>
  )
}