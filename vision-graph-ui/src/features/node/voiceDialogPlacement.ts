export type Rect = { readonly left: number; readonly right: number; readonly top: number; readonly bottom: number; readonly width: number; readonly height: number }
export type Viewport = { readonly width: number; readonly height: number }
export type DialogPlacement = { readonly side: 'left' | 'right'; readonly arrow: 'left' | 'right' }

export const chooseDialogPlacement = (anchor: Rect, viewport: Viewport, dialogWidth: number, neighbors: readonly Rect[] = []): DialogPlacement => {
  const rightStart = anchor.right + 12
  const rightEnd = rightStart + dialogWidth
  const rightCollision = rightEnd > viewport.width || neighbors.some((neighbor) => rightStart < neighbor.right && rightEnd > neighbor.left && anchor.top < neighbor.bottom && anchor.bottom > neighbor.top)
  return rightCollision ? { side: 'left', arrow: 'right' } : { side: 'right', arrow: 'left' }
}
