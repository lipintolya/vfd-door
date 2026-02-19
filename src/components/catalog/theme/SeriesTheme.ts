import type { DoorSeries } from '../types'

export interface SeriesTheme {
  accent: string
  fallbackImage?: string // Fallback изображение для серии
}

export const SERIES_THEME: Record<DoorSeries | "default", SeriesTheme> = {
  emalex: { accent: '#0000FF', fallbackImage: 'https://storage.yandexcloud.net/catalog-vfd/covers/emalex-cover.webp' },
  innova: { accent: '#EE204D', fallbackImage: 'https://storage.yandexcloud.net/catalog-vfd/covers/innova-cover.webp' },
  invisible: { accent: '#374151', fallbackImage: 'https://storage.yandexcloud.net/catalog-vfd/covers/invisible-cover.webp' },
  urban: { accent: '#0000FF', fallbackImage: 'https://storage.yandexcloud.net/catalog-vfd/covers/urban-cover.webp' },
  linea: { accent: '#0D9488', fallbackImage: 'https://storage.yandexcloud.net/catalog-vfd/covers/linea-cover.webp' },
  skinel: { accent: '#0D9488', fallbackImage: 'https://storage.yandexcloud.net/catalog-vfd/covers/skinel-cover.webp' },
  default: { accent: '#374151' }
}
