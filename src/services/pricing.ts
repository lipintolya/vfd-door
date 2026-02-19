import type { Door, Color } from '@/components/catalog/types'
import { pricingConfig } from '@/config/pricing'

export function calculateDoorPrice(
  door: Door,
  color?: Color
): number {
  const base = door.price
  const global = pricingConfig.globalMultiplier ?? 1

  let colorMultiplier = 1

  const seriesRule = pricingConfig.series[door.series]

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
  const multiplier = multipliers[door.series] ?? 1.8

  return Math.round(doorPrice * multiplier)
}