# Series Landing Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give every door series its own landing page (hero, story, advantages, characteristics, live product grid) plus a hub page listing all series, per `docs/superpowers/specs/2026-07-23-series-landing-pages-design.md`.

**Architecture:** Extract the existing Supabase model_colors→cards normalization out of `catalog.astro` into a shared `src/lib/catalog-data.ts`. Two new Astro routes (`/catalog/series` hub, `/catalog/series/[slug]` detail) consume it, plus the existing static `series-descriptions.ts` for editorial copy. Detail page reuses `CatalogGrid.vue` unmodified for the product grid.

**Tech Stack:** Astro 6 (`getStaticPaths`, static output), Supabase JS client, Vue 3 islands (`client:visible`), Tailwind v4, TypeScript.

## Global Constraints

- No test runner/linter in this repo. Verification gate is `npm run build` (runs `getStaticPaths` against the live Supabase project — a broken query fails the build) plus a manual dev-server/headless-screenshot check for visual tasks. Do not invent a test framework.
- Never run `npm run deploy` / `git push production main` as part of this plan — local build/preview only, per project rules.
- Follow existing code style: 2-space indent, `as any` casts on Supabase joined rows (matches `catalog.astro` / `models/[id].astro` — don't introduce stricter typing here, it'd be inconsistent with the rest of the file).
- Russian copy throughout (UI strings, comments where non-obvious).
- Reuse `CatalogGrid.vue` and `CatalogCardItem`/`CatalogFilterOption` types from `src/components/catalog/types.ts` as-is — don't fork or duplicate them.

---

### Task 1: Data layer — `src/lib/catalog-data.ts`

**Files:**
- Create: `src/lib/catalog-data.ts`
- Modify: `src/pages/catalog.astro:1-161` (replace inline query/normalization with the new module; keep everything from `urlSeries` onward unchanged)

**Interfaces:**
- Produces:
  - `getCatalogCards(): Promise<{ cards: CatalogCardItem[]; error: string | null }>`
  - `getSeriesList(cards: CatalogCardItem[]): SeriesListItem[]` where `SeriesListItem = { slug: string; name: string; coatingSlug: string; modelCount: number; minPrice: number | null }`
  - `getSeriesCards(cards: CatalogCardItem[], seriesSlug: string): CatalogCardItem[]` — cards for one series, sorted by price ascending

- [ ] **Step 1: Create `src/lib/catalog-data.ts`**

