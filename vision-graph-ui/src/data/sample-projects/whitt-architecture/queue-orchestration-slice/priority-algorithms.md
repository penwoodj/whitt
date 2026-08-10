---
id: e9f0a1b2-c3d4-5678-2345-789012345678
title: Priority Algorithms
parent: ./index.md
children:
created_at: 2026-08-09T00:00:00Z
updated_at: 2026-08-09T00:00:00Z
status: done
focus_jump:
---

# Priority Algorithms

Priority algorithms determine task execution order in Whitt's queue orchestration system, balancing multiple factors to optimize throughput and meet user expectations.

## Multi-Factor Priority Scoring

### Priority Factors
Comprehensive priority calculation:
```typescript
interface PriorityFactors {
  userPriority: number // 1-10, user-specified importance
  age: number // Milliseconds since task creation
  deadline?: Date // Optional deadline for time-sensitive tasks
  dependencies: number // Number of unsatisfied dependencies
  estimatedDuration: number // Expected execution time in ms
  resourceRequirements: ResourceRequirements // CPU, memory, GPU needs
  retryCount: number // Number of previous retry attempts
  category: TaskCategory // Task type for category-based prioritization
  userTier: UserTier // User service level (free, pro, enterprise)
}

interface PriorityScore {
  total: number // 0-100 final score
  components: {
    userPriority: number
    urgency: number
    readiness: number
    efficiency: number
    fairness: number
  }
  metadata: {
    calculatedAt: Date
    factors: PriorityFactors
  }
}
```

### Scoring Algorithm
Weighted priority calculation:
```typescript
function calculatePriorityScore(factors: PriorityFactors): PriorityScore {
  const components = {
    userPriority: calculateUserPriorityScore(factors),
    urgency: calculateUrgencyScore(factors),
    readiness: calculateReadinessScore(factors),
    efficiency: calculateEfficiencyScore(factors),
    fairness: calculateFairnessScore(factors)
  }
  
  // Weighted combination (weights sum to 1.0)
  const weights = {
    userPriority: 0.35,
    urgency: 0.25,
    readiness: 0.20,
    efficiency: 0.10,
    fairness: 0.10
  }
  
  const total = 
    components.userPriority * weights.userPriority +
    components.urgency * weights.urgency +
    components.readiness * weights.readiness +
    components.efficiency * weights.efficiency +
    components.fairness * weights.fairness
  
  return {
    total: Math.min(Math.max(total, 0), 100), // Clamp to 0-100
    components,
    metadata: {
      calculatedAt: new Date(),
      factors
    }
  }
}

function calculateUserPriorityScore(factors: PriorityFactors): number {
  // User priority 1-10 maps to 0-100, scaled by tier multiplier
  const tierMultiplier = {
    'enterprise': 1.2,
    'pro': 1.0,
    'free': 0.8
  }[factors.userTier]
  
  return (factors.userPriority / 10) * 100 * tierMultiplier
}

function calculateUrgencyScore(factors: PriorityFactors): number {
  if (!factors.deadline) return 0 // No deadline = no urgency
  
  const now = Date.now()
  const deadline = factors.deadline.getTime()
  const timeUntilDeadline = deadline - now
  
  if (timeUntilDeadline <= 0) return 100 // Overdue = maximum urgency
  
  // Calculate urgency based on proximity to deadline
  const hoursUntilDeadline = timeUntilDeadline / (1000 * 60 * 60)
  
  if (hoursUntilDeadline < 1) return 100 // Less than 1 hour = critical
  if (hoursUntilDeadline < 6) return 80 // Less than 6 hours = high
  if (hoursUntilDeadline < 24) return 60 // Less than 1 day = medium
  if (hoursUntilDeadline < 72) return 40 // Less than 3 days = low
  
  return 20 // More than 3 days = minimal urgency
}

function calculateReadinessScore(factors: PriorityFactors): number {
  // Fewer dependencies = higher readiness
  const maxDependencies = 10
  const dependencyScore = ((maxDependencies - factors.dependencies) / maxDependencies) * 100
  
  // Fewer retries = higher readiness (indicates stability)
  const retryPenalty = Math.min(factors.retryCount * 10, 50)
  
  return Math.max(0, dependencyScore - retryPenalty)
}

function calculateEfficiencyScore(factors: PriorityFactors): number {
  // Shorter tasks = higher efficiency (better for throughput)
  const maxDuration = 3600000 // 1 hour
  const durationScore = ((maxDuration - Math.min(factors.estimatedDuration, maxDuration)) / maxDuration) * 100
  
  // Lower resource requirements = higher efficiency
  const resourceScore = calculateResourceEfficiency(factors.resourceRequirements)
  
  return (durationScore + resourceScore) / 2
}

function calculateFairnessScore(factors: PriorityFactors): number {
  // Age-based fairness: older tasks get priority
  const maxAge = 86400000 // 24 hours
  const ageScore = Math.min(factors.age / maxAge, 1) * 100
  
  return ageScore
}
```

