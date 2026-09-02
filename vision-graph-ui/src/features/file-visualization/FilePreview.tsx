import ReactMarkdown from 'react-markdown'
import React from 'react'
import styled from 'styled-components'
import { useFileEdit } from './useFileEdit'
import { useFileSearch } from './useFileSearch'
import { useLineNumbers } from './useLineNumbers'
import CodeMirror from '@uiw/react-codemirror'
import { markdown } from '@codemirror/lang-markdown'
import { lineNumbers } from '@codemirror/view'
import type { WriteQueue } from '../../shared/fs/WriteQueue'

type FilePreviewProps = {
  content: string
  isLoading?: boolean
  writeQueue?: WriteQueue
  filePath?: string
  onExternalChange?: (event: { type: string; path: string }) => void
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

const PlainTextBtn = styled.button`
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

const PlainTextContent = styled.div`
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.font.sizeXs};
  line-height: 1.5;
  font-family: ${({ theme }) => theme.font.mono};
  white-space: pre-wrap;
  word-break: break-all;
`

const LineNumberCell = styled.span`
  color: ${({ theme }) => theme.colors.textMuted};
  text-align: right;
  padding-right: ${({ theme }) => theme.spacing.sm};
  min-width: 3em;
  user-select: none;
`

const LineContent = styled.span`
  flex: 1;
`

const LineRow = styled.div`
  display: flex;
  align-items: flex-start;
  min-height: 1.5em;

  &:hover {
    background-color: ${({ theme }) => theme.colors.bgHover};
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

const ConflictWrap = styled.div`
  background-color: ${({ theme }) => theme.colors.bgHover};
  border: 1px solid ${({ theme }) => theme.colors.warning};
  border-radius: ${({ theme }) => theme.radius.sm};
  padding: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`

const ConflictText = styled.span`
  color: ${({ theme }) => theme.colors.warning};
  font-size: ${({ theme }) => theme.font.sizeXs};
`

const ConflictBtns = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
`

const KeepMineBtn = styled.button`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme }) => theme.colors.primary};
  border: none;
  border-radius: ${({ theme }) => theme.radius.sm};
  color: ${({ theme }) => theme.colors.textInverse};
  cursor: pointer;
  font-size: ${({ theme }) => theme.font.sizeXs};

  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryHover};
  }
`

const UseDiskBtn = styled.button`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme }) => theme.colors.bg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.sm};
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  font-size: ${({ theme }) => theme.font.sizeXs};

  &:hover {
    background-color: ${({ theme }) => theme.colors.bgHover};
  }
`

export default function FilePreview({ content, isLoading = false, writeQueue, filePath = '', onExternalChange }: FilePreviewProps) {
  const { isEditing, content: previewContent, toggleEdit, saveOnBlur, saveError, retrySave, conflict, keepMine, useDisk } = useFileEdit(content, writeQueue, filePath, onExternalChange)
  const { searchQuery, matches, search } = useFileSearch()
  const { showLineNumbers } = useLineNumbers()
  const [isPlainText, setIsPlainText] = React.useState(false)

  const togglePlainText = (): void => {
    setIsPlainText(!isPlainText)
  }

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

  const lines = previewContent.split('\n')

  return (
    <PreviewWrap data-testid="file-preview-area">
      <Header>
      {conflict ? (
        <ConflictWrap data-testid="conflict-notice">
          <ConflictText>File changed on disk. Choose your version:</ConflictText>
          <ConflictBtns>
            <KeepMineBtn onClick={keepMine} data-testid="keep-mine-btn">Keep Mine</KeepMineBtn>
            <UseDiskBtn onClick={useDisk} data-testid="use-disk-btn">Use Disk Version</UseDiskBtn>
          </ConflictBtns>
        </ConflictWrap>
      ) : saveError ? (
        <ErrorWrap data-testid="error-notice">
          <ErrorText>Save failed: {saveError.message}</ErrorText>
          <RetryBtn onClick={retrySave}>Retry</RetryBtn>
        </ErrorWrap>
      ) : null}
        <EditBtn onMouseDown={(event) => event.stopPropagation()} onClick={toggleEdit} aria-label={isEditing ? 'Save' : 'Edit'}>
          {isEditing ? 'Save' : 'Edit'}
        </EditBtn>
        {!isEditing && (
          <>
            <PlainTextBtn onClick={togglePlainText} data-testid="plain-text-btn">
              {isPlainText ? 'Markdown' : 'Plain Text'}
            </PlainTextBtn>
            <input
              type="text"
              placeholder="Find..."
              value={searchQuery}
              onChange={(e) => search(e.target.value, previewContent)}
              data-testid="find-input"
            />
          </>
        )}
      </Header>

      {isEditing && !conflict ? (
        <EditorWrap>
          <CodeMirror
            value={previewContent}
            extensions={[markdown(), ...(showLineNumbers ? [lineNumbers()] : [])]}
            onChange={saveOnBlur}
            height="200px"
            theme="dark"
          />
        </EditorWrap>
      ) : !conflict ? (
        isPlainText ? (
          <PlainTextContent data-testid="plain-text-content">
              {lines.map((line, index) => (
              <LineRow key={line || 'blank'} data-line={index + 1}>
                {showLineNumbers && <LineNumberCell>{index + 1}</LineNumberCell>}
                <LineContent>{line || ' '}</LineContent>
              </LineRow>
            ))}
          </PlainTextContent>
        ) : (
          <MarkdownContent>
            <ReactMarkdown>{previewContent}</ReactMarkdown>
            {matches.length > 0 && (
              <div data-testid="search-matches">
                Found {matches.length} matches for "{searchQuery}"
              </div>
            )}
          </MarkdownContent>
        )
      ) : (
        <MarkdownContent>
          <ReactMarkdown>{previewContent}</ReactMarkdown>
        </MarkdownContent>
      )}
    </PreviewWrap>
  )
}
