# Neo4j Skill for Whitt Graph UI

Use this skill when working with Neo4j for the whitt graph UI domain. Covers data modeling, Cypher patterns, Docker instance management, and React client integration.

## Domain Graph Schema

### Node Labels

| Label | Purpose | Key Properties |
|-------|---------|----------------|
| `Workspace` | Top-level workspace container | `id: string`, `name: string`, `createdAt: datetime` |
| `Project` | Project within workspace | `id: string`, `name: string`, `workspaceId: string` |
| `Workflow` | Workflow definition and execution | `id: string`, `name: string`, `version: string`, `status: string`, `projectId: string` |
| `Step` | Individual workflow step | `id: string`, `name: string`, `workflowId: string`, `order: int` |
| `Hook` | Hook trigger and action configuration | `id: string`, `trigger: string`, `action: string`, `stepId: string` |
| `Task` | Executable task instance | `id: string`, `status: string`, `priority: string`, `createdAt: datetime`, `startedAt: datetime`, `completedAt: datetime`, `failedAt: datetime`, `retryCount: int` |
| `Tool` | Tool configuration and metadata | `id: string`, `name: string`, `type: string`, `config: map` |
| `Model` | Model routing and configuration | `id: string`, `name: string`, `provider: string`, `contextSize: int` |
| `Peer` | Swarm peer (machine) | `id: string`, `hostname: string`, `ip: string`, `status: string`, `load: float` |
| `Artifact` | Output artifact (file, blob, s3 reference) | `id: string`, `type: string`, `path: string`, `size: int`, `taskId: string` |
| `Schedule` | Scheduled task configuration | `id: string`, `cron: string`, `timezone: string`, `taskId: string` |
| `ApprovalRequest` | Human approval request | `id: string`, `taskId: string`, `requestedBy: string`, `status: string`, `requestedAt: datetime` |
| `RouterDecision` | Model routing decision | `id: string`, `taskId: string`, `modelId: string`, `confidence: float`, `reason: string` |

### Edge Types

| Edge Type | From → To | Purpose |
|-----------|-----------|---------|
| `ENQUEUED_BY` | Task → Workflow | Task enqueued by workflow |
| `DEPENDS_ON` | Task → Task | Task dependency |
| `PRODUCED` | Task → Artifact | Task produced artifact |
| `ROUTED_TO` | Task → Model | Task routed to model |
| `RUNNING_ON` | Task → Peer | Task running on peer |
| `APPROVED_BY` | ApprovalRequest → User | Approval approved by user |
| `FIRES_TRIGGER` | Step → Hook | Hook fires on step |
| `EXECUTES_ACTION` | Hook → Tool | Hook executes tool action |
| `HAS_STEP` | Workflow → Step | Workflow has step |
| `USES_MODEL` | Workflow → Model | Workflow uses model |

### Task States (10)

`NEW`, `QUEUED`, `SCHEDULED`, `LEASED`, `RUNNING`, `DONE`, `FAILED`, `DLQ`, `CANCELED`, `EXPIRED`

### Queue Categories (25)

`ASAP`, `WHENEVER`, `SCHEDULED`, `CRON`, `DEADLINE`, `RATE_LIMITED`, `INTERACTIVE`, `BACKGROUND`, `MAINTENANCE`, `MONITORING`, `TESTING`, `STAGING`, `PRODUCTION`, `EMERGENCY`, `BATCH`, `STREAMING`, `WORKFLOW`, `TOOL`, `MODEL`, `PEER`, `ARTIFACT`, `SCHEDULE`, `APPROVAL`, `ROUTER`, `DEFAULT`

### Hook Triggers (10) + Actions (12)

**Triggers**: `ON_START`, `ON_COMPLETE`, `ON_FAILURE`, `ON_RETRY`, `ON_CANCEL`, `ON_TIMEOUT`, `ON_DEQUEUE`, `ON_LEASE`, `ON_PROGRESS`, `ON_STATUS_CHANGE`

**Actions**: `LOG`, `NOTIFY`, `RETRY`, `CANCEL`, `ESCALATE`, `EMAIL`, `SLACK`, `WEBHOOK`, `METRIC`, `ARTIFACT`, `TOOL`, `MODEL`

## Cypher Patterns

### Failed Tasks (Last 24h)
```cypher
MATCH (t:Task {status: 'FAILED'})
WHERE t.failedAt > datetime() - duration('P1D')
RETURN t
ORDER BY t.failedAt DESC
LIMIT 100
```

### Trace Workflow Execution Path
```cypher
MATCH path = (w:Workflow)-[:HAS_STEP*]->(s:Step)-[:FIRES_TRIGGER]->(h:Hook)
WHERE w.id = $workflowId
RETURN path
```

