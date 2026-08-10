import type { Project } from './projectPickerTypes'

export const buildSampleProjects = (): Project[] => [
  {
    id: 'ai-frameworks',
    label: 'AI Frameworks Research',
    iconLetter: 'A',
    lastOpened: new Date('2026-08-09T10:30:00'),
  },
  {
    id: 'local-first',
    label: 'Local-First Essay',
    iconLetter: 'B',
    lastOpened: new Date('2026-08-08T15:45:00'),
  },
  {
    id: 'whitt-arch',
    label: 'Whitt Architecture',
    iconLetter: 'W',
    lastOpened: new Date('2026-08-07T09:15:00'),
  },
]

export const buildDefaultProps = () => ({
  projects: buildSampleProjects(),
  activeProjectId: 'ai-frameworks',
  onSelect: () => {},
  onNew: () => {},
})
