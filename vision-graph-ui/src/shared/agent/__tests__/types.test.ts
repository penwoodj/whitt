import { describe, it, expect } from 'vitest'
import type { AgentEvt, GraphMutation } from '../types'
import { isRunStart, isStepStart, isGraphMutation } from '../types'

describe('AgentEvt types', () => {
  describe('AgentEvt union covers all 8 event kinds', () => {
    it('run-start event matches shape', () => {
      const evt: AgentEvt = {
        kind: 'run-start',
        runId: 'r1',
        nodeId: 'n1',
        workflow: 'draft',
      }
      expect(evt.kind).toBe('run-start')
      expect(evt.runId).toBe('r1')
      expect(evt.nodeId).toBe('n1')
      expect(evt.workflow).toBe('draft')
    })

    it('step-start event matches shape', () => {
      const evt: AgentEvt = {
        kind: 'step-start',
        runId: 'r1',
        stepId: 's1',
        title: 'Parsing prompt',
      }
      expect(evt.kind).toBe('step-start')
      expect(evt.runId).toBe('r1')
      expect(evt.stepId).toBe('s1')
      expect(evt.title).toBe('Parsing prompt')
    })

    it('step-done event matches shape', () => {
      const evt: AgentEvt = {
        kind: 'step-done',
        runId: 'r1',
        stepId: 's1',
      }
      expect(evt.kind).toBe('step-done')
      expect(evt.runId).toBe('r1')
      expect(evt.stepId).toBe('s1')
    })

    it('step-error event matches shape', () => {
      const evt: AgentEvt = {
        kind: 'step-error',
        runId: 'r1',
        stepId: 's1',
        msg: 'Parse error',
      }
      expect(evt.kind).toBe('step-error')
      expect(evt.runId).toBe('r1')
      expect(evt.stepId).toBe('s1')
      expect(evt.msg).toBe('Parse error')
    })

    it('log event matches shape', () => {
      const evt: AgentEvt = {
        kind: 'log',
        runId: 'r1',
        level: 'info',
        msg: 'Processing',
      }
      expect(evt.kind).toBe('log')
      expect(evt.runId).toBe('r1')
      expect(evt.level).toBe('info')
      expect(evt.msg).toBe('Processing')
    })

    it('file-write event matches shape', () => {
      const evt: AgentEvt = {
        kind: 'file-write',
        runId: 'r1',
        path: 'topic-a.md',
        actor: 'agent',
      }
      expect(evt.kind).toBe('file-write')
      expect(evt.runId).toBe('r1')
      expect(evt.path).toBe('topic-a.md')
      expect(evt.actor).toBe('agent')
    })

    it('graph-mutation event matches shape', () => {
      const mutation: GraphMutation = {
        op: 'spawn',
        parentNodeId: 'n1',
        newNodeId: 'n2',
        title: 'Sub topic',
      }
      const evt: AgentEvt = {
        kind: 'graph-mutation',
        runId: 'r1',
        mutation,
      }
      expect(evt.kind).toBe('graph-mutation')
      expect(evt.runId).toBe('r1')
      expect(evt.mutation).toEqual(mutation)
    })

    it('run-done event matches shape', () => {
      const evt: AgentEvt = {
        kind: 'run-done',
        runId: 'r1',
        nodeId: 'n1',
        status: 'done',
      }
      expect(evt.kind).toBe('run-done')
      expect(evt.runId).toBe('r1')
      expect(evt.nodeId).toBe('n1')
      expect(evt.status).toBe('done')
    })
  })

  describe('GraphMutation covers 7 ops', () => {
    it('spawn op', () => {
      const mutation: GraphMutation = {
        op: 'spawn',
        parentNodeId: 'n1',
        newNodeId: 'n2',
        title: 'Sub topic',
      }
      expect(mutation.op).toBe('spawn')
      expect(mutation.parentNodeId).toBe('n1')
      expect(mutation.newNodeId).toBe('n2')
      expect(mutation.title).toBe('Sub topic')
    })

    it('edit op', () => {
      const mutation: GraphMutation = {
        op: 'edit',
        nodeId: 'n1',
      }
      expect(mutation.op).toBe('edit')
      expect(mutation.nodeId).toBe('n1')
    })

    it('move op', () => {
      const mutation: GraphMutation = {
        op: 'move',
        nodeId: 'n1',
        from: 'p1',
        to: 'p2',
      }
      expect(mutation.op).toBe('move')
      expect(mutation.nodeId).toBe('n1')
      expect(mutation.from).toBe('p1')
      expect(mutation.to).toBe('p2')
    })

    it('group op', () => {
      const mutation: GraphMutation = {
        op: 'group',
        nodeIds: ['n1', 'n2'],
        groupId: 'g1',
      }
      expect(mutation.op).toBe('group')
      expect(mutation.nodeIds).toEqual(['n1', 'n2'])
      expect(mutation.groupId).toBe('g1')
    })

    it('detach op', () => {
      const mutation: GraphMutation = {
        op: 'detach',
        nodeId: 'n1',
      }
      expect(mutation.op).toBe('detach')
      expect(mutation.nodeId).toBe('n1')
    })

    it('link op', () => {
      const mutation: GraphMutation = {
        op: 'link',
        source: 'n1',
        target: 'n2',
      }
      expect(mutation.op).toBe('link')
      expect(mutation.source).toBe('n1')
      expect(mutation.target).toBe('n2')
    })

    it('unlink op', () => {
      const mutation: GraphMutation = {
        op: 'unlink',
        source: 'n1',
        target: 'n2',
      }
      expect(mutation.op).toBe('unlink')
      expect(mutation.source).toBe('n1')
      expect(mutation.target).toBe('n2')
    })
  })

  describe('Type narrowing works on kind discriminator', () => {
    it('narrows to run-start type', () => {
      const evt: AgentEvt = {
        kind: 'run-start',
        runId: 'r1',
        nodeId: 'n1',
        workflow: 'draft',
      }
      if (isRunStart(evt)) {
        expect(evt.workflow).toBe('draft')
      }
    })

    it('narrows to step-start type', () => {
      const evt: AgentEvt = {
        kind: 'step-start',
        runId: 'r1',
        stepId: 's1',
        title: 'Parsing prompt',
      }
      if (isStepStart(evt)) {
        expect(evt.title).toBe('Parsing prompt')
      }
    })

    it('narrows to graph-mutation type', () => {
      const mutation: GraphMutation = {
        op: 'spawn',
        parentNodeId: 'n1',
        newNodeId: 'n2',
        title: 'Sub topic',
      }
      const evt: AgentEvt = {
        kind: 'graph-mutation',
        runId: 'r1',
        mutation,
      }
      if (isGraphMutation(evt)) {
        expect(evt.mutation.op).toBe('spawn')
      }
    })
  })
})
