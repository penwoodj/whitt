import { useCallback } from 'react'
import styled from 'styled-components'

type NodeDetailPanelProps = {
  expanded: boolean
  onToggle: () => void
  markdown?: string
}

const defaultMarkdown = `# Node Details

This is a placeholder for the markdown content that will be rendered in the detail panel.

## Features
- Live token streams
- Hook timeline
- Artifact preview
- Template variable values

## Status
The node is currently processing your request.
`

const DetailWrap = styled.div`
  padding: 4px 8px;
`

const DetailBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border-radius: ${({ theme }) => theme.radius.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.bgElevated};
  font-size: ${({ theme }) => theme.font.sizeXs};
  font-weight: ${({ theme }) => theme.font.weightBold};
  cursor: pointer;
  width: 100%;
`

const DetailArrow = styled.span<{ $expanded: boolean }>`
  transform: rotate(${({ $expanded }) => ($expanded ? '90deg' : '0deg')});
  transition: transform 0.2s;
`

const DetailContent = styled.div`
  padding: 8px 0 0 16px;
  font-size: ${({ theme }) => theme.font.sizeXs};
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.text};
`

export default function NodeDetailPanel({ expanded, onToggle, markdown = defaultMarkdown }: NodeDetailPanelProps) {
  const handleClick = useCallback(() => {
    onToggle()
  }, [onToggle])

  const renderMarkdown = (txt: string): string => {
    return txt
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^- (.*$)/gim, '<li>$1</li>')
      .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
      .replace(/\n/gim, '<br />')
  }

  return (
    <DetailWrap>
      <DetailBtn onClick={handleClick}>
        <DetailArrow $expanded={expanded}>▶</DetailArrow>
        <span>Details</span>
      </DetailBtn>
      {expanded && (
        <DetailContent dangerouslySetInnerHTML={{ __html: renderMarkdown(markdown) }} />
      )}
    </DetailWrap>
  )
}
