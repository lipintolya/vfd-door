export interface CatalogCardItem {
  id: string
  slug: string
  name: string
  series: string
  seriesSlug: string
  coating: string
  coatingSlug: string
  colorName: string
  colorHex: string
  /** Все цвета, в которых реально доступна эта модель — для корректной фильтрации по цвету */
  colorNames: string[]
  /** Те же цвета с hex/ценой/фото — рядок свотчей на карточке переключает
      обложку и цену прямо в каталоге, без захода в товар */
  colorSwatches: { name: string; hex: string; price: number | null; photo: string }[]
  photo: string
  price: number | null
  hasGlass: boolean
}

export interface CatalogFilterOption {
  label: string
  value: string
  color?: string
  count?: number
}

export type CatalogSort = 'price_asc' | 'price_desc' | 'name'
