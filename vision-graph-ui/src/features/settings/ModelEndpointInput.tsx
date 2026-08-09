import { useState, useCallback } from 'react'
import styled from 'styled-components'
import type { ModelEndpointInputProps } from './settingsTypes'
import { hasValidEndpoint } from './settingsPredicates'

const CfgWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`

const CfgInput = styled.input<{ $hasErr: boolean }>`
  border: 1px solid ${({ theme, $hasErr }) => $hasErr ? theme.colors.error : theme.colors.border};
  padding: ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.colors.bg};
  color: ${({ theme }) => theme.colors.text};
  border-radius: ${({ theme }) => theme.radius.sm};
  font-family: ${({ theme }) => theme.font.sans};
  font-size: ${({ theme }) => theme.font.sizeMd};
  outline: none;

  &:focus {
    border-color: ${({ theme }) => theme.colors.borderActive};
  }
`

export const ModelEndpointInput = ({ eptTxt, onChange }: ModelEndpointInputProps): JSX.Element => {
  const [isTouched, setIsTouched] = useState(false)
  const [value, setValue] = useState(eptTxt)

  const isValid = hasValidEndpoint(value)
  const showError = isTouched && !isValid

  const handleChange = useCallback((evt: React.ChangeEvent<HTMLInputElement>): void => {
    setValue(evt.target.value)
    onChange(evt.target.value)
  }, [onChange])

  const handleBlur = useCallback((): void => {
    setIsTouched(true)
  }, [])

  return (
    <CfgWrapper>
      <CfgInput
        type="text"
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        $hasErr={showError}
        placeholder="http://localhost:8080"
      />
    </CfgWrapper>
  )
}