```ts
/**
 * src/lib/catalog-data.ts
 * Единый источник карточек каталога (модель+цвет из Supabase, нормализованные
 * в CatalogCardItem) — используется /catalog и страницами серий, чтобы не
 * дублировать JOIN и нормализацию цветов в каждом месте.
 */
import { supabase } from './supabase'
import { buildModelSlugMap } from './slugify'
import type { CatalogCardItem } from '../components/catalog/types'

const normalizeHexColor = (value: string | null | undefined) => {
  const normalized = (value ?? '')
    .trim()
    .replaceAll('С', 'C')
    .replaceAll('с', 'c')

  return /^#[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/.test(normalized)
    ? normalized
    : '#cccccc'
}

export async function getCatalogCards(): Promise<{
  cards: CatalogCardItem[]
  error: string | null
}> {
  const { data, error } = await supabase
    .from('model_colors')
    .select(`
      price_rrp,
      photo_url,
      colors (
        id,
        name,
        hex_preview,
        coating_id,
        coatings ( id, name, slug )
      ),
      models (
        id,
        name,
        has_glass,
        series (
          id,
          name,
          slug,
          coating_id,
          coatings ( id, name, slug )
        )
      )
    `)
    .order('price_rrp', { ascending: true })

  if (error) console.error('Supabase error:', error.message)

  /* ── Полный набор цветов на модель (по всем строкам, не только первой) —
     нужен для корректной фильтрации: модель может подходить под фильтр
     «цвет X», даже если её карточка показывает другой цвет как основной.
     Свотчи (name+hex) — та же карта, чтобы на карточке в каталоге сразу было
     видно все доступные цвета, а не только тот, что выбран для обложки. ── */
  const colorsByModel = new Map<string, string[]>()
  const colorSwatchesByModel = new Map<string, { name: string; hex: string; price: number | null; photo: string }[]>()
  for (const row of (data ?? [])) {
    const model = row.models as any
    const color = row.colors as any
    if (!model || !color?.name) continue
    const list = colorsByModel.get(model.id) ?? []
    if (!list.includes(color.name)) list.push(color.name)
    colorsByModel.set(model.id, list)

    const swatches = colorSwatchesByModel.get(model.id) ?? []
    if (!swatches.some(s => s.name === color.name)) {
      swatches.push({
        name:  color.name,
        hex:   normalizeHexColor(color.hex_preview),
        price: row.price_rrp ?? null,
        photo: row.photo_url ?? '',
      })
    }
    colorSwatchesByModel.set(model.id, swatches)
  }

  /* ── Нормализуем: 1 модель = 1 карточка (первый цвет — для витрины) ── */
  const cards: CatalogCardItem[] = []
  const seen = new Set<string>()

  for (const row of (data ?? [])) {
    const model   = row.models as any
    const color   = row.colors as any
    if (!model || !color) continue
    if (seen.has(model.id)) continue
    seen.add(model.id)

    const series  = model?.series  as any
    const coating = series?.coatings ?? color?.coatings as any

    cards.push({
      id:          model.id,
      slug:        '',
      name:        model.name,
      series:      series?.name   ?? '—',
      seriesSlug:  series?.slug   ?? '',
      coating:     coating?.name  ?? '—',
      coatingSlug: coating?.slug  ?? '',
      colorName:   color.name,
      colorHex:    normalizeHexColor(color.hex_preview),
      colorNames:  colorsByModel.get(model.id) ?? [color.name],
      colorSwatches: colorSwatchesByModel.get(model.id) ?? [{ name: color.name, hex: normalizeHexColor(color.hex_preview), price: row.price_rrp ?? null, photo: row.photo_url ?? '' }],
      photo:       row.photo_url  ?? '',
      price:       row.price_rrp  ?? null,
      hasGlass:    model.has_glass ?? false,
    })
  }

  /* ── Читаемые слаги вместо UUID — та же функция, что и в /models/[id].astro,
     иначе ссылки карточек разойдутся с реально сгенерированными маршрутами ── */
  const slugMap = buildModelSlugMap(cards.map(c => ({ id: c.id, name: c.name, seriesSlug: c.seriesSlug })))
  for (const card of cards) {
    card.slug = slugMap.get(card.id)!
  }

  return { cards, error: error?.message ?? null }
}

export interface SeriesListItem {
  slug:        string
  name:        string
  coatingSlug: string
  modelCount:  number
  minPrice:    number | null
}

/** Группирует уже загруженные карточки по сериям — без второго запроса к Supabase. */
export function getSeriesList(cards: CatalogCardItem[]): SeriesListItem[] {
  const bySlug = new Map<string, SeriesListItem>()

  for (const card of cards) {
    if (!card.seriesSlug) continue
    const existing = bySlug.get(card.seriesSlug)
    if (existing) {
      existing.modelCount++
      if (card.price != null && (existing.minPrice == null || card.price < existing.minPrice)) {
        existing.minPrice = card.price
      }
      continue
    }
    bySlug.set(card.seriesSlug, {
      slug:        card.seriesSlug,
      name:        card.series,
      coatingSlug: card.coatingSlug,
      modelCount:  1,
      minPrice:    card.price,
    })
  }

  return [...bySlug.values()].sort((a, b) => a.name.localeCompare(b.name, 'ru'))
}

/** Карточки одной серии, отсортированные по цене — для страницы серии. */
export function getSeriesCards(cards: CatalogCardItem[], seriesSlug: string): CatalogCardItem[] {
  return cards
    .filter(c => c.seriesSlug === seriesSlug)
    .sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity))
}
```

- [ ] **Step 2: Rewrite `src/pages/catalog.astro` to use the new module**

Replace lines 1–161 (everything from the top through the `allColors` block) with:

```astro
---
/**
 * src/pages/catalog.astro
 * Данные грузятся на сервере — полный JOIN через Supabase (src/lib/catalog-data.ts).
 * Фильтрация — клиентская (Vue island), без перезагрузки страницы.
 */
import BaseLayout from '../layouts/BaseLayout.astro'
import Breadcrumbs from '../components/ui/Breadcrumbs.astro'
import CatalogClient from '../components/catalog/CatalogClient.vue'
import { getCatalogCards } from '../lib/catalog-data'

const { cards, error } = await getCatalogCards()

/* ── Уникальные опции для фильтров ── */
const allSeries = [...new Map(
  cards
    .filter(c => c.seriesSlug)
    .map(c => [c.seriesSlug, { label: c.series, value: c.seriesSlug }])
).values()]

const allCoatings = [...new Map(
  cards
    .filter(c => c.coatingSlug)
    .map(c => [c.coatingSlug, { label: c.coating, value: c.coatingSlug }])
).values()]

/* Из colorSwatches (полный набор цветов на модель, не только первого) —
   свотчи уже содержат все цвета каждой модели, так что колонка не теряет
   цвета, которые ни у одной модели не оказались «первыми». */
const allColors = [...new Map(
  cards
    .flatMap(c => c.colorSwatches.map(s => [s.name, { label: s.name, value: s.name, color: s.hex }] as const))
).values()]
```

Keep the rest of the file (`urlSeries`/`urlCoating`/`urlColor` through the closing `</BaseLayout>` and the template) exactly as it is today — only the block above changes. Delete the now-unused `CardItem` interface and `normalizeHexColor` function that used to live in this file (they moved to `catalog-data.ts`).

- [ ] **Step 3: Verify the build**

Run: `npm run build`
Expected: `[build] Complete!`, no TypeScript errors, `/catalog/index.html` present in the build log.

- [ ] **Step 4: Smoke-check the catalog page still works**

