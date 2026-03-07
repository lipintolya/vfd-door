/**
 * SEO конфигурация
 * Центральное управление мета-тегами
 */

import type { SeoMeta } from '@/types'

export const DEFAULT_SEO: SeoMeta = {
  title: 'VFD Doors — Двери и перегородки в Челябинске',
  description:
    'Фирменный салон интерьерных решений VFD на Кашириных. Межкомнатные двери, алюминиевые перегородки от официального дилера. Изготовление, монтаж, гарантия.',
  keywords: [
    'двери Челябинск',
    'межкомнатные двери',
    'алюминиевые перегородки',
    'VFD Doors',
    'двери на Кашириных',
    'двери оптом',
    'двери в рассрочку',
  ],
  ogImage: '/og-image.jpg',
  canonical: 'https://vfd74.ru',
  noIndex: false,
}

export const PAGE_SEO: Record<string, SeoMeta> = {
  home: {
    title: 'VFD Doors — Главная | Двери и перегородки в Челябинске',
    description:
      'Официальный дилер VFD Doors. Межкомнатные двери и алюминиевые перегородки в Челябинске. Полный цикл: от замера до монтажа. Гарантия качества.',
  },
  catalog: {
    title: 'Каталог дверей | VFD Doors Челябинск',
    description:
      'Широкий выбор межкомнатных дверей VFD: серии Innova, Linea, Classic, Modern. Более 100 моделей в наличии и на заказ. Цены от производителя.',
  },
  partitions: {
    title: 'Алюминиевые перегородки | VFD Doors Челябинск',
    description:
      'Дизайнерские алюминиевые перегородки для зонирования. Раздвижные и распашные системы. Изготовление за 45 дней. Монтаж под ключ.',
  },
  portfolio: {
    title: 'Портфолио работ | VFD Doors Челябинск',
    description:
      'Фотографии реализованных проектов: установка дверей и перегородок в квартирах, домах и офисах. Более 30 выполненных работ.',
  },
  about: {
    title: 'О компании | VFD Doors Челябинск',
    description:
      'Работаем на рынке дверей с 2014 года. Официальный дилер VFD. Собственный монтажный отдел. Гарантия 2 года на продукцию и монтаж.',
  },
}

export function getPageSeo(page: string): SeoMeta {
  return {
    ...DEFAULT_SEO,
    ...PAGE_SEO[page],
  }
}

export function getProductSeo(
  productName: string,
  seriesName: string
): SeoMeta {
  return {
    ...DEFAULT_SEO,
    title: `${productName} — купить в Челябинске | ${seriesName} | VFD Doors`,
    description: `${productName} из серии ${seriesName}. Официальный дилер VFD. Доставка по Челябинску. Гарантия качества.`,
  }
}

export function getArticleSeo(
  title: string,
  excerpt: string
): SeoMeta {
  return {
    ...DEFAULT_SEO,
    title: `${title} | Блог VFD Doors`,
    description: excerpt.slice(0, 160),
  }
}
