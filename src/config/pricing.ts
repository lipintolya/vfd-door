// Базовые серии для конфиг (латинские ключи)
type PricingSeries = 'innova' | 'emalex' | 'urban' | 'linea' | 'invisible' | 'skinel' | 'atum' | 'atum_pro' | 'classic_art' | 'basic' | 'eco_shpon' | 'Атум' | 'Атум Про' | 'Бэйзик' | 'Классик Арт' | 'Эмалекс' | 'Урбан' | 'Иннова'

export interface PricingConfig {
  globalMultiplier: number
  series: {
    [key in PricingSeries]?: {
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
        default: 1.2,
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
    atum: {
      colorMultiplier: {
        white: 1,
        default: 1,
      },
    },
    atum_pro: {
      colorMultiplier: {
        white: 1,
        default: 1,
      },
    },
    classic_art: {
      colorMultiplier: {
        white: 1,
        default: 1,
      },
    },
    basic: {
      colorMultiplier: {
        white: 1,
        default: 1,
      },
    },
    eco_shpon: {
      colorMultiplier: {
        white: 1,
        default: 1,
      },
    },
  },
}
export const GLOBAL_PRICE_MULTIPLIER = pricingConfig.globalMultiplier

export const SERIES_RULES = pricingConfig.series