```bash
npm run preview &
sleep 3
curl -s http://localhost:4321/catalog -o /dev/null -w "%{http_code}\n"
```
Expected: `200`. Then stop the preview server (`pkill -f "astro preview"`).

- [ ] **Step 5: Commit**

```bash
git add src/lib/catalog-data.ts src/pages/catalog.astro
git commit -m "refactor: extract Supabase catalog query into src/lib/catalog-data.ts

Pure extraction, no behavior change — /catalog now calls getCatalogCards()
instead of inlining the query. Series landing pages (next tasks) reuse it."
```

---

### Task 2: `heroImage` field on `SeriesSpec`

**Files:**
- Modify: `src/data/series-descriptions.ts:30-38` (interface only — no data changes)

**Interfaces:**
- Consumes: nothing new
- Produces: `SeriesSpec.heroImage?: string` — read by Task 3's detail page

- [ ] **Step 1: Add the field**

In `src/data/series-descriptions.ts`, change:

```ts
export interface SeriesSpec {
  tagline:     string
  description: string
  features:    string[]
  coating:     string
  material:    string
  edge:        string
  thickness:   string
}
```

to:

```ts
export interface SeriesSpec {
  tagline:     string
  description: string
  features:    string[]
  coating:     string
  material:    string
  edge:        string
  thickness:   string
  /** Обложка hero страницы серии. Пусто → на странице серии используется
      фото первой (по цене) модели серии как фолбэк. */
  heroImage?:  string
}
```

No entries in `seriesDescriptions` need editing — the field is optional and every existing entry is still valid without it.

- [ ] **Step 2: Verify the build**

Run: `npm run build`
Expected: `[build] Complete!`, no TypeScript errors (optional field, nothing consumes it yet).

- [ ] **Step 3: Commit**

```bash
git add src/data/series-descriptions.ts
git commit -m "feat: add optional heroImage field to SeriesSpec"
```

---

### Task 3: Series detail page — `/catalog/series/[slug]`

**Files:**
- Create: `src/pages/catalog/series/[slug].astro`

**Interfaces:**
- Consumes: `getCatalogCards`, `getSeriesList`, `getSeriesCards` from `../../../lib/catalog-data` (Task 1); `getSeriesSpec` from `../../../data/series-descriptions` (Task 2); `CatalogGrid` from `../../../components/catalog/CatalogGrid.vue`; `Breadcrumbs` from `../../../components/ui/Breadcrumbs.astro`; `BaseLayout` from `../../../layouts/BaseLayout.astro`
- Produces: static route per series slug, page renders even when `SeriesSpec` fields are empty (e.g. series `smart` has no entry in `seriesDescriptions` and falls through to an all-empty spec — every content section must be conditionally rendered)

- [ ] **Step 1: Create the file**

