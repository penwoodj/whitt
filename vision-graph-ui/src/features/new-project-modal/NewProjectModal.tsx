import { useState, useEffect } from 'react'
import styled from 'styled-components'
import type { NewProjectModalProps } from './newProjectModalTypes'
import { useNewProjectModalLogging } from './useNewProjectModalLogging'

const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: ${({ theme }) => theme.zIndex.overlay};
  display: flex;
  align-items: center;
  justify-content: center;
`

const Modal = styled.div`
  background-color: ${({ theme }) => theme.colors.bgElevated};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadow.lg};
  max-width: 500px;
  width: 90%;
  padding: ${({ theme }) => theme.spacing.lg};
  z-index: ${({ theme }) => theme.zIndex.modal};
`

const Title = styled.h2`
  margin: 0 0 ${({ theme }) => theme.spacing.lg} 0;
  font-size: ${({ theme }) => theme.font.sizeLg};
  font-weight: ${({ theme }) => theme.font.weightBold};
  color: ${({ theme }) => theme.colors.text};
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`

const Label = styled.label`
  display: block;
  font-size: ${({ theme }) => theme.font.sizeSm};
  font-weight: ${({ theme }) => theme.font.weightMedium};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`

const Input = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme }) => theme.colors.bg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.sm};
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.font.sizeSm};
  font-family: ${({ theme }) => theme.font.sans};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`

const InputGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`

const BrowseBtn = styled.button`
  padding: 0 ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.bgHover};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.sm};
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.font.sizeSm};
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.colors.border};
  }
`

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.md};
`

const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};
  background-color: ${({ $variant, theme }) =>
    $variant === 'primary' ? theme.colors.primary : theme.colors.bgHover};
  border: 1px solid
    ${({ $variant, theme }) =>
      $variant === 'primary' ? theme.colors.primary : theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.sm};
  color: ${({ $variant, theme }) =>
    $variant === 'primary' ? theme.colors.textInverse : theme.colors.text};
  font-size: ${({ theme }) => theme.font.sizeSm};
  font-weight: ${({ theme }) => theme.font.weightMedium};
  cursor: pointer;

  &:hover:not(:disabled) {
    background-color: ${({ $variant, theme }) =>
      $variant === 'primary' ? theme.colors.primaryHover : theme.colors.border};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

export default function NewProjectModal({ isOpen, onCreate, onCancel }: NewProjectModalProps) {
  const modalLog = useNewProjectModalLogging()

  const [name, setName] = useState('')
  const [folder, setFolder] = useState('')

  useEffect(() => {
    if (isOpen) {
      setName('')
      setFolder('')
    }
  }, [isOpen])

  const isFormValid = name.trim().length > 0 && folder.trim().length > 0

  const handleCreate = (evt: React.FormEvent) => {
    evt.preventDefault()
    if (isFormValid) {
      onCreate({ name: name.trim(), folder: folder.trim() })
      modalLog.info('Project created', { name, folder })
    }
  }

  const handleBrowse = () => {
    modalLog.debug('Browse clicked (placeholder)')
  }

  if (!isOpen) return null

  return (
    <Backdrop data-testid="modal-backdrop" onClick={onCancel}>
      <Modal data-testid="new-project-modal" onClick={(evt) => evt.stopPropagation()}>
        <Title>New Project</Title>
        <Form onSubmit={handleCreate}>
          <div>
            <Label htmlFor="project-name">Project Name</Label>
            <Input
              id="project-name"
              type="text"
              value={name}
              onChange={(evt) => setName(evt.target.value)}
              placeholder="My Graph"
              aria-label="Project name"
            />
          </div>
          <div>
            <Label htmlFor="folder-path">Folder Path</Label>
            <InputGroup>
              <Input
                id="folder-path"
                type="text"
                value={folder}
                onChange={(evt) => setFolder(evt.target.value)}
                placeholder="/path/to/project"
                aria-label="Folder path"
              />
              <BrowseBtn type="button" onClick={handleBrowse}>
                Browse
              </BrowseBtn>
            </InputGroup>
          </div>
          <ButtonRow>
            <Button type="button" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" $variant="primary" disabled={!isFormValid}>
              Create
            </Button>
          </ButtonRow>
        </Form>
      </Modal>
    </Backdrop>
  )
}
