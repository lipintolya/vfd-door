# Portfolio (Наши работы) — Design Spec

**Date:** 2026-07-01  
**Project:** vfd74.ru — салон дверей ВФД, Челябинск

---

## Goal

Создать страницу фотоотчётов с объектов (`/portfolio`) с индивидуальными страницами проектов (`/portfolio/[slug]`), превью-блоком на главной и удобным способом добавления новых работ через `.ts`-файл.

---

## Scope

- `src/data/portfolio-works.ts` — единый источник данных всех работ
- `src/pages/portfolio/index.astro` — листинг с masonry-сеткой
- `src/pages/portfolio/[slug].astro` — детальная страница проекта (SEO + слайдер)
- `src/components/portfolio/PortfolioGrid.vue` — Vue island: фильтры + masonry
- `src/components/portfolio/ProjectSlider.vue` — Vue island: фото-слайдер
- `src/components/portfolio/PortfolioPreview.astro` — SSR-блок на главной
- Обновление `src/pages/index.astro` — добавить `<PortfolioPreview />`
- Миграция `INVISIBLE_WORKS` из `skrytye-dveri-works.ts` в `portfolio-works.ts`

Не в scope этой задачи: удаление `skrytye-dveri-works.ts` (он используется на странице `/catalog/skrytye-dveri`; отдельный рефактор).

---

## Data Model

**Файл:** `src/data/portfolio-works.ts`

```ts
const CDN = 'https://storage.yandexcloud.net/catalog-vfd/'

export type WorkCategory = 'interior' | 'hidden' | 'partitions' | 'entrance'
export type ObjectType   = 'apartment' | 'house' | 'office' | 'commercial'

export interface PortfolioWork {
  id:          string        // URL slug: '2026-06-17-urban-3room'
  date:        string        // ISO '2026-06-17'  (Schema.org dateCreated)
  label:       string        // отображение: '17.06.2026'
  title:       string        // H1 на странице проекта
  description: string        // meta description (~140 символов)
  category:    WorkCategory
  objectType:  ObjectType
  location:    string        // 'Челябинск, Привилегия'
  story?:      string        // 2-3 предложения о проекте
  model?:      string        // 'Urban 1', 'Секрет Реверс', 'Alutech AL60'
  doorCount?:  number        // количество дверей / пролётов перегородки
  features?:   string[]      // ['Скрытые петли', 'Без наличников']
  images:      string[]      // images[0] — обложка (hero)
}

export const PORTFOLIO_WORKS: PortfolioWork[] = [
  // новые работы добавляются ВВЕРХУ массива
]
```

**Категории для фильтров:**
| `WorkCategory` | Метка в UI |
|---|---|
| `interior` | Межкомнатные |
| `hidden` | Скрытые двери |
| `partitions` | Перегородки |
| `entrance` | Входные |

**Объект типа:**
| `ObjectType` | Метка в UI |
|---|---|
| `apartment` | Квартира |
| `house` | Частный дом |
| `office` | Офис |
| `commercial` | Коммерческая недвижимость |

---

## Architecture

**Rendering model:** Astro pages (SSR at build time, static output) + Vue 3 islands для интерактивных частей.

**Data flow:**
1. `portfolio-works.ts` экспортирует `PORTFOLIO_WORKS: PortfolioWork[]`
2. `portfolio/index.astro` импортирует, сортирует по дате DESC, передаёт в `<PortfolioGrid :works client:visible />`
3. `PortfolioGrid.vue` — фильтрация по `category` на клиенте, рендер masonry через CSS `columns`
4. `portfolio/[slug].astro` — `getStaticPaths()` итерирует массив, создаёт страницу per work, `<ProjectSlider :images client:load />`
5. `PortfolioPreview.astro` — SSR, берёт первые 3 записи, рендерит асимметричную сетку без JS

---

## Components

### `PortfolioGrid.vue`
- Props: `works: PortfolioWork[]`
- State: `activeCategory: WorkCategory | 'all'` (default `'all'`)
- Computed: `filteredWorks` — фильтр по `activeCategory`
- Pill-фильтры вверху (Все / 4 категории). Счётчик «Показано N из M»
- CSS `columns: 3` (desktop) / `columns: 2` (≥640px) / `columns: 1` (mobile)
- Карточка: фото на всю высоту, gradient overlay, тег + заголовок + локация поверх
- Hover: `scale(1.02)` + `box-shadow`
- Анимация фильтра: `opacity 0→1` + `translateY 8px→0` CSS transition
- Ссылки на `/portfolio/{work.id}` — обычные `<a>`, без router

