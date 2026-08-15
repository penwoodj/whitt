import type { SimpleGit } from 'simple-git'

export type CommitActor = 'user' | 'agent'

export type CommitAction = 'file-edit' | 'file-create' | 'prompt' | 'rename' | 'group'

export type CommitMetadata = {
  actor: CommitActor
  action: CommitAction
  refs: string[]
  ts: string
}

export class CommitBuilder {
  private readonly git: SimpleGit

  constructor(git: SimpleGit) {
    this.git = git
  }

  async commit(
    files: string | string[],
    metadata: CommitMetadata
  ): Promise<void> {
    const fileList = Array.isArray(files) ? files : [files]
    const primaryFile = fileList[0]

    for (const file of fileList) {
      await this.git.add(file)
    }

    const message = this.formatCommitMessage(primaryFile, metadata)
    const metadataJson = JSON.stringify(metadata)

    await this.git.commit(message, {
      '--message': metadataJson
    })
  }

  private formatCommitMessage(file: string, metadata: CommitMetadata): string {
    return `whitt: ${metadata.action} ${file} [${metadata.actor}]`
  }
}
