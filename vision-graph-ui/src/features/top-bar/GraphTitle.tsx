import styled from 'styled-components'
import type { GraphTitleProps } from './topBarTypes'

const Title = styled.h1`
  margin: 0;
  font-size: ${({ theme }) => theme.font.sizeMd};
  font-weight: ${({ theme }) => theme.font.weightMedium};
  color: ${({ theme }) => theme.colors.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
`

export default function GraphTitle({ title }: GraphTitleProps) {
  return <Title>{title}</Title>
}
