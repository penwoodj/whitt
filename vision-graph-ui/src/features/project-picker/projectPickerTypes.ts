export type Project = {
  id: string
  label: string
  iconLetter: string
  lastOpened: Date
}

export type ProjectPickerProps = {
  projects: Project[]
  activeProjectId: string
  onSelect: (id: string) => void
  onNew: () => void
}

export type ProjectIconProps = {
  label: string
  iconLetter: string
  $isActive: boolean
  onClick: () => void
}

export type NewProjectBtnProps = {
  onClick: () => void
}
