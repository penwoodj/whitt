export type AnimationClass =
  | 'fade-in-settle'
  | 'pulse'
  | 'shift'
  | 'halo'
  | 'fade-out'
  | 'edge-draw'
  | 'edge-erase'

export const ANIMATION_CLASSES: AnimationClass[] = [
  'fade-in-settle',
  'pulse',
  'shift',
  'halo',
  'fade-out',
  'edge-draw',
  'edge-erase',
]

export const ANIMATION_DURATIONS = {
  'fade-in-settle': '400ms',
  'pulse': '300ms',
  'shift': '300ms',
  'halo': '350ms',
  'fade-out': '300ms',
  'edge-draw': '400ms',
  'edge-erase': '300ms',
} as const

export type GraphMutationOp = 'spawn' | 'edit' | 'move' | 'group' | 'detach' | 'link' | 'unlink'

export const mutationAnimationMap: Record<GraphMutationOp, AnimationClass> = {
  spawn: 'fade-in-settle',
  edit: 'pulse',
  move: 'shift',
  group: 'halo',
  detach: 'fade-out',
  link: 'edge-draw',
  unlink: 'edge-erase',
}

export function getAnimationClass(mutationOp: GraphMutationOp): AnimationClass {
  return mutationAnimationMap[mutationOp]
}