import styled from 'styled-components'
import { morphFade } from '../../shared/keyframes'

type MorphLoaderProps = {
  isActive: boolean
}

const LoaderWrap = styled.div<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`

const IconWrap = styled.span<{ $delay: number }>`
  opacity: 0;
  transform: translateY(4px);
  animation: ${morphFade} 0.3s ease-out forwards;
  animation-delay: ${({ $delay }) => $delay}s;
`

const icons = ['○', '◐', '◑', '●']

export function MorphLoader({ isActive }: MorphLoaderProps) {
  if (!isActive) return null

  return (
    <LoaderWrap $isActive={isActive}>
      {icons.map((icon, i) => (
        <IconWrap key={icon} $delay={i * 0.3}>
          {icon}
        </IconWrap>
      ))}
    </LoaderWrap>
  )
}
