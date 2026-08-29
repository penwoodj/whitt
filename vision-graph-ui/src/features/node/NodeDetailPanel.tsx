import styled from 'styled-components'
import FilePreview from '../file-visualization/FilePreview'

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

export default function NodeDetailPanel({ markdown = defaultMarkdown }: NodeDetailPanelProps) {
  return (
    <DetailWrap>
      <FilePreview content={markdown} />
    </DetailWrap>
  )
}
