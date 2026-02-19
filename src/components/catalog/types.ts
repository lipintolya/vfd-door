/* src/components/catalog/types.ts */

/* =========================
   Теги
========================= */
export type Tag =
  | 'новинка'
  | 'акция'
  | 'скидка'
  | 'под заказ'
  | 'в наличии'
  | 'хит'

/* =========================
   Серии дверей
========================= */
export type DoorSeries =
  | 'innova'
  | 'emalex'
  | 'invisible'
  | 'urban'
  | 'linea'
  | 'skinel'

/* =========================
   Тип покрытия
========================= */
export type DoorCover =
  | 'strong-flex'
  | 'emalex'
  | 'emal'

/* =========================
   Цвет
========================= */
export interface Color {
  name: string
  hex: string
  image?: string   // <-- опционально, часто в данных отсутствует
}

/* =========================
   Элемент комплекта
========================= */
export interface DoorSetItem {
  name: string
  unit: 'шт' | 'комплект'
  price: number
  note?: string
  image?: string
  category?:
    | 'коробка'
    | 'наличник'
    | 'добор'
    | 'плинтус'
    | 'фурнитура'
}

/* =========================
   Дверь
========================= */
export interface Door {
  id: string
  cover: DoorCover
  series: DoorSeries
  model: string
  name: string
  material: string
  price: number

  thickness?: number
  tags: Tag[]

  sizes: {
    height: number[]
    width: number[]
  }

  colors: Color[]
  images?: string[]

  set?: DoorSetItem[]

  // Дополнительные опциональные поля — безопасно добавить
  description?: string
  docs?: { name: string; url: string }[]
}
