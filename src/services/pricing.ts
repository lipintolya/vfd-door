import type { Door, Color } from '@/components/catalog/types'
import { pricingConfig } from '@/config/pricing'

/**
 * Маппинг русских названий серий на английские ключи
 */
const SERIES_KEY_MAP: Record<string, string> = {
  'Иннова': 'innova',
  'Эмалекс': 'emalex',
  'Emalex': 'emalex',
  'Скрытые': 'invisible',
  'скрытые': 'invisible',
  'Урбан': 'urban',
  'Urban': 'urban',
  'Линеа': 'linea',
  'Скинель': 'skinel',
  'Atum': 'atum',
  'Atum Pro': 'atum_pro',
  'Атум': 'atum',
  'Атум Про': 'atum_pro',
  'Classic Art': 'classic_art',
  'Классик Арт': 'classic_art',
  'Basic': 'basic',
  'Бэйзик': 'basic',
  'Эко шпон': 'eco_shpon',
}

type PricingKey = keyof typeof pricingConfig.series

/**
 * Извлекает базовое название серии для использования в pricingConfig
 * Поддерживает как английские, так и русские названия
 */
function getBaseSeries(series: string): PricingKey {
  // Проверяем, есть ли русское название в маппинге
  const mapped = SERIES_KEY_MAP[series]
  if (mapped && pricingConfig.series[mapped as PricingKey]) {
    return mapped as PricingKey
  }
  // Для старых данных с форматом "series/Серия"
  const base = series.split('/')[0] ?? series
  const mappedBase = (SERIES_KEY_MAP as Record<string, string | undefined>)[base]
  if (mappedBase && pricingConfig.series[mappedBase as PricingKey]) {
    return mappedBase as PricingKey
  }
  return 'innova'
}

export function calculateDoorPrice(
  door: Door,
  color?: Color
): number {
  const base = door.price
  const global = pricingConfig.globalMultiplier ?? 1

  let colorMultiplier = 1

  const baseSeries = getBaseSeries(door.series)
  const seriesRule = pricingConfig.series[baseSeries]

  if (seriesRule?.colorMultiplier && color) {
    const name = color.name.toLowerCase()
    const isWhite = name.includes('white') || name.includes('белый') || name.includes('снежный') || name.includes('ice')

    colorMultiplier = isWhite
      ? seriesRule.colorMultiplier.white
      : seriesRule.colorMultiplier.default
  }

  return Math.round(base * global * colorMultiplier)
}