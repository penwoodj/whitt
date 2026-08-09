export type NewProjectModalProps = {
  isOpen: boolean
  onCreate: (data: { name: string; folder: string }) => void
  onCancel: () => void
}
