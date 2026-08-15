import { useState, useMemo } from 'react'
import styled from 'styled-components'
import * as yaml from 'js-yaml'
import { darkTheme } from '../../shared/theme'

const VisualizerContainer = styled.div`
  color: ${({ theme }) => theme.colors.text};
  font-family: ${({ theme }) => theme.font.mono};
  font-size: ${({ theme }) => theme.font.sizeSm};
  padding: ${({ theme }) => theme.spacing.sm};
  overflow-x: auto;
  max-height: 400px;
`

const ErrorContainer = styled.div`
  color: ${({ theme }) => theme.colors.text};
  font-family: ${({ theme }) => theme.font.mono};
  font-size: ${({ theme }) => theme.font.sizeSm};
  padding: ${({ theme }) => theme.spacing.sm};
`

const ErrorBox = styled.div`
  color: ${({ theme }) => theme.colors.error};
  padding: ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.colors.error};
  border-radius: ${({ theme }) => theme.radius.sm};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`

const RawText = styled.pre`
  color: ${({ theme }) => theme.colors.textMuted};
  white-space: pre-wrap;
  word-break: break-all;
`

const TreeNode = styled.div`
  display: flex;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.xs} 0;
  cursor: pointer;
  
  &:hover {
    background: ${({ theme }) => theme.colors.bgHover};
  }
`

const ToggleBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  margin-right: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.font.sizeSm};
`

const KeyLabel = styled.span<{ $level: number }>`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: ${({ theme }) => theme.font.weightMedium};
  margin-right: ${({ theme }) => theme.spacing.xs};
`

const ValueText = styled.span<{ $type: string }>`
  color: ${({ theme, $type }) => {
    switch ($type) {
      case 'string': return theme.colors.success
      case 'number': return theme.colors.textMuted
      case 'boolean': return theme.colors.textMuted
      case 'null': return theme.colors.textMuted
      default: return theme.colors.text
    }
  }};
`

const NestedContainer = styled.div<{ $level: number }>`
  margin-left: ${({ theme, $level }) => `calc(${$level * 16}px + ${theme.spacing.sm})`};
`

const ArrayItem = styled.div`
  border-left: 1px solid ${({ theme }) => theme.colors.border};
  padding-left: ${({ theme }) => theme.spacing.sm};
  margin: ${({ theme }) => theme.spacing.xs} 0;
`

export interface YamlWorkflowVisualizerProps {
  workflow: string
  disabledOnError?: boolean
}

export function YamlWorkflowVisualizer({ workflow, disabledOnError = true }: YamlWorkflowVisualizerProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())
  const [parseError, setParseError] = useState<string | null>(null)

  const parsedContent = useMemo(() => {
    try {
      const result = yaml.load(workflow)
      setParseError(null)
      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Invalid YAML'
      setParseError(errorMessage)
      return null
    }
  }, [workflow])

  const toggleSection = (path: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev)
      if (next.has(path)) {
        next.delete(path)
      } else {
        next.add(path)
      }
      return next
    })
  }

  const renderValue = (value: unknown, path: string, level: number): React.ReactNode => {
    if (value === null) {
      return <ValueText $type="null">null</ValueText>
    }

    if (typeof value === 'string') {
      return <ValueText $type="string">"{value}"</ValueText>
    }

    if (typeof value === 'number') {
      return <ValueText $type="number">{value}</ValueText>
    }

    if (typeof value === 'boolean') {
      return <ValueText $type="boolean">{value ? 'true' : 'false'}</ValueText>
    }

    if (Array.isArray(value)) {
      const isExpanded = expandedSections.has(path)
      return (
        <div key={path}>
          <TreeNode onClick={() => toggleSection(path)}>
            <ToggleBtn type="button">
              {isExpanded ? '▼' : '▶'}
            </ToggleBtn>
            <KeyLabel $level={level}>{path}:</KeyLabel>
          </TreeNode>
          {isExpanded && (
            <NestedContainer $level={level}>
              {value.map((item, index) => {
                const itemKey = typeof item === 'object' && item !== null 
                  ? `${path}-item-${index}` 
                  : `${path}-item-${String(item)}-${index}`
                return (
                  <ArrayItem key={itemKey}>
                    {renderValue(item, `${path}[${index}]`, level + 1)}
                  </ArrayItem>
                )
              })}
            </NestedContainer>
          )}
        </div>
      )
    }

    if (typeof value === 'object' && value !== null) {
      const isExpanded = expandedSections.has(path)
      const entries = Object.entries(value as Record<string, unknown>)
      return (
        <div key={path}>
          <TreeNode onClick={() => toggleSection(path)}>
            <ToggleBtn type="button">
              {isExpanded ? '▼' : '▶'}
            </ToggleBtn>
            <KeyLabel $level={level}>{path}:</KeyLabel>
          </TreeNode>
          {isExpanded && (
            <NestedContainer $level={level}>
              {entries.map(([key, val]) => (
                <div key={key}>
                  <KeyLabel $level={level + 1}>{key}:</KeyLabel>
                  {renderValue(val, `${path}.${key}`, level + 1)}
                </div>
              ))}
            </NestedContainer>
          )}
        </div>
      )
    }

    return <ValueText $type="unknown">{String(value)}</ValueText>
  }

  if (parseError && disabledOnError) {
    return (
      <ErrorContainer data-testid="yaml-visualizer">
        <ErrorBox data-testid="yaml-error">
          <strong>Parse Error:</strong> {parseError}
        </ErrorBox>
        <RawText>{workflow}</RawText>
      </ErrorContainer>
    )
  }

  return (
    <VisualizerContainer data-testid="yaml-visualizer">
      {parsedContent && typeof parsedContent === 'object' && !Array.isArray(parsedContent) ? (
        <div>
          {Object.entries(parsedContent).map(([key, value]) => (
            <div key={key} style={{ marginLeft: darkTheme.spacing.sm }}>
              {renderValue(value, key, 0)}
            </div>
          ))}
        </div>
      ) : (
        <RawText>{workflow}</RawText>
      )}
    </VisualizerContainer>
  )
}