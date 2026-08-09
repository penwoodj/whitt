import type { Project } from './projectPickerTypes'

export const buildSampleProjects = (): Project[] => [
  {
    id: 'proj-1',
    label: 'Research Project',
    iconLetter: 'R',
    lastOpened: new Date('2026-08-08T10:30:00'),
  },
  {
    id: 'proj-2',
    label: 'Notes App',
    iconLetter: 'N',
    lastOpened: new Date('2026-08-07T15:45:00'),
  },
  {
    id: 'proj-3',
    label: 'Design System',
    iconLetter: 'D',
    lastOpened: new Date('2026-08-06T09:15:00'),
  },
]

export const buildDefaultProps = () => ({
  projects: buildSampleProjects(),
  activeProjectId: 'proj-1',
  onSelect: () => {},
  onNew: () => {},
})
