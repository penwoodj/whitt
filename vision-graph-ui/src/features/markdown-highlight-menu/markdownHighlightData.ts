import type { MarkdownHighlightMenuProps } from './markdownHighlightTypes'

export const buildDefaultProps = (): MarkdownHighlightMenuProps => ({
  selectedText: 'React Flow',
  position: { x: 100, y: 200 },
  onExpand: () => {},
  onRefine: () => {},
  onClose: () => {},
})

export const buildEmptySelectionProps = (): MarkdownHighlightMenuProps => ({
  selectedText: '',
  position: null,
  onExpand: () => {},
  onRefine: () => {},
  onClose: () => {},
})

export const buildNullPositionProps = (): MarkdownHighlightMenuProps => ({
  selectedText: 'React Flow',
  position: null,
  onExpand: () => {},
  onRefine: () => {},
  onClose: () => {},
})
