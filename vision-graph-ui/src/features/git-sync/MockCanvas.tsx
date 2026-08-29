import styled from 'styled-components'

const Canvas = styled.div`
  width: 100vw;
  height: 100vh;
  background: ${({ theme }) => theme.colors.bg};
  position: relative;
`

const Node = styled.div`
  width: 200px;
  height: 100px;
  background: ${({ theme }) => theme.colors.bgElevated};
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.text};
  font-weight: ${({ theme }) => theme.font.weightMedium};
  user-select: none;
`

export function MockCanvas() {
  return (
    <Canvas>
      <Node>Test Node</Node>
    </Canvas>
  )
}