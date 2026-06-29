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
