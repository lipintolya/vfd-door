/**
 * Конфигурация приложения
 * @see https://vuejs.org/guide/best-practices/production-deployment.html
 */

export * from './constants'
export * from './seo'

// Environment validation
export const ENV = {
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
  isTest: import.meta.env.MODE === 'test',
} as const

// Feature flags
export const FEATURES = {
  ENABLE_ANALYTICS: import.meta.env.PROD,
  ENABLE_DEV_TOOLS: import.meta.env.DEV,
  ENABLE_CONSOLE_LOGS: import.meta.env.DEV,
} as const
