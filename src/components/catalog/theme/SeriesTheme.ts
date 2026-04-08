import type { DoorSeries } from '../types'

export interface SeriesTheme {
  accent: string
  fallbackImage?: string
}

export const SERIES_THEME: Record<DoorSeries | "default", SeriesTheme> = {
  // English keys (DoorSeriesBase)
  atum: { accent: '#0D9488', fallbackImage: 'https://storage.yandexcloud.net/catalog-vfd/covers/atum-cover.webp' },
  atum_pro: { accent: '#0F766E', fallbackImage: 'https://storage.yandexcloud.net/catalog-vfd/covers/atum-pro-cover.webp' },
  classic_art: { accent: '#B45309', fallbackImage: 'https://storage.yandexcloud.net/catalog-vfd/covers/classic-art-cover.webp' },
  emalex: { accent: '#0D9488', fallbackImage: 'https://storage.yandexcloud.net/catalog-vfd/covers/emalex-cover.webp' },
  urban: { accent: '#6366F1', fallbackImage: 'https://storage.yandexcloud.net/catalog-vfd/covers/urban-cover.webp' },
  basic: { accent: '#6B7280', fallbackImage: 'https://storage.yandexcloud.net/catalog-vfd/covers/basic-cover.webp' },
  eco_shpon: { accent: '#65A30D', fallbackImage: 'https://storage.yandexcloud.net/catalog-vfd/covers/eco-shpon-cover.webp' },
  innova: { accent: '#EE204D', fallbackImage: 'https://storage.yandexcloud.net/catalog-vfd/covers/innova-cover.webp' },
  invisible: { accent: '#374151', fallbackImage: 'https://storage.yandexcloud.net/catalog-vfd/covers/invisible-cover.webp' },
  linea: { accent: '#0D9488', fallbackImage: 'https://storage.yandexcloud.net/catalog-vfd/covers/linea-cover.webp' },
  skinel: { accent: '#0D9488', fallbackImage: 'https://storage.yandexcloud.net/catalog-vfd/covers/skinel-cover.webp' },

  // Русские и смешанные названия
  'Atum': { accent: '#0D9488', fallbackImage: 'https://storage.yandexcloud.net/catalog-vfd/covers/atum-cover.webp' },
  'Atum Pro': { accent: '#0F766E', fallbackImage: 'https://storage.yandexcloud.net/catalog-vfd/covers/atum-pro-cover.webp' },
  'Classic Art': { accent: '#B45309', fallbackImage: 'https://storage.yandexcloud.net/catalog-vfd/covers/classic-art-cover.webp' },
  'Emalex': { accent: '#0D9488', fallbackImage: 'https://storage.yandexcloud.net/catalog-vfd/covers/emalex-cover.webp' },
  'Urban': { accent: '#6366F1', fallbackImage: 'https://storage.yandexcloud.net/catalog-vfd/covers/urban-cover.webp' },
  'Basic': { accent: '#6B7280', fallbackImage: 'https://storage.yandexcloud.net/catalog-vfd/covers/basic-cover.webp' },
  'Эко шпон': { accent: '#65A30D', fallbackImage: 'https://storage.yandexcloud.net/catalog-vfd/covers/eco-shpon-cover.webp' },
  'Атум': { accent: '#0D9488', fallbackImage: 'https://storage.yandexcloud.net/catalog-vfd/covers/atum-cover.webp' },
  'Атум Про': { accent: '#0F766E', fallbackImage: 'https://storage.yandexcloud.net/catalog-vfd/covers/atum-pro-cover.webp' },
  'Классик Арт': { accent: '#B45309', fallbackImage: 'https://storage.yandexcloud.net/catalog-vfd/covers/classic-art-cover.webp' },
  'Бэйзик': { accent: '#6B7280', fallbackImage: 'https://storage.yandexcloud.net/catalog-vfd/covers/basic-cover.webp' },
  'Иннова': { accent: '#EE204D', fallbackImage: 'https://storage.yandexcloud.net/catalog-vfd/covers/innova-cover.webp' },
  'Эмалекс': { accent: '#0D9488', fallbackImage: 'https://storage.yandexcloud.net/catalog-vfd/covers/emalex-cover.webp' },
  'Скрытые': { accent: '#374151', fallbackImage: 'https://storage.yandexcloud.net/catalog-vfd/covers/invisible-cover.webp' },
  'скрытые': { accent: '#374151', fallbackImage: 'https://storage.yandexcloud.net/catalog-vfd/covers/invisible-cover.webp' },
  'Урбан': { accent: '#6366F1', fallbackImage: 'https://storage.yandexcloud.net/catalog-vfd/covers/urban-cover.webp' },
  'Линеа': { accent: '#0D9488', fallbackImage: 'https://storage.yandexcloud.net/catalog-vfd/covers/linea-cover.webp' },
  'Скинель': { accent: '#0D9488', fallbackImage: 'https://storage.yandexcloud.net/catalog-vfd/covers/skinel-cover.webp' },

  default: { accent: '#374151' }
}
