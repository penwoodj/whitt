import { useEffect, useRef } from 'react'
import styled from 'styled-components'
import { useModalState } from './useModalState'

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
  children?: React.ReactNode
}

export function NodeModalWrapper({ children }: NodeModalWrapperProps) {
  const { isModalOpen, closeModal } = useModalState()
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleEscape = (evt: KeyboardEvent) => {
      if (evt.key === 'Escape' && isModalOpen) {
        closeModal()
      }
    }

    const handleClickOutside = (evt: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(evt.target as Node) &&
        isModalOpen
      ) {
        closeModal()
      }
    }

    if (isModalOpen) {
      document.addEventListener('keydown', handleEscape)
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isModalOpen, closeModal])

  if (!isModalOpen) {
    return null
  }

  return (
    <ModalOverlay>
      <ModalContent
        ref={modalRef}
        $originX={isModalOpen.originX}
        $originY={isModalOpen.originY}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`modal-title-${isModalOpen.nodeId}`}
      >
        <CloseButton onClick={closeModal} aria-label="Close modal" data-testid="close-btn">
          ×
        </CloseButton>
        {children}
      </ModalContent>
    </ModalOverlay>
  )
}
