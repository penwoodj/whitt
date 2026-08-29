import type { CommitMetadata, CommitActor, CommitAction } from '../../shared/fs/CommitBuilder'

export function buildCommitMetadata(
  actor: CommitActor,
  action: CommitAction,
  refs: string[]
): CommitMetadata {
  return {
    actor,
    action,
    refs,
    ts: new Date().toISOString()
  }
}