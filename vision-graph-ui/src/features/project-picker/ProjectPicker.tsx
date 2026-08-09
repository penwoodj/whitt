import styled from 'styled-components'
import type { ProjectPickerProps } from './projectPickerTypes'
import { useProjectPickerLogging } from './useProjectPickerLogging'
import ProjectIcon from './ProjectIcon'
import NewProjectBtn from './NewProjectBtn'

const Sidebar = styled.div`
  width: 60px;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.bg};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.md} 0;
  gap: ${({ theme }) => theme.spacing.sm};
  border-right: 1px solid ${({ theme }) => theme.colors.border};
`

const ProjectList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  flex: 1;
`

const NewBtnContainer = styled.div`
  margin-top: auto;
`

export default function ProjectPicker({ projects, activeProjectId, onSelect, onNew }: ProjectPickerProps) {
  const pickerLog = useProjectPickerLogging()

  const handleSelect = (id: string) => {
    onSelect(id)
    pickerLog.debug('Project selected', { projectId: id })
  }

  const handleNew = () => {
    onNew()
    pickerLog.debug('New project clicked')
  }

  return (
    <Sidebar>
      <ProjectList>
        {projects.map((project) => (
          <ProjectIcon
            key={project.id}
            label={project.label}
            iconLetter={project.iconLetter}
            $isActive={project.id === activeProjectId}
            onClick={() => handleSelect(project.id)}
          />
        ))}
      </ProjectList>
      <NewBtnContainer>
        <NewProjectBtn onClick={handleNew} />
      </NewBtnContainer>
    </Sidebar>
  )
}
