import flow from 'lodash/fp/flow'
import sortBy from 'lodash/fp/sortBy'
import type { Project } from './projectPickerTypes'

export const sortProjects = (projects: Project[]): Project[] =>
  flow([sortBy<Project>('lastOpened')])(projects).reverse()

export const filterActive = (projects: Project[], activeId: string): Project | undefined =>
  projects.find((p) => p.id === activeId)
