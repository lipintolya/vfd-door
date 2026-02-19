import type { DoorSeries } from '@/components/catalog/types'

export interface PricingConfig {
  globalMultiplier: number
  series: {
    [key in DoorSeries]?: {
      colorMultiplier: {
        white: number
        default: number
      }
    }
  }
}

export const pricingConfig: PricingConfig = {
  /**
   * Глобальное изменение цен
   * +4% = 1.04
   */
  globalMultiplier: 1,

  /**
   * Правила по сериям
   */
  series: {
    innova: {
      colorMultiplier: {
        white: 1,
        default: 1.2, // +20% ко всем цветам кроме white
      },
    },
    emalex: {
      colorMultiplier: {
        white: 1,
        default: 1,
      },
    },
    urban: {
      colorMultiplier: {
        white: 1,
        default: 1,
      },
    },
    linea: {
      colorMultiplier: {
        white: 1,
        default: 1,
      },
    },
    invisible: {
      colorMultiplier: {
        white: 1,
        default: 1,
      },
    },
    skinel: {
      colorMultiplier: {
        white: 1,
        default: 1,
      },
    },
  },
}
export const GLOBAL_PRICE_MULTIPLIER = pricingConfig.globalMultiplier

export const SERIES_RULES = pricingConfig.series