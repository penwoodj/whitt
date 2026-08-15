import { useEffect, useRef } from 'react'
import styled from 'styled-components'

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: ${({ theme }) => theme.zIndex.overlay};
  display: flex;
  align-items: center;
  justify-content: center;
`

const ModalContent = styled.div<{
  $originX: number
  $originY: number
}>`
  width: 810px;
  max-width: 90vw;
  max-height: 80vh;
  background-color: ${({ theme }) => theme.colors.bgElevated};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadow.lg};
  overflow-y: auto;
  transform-origin: ${({ $originX, $originY }) => `${$originX}px ${$originY}px`};
  animation: modalOpen 250ms ease;
  position: relative;

  @keyframes modalOpen {
    0% {
      opacity: 0;
      transform: scale(0.9);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }
`

const CloseButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  width: 24px;
  height: 24px;
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.textMuted};
  cursor: pointer;
  border-radius: 4px;
  font-size: 18px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 120ms ease, background-color 120ms ease;
  z-index: 1;

  &:hover {
    color: ${({ theme }) => theme.colors.text};
    background-color: ${({ theme }) => theme.colors.bgHover};
  }
`

type NodeModalWrapperProps = {
  isOpen: boolean
  onClose: () => void
  origin?: { x: number; y: number }
  children?: React.ReactNode
}

export function NodeModalWrapper({ isOpen, onClose, origin, children }: NodeModalWrapperProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const originX = origin?.x ?? 0
  const originY = origin?.y ?? 0

  useEffect(() => {
    if (!isOpen) {
      return undefined
    }

    const handleEscape = (evt: KeyboardEvent) => {
      if (evt.key === 'Escape') {
        onClose()
      }
    }

    const handleClickOutside = (evt: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(evt.target as Node)) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  if (!isOpen) {
    return null
  }

  return (
    <ModalOverlay>
      <ModalContent
        ref={modalRef}
        $originX={originX}
        $originY={originY}
        role="dialog"
        aria-modal="true"
        data-testid="modal-content"
      >
        <CloseButton onClick={onClose} aria-label="Close modal" data-testid="close-btn">
          ×
        </CloseButton>
        {children}
      </ModalContent>
    </ModalOverlay>
  )
}
