import styled from 'styled-components'
import type { SettingsLayoutProps } from './settingsTypes'
import type { ReactNode } from 'react'

const CfgLayout = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.lg};
`

const CfgFieldset = styled.fieldset`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: ${({ theme }) => theme.spacing.md};
`

const CfgLegend = styled.legend`
  padding: 0 ${({ theme }) => theme.spacing.sm};
  font-weight: ${({ theme }) => theme.font.weightBold};
`

export const SettingsLayout = ({ children }: SettingsLayoutProps): React.JSX.Element => {
  return <CfgLayout>{children}</CfgLayout>
}

type SectionProps = {
  legend: string
  children: ReactNode
}

export const SettingsSection = ({ legend, children }: SectionProps): React.JSX.Element => {
  return (
    <CfgFieldset>
      <CfgLegend>{legend}</CfgLegend>
      {children}
    </CfgFieldset>
  )
}
