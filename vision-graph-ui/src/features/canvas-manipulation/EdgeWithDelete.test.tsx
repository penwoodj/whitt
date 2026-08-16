import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { EdgeWithDelete } from './EdgeWithDelete'

describe('EdgeWithDelete', () => {
  const defaultProps = {
    edgeId: 'edge-a-b',
    sourcePosition: { x: 100, y: 100 },
    targetPosition: { x: 300, y: 100 },
    isHovered: false,
    isSelected: false,
    onDelete: () => {},
    onClick: () => {},
    onMouseEnter: () => {},
    onMouseLeave: () => {},
  }

  describe('GRPC-05 edge delete - hover', () => {
    it('shows delete button when edge is hovered', async () => {
      const onMouseEnter = vi.fn()
      const onDelete = vi.fn()

      render(
        <EdgeWithDelete
          {...defaultProps}
          onDelete={onDelete}
          onMouseEnter={onMouseEnter}
          isHovered={true}
        />
      )

      const deleteButton = screen.getByTestId('delete-edge-edge-a-b')
      expect(deleteButton).toBeVisible()
    })

    it('delete button is clearly visible', () => {
      render(
        <EdgeWithDelete
          {...defaultProps}
          isHovered={true}
        />
      )

      const deleteButton = screen.getByTestId('delete-edge-edge-a-b')
      expect(deleteButton).toBeInTheDocument()
      expect(deleteButton).toBeVisible()
      expect(deleteButton).toHaveTextContent('×')
    })
  })

  describe('GRPC-05 edge delete - click X', () => {
    it('deletes edge when X button is clicked', async () => {
      const onDelete = vi.fn()

      render(
        <EdgeWithDelete
          {...defaultProps}
          onDelete={onDelete}
          isHovered={true}
        />
      )

      const deleteButton = screen.getByTestId('delete-edge-edge-a-b')
      await userEvent.click(deleteButton)

      expect(onDelete).toHaveBeenCalledTimes(1)
    })

    it('edge removed after delete click', async () => {
      let isDeleted = false

      render(
        <EdgeWithDelete
          {...defaultProps}
          onDelete={() => { isDeleted = true }}
          isHovered={true}
        />
      )

      const deleteButton = screen.getByTestId('delete-edge-edge-a-b')
      await userEvent.click(deleteButton)

      await waitFor(() => {
        expect(isDeleted).toBe(true)
      })
    })
  })

  describe('GRPC-05 edge delete - keyboard', () => {
    it('selects edge on click', async () => {
      const onClick = vi.fn()

      render(
        <EdgeWithDelete
          {...defaultProps}
          onClick={onClick}
        />
      )

      const edgeLine = screen.getByRole('presentation')
      await userEvent.click(edgeLine)

      expect(onClick).toHaveBeenCalledTimes(1)
    })

    it('deletes edge when Delete key pressed on selected edge', async () => {
      const onDelete = vi.fn()

      render(
        <EdgeWithDelete
          {...defaultProps}
          onDelete={onDelete}
          isSelected={true}
        />
      )

      await userEvent.keyboard('{Delete}')

      expect(onDelete).toHaveBeenCalledTimes(1)
    })

    it('deletes edge when Backspace key pressed on selected edge', async () => {
      const onDelete = vi.fn()

      render(
        <EdgeWithDelete
          {...defaultProps}
          onDelete={onDelete}
          isSelected={true}
        />
      )

      await userEvent.keyboard('{Backspace}')

      expect(onDelete).toHaveBeenCalledTimes(1)
    })
  })
})
