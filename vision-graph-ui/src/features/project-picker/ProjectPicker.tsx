import { useRef, useEffect } from 'react'
import styled from 'styled-components'
import type { ProjectPickerProps } from './projectPickerTypes'
import { useProjectPickerLogging } from './useProjectPickerLogging'
import ProjectIcon from './ProjectIcon'
import NewProjectBtn from './NewProjectBtn'

const Sidebar = styled.div`
  width: 60px;
  height: 100%;
  background: ${({ theme }) => theme.cinematic.bgGradient};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.md} 0;
  gap: ${({ theme }) => theme.spacing.sm};
  border-right: 1px solid ${({ theme }) => theme.colors.border};
`

const ProjectList = styled.div<{ $isEmpty: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  flex: 1;
  width: 100%;
  align-items: center;
  overflow-y: auto;
  overflow-x: hidden;
  
  ${({ $isEmpty }) => $isEmpty && 'display: none;'}
  
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.border};
    border-radius: 2px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors.textMuted};
  }
`

const NewBtnContainer = styled.div`
  margin-top: auto;
`

export default function ProjectPicker({ projects, activeProjectId, onSelect, onNew }: ProjectPickerProps) {
  const pickerLog = useProjectPickerLogging()
  const isEmpty = projects.length === 0
  const activeProjectRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (activeProjectId && activeProjectRef.current) {
      activeProjectRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, [activeProjectId])

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
      <ProjectList $isEmpty={isEmpty} role="list">
        {projects.map((project) => (
          <ProjectIcon
            key={project.id}
            label={project.label}
            iconLetter={project.iconLetter}
            $isActive={project.id === activeProjectId}
            onClick={() => handleSelect(project.id)}
            {...(project.id === activeProjectId && { ref: activeProjectRef })}
          />
        ))}
      </ProjectList>
      <NewBtnContainer>
        <NewProjectBtn onClick={handleNew} />
      </NewBtnContainer>
    </Sidebar>
  )
}
