import logsConfig from './logs.config.json'

type LogLevel = 'silent' | 'error' | 'warn' | 'info' | 'debug' | 'trace'

const LEVEL_RANK: Record<LogLevel, number> = {
  silent: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4,
  trace: 5,
}

const isLevelAtLeast = (threshold: LogLevel, candidate: LogLevel): boolean =>
  LEVEL_RANK[candidate] <= LEVEL_RANK[threshold]

const resolveModuleLevel = (moduleName: string): LogLevel => {
  const configuredLevel = (logsConfig.modules as Record<string, LogLevel>)[moduleName]
  return configuredLevel ?? (logsConfig.rootLevel as LogLevel)
}

const formatMessage = (level: LogLevel, moduleName: string, message: string, data?: unknown): string => {
  const timestamp = new Date().toISOString()
  const baseLog = `[${timestamp}] ${level.toUpperCase()} [${moduleName}] ${message}`
  return data === undefined ? baseLog : `${baseLog} ${JSON.stringify(data)}`
}

const emitLog = (level: LogLevel, formatted: string): void => {
  const shouldUseConsole = (logsConfig.transports as string[]).includes('console')
  if (!shouldUseConsole) return

  const consoleMethod = level === 'error' ? console.error : level === 'warn' ? console.warn : console.log
  consoleMethod(formatted)
}

const createModuleLogger = (moduleName: string) => {
  const logAt = (level: LogLevel, message: string, data?: unknown): void => {
    const moduleLevel = resolveModuleLevel(moduleName)
    const shouldLog = isLevelAtLeast(moduleLevel, level)
    if (!shouldLog) return
    const formatted = formatMessage(level, moduleName, message, data)
    emitLog(level, formatted)
  }

  return {
    error: (message: string, data?: unknown) => logAt('error', message, data),
    warn: (message: string, data?: unknown) => logAt('warn', message, data),
    info: (message: string, data?: unknown) => logAt('info', message, data),
    debug: (message: string, data?: unknown) => logAt('debug', message, data),
    trace: (message: string, data?: unknown) => logAt('trace', message, data),
  }
}

type ModuleLogger = ReturnType<typeof createModuleLogger>

const noopLogger: ModuleLogger = {
  error: () => {},
  warn: () => {},
  info: () => {},
  debug: () => {},
  trace: () => {},
}

const isProduction = import.meta.env.PROD

export const log = (moduleName: string): ModuleLogger =>
  isProduction ? noopLogger : createModuleLogger(moduleName)

export const withLogConfig = <T>(config: typeof logsConfig, fn: () => T): T => {
  const originalConfig = logsConfig
  Object.assign(logsConfig, config)
  try {
    return fn()
  } finally {
    Object.assign(logsConfig, originalConfig)
  }
}