### Find Similar Workflows for Router
```cypher
MATCH (w:Workflow)-[:USES_MODEL]->(m:Model)
WHERE m.id = $modelId
RETURN w
LIMIT 50
```

### Swarm Topology
```cypher
MATCH (p:Peer)-[:RUNNING_ON]->(t:Task)
WHERE t.status = 'RUNNING'
RETURN p.hostname AS peer, count(t) AS runningTasks
ORDER BY runningTasks DESC
```

### Task Dependencies
```cypher
MATCH (t:Task)-[:DEPENDS_ON]->(dep:Task)
WHERE t.id = $taskId
RETURN dep.id AS dependsOn, dep.status AS status
```

### Workflow Artifacts
```cypher
MATCH (w:Workflow)-[:HAS_STEP]->(:Step)-[:FIRES_TRIGGER]->(:Hook)-[:EXECUTES_ACTION]->(:Tool)<-[:PRODUCED]-(t:Task)-[:PRODUCED]->(a:Artifact)
WHERE w.id = $workflowId
RETURN DISTINCT a
```

### Approval Requests Pending
```cypher
MATCH (ar:ApprovalRequest {status: 'PENDING'})<-[:APPROVED_BY]-(u:User)
RETURN ar, u
ORDER BY ar.requestedAt DESC
LIMIT 50
```

### Router Decision History
```cypher
MATCH (rd:RouterDecision)-[:ROUTED_TO]->(m:Model)
WHERE rd.taskId = $taskId
RETURN rd, m
ORDER BY rd.confidence DESC
```

### Peer Load Distribution
```cypher
MATCH (p:Peer)-[:RUNNING_ON]->(t:Task {status: 'RUNNING'})
RETURN p.hostname AS peer, p.load AS currentLoad, count(t) AS taskCount
ORDER BY p.load DESC
```

## Local Docker Instance

### docker-compose.yml
```yaml
version: '3.8'
services:
  neo4j:
    image: neo4j:5.15-community
    container_name: whitt-neo4j
    ports:
      - "7474:7474"
      - "7687:7687"
    environment:
      - NEO4J_AUTH=neo4j/password
      - NEO4J_PLUGINS=["apoc"]
      - NEO4J_dbms_security_procedures_unrestricted=apoc.*
    volumes:
      - neo4j_data:/data
      - neo4j_logs:/logs
      - neo4j_import:/import
      - neo4j_plugins:/plugins

volumes:
  neo4j_data:
  neo4j_logs:
  neo4j_import:
  neo4j_plugins:
```

### .env
```env
NEO4J_AUTH=neo4j/password
NEO4J_PLUGINS=["apoc"]
NEO4J_dbms_security_procedures_unrestricted=apoc.*
```

### Default Credentials
- Username: `neo4j`
- Password: `password` (dev only, change for any non-localhost)

### URLs
- Browser: http://localhost:7474
- Bolt: bolt://localhost:7687

### Seed Data (seed.cypher)
```cypher
// Workspace
CREATE (w:Workspace {id: 'ws_001', name: 'Default Workspace', createdAt: datetime()})

// Project
CREATE (p:Project {id: 'prj_001', name: 'Sample Project', workspaceId: 'ws_001', createdAt: datetime()})

// Model
CREATE (m:Model {id: 'model_001', name: 'Llama-3-8B', provider: 'ollama', contextSize: 8192})

// Workflow
CREATE (wf:Workflow {id: 'wf_001', name: 'Sample Workflow', version: '1.0', status: 'ACTIVE', projectId: 'prj_001', createdAt: datetime()})
CREATE (wf)-[:USES_MODEL]->(m)

// Steps
CREATE (s1:Step {id: 'step_001', name: 'Fetch Data', workflowId: 'wf_001', order: 1})
CREATE (s2:Step {id: 'step_002', name: 'Process Data', workflowId: 'wf_001', order: 2})
CREATE (s3:Step {id: 'step_003', name: 'Generate Report', workflowId: 'wf_001', order: 3})

CREATE (wf)-[:HAS_STEP]->(s1)
CREATE (wf)-[:HAS_STEP]->(s2)
CREATE (wf)-[:HAS_STEP]->(s3)

// Hooks
CREATE (h1:Hook {id: 'hook_001', trigger: 'ON_COMPLETE', action: 'LOG', stepId: 'step_001'})
CREATE (h2:Hook {id: 'hook_002', trigger: 'ON_FAILURE', action: 'NOTIFY', stepId: 'step_002'})

CREATE (s1)-[:FIRES_TRIGGER]->(h1)
CREATE (s2)-[:FIRES_TRIGGER]->(h2)

// Return summary
MATCH (w:Workspace)-[:HAS_PROJECT]->(p:Project)-[:HAS_WORKFLOW]->(wf:Workflow)-[:HAS_STEP]->(s:Step)
OPTIONAL MATCH (s)-[:FIRES_TRIGGER]->(h:Hook)
RETURN w, p, wf, s, h
```

