/**
 * Данные для каталога дверей
 * Импортируются из JSON и типизируются
 */

import type { Door, Series, Color, Tag } from '@/types'
import catalogJson from '@/data/doors.json'

// Приведение JSON к типизированному виду
export const doorsCatalog = catalogJson as unknown as Door[]

/**
 * Получить все двери
 */
export function getAllDoors(): Door[] {
  return doorsCatalog
}

/**
 * Получить двери по серии
 */
export function getDoorsBySeries(seriesSlug: string): Door[] {
  const normalized = seriesSlug.toLowerCase()
  return doorsCatalog.filter(
    (door) => door.series.toLowerCase().includes(normalized)
  )
}

/**
 * Получить дверь по ID
 */
export function getDoorById(id: number): Door | undefined {
  return doorsCatalog.find((door) => door.id === id)
}

/**
 * Получить популярные двери
 */
export function getPopularDoors(limit = 4): Door[] {
  return doorsCatalog
    .filter((door) => door.isPopular)
    .slice(0, limit)
}

/**
 * Получить новые двери
 */
export function getNewDoors(limit = 4): Door[] {
  return doorsCatalog
    .filter((door) => door.isNew)
    .slice(0, limit)
}

/**
 * Получить двери с тегом
 */
export function getDoorsByTag(tag: Tag): Door[] {
  return doorsCatalog.filter((door) => door.tags?.includes(tag))
}

/**
 * Получить все уникальные серии
 */
export function getAllSeries(): string[] {
  const seriesSet = new Set(doorsCatalog.map((door) => door.series))
  return Array.from(seriesSet)
}

/**
 * Получить все цвета из каталога
 */
export function getAllColors(): Color[] {
  const colorMap = new Map<string, Color>()

  doorsCatalog.forEach((door) => {
    door.colors.forEach((color) => {
      if (!colorMap.has(color.name)) {
        colorMap.set(color.name, color)
      }
    })
  })

  return Array.from(colorMap.values())
}

/**
 * Фильтровать двери по параметрам
 */
export function filterDoors(params: {
  search?: string
  series?: string[]
  colors?: string[]
  tags?: Tag[]
  priceMin?: number
  priceMax?: number
}): Door[] {
  return doorsCatalog.filter((door) => {
    // Поиск по названию
    if (params.search) {
      const search = params.search.toLowerCase()
      const matchesName = door.name.toLowerCase().includes(search)
      const matchesDescription =
        door.description.toLowerCase().includes(search)
      if (!matchesName && !matchesDescription) return false
    }

    // Фильтр по серии
    if (params.series?.length) {
      const matchesSeries = params.series.some((series) =>
        door.series.toLowerCase().includes(series.toLowerCase())
      )
      if (!matchesSeries) return false
    }

    // Фильтр по цветам
    if (params.colors?.length) {
      const doorColors = door.colors.map((c) => c.name.toLowerCase())
      const matchesColors = params.colors.some((color) =>
        doorColors.includes(color.toLowerCase())
      )
      if (!matchesColors) return false
    }

    // Фильтр по тегам
    if (params.tags?.length) {
      const matchesTags = params.tags.some((tag) => door.tags?.includes(tag))
      if (!matchesTags) return false
    }

    // Фильтр по цене
    if (params.priceMin !== undefined && door.price < params.priceMin) {
      return false
    }
    if (params.priceMax !== undefined && door.price > params.priceMax) {
      return false
    }

    return true
  })
}

/**
 * Сортировать двери
 */
export function sortDoors(
  doors: Door[],
  sort: 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc' | 'newest' | 'popular'
): Door[] {
  const sorted = [...doors]

  switch (sort) {
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price)
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price)
    case 'name-asc':
      return sorted.sort((a, b) => a.name.localeCompare(b.name))
    case 'name-desc':
      return sorted.sort((a, b) => b.name.localeCompare(a.name))
    case 'popular':
      return sorted.sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0))
    case 'newest':
      return sorted.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0))
    default:
      return sorted
  }
}
