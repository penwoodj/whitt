import type { Meta, StoryObj } from '@storybook/react'
import { expect, fn, within } from '@storybook/test'
import { useGitCommit } from './useGitCommit'
import type { GitService } from './gitSyncTypes'

function TestComponent({ gitService }: { gitService: GitService }) {
  const { onFlush } = useGitCommit(gitService)

  return (
    <button
      type="button"
      onClick={() => onFlush([{ path: 'test.md', content: 'content' }])}
    >
      Save
    </button>
  )
}

const meta = {
  title: 'Features/Git Time Travel/GIT-01 commit per save',
  component: TestComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered'
  }
} satisfies Meta<typeof TestComponent>

export default meta
type Story = StoryObj<typeof meta>

export const CommitPerSave: Story = {
  args: {
    gitService: {
      commit: fn(),
      push: fn()
    }
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const saveBtn = canvas.getByRole('button', { name: /save/i })

    await saveBtn.click()

    expect(args.gitService.commit).toHaveBeenCalledTimes(1)
    expect(args.gitService.commit).toHaveBeenCalledWith(
      'test.md',
      expect.objectContaining({
        actor: 'user',
        action: 'file-edit',
        refs: expect.any(Array),
        ts: expect.any(String)
      })
    )
  }
}

export const Gitc03MetadataSchema: Story = {
  title: 'Features/Git Time Travel/GITC-03 metadata schema',
  args: {
    gitService: {
      commit: fn(),
      push: fn()
    }
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const saveBtn = canvas.getByRole('button', { name: /save/i })

    await saveBtn.click()

    const commitCall = (args.gitService.commit as ReturnType<typeof fn>).mock.calls[0]
    const metadata = commitCall[1]

    expect(metadata).toHaveProperty('actor')
    expect(metadata).toHaveProperty('action')
    expect(metadata).toHaveProperty('refs')
    expect(metadata).toHaveProperty('ts')
    expect(metadata.actor).toBe('user')
  }
}