```astro
---
/**
 * src/pages/catalog/series/[slug].astro
 * Лендинг серии: hero + якорная навигация + описание + преимущества +
 * характеристики + живая сетка моделей серии (Supabase, через catalog-data).
 */
import BaseLayout from '../../../layouts/BaseLayout.astro'
import Breadcrumbs from '../../../components/ui/Breadcrumbs.astro'
import CatalogGrid from '../../../components/catalog/CatalogGrid.vue'
import { getCatalogCards, getSeriesList, getSeriesCards } from '../../../lib/catalog-data'
import { getSeriesSpec } from '../../../data/series-descriptions'
import type { CatalogCardItem } from '../../../components/catalog/types'

export async function getStaticPaths() {
  const { cards } = await getCatalogCards()
  const seriesList = getSeriesList(cards)

  return seriesList.map(series => ({
    params: { slug: series.slug },
    props: { series, cards },
  }))
}

interface Props {
  series: { slug: string; name: string; coatingSlug: string; modelCount: number; minPrice: number | null }
  cards:  CatalogCardItem[]
}

const { series, cards } = Astro.props as Props

const seriesCards = getSeriesCards(cards, series.slug)
const spec        = getSeriesSpec(series.slug, series.coatingSlug)
const heroImage   = spec.heroImage || seriesCards[0]?.photo || ''

const fmt = (n: number) => n.toLocaleString('ru-RU') + ' ₽'

const PHONE = '+79000297888'
const TG    = 'https://t.me/vfddoors74'

const canonicalUrl = Astro.site ? new URL(`/catalog/series/${series.slug}`, Astro.site).href : undefined

const breadcrumbItems = [
  { label: 'Главная', href: '/' },
  { label: 'Каталог', href: '/catalog' },
  { label: 'Серии',   href: '/catalog/series' },
  { label: series.name },
]

/* ── Характеристики — только заполненные поля (у серий без записи в
   seriesDescriptions, напр. "Смарт", всё это может быть пусто) ── */
const characteristics = [
  { label: 'Покрытие',        value: spec.coating },
  { label: 'Материал',        value: spec.material },
  { label: 'Кромка',          value: spec.edge },
  { label: 'Толщина полотна', value: spec.thickness ? `${spec.thickness} мм` : '' },
].filter(row => row.value)

const jumpLinks = [
  spec.description   && { href: '#about',    label: 'О коллекции' },
  spec.features.length && { href: '#features', label: 'Особенности' },
  characteristics.length && { href: '#specs',   label: 'Характеристики' },
  { href: '#models', label: 'Модели' },
].filter(Boolean) as { href: string; label: string }[]

const pageTitle = `Двери серии ${series.name} — цены, характеристики | ВФД Челябинск`
const pageDesc  = spec.description ||
  `Двери серии ${series.name} в салоне ВФД на Кашириных. ${series.modelCount} ${series.modelCount === 1 ? 'модель' : 'моделей'}${series.minPrice ? `, цены от ${fmt(series.minPrice)}` : ''}.`

const structuredData = canonicalUrl ? [
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbItems.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.label,
      ...(item.href ? { item: new URL(item.href, canonicalUrl).href } : {}),
    })),
  },
  {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `Серия ${series.name}`,
    description: pageDesc,
    url: canonicalUrl,
    numberOfItems: seriesCards.length,
  },
] : undefined
---

<BaseLayout
  title={pageTitle}
  description={pageDesc}
  ogImage={heroImage || undefined}
  preloadImage={heroImage || undefined}
  canonical={canonicalUrl}
  structuredData={structuredData}
>

  <div class="breadcrumb-bar">
    <div class="container">
      <Breadcrumbs items={breadcrumbItems} />
    </div>
  </div>

  <!-- ══════════════════════════════════════════════
       HERO + ЯКОРНАЯ НАВИГАЦИЯ
  ══════════════════════════════════════════════ -->
  <section class="sr-hero" aria-label={`Серия ${series.name}`}>
    {heroImage && (
      <img
        src={heroImage}
        alt={`Двери серии ${series.name} — ВФД`}
        class="sr-hero__img"
        loading="eager"
        fetchpriority="high"
        decoding="async"
        width="1600"
        height="900"
      />
    )}
    <div class="sr-hero__overlay" aria-hidden="true"></div>
    <div class="sr-hero__body">
      <p class="sr-eyebrow">Серия дверей</p>
      <h1 class="sr-hero__h1">{series.name}</h1>
      {spec.tagline && <p class="sr-hero__tagline">{spec.tagline}</p>}
      <div class="sr-hero__actions">
        <a href={TG} target="_blank" rel="noopener" class="btn btn-ghost">Получить расчёт</a>
        <a href={`tel:${PHONE}`} class="btn btn-ghost">Позвонить</a>
      </div>
    </div>
  </section>

  {jumpLinks.length > 1 && (
    <nav class="sr-jumpnav" aria-label="Разделы страницы">
      <div class="container sr-jumpnav__row">
        {jumpLinks.map(link => (
          <a href={link.href} class="sr-jumpnav__link">{link.label}</a>
        ))}
      </div>
    </nav>
  )}

  <!-- ══════════════════════════════════════════════
       О КОЛЛЕКЦИИ
  ══════════════════════════════════════════════ -->
  {spec.description && (
    <section id="about" class="section sr-section">
      <div class="container">
        <h2 class="sr-h2">О коллекции</h2>
        <p class="sr-p">{spec.description}</p>
      </div>
    </section>
  )}

  <!-- ══════════════════════════════════════════════
       ОСОБЕННОСТИ
  ══════════════════════════════════════════════ -->
  {spec.features.length > 0 && (
    <section id="features" class="section sr-section">
      <div class="container">
        <h2 class="sr-h2">Особенности</h2>
        <ul class="sr-features">
          {spec.features.map(feature => (
            <li class="sr-features__item">
              <svg class="sr-features__icon" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <circle cx="10" cy="10" r="9" stroke="currentColor" stroke-width="1.5"/>
                <path d="M6 10.5l2.5 2.5L14 7.5" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )}

  <!-- ══════════════════════════════════════════════
       ХАРАКТЕРИСТИКИ
  ══════════════════════════════════════════════ -->
  {characteristics.length > 0 && (
    <section id="specs" class="section sr-section">
      <div class="container">
        <h2 class="sr-h2">Характеристики</h2>
        <dl class="sr-specs">
          {characteristics.map(row => (
            <div class="sr-specs__row">
              <dt class="sr-specs__label">{row.label}</dt>
              <dd class="sr-specs__value">{row.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )}

  <!-- ══════════════════════════════════════════════
       МОДЕЛИ СЕРИИ
  ══════════════════════════════════════════════ -->
  <section id="models" class="section sr-section">
    <div class="container">
      <h2 class="sr-h2">Модели серии {series.name}</h2>
      <p class="sr-p sr-p--tight">
        {series.modelCount} {series.modelCount === 1 ? 'модель' : 'моделей'}
        {series.minPrice && <span> · от {fmt(series.minPrice)}</span>}
      </p>
      <div class="sr-grid-wrap">
        <CatalogGrid client:visible cards={seriesCards} />
      </div>
    </div>
  </section>

  <!-- ══════════════════════════════════════════════
       CTA
  ══════════════════════════════════════════════ -->
  <section class="section">
    <div class="container">
      <div class="sr-cta">
        <div class="sr-cta__text">
          <h2 class="sr-cta__h2">Подберём дверь серии {series.name} под ваш интерьер</h2>
          <p class="sr-cta__lead">Замер, расчёт стоимости и монтаж — в шоуруме на Кашириных.</p>
        </div>
        <div class="sr-cta__actions">
          <a href={TG} target="_blank" rel="noopener" class="btn btn-ghost">Написать в Telegram</a>
          <a href={`tel:${PHONE}`} class="btn btn-ghost">Позвонить</a>
        </div>
      </div>
    </div>
  </section>

</BaseLayout>

<style>
.sr-eyebrow {
  display: block;
  margin: 0 0 0.875rem;
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.55);
}
.sr-h2 {
  margin: 0 0 1rem;
  font-size: clamp(1.625rem, 3vw, 2.125rem);
  font-weight: 500;
  color: #0f172a;
  letter-spacing: -0.02em;
  line-height: 1.15;
}
.sr-p {
  margin: 0;
  color: #64748b;
  font-size: clamp(0.9375rem, 1.4vw, 1.0625rem);
  line-height: 1.75;
}
.sr-p--tight { margin-bottom: 1.5rem; }

/* ── Hero ─────────────────────────────────────────────────────── */
.sr-hero {
  position: relative;
  overflow: hidden;
  min-height: clamp(24rem, 46vw, 34rem);
  padding: clamp(2.5rem, 6vw, 4.5rem) 0;
  background: #0f172a;
  display: flex;
  align-items: flex-end;
}
.sr-hero__img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}
.sr-hero__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(15,23,42,0.92), rgba(15,23,42,0.5) 55%, rgba(15,23,42,0.15));
}
.sr-hero__body {
  position: relative;
  z-index: 1;
  max-width: 44rem;
  margin: 0 auto;
  width: 100%;
  padding: 0 var(--container-padding, 1.25rem);
  color: #fff;
}
.sr-hero__h1 {
  margin: 0 0 0.75rem;
  font-size: clamp(2.25rem, 5vw, 3.5rem);
  font-weight: 500;
  line-height: 1.05;
  letter-spacing: -0.03em;
}
.sr-hero__tagline {
  margin: 0 0 2rem;
  max-width: 38rem;
  font-size: clamp(1rem, 1.6vw, 1.125rem);
  line-height: 1.65;
  color: rgba(255,255,255,0.8);
}
.sr-hero__actions { display: flex; flex-wrap: wrap; gap: 0.625rem; }

/* ── Jump nav ─────────────────────────────────────────────────── */
.sr-jumpnav {
  border-bottom: 1px solid #e5e7eb;
  background: #fff;
}
.sr-jumpnav__row {
  display: flex;
  flex-wrap: wrap;
  gap: clamp(1rem, 3vw, 2rem);
  padding: 0.875rem var(--container-padding, 1.25rem);
}
.sr-jumpnav__link {
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: #64748b;
  text-decoration: none;
  border-bottom: 1px dashed transparent;
  padding-bottom: 0.125rem;
  transition: color 150ms ease, border-color 150ms ease;
}
.sr-jumpnav__link:hover { color: #0f172a; border-color: #94a3b8; }

/* ── Sections ─────────────────────────────────────────────────── */
.sr-section { scroll-margin-top: 5.5rem; }
.sr-section + .sr-section { padding-top: 0; }

/* ── Features ─────────────────────────────────────────────────── */
.sr-features {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr));
  gap: 0.875rem;
}
.sr-features__item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1.125rem 1.25rem;
  border: 1px solid #e5e7eb;
  border-radius: 1rem;
  font-size: 0.9375rem;
  color: #334155;
  line-height: 1.5;
}
.sr-features__icon { width: 1.25rem; height: 1.25rem; flex-shrink: 0; margin-top: 0.125rem; color: #0d9488; }

/* ── Specs ────────────────────────────────────────────────────── */
.sr-specs {
  margin: 0;
  border: 1px solid #e5e7eb;
  border-radius: 1rem;
  overflow: hidden;
}
.sr-specs__row {
  display: grid;
  grid-template-columns: 12rem 1fr;
  gap: 1rem;
  padding: 1rem 1.375rem;
}
.sr-specs__row + .sr-specs__row { border-top: 1px solid #f1f5f9; }
.sr-specs__label { margin: 0; font-size: 0.875rem; font-weight: 600; color: #94a3b8; }
.sr-specs__value { margin: 0; font-size: 0.9375rem; color: #334155; line-height: 1.6; }

/* ── Grid ─────────────────────────────────────────────────────── */
.sr-grid-wrap { margin-top: 0.5rem; }

/* ── CTA ──────────────────────────────────────────────────────── */
.sr-cta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  flex-wrap: wrap;
  padding: clamp(2.5rem, 5vw, 4rem);
  border-radius: 1.25rem;
  background: #212124;
  color: #fff;
}
.sr-cta__h2 { margin: 0 0 0.5rem; font-size: clamp(1.5rem, 3vw, 2.125rem); font-weight: 500; letter-spacing: -0.02em; }
.sr-cta__lead { margin: 0; font-size: 0.9375rem; color: rgba(255,255,255,0.6); line-height: 1.6; }
.sr-cta__actions { display: flex; gap: 0.625rem; flex-wrap: wrap; flex-shrink: 0; }

/* ── Responsive ───────────────────────────────────────────────── */
@media (max-width: 768px) {
  .sr-cta { flex-direction: column; align-items: flex-start; gap: 1.5rem; padding: 1.75rem 1.5rem; }
  .sr-specs__row { grid-template-columns: 1fr; gap: 0.25rem; }
}
</style>
```

