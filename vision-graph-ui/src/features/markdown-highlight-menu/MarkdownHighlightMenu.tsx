import { useEffect } from 'react'
import styled from 'styled-components'
import type { MarkdownHighlightMenuProps } from './markdownHighlightTypes'
import { useMarkdownHighlightLogging } from './useMarkdownHighlightLogging'
import { isMenuVisible } from './markdownHighlightPredicates'
import MenuButton from './MenuButton'

const Menu = styled.div<{ $x: number; $y: number }>`
  position: absolute;
  left: ${({ $x }) => `${$x}px`};
  top: ${({ $y }) => `${$y}px`};
  background-color: ${({ theme }) => theme.colors.bgElevated};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  box-shadow: ${({ theme }) => `${theme.glow.primaryStrong}, ${theme.shadow.lg}`};
  padding: ${({ theme }) => theme.spacing.sm};
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  z-index: ${({ theme }) => theme.zIndex.tooltip};
`

const ButtonContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
`

export default function MarkdownHighlightMenu({
  selectedText,
  position,
  onExpand,
  onRefine,
  onClose,
}: MarkdownHighlightMenuProps) {
  const menuLog = useMarkdownHighlightLogging()

  useEffect(() => {
    const handleMouseDown = (evt: MouseEvent) => {
      const target = evt.target as HTMLElement
      if (!target.closest('[data-testid="highlight-menu"]')) {
        onClose()
        menuLog.debug('Menu closed by outside click')
      }
    }

    if (isMenuVisible(selectedText, position)) {
      document.addEventListener('mousedown', handleMouseDown)
      return () => document.removeEventListener('mousedown', handleMouseDown)
    }
  }, [selectedText, position, onClose, menuLog])

  if (!isMenuVisible(selectedText, position)) {
    return null
  }

  const handleExpand = () => {
    onExpand(selectedText)
    onClose()
    menuLog.debug('Expand clicked', { text: selectedText })
  }

  const handleRefine = () => {
    onRefine(selectedText)
    onClose()
    menuLog.debug('Refine clicked', { text: selectedText })
  }

  return (
    <Menu $x={position!.x} $y={position!.y} data-testid="highlight-menu">
      <ButtonContainer>
        <MenuButton icon="+" label="Expand" onClick={handleExpand} />
        <MenuButton icon="✎" label="Refine" onClick={handleRefine} />
      </ButtonContainer>
    </Menu>
  )
}