## Scheduling Strategies

### Adaptive Scheduling
Dynamic strategy selection:
```typescript
class AdaptiveScheduler {
  private strategies: Map<string, SchedulingStrategy>
  private performanceMetrics: StrategyPerformance
  
  selectStrategy(systemState: SystemState): SchedulingStrategy {
    // High load -> use efficiency-focused strategy
    if (systemState.cpuUsage > 80 || systemState.memoryUsage > 85) {
      return this.strategies.get('efficiency-first')!
    }
    
    // Many overdue tasks -> use urgency-focused strategy
    if (systemState.overdueTaskCount > 10) {
      return this.strategies.get('urgency-first')!
    }
    
    // High user wait times -> use fairness-focused strategy
    if (systemState.averageWaitTime > 300000) { // 5 minutes
      return this.strategies.get('fairness-first')!
    }
    
    // Default balanced strategy
    return this.strategies.get('balanced')!
  }
}
```

### Strategy Implementations

#### Priority Queue Strategy
Classic priority-based scheduling:
```typescript
class PriorityQueueStrategy implements SchedulingStrategy {
  private queue: PriorityQueue<Task>
  
  async schedule(task: Task): Promise<void> {
    const score = calculatePriorityScore(task.priorityFactors)
    task.priorityScore = score
    
    this.queue.enqueue(task)
  }
  
  async getNextTask(): Promise<Task | null> {
    return this.queue.dequeue()
  }
  
  getQueueLength(): number {
    return this.queue.size()
  }
}
```

#### Fair Share Strategy
Balance across users and categories:
```typescript
class FairShareStrategy implements SchedulingStrategy {
  private userQueues: Map<string, PriorityQueue<Task>>
  private categoryQueues: Map<string, PriorityQueue<Task>>
  private userQuotas: Map<string, number>
  private categoryQuotas: Map<string, number>
  
  async schedule(task: Task): Promise<void> {
    this.ensureQueueExists(task.userId, task.category)
    
    const userQueue = this.userQueues.get(task.userId)!
    const categoryQueue = this.categoryQueues.get(task.category)!
    
    const score = calculatePriorityScore(task.priorityFactors)
    task.priorityScore = score
    
    userQueue.enqueue(task)
    categoryQueue.enqueue(task)
  }
  
  async getNextTask(): Promise<Task | null> {
    // Try to get task from under-served user
    const underServedUser = this.findUnderServedUser()
    if (underServedUser) {
      const task = this.userQueues.get(underServedUser)?.dequeue()
      if (task) return task
    }
    
    // Fall back to category-based selection
    const category = this.selectCategoryByFairness()
    return this.categoryQueues.get(category)?.dequeue() || null
  }
  
  private findUnderServedUser(): string | null {
    let minUsage = Infinity
    let underServedUser: string | null = null
    
    for (const [userId, queue] of this.userQueues.entries()) {
      const quota = this.userQuotas.get(userId) || 10
      const usage = this.getUserUsage(userId)
      const utilization = usage / quota
      
      if (utilization < minUsage && queue.size() > 0) {
        minUsage = utilization
        underServedUser = userId
      }
    }
    
    return underServedUser
  }
}
```

