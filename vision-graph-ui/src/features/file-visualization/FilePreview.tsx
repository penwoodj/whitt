import ReactMarkdown from 'react-markdown'
import styled from 'styled-components'

type FilePreviewProps = {
  content: string
}

const PreviewWrap = styled.div`
  padding: ${({ theme }) => theme.spacing.sm};
  min-height: 200px;
  background-color: ${({ theme }) => theme.colors.bgElevated};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
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

export default function FilePreview({ content }: FilePreviewProps) {
  return (
    <PreviewWrap data-testid="file-preview-area">
      <MarkdownContent>
        <ReactMarkdown>{content}</ReactMarkdown>
      </MarkdownContent>
    </PreviewWrap>
  )
}