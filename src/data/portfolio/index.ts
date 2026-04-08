/**
 * Данные для портфолио
 * Экспорт и функции для работы с портфолио
 */

import type { PortfolioProject } from '@/types'
import { portfolioProjects as rawProjects } from '../partitions'

export const portfolioProjects = rawProjects as unknown as PortfolioProject[]

/**
 * Получить все проекты
 */
export function getAllProjects(): PortfolioProject[] {
  return portfolioProjects
}

/**
 * Получить проект по ID
 */
export function getProjectById(id: number): PortfolioProject | undefined {
  return portfolioProjects.find((project) => project.id === id)
}

/**
 * Получить проекты по категории
 */
export function getProjectsByCategory(
  category: 'doors' | 'partitions' | 'combined'
): PortfolioProject[] {
  // Пока возвращаем все, можно добавить фильтрацию
  return portfolioProjects
}

/**
 * Получить последние проекты
 */
export function getLatestProjects(limit = 6): PortfolioProject[] {
  return portfolioProjects.slice(0, limit)
}
