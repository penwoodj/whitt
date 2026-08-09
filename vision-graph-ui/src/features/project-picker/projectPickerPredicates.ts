import type { Project } from './projectPickerTypes'

export const isActive = (project: Project, activeId: string): boolean => project.id === activeId

export const hasNewBtn = (props: { onNew: () => void }): boolean => typeof props.onNew === 'function'