**Note on `characteristics.length` / `spec.features.length` inside the `jumpLinks` array literal:** the truthy branches return objects, falsy branches return `false`/`0`/`''` — the trailing `.filter(Boolean) as {...}[]` strips those out. This mirrors the conditional-rendering style already used elsewhere in this codebase (`decor.astro`'s `{IMAGES.framuga && (...)}`).

- [ ] **Step 2: Verify the build**

Run: `npm run build`
Expected: `[build] Complete!`, and the route list includes one `/catalog/series/<slug>/index.html` per series currently in Supabase (e.g. `innova`, `linea`, `smart`, etc.) — confirm by grepping the build log:

```bash
npm run build 2>&1 | grep "catalog/series"
```

- [ ] **Step 3: Visual check — a series with full copy**

```bash
npm run preview &
sleep 3
curl -s http://localhost:4321/catalog/series/innova -o /dev/null -w "%{http_code}\n"
```
Expected: `200`. Take a headless screenshot at 1400px width and read it back to confirm: hero renders with fallback photo + gradient + "Иннова" title, jump nav shows all 4 links, description/features/specs/grid all render with real content, grid shows model cards with prices.

- [ ] **Step 4: Visual check — a series with no editorial copy (edge case)**

```bash
curl -s http://localhost:4321/catalog/series/smart -o /dev/null -w "%{http_code}\n"
```
Expected: `200`, page does NOT crash. Screenshot check: hero still renders (fallback to first model photo), jump nav shows only "Модели" (since `smart` has no description/features/characteristics — this is the scenario the conditional rendering in Step 1 exists for), "О коллекции"/"Особенности"/"Характеристики" sections are absent (not empty/broken), product grid renders normally.

Stop the preview server after both checks: `pkill -f "astro preview"`.

- [ ] **Step 5: Commit**

```bash
git add "src/pages/catalog/series/[slug].astro"
git commit -m "feat: series landing page — /catalog/series/[slug]

Hero + jump nav + О коллекции/Особенности/Характеристики (from
SeriesSpec) + live product grid (CatalogGrid, reused as-is). All content
sections are conditionally rendered — series without editorial copy in
series-descriptions.ts (e.g. smart) still render a clean page."
```

---

### Task 4: Series hub page — `/catalog/series`

**Files:**
- Create: `src/pages/catalog/series/index.astro`
- Modify: `astro.config.mjs:31` (sitemap priority rule)

**Interfaces:**
- Consumes: `getCatalogCards`, `getSeriesList`, `getSeriesCards` from `../../../lib/catalog-data`; `getSeriesSpec` from `../../../data/series-descriptions`

- [ ] **Step 1: Create the hub page**

```astro
---
/**
 * src/pages/catalog/series/index.astro
 * Хаб — сетка карточек всех серий. Добавление новой серии в Supabase
 * автоматически добавляет карточку сюда, без правки этого файла.
 */
import BaseLayout from '../../../layouts/BaseLayout.astro'
import Breadcrumbs from '../../../components/ui/Breadcrumbs.astro'
import { getCatalogCards, getSeriesList, getSeriesCards } from '../../../lib/catalog-data'
import { getSeriesSpec } from '../../../data/series-descriptions'

const { cards } = await getCatalogCards()
const seriesList = getSeriesList(cards)

const seriesCardsData = seriesList.map(series => {
  const spec = getSeriesSpec(series.slug, series.coatingSlug)
  const seriesCards = getSeriesCards(cards, series.slug)
  return {
    ...series,
    tagline: spec.tagline,
    cover:   spec.heroImage || seriesCards[0]?.photo || '',
  }
})

const fmt = (n: number) => n.toLocaleString('ru-RU') + ' ₽'

const canonicalUrl = Astro.site ? new URL('/catalog/series', Astro.site).href : undefined

const breadcrumbItems = [
  { label: 'Главная', href: '/' },
  { label: 'Каталог', href: '/catalog' },
  { label: 'Серии' },
]

const structuredData = canonicalUrl ? [
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbItems.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.label,
      ...(item.href ? { item: new URL(item.href, canonicalUrl).href } : {}),
    })),
  },
  {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Серии дверей ВФД',
    description: 'Все серии межкомнатных дверей ВФД — покрытия, характеристики, цены.',
    url: canonicalUrl,
    numberOfItems: seriesCardsData.length,
  },
] : undefined
---

<BaseLayout
  title="Серии дверей — каталог коллекций | ВФД Челябинск"
  description="Все серии межкомнатных дверей ВФД: Иннова, Линия, Стокгольм и другие. Покрытия, характеристики, цены. Салон в Челябинске."
  canonical={canonicalUrl}
  structuredData={structuredData}
>

  <div class="breadcrumb-bar">
    <div class="container">
      <Breadcrumbs items={breadcrumbItems} />
    </div>
  </div>

  <section class="section">
    <div class="container">
      <header class="mb-10 max-w-3xl md:mb-16">
        <p class="t-eyebrow mb-3">Каталог</p>
        <h1 class="m-0 mb-4 text-3xl font-medium leading-tight tracking-tight text-slate-900 md:text-5xl">Серии дверей</h1>
        <p class="m-0 text-base leading-relaxed text-slate-600 md:text-lg">
          {seriesCardsData.length} {seriesCardsData.length === 1 ? 'серия' : 'серий'} — выберите коллекцию, чтобы увидеть все модели, покрытия и цены.
        </p>
      </header>

      <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {seriesCardsData.map(series => (
          <a href={`/catalog/series/${series.slug}`} class="sh-card">
            <div class="sh-card__img-wrap">
              {series.cover && (
                <img
                  src={series.cover}
                  alt={`Серия ${series.name} — ВФД`}
                  class="sh-card__img"
                  loading="lazy"
                  decoding="async"
                  width="600"
                  height="450"
                />
              )}
            </div>
            <div class="sh-card__body">
              <h2 class="sh-card__name">{series.name}</h2>
              {series.tagline && <p class="sh-card__tagline">{series.tagline}</p>}
              <p class="sh-card__meta">
                {series.modelCount} {series.modelCount === 1 ? 'модель' : 'моделей'}
                {series.minPrice && <span> · от {fmt(series.minPrice)}</span>}
              </p>
            </div>
          </a>
        ))}
      </div>
    </div>
  </section>

</BaseLayout>

<style>
.sh-card {
  display: flex;
  flex-direction: column;
  border: 1px solid #e5e7eb;
  border-radius: 1.25rem;
  overflow: hidden;
  text-decoration: none;
  transition: border-color 150ms ease, transform 150ms ease;
}
.sh-card:hover { border-color: #94a3b8; transform: translateY(-2px); }
.sh-card__img-wrap { aspect-ratio: 4/3; background: #f1f5f9; overflow: hidden; }
.sh-card__img { display: block; width: 100%; height: 100%; object-fit: cover; }
.sh-card__body { padding: 1.25rem 1.375rem 1.5rem; }
.sh-card__name { margin: 0 0 0.375rem; font-size: 1.25rem; font-weight: 500; color: #0f172a; letter-spacing: -0.01em; }
.sh-card__tagline { margin: 0 0 0.625rem; font-size: 0.875rem; color: #64748b; line-height: 1.5; }
.sh-card__meta { margin: 0; font-size: 0.8125rem; font-weight: 600; color: #94a3b8; }
</style>
```

- [ ] **Step 2: Add sitemap priority rule**

In `astro.config.mjs`, change:

```js
        if (/\/(catalog|about|contacts|partitions|vhodnye-dveri)\/?$/.test(u)) {
          return { ...item, changefreq: 'weekly', priority: 0.8 }
        }
```

to:

```js
        if (/\/(catalog|about|contacts|partitions|vhodnye-dveri)\/?$/.test(u)) {
          return { ...item, changefreq: 'weekly', priority: 0.8 }
        }
        if (/\/catalog\/series(\/.+)?\/?$/.test(u)) {
          return { ...item, changefreq: 'weekly', priority: 0.8 }
        }
```

- [ ] **Step 3: Verify the build**

Run: `npm run build`
Expected: `[build] Complete!`, build log includes `/catalog/series/index.html`.

- [ ] **Step 4: Visual check**

```bash
npm run preview &
sleep 3
curl -s http://localhost:4321/catalog/series -o /dev/null -w "%{http_code}\n"
pkill -f "astro preview"
```
Expected: `200`. Screenshot at 1400px: grid of series cards, each with cover image (or blank placeholder box if no cover/fallback photo — should not be visually broken), name, tagline where present, model count + price.

- [ ] **Step 5: Commit**

```bash
git add "src/pages/catalog/series/index.astro" astro.config.mjs
git commit -m "feat: series hub page — /catalog/series

Grid of all series (cover, name, tagline, model count + from-price).
New series in Supabase appear here automatically, no file changes needed."
```

---

### Task 5: Navigation wiring

**Files:**
- Modify: `src/components/catalog/CatalogFilters.vue:121-148` (series filter section → links)
- Modify: `src/pages/models/[id].astro:143` (breadcrumb target)
- Modify: `src/components/layout/Header.vue:50-55` (catalog dropdown entry)

**Interfaces:**
- Consumes: nothing new — pure link-target changes
- Produces: nothing new — this is the last task, nothing downstream depends on it

- [ ] **Step 1: `CatalogFilters.vue` — series section becomes links, not filter toggles**

Replace (lines 128–147):

```html
      <div v-if="openSections.series" class="mb-3.5 grid max-h-56 gap-1 overflow-y-auto">
        <button
          type="button"
          class="rounded-lg px-2.5 py-3 text-left text-step-0 text-slate-600 transition hover:bg-slate-100"
          :class="draftSeries === '' ? 'bg-teal-50 text-teal-700' : ''"
          @click="draftSeries = ''"
        >
          Все серии
        </button>
        <button
          v-for="item in series"
          :key="item.value"
          type="button"
          class="rounded-lg px-2.5 py-3 text-left text-step-0 text-slate-600 transition hover:bg-slate-100"
          :class="draftSeries === item.value ? 'bg-teal-50 text-teal-700' : ''"
          @click="draftSeries = draftSeries === item.value ? '' : item.value"
        >
          {{ item.label }}
        </button>
      </div>
```

with:

```html
      <div v-if="openSections.series" class="mb-3.5 grid max-h-56 gap-1 overflow-y-auto">
        <a
          href="/catalog/series"
          class="rounded-lg px-2.5 py-3 text-left text-step-0 text-slate-600 transition hover:bg-slate-100"
        >
          Все серии →
        </a>
        <a
          v-for="item in series"
          :key="item.value"
          :href="`/catalog/series/${item.value}`"
          class="rounded-lg px-2.5 py-3 text-left text-step-0 text-slate-600 transition hover:bg-slate-100"
        >
          {{ item.label }}
        </a>
      </div>
```

Clicking a series now navigates to its dedicated landing page instead of filtering the current `/catalog` list in place. Leave `draftSeries`/`activeSeries` and the rest of the draft/apply/count machinery untouched — it still correctly filters `/catalog?series=slug` for anyone who lands there via an old link, it's just no longer settable by clicking these two elements.

- [ ] **Step 2: `models/[id].astro` — breadcrumb points at the real series page**

Change line 143:

```ts
  ...(seriesName ? [{ label: seriesName, href: `/catalog?series=${seriesSlug}` }] : []),
```

to:

```ts
  ...(seriesName ? [{ label: seriesName, href: `/catalog/series/${seriesSlug}` }] : []),
```

- [ ] **Step 3: `Header.vue` — add "Все серии" to the catalog dropdown**

Change (lines 50–55):

```ts
const CATALOG_DROPDOWN = [
  { href: '/catalog',               label: 'Все двери',      desc: 'Межкомнатные' },
  { href: '/catalog/skrytye-dveri', label: 'Скрытые двери', desc: 'Скрытый монтаж' },
  { href: '/vhodnye-dveri',         label: 'Входные двери', desc: 'С монтажом' },
  { href: '/catalog/decor',         label: 'Декор',         desc: 'Плинтус, фрамуги, рейки' },
] as const
```

to:

```ts
const CATALOG_DROPDOWN = [
  { href: '/catalog',               label: 'Все двери',      desc: 'Межкомнатные' },
  { href: '/catalog/series',        label: 'Серии',          desc: 'Все коллекции' },
  { href: '/catalog/skrytye-dveri', label: 'Скрытые двери', desc: 'Скрытый монтаж' },
  { href: '/vhodnye-dveri',         label: 'Входные двери', desc: 'С монтажом' },
  { href: '/catalog/decor',         label: 'Декор',         desc: 'Плинтус, фрамуги, рейки' },
] as const
```

- [ ] **Step 4: Verify the build**

Run: `npm run build`
Expected: `[build] Complete!`, no errors.

- [ ] **Step 5: Visual check**

```bash
npm run preview &
sleep 3
```
Headless screenshot of `/catalog` at 1400px: open the series filter accordion, confirm entries render as links (hover state still visually a pill, same as before). Click through to `/models/<any-slug>` and confirm the series breadcrumb link now points at `/catalog/series/<slug>` (check `href` attribute, e.g. via `curl -s http://localhost:4321/models/<slug> | grep -o '/catalog/series/[a-z-]*'`). Open the header "Каталог" dropdown and confirm "Серии" appears second in the list.

```bash
pkill -f "astro preview"
```

- [ ] **Step 6: Commit**

```bash
git add src/components/catalog/CatalogFilters.vue "src/pages/models/[id].astro" src/components/layout/Header.vue
git commit -m "feat: wire navigation to the new series pages

Catalog filter's series list now links to /catalog/series/[slug] instead
of filtering in place. Model breadcrumb and header dropdown updated to
match."
```

---

## Post-plan (not part of this plan, tracked separately)

- Hero photos per series (`SeriesSpec.heroImage`) — user will supply URLs per series once ready, matching the visual reference already reviewed (dark gradient, volhovec-style). Filling these in is a data-only edit to `series-descriptions.ts`, no code changes.
