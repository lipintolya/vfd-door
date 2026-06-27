# Страница товара: фото, терминология покрытия, цены на погонаж

Дата: 2026-06-27

## Контекст

Три независимых правки на странице карточки товара (`/models/[slug]`):

1. Фото двери растягивается на всю высоту блока (`aspect-ratio: 3/4` + `object-fit: cover` в [ProductColorPicker.vue](../../../src/components/catalog/ProductColorPicker.vue)), из-за чего цена и CTA уезжают за пределы экрана без скролла.
2. Покрытие «Эмалекс» описано в данных как «эмаль + лак» ([series-descriptions.ts](../../../src/data/series-descriptions.ts)), что фактически неверно: эмалекс — полипропиленовое покрытие, имитирующее эмаль, а не сама эмаль.
3. Клиент не видит на странице товара полную стоимость двери «под ключ» (полотно + коробка + наличники), только цену полотна. Погонажные изделия ([accessories.ts](../../../src/data/accessories.ts)) сейчас содержат только наименования без цен.

## 1. Формат фото в карточке товара

**Файл:** `src/components/catalog/ProductColorPicker.vue`

Меняем `.color-picker__photo-wrap`:
- `aspect-ratio: 3 / 4` → `aspect-ratio: 1 / 1`
- `.color-picker__photo { object-fit: cover }` → `object-fit: contain`
- фон контейнера — `#f8fafc` (как у `bg-slate-50` в `CatalogProductCard.vue`), чтобы при `contain` не было пустого белого поля без визуальной границы

Это повторяет паттерн, уже используемый в карточках каталога (`CatalogProductCard.vue`): дверь показывается целиком, без обрезки, а высота блока ограничена шириной колонки (480px на десктопе), а не высотой viewport. На мобильных `.product-layout` уже переключается на `grid-template-columns: 1fr` при `max-width: 900px` — квадратный блок просто становится на всю ширину, никаких доп. медиа-правил не требуется.

## 2. Терминология «Эмалекс»

**Файл:** `src/data/series-descriptions.ts`

Заменить во всех вхождениях (`emalex`, `emalex-modern`, `coatingFallbacks.emalex`):

- `coating`: `'Эмалекс: полипропиленовое покрытие с эффектом эмали — устойчиво к сколам, царапинам и выгоранию'`
- `emalex.description`: `'Серия Эмалекс — двери в полипропиленовом покрытии с эффектом эмали. Повышенная стойкость к царапинам и истиранию, не выгорает на солнце.'`
- `'emalex-modern'.description`: аналогично, с акцентом на современный дизайн серии (не дублировать текст `emalex` целиком)

`tagline` и `features` не содержат фактических неточностей про материал — не трогаем (`features` упоминает «Двухслойное покрытие», что верно — у эмалекс действительно двухслойная структура покрытия, просто не эмаль+лак, а полипропилен с защитным слоем).

## 3. Цены на погонаж и расчёт стоимости «комплекта»

### Данные — `src/data/accessories.ts`

Расширяем существующий модуль (не выносим в отдельный файл — это та же товарная линейка, что и текущие `accessoriesByCoating`):