### `ProjectSlider.vue`
- Props: `images: string[]`
- State: `current: number` (индекс активного фото)
- Главное фото: `aspect-ratio: 4/3`, `object-fit: cover`
- Thumbnails: горизонтальный прокручиваемый ряд, `aspect-ratio: 1`, клик → переключает `current`
- Стрелки влево/вправо: prev/next с wrap (last → first)
- Keyboard: `keydown` `ArrowLeft` / `ArrowRight` на `window` при mount, cleanup при unmount
- Нет внешних зависимостей — только Vue 3 `ref`/`computed`

### `PortfolioPreview.astro`
- Astro SSR, никакого `client:*`
- Берёт `PORTFOLIO_WORKS.slice(0, 3)`
- Layout: `display: grid; grid-template-columns: 1.6fr 1fr; grid-template-rows: 1fr 1fr`
- Первая карточка: `grid-row: 1 / 3` — занимает обе строки
- Каждая карточка: `<a href="/portfolio/{id}">`, фото + overlay + тег + заголовок + локация
- Под сеткой: счётчик «N фотоотчётов» + кнопка «Все работы →»
- Помещается в `index.astro` между `<Reviews />` и `<Promo client:idle />`

---

## Pages

### `/portfolio` (`src/pages/portfolio/index.astro`)

```
title: "Наши работы — фотоотчёты монтажей дверей в Челябинске | ВФД"
description: "Фотоотчёты установки межкомнатных, скрытых, входных дверей и алюминиевых перегородок в Челябинске. Реальные объекты от салона ВФД."
```

- Breadcrumb: Главная → Наши работы
- H1: «Наши работы — фотоотчёты с объектов»
- JSON-LD: `BreadcrumbList`
- `<PortfolioGrid :works={sorted} client:visible />`

### `/portfolio/[slug]` (`src/pages/portfolio/[slug].astro`)

```
title: `${work.title} — ВФД Челябинск`
description: work.description
```

- `getStaticPaths()` по `PORTFOLIO_WORKS`
- Breadcrumb: Главная → Наши работы → `work.title`
- `<ProjectSlider :images={work.images} client:load />`
- Под слайдером:
  - H1: `work.title`
  - Мета-строка: дата · категория · `work.location` · `N дверей` (если `doorCount`)
  - `work.story` — текстовый блок (если есть)
  - Chips `work.features` (если есть)
  - Строка «Модель: work.model» (если есть)
  - CTA: «Хотите так же? Позвоните нам» (номер из `contacts-data.ts`) + «← Все работы»
- JSON-LD: `ImageGallery` + `BreadcrumbList`

**`ImageGallery` schema:**
```json
{
  "@type": "ImageGallery",
  "name": "work.title",
  "description": "work.description",
  "dateCreated": "work.date",
  "image": ["work.images[0]", "..."],
  "contentLocation": { "@type": "Place", "name": "work.location" }
}
```

---

## Sitemap

В `astro.config.mjs` добавить в `serialize()`:
```js
if (/\/portfolio\/?$/.test(u)) return { ...item, changefreq: 'weekly', priority: 0.8 }
if (/\/portfolio\/.+/.test(u)) return { ...item, changefreq: 'monthly', priority: 0.65 }
```

---

## Adding New Works — Developer Flow

1. Открыть `src/data/portfolio-works.ts`
2. Добавить объект `PortfolioWork` в **начало** массива `PORTFOLIO_WORKS`
3. `npm run build` — Astro сгенерирует страницу и обновит sitemap
4. `git add src/data/portfolio-works.ts && git commit`
5. `git push production main` (деплой)

---

## Migration: Hidden Doors

Существующие записи из `INVISIBLE_WORKS` (`skrytye-dveri-works.ts`) копируются в `PORTFOLIO_WORKS` с маппингом:
- `category: 'hidden'`
- `objectType: 'apartment'` (по умолчанию, корректируется вручную)
- `description` — добавляется вручную (~140 символов)
- Поля `series`, `edge`, `coating` → в `features[]` или `model`

`skrytye-dveri-works.ts` и его использование на `/catalog/skrytye-dveri` не трогаем — это отдельный рефактор.

---

## Constraints

- Astro 6.4.x + Vue 3 + Tailwind v4 — следовать существующим паттернам
- `@apply` не использовать в `<style>` блоках `.astro` — только прямые CSS-свойства или Tailwind utility в `class="..."`
- Изображения — только внешние CDN-ссылки (Yandex Cloud), не бандлить
- `client:visible` для PortfolioGrid (below-fold), `client:load` для ProjectSlider (выше сгиба)
- Sitemap: не включать в него `/keystatic` и `/api/keystatic` (уже есть фильтр)
- Не удалять и не модифицировать `skrytye-dveri-works.ts` в этой задаче
