export type MenuPosition = {
  x: number
  y: number
}

export type MarkdownHighlightMenuProps = {
  selectedText: string
  position: MenuPosition | null
  onExpand: (text: string) => void
  onRefine: (text: string) => void
  onClose: () => void
}

export type MenuButtonProps = {
  icon: string
  label: string
  onClick: () => void
}
