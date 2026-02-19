import { computed } from 'vue'
import { SERIES_THEME } from './SeriesTheme'
import type { DoorSeries } from '../types'

export function useSeriesTheme(series: DoorSeries) {
  return computed(() => {
    return SERIES_THEME[series] ?? SERIES_THEME.default
  })
}
