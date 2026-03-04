import type { Door, Color, DoorSeriesBase } from '@/components/catalog/types'
import { pricingConfig } from '@/config/pricing'

/**
 * Извлекает базовое название серии из формата "series/Серия" или возвращает как есть
 */
function getBaseSeries(series: string): DoorSeriesBase {
  const base = series.split('/')[0] as string
  return base as DoorSeriesBase
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
    const isWhite = color.name.toLowerCase().includes('white')

    colorMultiplier = isWhite
      ? seriesRule.colorMultiplier.white
      : seriesRule.colorMultiplier.default
  }

  return Math.round(base * global * colorMultiplier)
}

export function calculateSetPrice(
  door: Door,
  color?: Color,
  seriesMultipliers?: Record<string, number>
): number {
  const doorPrice = calculateDoorPrice(door, color)

  const defaultMultipliers: Record<string, number> = {
    innova: 1.5,
    emalex: 2,
    invisible: 2,
    urban: 1.7,
    linea: 1.85,
    skinel: 2
  }

  const multipliers = seriesMultipliers ?? defaultMultipliers
  const baseSeries = getBaseSeries(door.series)
  const multiplier = multipliers[baseSeries] ?? 1.8

  return Math.round(doorPrice * multiplier)
}