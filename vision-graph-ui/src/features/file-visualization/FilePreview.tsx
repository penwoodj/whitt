import ReactMarkdown from 'react-markdown'
import styled from 'styled-components'
import { useFileEdit } from './useFileEdit'
import CodeMirror from '@uiw/react-codemirror'
import { markdown } from '@codemirror/lang-markdown'
import { lineNumbers } from '@codemirror/view'
import type { WriteQueue } from '../../shared/fs/WriteQueue'

type FilePreviewProps = {
  content: string
  isLoading?: boolean
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

const SkeletonBlock = styled.div`
  height: 16px;
  background-color: ${({ theme }) => theme.colors.bgHover};
  border-radius: ${({ theme }) => theme.radius.sm};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  animation: pulse 1.5s ease-in-out infinite;

  @keyframes pulse {
    0%, 100% { opacity: 0.4; }
    50% { opacity: 0.8; }
  }

  &:nth-child(1) { width: 60%; height: 24px; }
  &:nth-child(2) { width: 40%; }
  &:nth-child(3) { width: 80%; }
  &:nth-child(4) { width: 70%; }
`

const SkeletonWrap = styled.div`
  display: flex;
  flex-direction: column;
  padding: ${({ theme }) => theme.spacing.sm};
  min-height: 200px;
`

const ErrorWrap = styled.div`
  background-color: ${({ theme }) => theme.colors.bgHover};
  border: 1px solid ${({ theme }) => theme.colors.error};
  border-radius: ${({ theme }) => theme.radius.sm};
  padding: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`

const ErrorText = styled.span`
  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.font.sizeXs};
  flex: 1;
`

const RetryBtn = styled.button`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme }) => theme.colors.error};
  border: none;
  border-radius: ${({ theme }) => theme.radius.sm};
  color: ${({ theme }) => theme.colors.textInverse};
  cursor: pointer;
  font-size: ${({ theme }) => theme.font.sizeXs};

  &:hover {
    background-color: ${({ theme }) => theme.colors.error};
    opacity: 0.9;
  }
`

export default function FilePreview({ content, isLoading = false, writeQueue, filePath = '' }: FilePreviewProps) {
  const { isEditing, toggleEdit, saveOnBlur, saveError, retrySave } = useFileEdit(content, writeQueue, filePath)

  if (isLoading) {
    return (
      <PreviewWrap data-testid="file-preview-area">
        <Header>
          <EditBtn disabled>Edit</EditBtn>
        </Header>
        <SkeletonWrap data-testid="skeleton-loader">
          <SkeletonBlock data-testid="skeleton-block-1" />
          <SkeletonBlock data-testid="skeleton-block-2" />
          <SkeletonBlock data-testid="skeleton-block-3" />
          <SkeletonBlock data-testid="skeleton-block-4" />
        </SkeletonWrap>
      </PreviewWrap>
    )
  }

  return (
    <PreviewWrap data-testid="file-preview-area">
      <Header>
        {saveError && (
          <ErrorWrap>
            <ErrorText>Save failed: {saveError.message}</ErrorText>
            <RetryBtn onClick={retrySave}>Retry</RetryBtn>
          </ErrorWrap>
        )}
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