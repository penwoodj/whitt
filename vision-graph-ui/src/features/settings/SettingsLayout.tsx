import type { SettingsLayoutProps } from './settingsTypes'
import type { ReactNode } from 'react'

export const SettingsLayout = ({ children }: SettingsLayoutProps): JSX.Element => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: 24 }}>
      {children}
    </div>
  )
}

type SectionProps = {
  legend: string
  children: ReactNode
}

export const SettingsSection = ({ legend, children }: SectionProps): JSX.Element => {
  return (
    <fieldset style={{ border: '1px solid #ccc', borderRadius: 8, padding: 16 }}>
      <legend style={{ padding: '0 8px', fontWeight: 'bold' }}>{legend}</legend>
      {children}
    </fieldset>
  )
}
