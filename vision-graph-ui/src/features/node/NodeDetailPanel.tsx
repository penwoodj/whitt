import styled from 'styled-components'
import ReactMarkdown from 'react-markdown'

type NodeDetailPanelProps = {
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
  padding: 8px 0;
`

const DetailContent = styled.div`
  padding: 0 8px;
  font-size: ${({ theme }) => theme.font.sizeXs};
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.text};
  
  h1 {
    font-size: ${({ theme }) => theme.font.sizeMd};
    font-weight: ${({ theme }) => theme.font.weightBold};
    margin-bottom: ${({ theme }) => theme.spacing.sm};
    color: ${({ theme }) => theme.colors.text};
  }
  
  h2 {
    font-size: ${({ theme }) => theme.font.sizeSm};
    font-weight: ${({ theme }) => theme.font.weightMedium};
    margin-bottom: ${({ theme }) => theme.spacing.xs};
    margin-top: ${({ theme }) => theme.spacing.sm};
    color: ${({ theme }) => theme.colors.text};
  }
  
  h3 {
    font-size: ${({ theme }) => theme.font.sizeXs};
    font-weight: ${({ theme }) => theme.font.weightMedium};
    margin-bottom: ${({ theme }) => theme.spacing.xs};
    margin-top: ${({ theme }) => theme.spacing.sm};
    color: ${({ theme }) => theme.colors.text};
  }
  
  ul, ol {
    padding-left: ${({ theme }) => theme.spacing.md};
    margin-bottom: ${({ theme }) => theme.spacing.sm};
  }
  
  li {
    margin-bottom: 2px;
  }
  
  p {
    margin-bottom: ${({ theme }) => theme.spacing.sm};
  }
  
  strong {
    font-weight: ${({ theme }) => theme.font.weightBold};
  }
  
  em {
    font-style: italic;
  }
  
  code {
    background-color: ${({ theme }) => theme.colors.bgHover};
    padding: 2px 4px;
    border-radius: ${({ theme }) => theme.radius.sm};
    font-family: ${({ theme }) => theme.font.mono};
    font-size: ${({ theme }) => theme.font.sizeXs};
  }
  
  pre {
    background-color: ${({ theme }) => theme.colors.bgHover};
    padding: ${({ theme }) => theme.spacing.sm};
    border-radius: ${({ theme }) => theme.radius.sm};
    margin-bottom: ${({ theme }) => theme.spacing.sm};
    overflow-x: auto;
  }
  
  pre code {
    background-color: transparent;
    padding: 0;
  }
  
  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
  
  blockquote {
    border-left: 3px solid ${({ theme }) => theme.colors.border};
    padding-left: ${({ theme }) => theme.spacing.sm};
    margin-bottom: ${({ theme }) => theme.spacing.sm};
    color: ${({ theme }) => theme.colors.textMuted};
    font-style: italic;
  }
`

export default function NodeDetailPanel({ markdown = defaultMarkdown }: NodeDetailPanelProps) {
  return (
    <DetailWrap>
      <DetailContent>
        <ReactMarkdown>{markdown}</ReactMarkdown>
      </DetailContent>
    </DetailWrap>
  )
}
