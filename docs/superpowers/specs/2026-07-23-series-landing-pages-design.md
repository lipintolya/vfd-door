# Страницы серий (коллекций) дверей — дизайн

Дата: 2026-07-23
Статус: approved

## Цель

Каждая серия дверей (Иннова, Линия, Стокгольм и т.д.) получает собственную
маркетинговую/SEO-страницу — hero, история коллекции, преимущества,
характеристики, живая сетка моделей серии с ценами. Ориентир:
https://www.volhovec.ru/catalog/doors/modern/planum/ (структура секций +
визуальный стиль hero — тёмный градиент на фото, крошки и заголовок поверх,
якорная навигация по секциям у нижнего края hero).

Плюс хаб-страница со списком всех серий — чтобы добавление новой серии было
делом данных, а не новых файлов.

## Data layer

### `src/lib/catalog-data.ts` (новый файл)

Сегодня `src/pages/catalog.astro` сам делает Supabase-запрос
(`model_colors` → `colors/coatings`, `models/series/coatings`) и вручную
нормализует результат в `CatalogCardItem[]` (~130 строк: свотчи, дедуп по
модели, нормализация hex, слаги). Это единственный источник данных о
моделях — страницам серий нужны те же данные, только отфильтрованные по
`seriesSlug`.

Выносим в отдельный модуль:

```ts
export async function getCatalogCards(): Promise<{
  cards: CatalogCardItem[]
  error: string | null
}>
```

— тот же запрос + нормализация, что сейчас в `catalog.astro` (без изменений
в логике, чистый рефактор). `catalog.astro` вызывает эту функцию вместо
инлайновой логики.

```ts
export function getSeriesList(cards: CatalogCardItem[]): {
  slug: string
  name: string
  coatingSlug: string
  modelCount: number
  minPrice: number | null
}[]
```

— группировка уже загруженных карточек по `seriesSlug` (без второго
запроса к Supabase). Используется и хабом, и `getStaticPaths` страницы
серии.

### `src/data/series-descriptions.ts` (правка)

`SeriesSpec` получает один новый необязательный филд:

```ts
export interface SeriesSpec {
  tagline: string
  description: string
  features: string[]
  coating: string
  material: string
  edge: string
  thickness: string
  heroImage?: string   // NEW — обложка hero. Пусто → fallback на фото
                        // первой (по цене) модели серии из Supabase.
}
```

Остальные поля не меняются — `tagline`/`description`/`features` уже
заполнены для всех текущих серий и переиспользуются как есть.

## Маршруты

### `src/pages/catalog/series/index.astro` — хаб

- Server-side: `getCatalogCards()` → `getSeriesList()`.
- Сетка карточек серий: обложка (`heroImage` или fallback), название,
  `tagline`, "N моделей от X ₽". Клик → `/catalog/series/[slug]`.
- Breadcrumbs: Главная / Каталог / Серии.

### `src/pages/catalog/series/[slug].astro` — страница серии

`getStaticPaths` — по `getSeriesList()`.

Секции сверху вниз:

1. **Hero** — по референсу volhovec: фон на всю ширину (`heroImage` или
   fallback на фото первой модели), тёмный градиент-overlay для
   читаемости, breadcrumbs и eyebrow+заголовок (название серии) поверх
   фото. У нижнего края hero — якорная навигация по секциям страницы
   («О коллекции», «Особенности», «Характеристики», «Модели»), плавный
   скролл к `id`.
2. **О коллекции** — `description` из `SeriesSpec`.
3. **Особенности** — `features[]` карточками (без иконок на старте —
   реальных иконок под конкретные фичи нет, псевдо-иконки добавлять не
   будем, чтобы не плодить дизайн-долг; просто текстовые карточки).
4. **Характеристики** — `coating` / `material` / `edge` / `thickness` —
   таблица/список, один-в-один поля `SeriesSpec`.
5. **Модели серии** — `<CatalogGrid client:visible :cards={seriesCards} />`
   (переиспользуем как есть — свотчи, попап комплекта, всё уже работает),
   отсортировано по цене, строка «N моделей от X ₽» над сеткой.
6. CTA (звонок/telegram) — по паттерну decor.astro/skrytye-dveri.astro.

Без карусели «системы открывания» и без блока «завершите образ» —
намеренно урезано от референса (см. «Что не делаем» ниже).

## Навигация (правки существующих файлов)

- **`CatalogClient.vue`** — клик по серии в фильтре каталога переходит на
  `/catalog/series/[slug]` вместо фильтрации списка на месте (точный узел
  — select/pill-компонент фильтра серии — уточняется в момент реализации,
  сам факт замены behavior fixed).
- **`src/pages/models/[id].astro`** — крошка серии меняет ссылку с
  `/catalog?series=${slug}` на `/catalog/series/${slug}`.
- **`Header.vue`** — в `CATALOG_DROPDOWN` добавляется пункт «Все серии» →
  `/catalog/series`, рядом с «Декор»/«Скрытые двери».

## SEO

- Breadcrumbs + JSON-LD (`BreadcrumbList` + `CollectionPage`) на хабе и на
  каждой странице серии — по паттерну `decor.astro`.
- `astro.config.mjs`: `/catalog/series` и `/catalog/series/*` получают
  `priority: 0.8, changefreq: 'weekly'` — как `/catalog`.

## Что не делаем (сознательно урезано от volhovec)

- Промо-баннер со скидкой на фото hero — у нас нет системы акций, не
  придумываем.
- Карусель «системы открывания» (12 конфигураций монтажа) — слишком
  разный масштаб для нашего каталога, отдельная задача при необходимости.
- Блок «завершите образ» (сопутствующие товары — плинтус/фрамуга/рейки из
  `decor.astro`) — рассмотрели, отложили: не хотим тащить кросс-доменную
  логику в первую версию.
- Иконки под фичи — `features[]` сейчас просто строки без привязки к
  конкретным иконкам, не изобретаем произвольное сопоставление.

## Обложки (hero) для серий

Фото пока не готовы, придут отдельно по каждой серии (референс визуала —
скриншот volhovec выше). До этого страница работает на fallback (фото
первой модели серии) — не блокирует релиз структуры.