#### Deadline-Driven Strategy
Prioritize time-sensitive tasks:
```typescript
class DeadlineDrivenStrategy implements SchedulingStrategy {
  private deadlineQueue: PriorityQueue<Task>
  private regularQueue: PriorityQueue<Task>
  
  async schedule(task: Task): Promise<void> {
    const score = calculatePriorityScore(task.priorityFactors)
    task.priorityScore = score
    
    if (task.priorityFactors.deadline) {
      this.deadlineQueue.enqueue(task)
    } else {
      this.regularQueue.enqueue(task)
    }
  }
  
  async getNextTask(): Promise<Task | null> {
    // Always check deadline queue first
    const deadlineTask = this.deadlineQueue.peek()
    
    if (deadlineTask && this.isUrgent(deadlineTask)) {
      return this.deadlineQueue.dequeue()
    }
    
    // Compare top tasks from both queues
    const regularTask = this.regularQueue.peek()
    
    if (!deadlineTask) return this.regularQueue.dequeue()
    if (!regularTask) return this.deadlineQueue.dequeue()
    
    // Choose task with higher priority score
    return deadlineTask.priorityScore.total >= regularTask.priorityScore.total
      ? this.deadlineQueue.dequeue()
      : this.regularQueue.dequeue()
  }
  
  private isUrgent(task: Task): boolean {
    if (!task.priorityFactors.deadline) return false
    
    const timeUntilDeadline = task.priorityFactors.deadline.getTime() - Date.now()
    return timeUntilDeadline < 3600000 // Less than 1 hour
  }
}
```

## Dynamic Priority Adjustment

### Real-Time Recalculation
Update priorities based on changing conditions:
```typescript
class DynamicPriorityAdjuster {
  private adjustmentInterval: number = 60000 // 1 minute
  private adjustmentTimer: NodeJS.Timeout | null = null
  
  start(): void {
    this.adjustmentTimer = setInterval(() => {
      this.adjustAllPriorities()
    }, this.adjustmentInterval)
  }
  
  stop(): void {
    if (this.adjustmentTimer) {
      clearInterval(this.adjustmentTimer)
      this.adjustmentTimer = null
    }
  }
  
  private async adjustAllPriorities(): Promise<void> {
    const tasks = await this.getAllQueuedTasks()
    
    for (const task of tasks) {
      const oldScore = task.priorityScore
      const newScore = calculatePriorityScore({
        ...task.priorityFactors,
        age: Date.now() - task.createdAt.getTime()
      })
      
      // Only update if score changed significantly
      if (Math.abs(newScore.total - oldScore.total) > 5) {
        task.priorityScore = newScore
        await this.updateTaskPosition(task)
      }
    }
  }
}
```

### Context-Aware Adjustment
Adapt to system conditions:
```typescript
class ContextAwareAdjuster {
  adjustPrioritiesByLoad(tasks: Task[], systemLoad: SystemLoad): Task[] {
    const adjustmentFactor = this.calculateLoadFactor(systemLoad)
    
    return tasks.map(task => {
      const adjustedScore = {
        ...task.priorityScore,
        total: task.priorityScore.total * adjustmentFactor
      }
      
      return {
        ...task,
        priorityScore: adjustedScore
      }
    })
  }
  
  private calculateLoadFactor(load: SystemLoad): number {
    if (load.cpuUsage < 50 && load.memoryUsage < 60) {
      return 1.0 // Normal load, no adjustment
    }
    
    if (load.cpuUsage < 80 && load.memoryUsage < 85) {
      return 0.9 // Moderate load, slight priority reduction
    }
    
    return 0.8 // High load, reduce priority to prevent overload
  }
}
```

Priority algorithms in Whitt provide intelligent task scheduling that balances user priorities, system efficiency, and fairness to optimize overall workflow performance.