```ts
export type AccessoryCategory = 'kit' | 'box' | 'nalichnik' | 'kapitel' | 'dobor' | 'plinth' | 'decorative'

export const CATEGORY_LABELS: Record<AccessoryCategory, string> = {
  kit:        'Базовый комплект погонажа',
  box:        'Коробки',
  nalichnik:  'Наличники',
  kapitel:    'Капители',
  dobor:      'Доборы',
  plinth:     'Плинтус',
  decorative: 'Декоративные элементы',
}

export interface Accessory {
  name:     string
  category: AccessoryCategory
  unit:     'шт' | 'комплект'
  price:    number | null   // null = цена уточняется ("скоро")
}

export type CoatingSlug = 'pet' | 'emal' | 'emalex'

// Цена позиции «Комплект погонажа» (2,5 коробки + 5 наличников) для базового цвета покрытия
export const BASE_KIT_PRICE: Record<CoatingSlug, number> = {
  pet:    5_130,
  emal:   6_080,
  emalex: 4_900,
}
export const BASE_KIT_DESCRIPTION = '2,5 коробки + 5 наличников'

// Надбавка к цене погонажа за цвет — ключ ТОЧНО совпадает с colors.name в Supabase.
// Цвета, не упомянутые здесь, считаются базовыми (0%).
export const COLOR_SURCHARGE: Record<string, number> = {
  // ПЭТ — база: «Шёлковый белый»
  'Шёлковый бежевый': 0.20,
  'Шёлковый графит':  0.20,
  'Шёлковый индиго':  0.20,
  'Шёлковый муссон':  0.20,
  // Эмаль — база: «Эмаль белая»
  'Эмаль магнолия':       0.05,
  'Эмаль мокко':          0.05,
  'Эмаль слоновая кость': 0.05,
  'Эмаль серебро':        0.05,
  'Эмаль серая':          0.05,
  'Эмаль графит':         0.10,
  // Эмалекс — без надбавок (не указываем ключи)
}

// Цена комплекта (коробка + наличники) для конкретного цвета двери.
// Округление вверх до рубля — комплект не продаётся дробно.
export function calcKitPrice(coatingSlug: string, colorName: string): number {
  const base = BASE_KIT_PRICE[coatingSlug as CoatingSlug] ?? 0
  const surcharge = COLOR_SURCHARGE[colorName] ?? 0
  return Math.ceil(base * (1 + surcharge))
}

export const accessoriesByCoating: Record<CoatingSlug, Accessory[]> = {
  pet: [
    { name: 'Комплект погонажа (2,5 коробки, 5 наличников)', category: 'kit', unit: 'комплект', price: BASE_KIT_PRICE.pet },
    { name: 'Коробка КБТ№43П 80х32х2100', category: 'box', unit: 'шт', price: 910 },
    // ...остальные позиции из прайса, с unit/price по факту
    { name: 'Притворная планка 30х10х2100', category: 'decorative', unit: 'шт', price: null },
  ],
  emal: [
    { name: 'Комплект погонажа (2,5 коробки, 5 наличников)', category: 'kit', unit: 'комплект', price: BASE_KIT_PRICE.emal },
    // ...
  ],
  emalex: [
    { name: 'Комплект погонажа (2,5 коробки, 5 наличников)', category: 'kit', unit: 'комплект', price: BASE_KIT_PRICE.emalex },
    // ...включая категорию 'plinth' (Плинтус 70х16х2140, Клипсы для плинтуса)
  ],
}
```

Полные списки позиций переносятся из прайса, присланного пользователем (категории `box`/`nalichnik`/`kapitel`/`dobor` — по аналогии с уже существующими записями `emal`, дополняем `pet` и `emalex`, которые сейчас пустые/TODO).

### UI — цена «комплекта» на странице товара

**Файл:** `src/components/catalog/ProductColorPicker.vue`

`ColorVariant` уже содержит `coatingSlug` и `name` — этого достаточно для расчёта без новых пропсов. Под текущей строкой цены добавляется вторая строка, реактивная к выбранному свотчу:

```ts
import { calcKitPrice } from '../../data/accessories'

const kitTotal = computed(() => {
  if (!selected.value.price) return null
  return selected.value.price + calcKitPrice(selected.value.coatingSlug, selected.value.name)
})
```

```html
<p v-if="kitTotal" class="color-picker__kit-price">
  Комплект под ключ (с коробкой и наличниками): <strong>от {{ kitTotal.toLocaleString('ru-RU') }} ₽</strong>
</p>
```

Если `selected.price` отсутствует («по запросу»), строка не показывается — нет базы для расчёта.

### UI — таблица цен на погонаж

**Файл:** `src/pages/models/[id].astro`, секция `.accessories-section` (строки ~271–300)

- `accessoryGroups` (уже вычисляется через `Object.entries`) дополнительно сортируется так, чтобы группа `kit` шла первой и визуально выделялась (другой фон/рамка — `accessories-group--kit`)
- каждая `accessories-item` дополняется ценой и единицей измерения: `{item.price ? \`${item.price.toLocaleString('ru-RU')} ₽ / ${item.unit}\` : 'Цена уточняется'}`
- под заголовком секции — сноска о надбавке за цвет, сгенерированная из данных, а не хардкоднутая строка:

```ts
const surchargeNote = Object.entries(COLOR_SURCHARGE)
  .filter(([name]) => /* цвета текущего покрытия coatingSlug */)
  .map(([name, pct]) => `${name} +${pct * 100}%`)
  .join(', ')
```

Конкретная формулировка сноски и её точная вёрстка уточняются на этапе реализации — это деталь представления, не меняющая структуру данных.

## Границы изменений

- Не трогаем Supabase-схему и существующие запросы в `getStaticPaths` — `coatingSlug`/`colors[].name` уже приходят оттуда без изменений.
- Не вводим отдельный файл для цен — расширяем `accessories.ts`, следуя существующему в проекту паттерну одного файла на товарную линейку (см. `skrytye-dveri-products.ts`).
- Надбавка за цвет считается только для «комплекта» (коробка+наличники), не для цены самого полотна — цена полотна по-прежнему приходит из Supabase (`model_colors.price_rrp`) и уже учитывает цвет.
