/**
 * Данные для статей и блога
 */

import type { Article } from '@/types'
import articlesData from '@/data/articles.json'

export const articles = articlesData as unknown as Article[]

/**
 * Получить все статьи
 */
export function getAllArticles(): Article[] {
  return articles
}

/**
 * Получить статью по slug
 */
export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((article) => article.slug === slug)
}

/**
 * Получить статьи по категории
 */
export function getArticlesByCategory(
  category: string
): Article[] {
  return articles.filter((article) => article.category === category)
}

/**
 * Получить последние статьи
 */
export function getLatestArticles(limit = 3): Article[] {
  return articles.slice(0, limit)
}

/**
 * Получить популярные статьи
 */
export function getPopularArticles(limit = 3): Article[] {
  // Пока возвращаем первые, можно добавить счётчик просмотров
  return articles.slice(0, limit)
}
