import styled from 'styled-components'

const ContentArea = styled.div`
  padding: 16px;
  min-height: 200px;
  overflow-y: auto;
  flex: 1;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.bg};
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.border};
    border-radius: 4px;

    &:hover {
      background: ${({ theme }) => theme.colors.borderActive};
    }
  }
`

type NodeModalContentProps = {
  children?: React.ReactNode
}

export function NodeModalContent({ children }: NodeModalContentProps) {
  return <ContentArea>{children}</ContentArea>
}
