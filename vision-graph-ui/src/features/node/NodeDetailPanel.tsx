import styled from 'styled-components'
import FilePreview from '../file-visualization/FilePreview'
import type { WriteQueue } from '../../shared/fs/WriteQueue'

type NodeDetailPanelProps = {
  markdown?: string
  writeQueue?: WriteQueue
  filePath?: string
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

const DetailTitle = styled.h2`
  margin: 0 0 8px;
`

export default function NodeDetailPanel({ markdown = defaultMarkdown, writeQueue, filePath }: NodeDetailPanelProps) {
  return (
    <DetailWrap>
      <DetailTitle>Details</DetailTitle>
      <FilePreview content={markdown} writeQueue={writeQueue} filePath={filePath} />
    </DetailWrap>
  )
}
