import ReactMarkdown from 'react-markdown'
import styled from 'styled-components'
import { useFileEdit } from './useFileEdit'
import CodeMirror from '@uiw/react-codemirror'
import { markdown } from '@codemirror/lang-markdown'
import { lineNumbers } from '@codemirror/view'
import type { WriteQueue } from '../../shared/fs/WriteQueue'

type FilePreviewProps = {
  content: string
  writeQueue?: WriteQueue
  filePath?: string
}

const PreviewWrap = styled.div`
  padding: ${({ theme }) => theme.spacing.sm};
  min-height: 200px;
  background-color: ${({ theme }) => theme.colors.bgElevated};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`

const Header = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`

const EditBtn = styled.button`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme }) => theme.colors.bgHover};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.sm};
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  font-size: ${({ theme }) => theme.font.sizeXs};

  &:hover {
    background-color: ${({ theme }) => theme.colors.bg};
  }
`

const MarkdownContent = styled.div`
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.font.sizeSm};
  line-height: 1.5;

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

  p {
    margin-bottom: ${({ theme }) => theme.spacing.sm};
  }

  ul, ol {
    padding-left: ${({ theme }) => theme.spacing.md};
    margin-bottom: ${({ theme }) => theme.spacing.sm};
  }

  li {
    margin-bottom: 2px;
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

  strong {
    font-weight: ${({ theme }) => theme.font.weightBold};
  }

  em {
    font-style: italic;
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

const EditorWrap = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;

  .cm-editor {
    height: 100%;
    background-color: ${({ theme }) => theme.colors.bg};
    color: ${({ theme }) => theme.colors.text};
    font-family: ${({ theme }) => theme.font.mono};
    font-size: ${({ theme }) => theme.font.sizeXs};

    .cm-gutters {
      background-color: ${({ theme }) => theme.colors.bgElevated};
      border-right: 1px solid ${({ theme }) => theme.colors.border};
      color: ${({ theme }) => theme.colors.textMuted};
    }

    .cm-activeLineGutter {
      background-color: ${({ theme }) => theme.colors.bgHover};
    }

    .cm-lineNumbers .cm-gutterElement {
      padding: 0 4px;
      min-width: 2em;
      text-align: right;
    }

    .cm-content {
      padding: ${({ theme }) => theme.spacing.sm};
    }

    .cm-scroller {
      overflow: auto;
    }
  }
`

export default function FilePreview({ content, writeQueue, filePath = '' }: FilePreviewProps) {
  const { isEditing, toggleEdit, saveOnBlur } = useFileEdit(content, writeQueue, filePath)

  return (
    <PreviewWrap data-testid="file-preview-area">
      <Header>
        <EditBtn onClick={toggleEdit} aria-label={isEditing ? 'Save' : 'Edit'}>
          {isEditing ? 'Save' : 'Edit'}
        </EditBtn>
      </Header>

      {isEditing ? (
        <EditorWrap>
          <CodeMirror
            value={content}
            extensions={[markdown(), lineNumbers()]}
            onChange={saveOnBlur}
            height="200px"
            theme="dark"
          />
        </EditorWrap>
      ) : (
        <MarkdownContent>
          <ReactMarkdown>{content}</ReactMarkdown>
        </MarkdownContent>
      )}
    </PreviewWrap>
  )
}