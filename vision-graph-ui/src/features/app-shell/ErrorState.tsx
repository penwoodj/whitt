import styled from 'styled-components'

const ErrorContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: ${({ theme }) => theme.colors.bgElevated};
  border: 1px solid ${({ theme }) => theme.colors.error};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  max-width: 400px;
  box-shadow: ${({ theme }) => theme.shadow.lg};
  z-index: 1000;
`

const ErrorTitle = styled.h3`
  color: ${({ theme }) => theme.colors.error};
  margin: 0 0 ${({ theme }) => theme.spacing.sm} 0;
  font-size: ${({ theme }) => theme.font.sizeLg};
  font-weight: ${({ theme }) => theme.font.weightBold};
`

const ErrorMessage = styled.p`
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 ${({ theme }) => theme.spacing.md} 0;
  font-size: ${({ theme }) => theme.font.sizeMd};
  line-height: 1.5;
`

const RetryButton = styled.button`
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.textInverse};
  border: none;
  border-radius: ${({ theme }) => theme.radius.sm};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};
  font-size: ${({ theme }) => theme.font.sizeMd};
  font-weight: ${({ theme }) => theme.font.weightMedium};
  cursor: pointer;
  transition: background-color ${({ theme }) => theme.transition.fast};
  opacity: 0.9;

  &:hover {
    opacity: 1;
  }

  &:active {
    transform: translateY(1px);
  }
`

export type ErrorStateProps = {
  message: string
  onRetry: () => void
}

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <ErrorContainer role="alert">
      <ErrorTitle>Failed to Load Project</ErrorTitle>
      <ErrorMessage>{message}</ErrorMessage>
      <RetryButton onClick={onRetry}>Retry</RetryButton>
    </ErrorContainer>
  )
}