## Integration with Whitt

### React Client Setup

```bash
npm install neo4j-driver
```

```typescript
import neo4j from 'neo4j-driver';

const driver = neo4j.driver(
  'bolt://localhost:7687',
  neo4j.auth.basic('neo4j', 'password')
);

// Per-request session (never hold open across renders)
async function query(cypher: string, params: Record<string, any>) {
  const session = driver.session();
  try {
    const result = await session.run(cypher, params);
    return result.records.map(record => record.toObject());
  } finally {
    await session.close();
  }
}

// Stream consumption for large results
async function streamQuery(cypher: string, params: Record<string, any>) {
  const session = driver.session();
  try {
    const result = await session.run(cypher, params);
    const records = [];
    return new Promise((resolve, reject) => {
      result.subscribe({
        onNext: record => records.push(record.toObject()),
        onCompleted: () => {
          session.close();
          resolve(records);
        },
        onError: error => {
          session.close();
          reject(error);
        }
      });
    });
  } catch (error) {
    session.close();
    throw error;
  }
}
```

### TypeScript Interfaces

```typescript
interface Node {
  id: string;
  createdAt?: Date;
}

interface Workspace extends Node {
  name: string;
}

interface Project extends Node {
  name: string;
  workspaceId: string;
}

interface Workflow extends Node {
  name: string;
  version: string;
  status: string;
  projectId: string;
}

interface Step extends Node {
  name: string;
  workflowId: string;
  order: number;
}

interface Hook extends Node {
  trigger: string;
  action: string;
  stepId: string;
}

interface Task extends Node {
  status: 'NEW' | 'QUEUED' | 'SCHEDULED' | 'LEASED' | 'RUNNING' | 'DONE' | 'FAILED' | 'DLQ' | 'CANCELED' | 'EXPIRED';
  priority: string;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  failedAt?: Date;
  retryCount: number;
}

interface Model extends Node {
  name: string;
  provider: string;
  contextSize: number;
}

interface Peer extends Node {
  hostname: string;
  ip: string;
  status: string;
  load: number;
}

interface Artifact extends Node {
  type: string;
  path: string;
  size: number;
  taskId: string;
}

interface Schedule extends Node {
  cron: string;
  timezone: string;
  taskId: string;
}

interface ApprovalRequest extends Node {
  taskId: string;
  requestedBy: string;
  status: string;
  requestedAt: Date;
}

interface RouterDecision extends Node {
  taskId: string;
  modelId: string;
  confidence: number;
  reason: string;
}
```

## Performance

### Indexes
```cypher
CREATE INDEX task_status_index FOR (n:Task) ON (n.status);
CREATE INDEX workflow_id_index FOR (n:Workflow) ON (n.id);
CREATE INDEX task_created_at_index FOR (n:Task) ON (n.createdAt);
CREATE INDEX project_workspace_id_index FOR (n:Project) ON (n.workspaceId);
CREATE INDEX peer_status_index FOR (n:Peer) ON (n.status);
CREATE INDEX router_decision_task_id_index FOR (n:RouterDecision) ON (n.taskId);
```

### Constraints
```cypher
CREATE CONSTRAINT workflow_id_unique FOR (w:Workflow) REQUIRE w.id IS UNIQUE;
CREATE CONSTRAINT task_id_unique FOR (t:Task) REQUIRE t.id IS UNIQUE;
CREATE CONSTRAINT peer_id_unique FOR (p:Peer) REQUIRE p.id IS UNIQUE;
CREATE CONSTRAINT model_id_unique FOR (m:Model) REQUIRE m.id IS UNIQUE;
```

### Pagination
Always use `LIMIT` for non-streaming queries:
```cypher
MATCH (t:Task)
RETURN t
ORDER BY t.createdAt DESC
LIMIT 100
SKIP 0
```

For streaming, use `Result.subscribe()` instead of `Result.then()`.

## Anti-Patterns to Avoid

1. **Don't store large blobs** - Use `Artifact` node + s3/file path reference
2. **Don't model enums as nodes** - Use string properties (`status: 'FAILED'`)
3. **Don't query deeper than 4 hops** without an index hint
4. **Don't hold sessions open** - One session per request, always close
5. **Don't ignore APOC** - Use `apoc.*` procedures for batch operations
6. **Don't skip constraints** - Always define uniqueness constraints
7. **Don't use `MATCH (n)` without filters** - Always filter by label and property
8. **Don't forget transaction boundaries** - Group related writes in transactions
9. **Don't ignore connection pooling** - Configure driver pool settings for production
10. **Don't use `bolt://` in production** - Use `bolt+s://` with TLS