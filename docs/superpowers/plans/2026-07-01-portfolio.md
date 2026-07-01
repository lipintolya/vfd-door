# Portfolio (Наши работы) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a `/portfolio` photo-report page with masonry grid + tag filters, individual `/portfolio/[slug]` project pages with photo slider, an SSR preview block on the homepage, and a single TypeScript data file for easy content updates.

**Architecture:** Static Astro pages (`getStaticPaths` for slug routes) + Vue 3 islands for interactivity (`PortfolioGrid.vue` for client-side filtering, `ProjectSlider.vue` for the photo slider). A single `src/data/portfolio-works.ts` is the one place to add new projects — build auto-generates all pages. SSR `PortfolioPreview.astro` on the homepage has no JS at all.

**Tech Stack:** Astro 6.4, Vue 3, Tailwind v4 (via `@tailwindcss/vite`), TypeScript strict

## Global Constraints

- **No `@apply` in `.astro` `<style>` blocks** — use direct CSS properties instead (e.g. `font-size: 1rem` not `@apply text-base`)
- **No `@apply` in Vue `<style>` blocks either** — use Tailwind utility classes in the `class=""` attributes
- Images are external CDN links (`storage.yandexcloud.net`) — never `import` or `<Image>` them
- `client:visible` for below-fold Vue islands, `client:load` for above-fold (e.g. the slider on a detail page)
- No new npm packages — zero external dependencies for slider or masonry
- `src/data/portfolio-works.ts` is the **only** file to edit when adding new works
- Do NOT modify or delete `src/data/skrytye-dveri-works.ts` — it's still used on `/catalog/skrytye-dveri`
- Tailwind v4 has `columns-{n}` and `break-inside-avoid` utilities — use them for masonry
- `BaseLayout` accepts `structuredData?: Record<string, unknown> | Record<string, unknown>[]`

---

### Task 1: Data module `src/data/portfolio-works.ts`

**Files:**
- Create: `src/data/portfolio-works.ts`

**Interfaces:**
- Produces: `PortfolioWork`, `WorkCategory`, `ObjectType`, `PORTFOLIO_WORKS`, `CATEGORY_LABELS`, `OBJECT_TYPE_LABELS` — consumed by Tasks 2, 3, 4, 5

- [ ] **Step 1: Create `src/data/portfolio-works.ts`**

```ts
/* ============================================================
   Наши работы — портфолио
   Чтобы добавить новую работу: вставь объект PortfolioWork
   в НАЧАЛО массива PORTFOLIO_WORKS.
   ============================================================ */

const CDN_OW = 'https://storage.yandexcloud.net/catalog-vfd/invisible/ourworks/'

export type WorkCategory = 'interior' | 'hidden' | 'partitions' | 'entrance'
export type ObjectType   = 'apartment' | 'house' | 'office' | 'commercial'

export const CATEGORY_LABELS: Record<WorkCategory, string> = {
  interior:   'Межкомнатные',
  hidden:     'Скрытые двери',
  partitions: 'Перегородки',
  entrance:   'Входные',
}

export const OBJECT_TYPE_LABELS: Record<ObjectType, string> = {
  apartment:  'Квартира',
  house:      'Частный дом',
  office:     'Офис',
  commercial: 'Коммерческая недвижимость',
}

export interface PortfolioWork {
  id:          string       // URL slug: '2026-06-17-urban-3room'
  date:        string       // ISO '2026-06-17'
  label:       string       // отображение: '17.06.2026'
  title:       string       // H1 на странице проекта
  description: string       // meta description, ~140 символов
  category:    WorkCategory
  objectType:  ObjectType
  location:    string       // 'Челябинск, ЖК Привилегия'
  story?:      string       // 2-3 предложения о проекте
  model?:      string       // 'Urban 1', 'Секрет', 'Alutech AL60'
  doorCount?:  number       // количество дверей / пролётов
  features?:   string[]     // ['Скрытые петли', 'Без наличников']
  images:      string[]     // images[0] — обложка
}

export const PORTFOLIO_WORKS: PortfolioWork[] = [
  {
    id:          '2026-06-17-sekret-pod-pokrasku',
    date:        '2026-06-17',
    label:       '17.06.2026',
    title:       'Скрытые двери «Секрет» под покраску в частной квартире',
    description: 'Дверь скрытого монтажа «Секрет» — полотно заподлицо со стеной, зазоры выверены вручную. Готово к покраске в цвет стен. Монтаж в Челябинске.',
    category:    'hidden',
    objectType:  'apartment',
    location:    'Челябинск, частный объект',
    story:       'Полотно установлено в одной плоскости со стеной, зазоры выверены вручную — после монтажа дверь готова под покраску в цвет стен.',
    model:       'Секрет',
    features:    ['Короб заподлицо', 'Скрытые петли', 'Без наличников'],
    images: [
      `${CDN_OW}16.06.26/7UN6NAn6RlJoy818Ox6UHyTxUavm1e_Nk32olpTpd38DWB-uy_OVrikpEHd8NPVFmmTdybwyZQvAHtddZbXNAAuR.webp`,
      `${CDN_OW}16.06.26/CF5LXIr2L7_lXBexI7LRGPXOVeUmX44RPSNPP-lkSkTXuADcTd7XzorEV1JUazPZnzF0u00kh1q92F1Id2DN0BNe.webp`,
      `${CDN_OW}16.06.26/tWn2QcmlFut0c3aki_ODzSnm8xfmYMcxpBFOPKdVM8DK8vZeY9IArl-4nyKS0zXn7cmAheL9F4sjr34G1qhl553s.webp`,
      `${CDN_OW}16.06.26/uidj-G7YEZlx-koSXLy4QUJSW-GrP--minZFlWrSnxwvxJ8POKlNOzxeG3AOo5yoIxn9y85cv9DVHxVOEbKEe59n.webp`,
    ],
  },
  {
    id:          '2026-01-05-sekret-chernaya-kromka',
    date:        '2026-01-05',
    label:       '05.01.2026',
    title:       'Скрытые двери «Секрет» с чёрной алюминиевой кромкой',
    description: 'Установка дверей скрытого монтажа «Секрет» с чёрной алюминиевой кромкой по периметру. Минималистичный дизайн, Челябинск.',
    category:    'hidden',
    objectType:  'apartment',
    location:    'Челябинск',
    story:       'Установили дверь скрытого монтажа с чёрной алюминиевой кромкой по периметру.',
    model:       'Секрет',
    features:    ['Чёрная алюминиевая кромка'],
    images: [
      `${CDN_OW}05.01.26/SrSaJHteDxFsF45XRcrxgY1ntwoHiJLdXACpn3C0H32eSurQ4LPGhR9YqAHVEOATSEU3Tw3bBMn_EWe2qMk30uQm.webp`,
      `${CDN_OW}05.01.26/Vri69KHrmJZ5ixVa9KptncDKtNeEUv51UWgWhXKFEMqZ0nZ84URREw_llqwQ4nHKcc8bKJh-MZ_SE4lsfdyFSQU8.webp`,
    ],
  },
  {
    id:          '2025-10-21-sekret-privilegiya',
    date:        '2025-10-21',
    label:       '21.10.2025',
    title:       'Двери скрытого монтажа «Секрет» в ЖК Привилегия',
    description: 'Монтаж дверей скрытого монтажа «Секрет» с чёрной алюминиевой кромкой в ЖК Привилегия, Челябинск. Установка перед финишной отделкой.',
    category:    'hidden',
    objectType:  'apartment',
    location:    'Челябинск, ЖК Привилегия',
    story:       'Установили дверь скрытого монтажа с чёрной алюминиевой кромкой в ЖК Привилегия. Монтаж выполнен перед финишной отделкой стен.',
    model:       'Секрет',
    features:    ['Чёрная алюминиевая кромка', 'Под покраску'],
    images: [
      `${CDN_OW}21.10.25/GVUk8kmwYRgdLkO2nAKVkccb7ZReMFQ6bm4DrPVaYG8k6uoAOmZcr20wr3usWUdS_Fy_mFk80Vs8CvZz3aXui6tE-1.webp`,
      `${CDN_OW}21.10.25/GVUk8kmwYRgdLkO2nAKVkccb7ZReMFQ6bm4DrPVaYG8k6uoAOmZcr20wr3usWUdS_Fy_mFk80Vs8CvZz3aXui6tE.webp`,
      `${CDN_OW}21.10.25/pOSS22itQBq3S9XIiFeQOneKqFxzLZhxhtl8ZP3_Yrnm-uYizzeYzgQguHSSu7mrgZgiQY8m0znFwLKu5seYQ8Qb.webp`,
    ],
  },
  {
    id:          '2025-10-17-sekret-oboi-salon',
    date:        '2025-10-17',
    label:       '17.10.2025',
    title:       'Скрытые двери «Секрет» с поклейкой обоев — выставочный образец',
    description: 'Скрытые двери «Секрет» с обоями прямо на полотне — посмотрите образец в нашем салоне на Братьев Кашириных, 131Б, Челябинск.',
    category:    'hidden',
    objectType:  'commercial',
    location:    'Челябинск, салон ВФД на Кашириных',
    story:       'Реализовали идею с поклейкой обоев на дверь скрытого монтажа. Образец можно посмотреть в нашем фирменном салоне на Кашириных, 131Б.',
    model:       'Секрет',
    features:    ['Обои на полотне', 'Чёрная алюминиевая кромка'],
    images: [
      `${CDN_OW}17.10.25/4a4dICVgZw4zQ6eyxWyX5g57oGMNz6Trzt-g6f3fkxy2Ra4Cd8s3NaEcbOmf-SUdpMvyCmcDiZyx_2sM2UuDzEIJ.webp`,
      `${CDN_OW}17.10.25/7kqCtqhk4MBTHq5TQMKuLFS0bEdKUrxoQoW2rfS6Mxph0m1AyqWpQtGhZ7G6862Lu3OEA3ZrSVwypHKDb_Llckx5.webp`,
      `${CDN_OW}17.10.25/kdIiQ-53bh6U0RfDlzcgk2Xj12-V6RaKAEmtYB2Kzuj-EGQHjcejMjl5pWh4bjMnXXEC-yDbIvc0U1mCB-RkvZ8D.webp`,
    ],
  },
  {
    id:          '2025-07-29-sekret-privilegiya-02',
    date:        '2025-07-29',
    label:       '29.07.2025',
    title:       'Монтаж дверей скрытого монтажа «Секрет» в ЖК Привилегия',
    description: 'Установка 3 дверей скрытого монтажа «Секрет» с чёрной алюминиевой кромкой в квартире ЖК Привилегия, Челябинск.',
    category:    'hidden',
    objectType:  'apartment',
    location:    'Челябинск, ЖК Привилегия',
    story:       'Установили 3 двери скрытого монтажа «Секрет» с чёрной алюминиевой кромкой по периметру в ЖК Привилегия.',
    model:       'Секрет',
    doorCount:   3,
    features:    ['Чёрная алюминиевая кромка', 'Без наличников'],
    images: [
      `${CDN_OW}29.07.25/-tygOqs6wWnQRncuyldbijKD30OM1RSc1rm0INTl1Xf5-7kpZwGgQxV25AAdzllP-FNh7amcKdZ0Lxb7er_V3P6P.webp`,
      `${CDN_OW}29.07.25/A6w3g6VFobsKsLaxAhvYypDKKbhmM5qT16v_5cirjfO-Oww6diFQXoMt4lpjN5-rwjCXh9IvvlhRJRCAOXVbi0x7.webp`,
      `${CDN_OW}29.07.25/L_thnz01M389akNR7PIdwcMnaC2bMpOJoK-P4464-Hu_bogj6prnFk_kvd7Ae6DlAtqWVQseR9BTWeuqPMgEC3CZ.webp`,
      `${CDN_OW}29.07.25/bJnzaZd486cmu-j3C-T_LVXmEWQ_2CZp9PMAIO4HuYVC_mzHjl9cmAIo5yoIxn9y85cv9DVHxVOEbKEe59n.webp`,
      `${CDN_OW}29.07.25/bzDNJ6XEeYDby_Uflth_lNZjvZ9a88OPkGw7VEa2VAniUt-6wE1b--lV8Uy4AojA2Jr8cshdowIhUFfQZfx9_HlEp.webp`,
      `${CDN_OW}29.07.25/wtyYghspdRhfrTNLaeRWb4NIlTxv5EKE4fjYu59AFNATzLNut6rDqFJfDaL4ix2LDryK6YCH8ITGgArplRG7twF0.webp`,
    ],
  },
]
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /Users/tolya/Projects/vfd-door && npx astro check 2>&1 | head -30
```

Expected: zero errors from `portfolio-works.ts`

- [ ] **Step 3: Commit**

```bash
git add src/data/portfolio-works.ts
git commit -m "feat: add portfolio-works data module with 5 seed works"
```

---

### Task 2: Portfolio listing page (`PortfolioGrid.vue` + `portfolio/index.astro`)

**Files:**
- Create: `src/components/portfolio/PortfolioGrid.vue`
- Create: `src/pages/portfolio/index.astro`

**Interfaces:**
- Consumes: `PORTFOLIO_WORKS: PortfolioWork[]`, `CATEGORY_LABELS`, `WorkCategory` from `../../data/portfolio-works`
- Produces: `/portfolio` page with filter pills + masonry grid

- [ ] **Step 1: Create `src/components/portfolio/PortfolioGrid.vue`**

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'
import type { PortfolioWork, WorkCategory } from '../../data/portfolio-works'
import { CATEGORY_LABELS } from '../../data/portfolio-works'

const props = defineProps<{ works: PortfolioWork[] }>()

type FilterKey = WorkCategory | 'all'

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all',        label: 'Все работы' },
  { key: 'interior',   label: CATEGORY_LABELS.interior },
  { key: 'hidden',     label: CATEGORY_LABELS.hidden },
  { key: 'partitions', label: CATEGORY_LABELS.partitions },
  { key: 'entrance',   label: CATEGORY_LABELS.entrance },
]

const active = ref<FilterKey>('all')

const filtered = computed(() =>
  active.value === 'all'
    ? props.works
    : props.works.filter(w => w.category === active.value)
)
</script>

<template>
  <div>
    <!-- Filter pills -->
    <div class="flex flex-wrap gap-2 mb-6">
      <button
        v-for="f in FILTERS"
        :key="f.key"
        @click="active = f.key"
        :class="[
          'px-4 py-2 rounded-full text-sm font-bold border-[1.5px] transition-colors duration-150',
          active === f.key
            ? 'bg-slate-900 text-white border-slate-900'
            : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
        ]"
      >
        {{ f.label }}
      </button>
    </div>

    <!-- Count -->
    <p class="text-sm text-slate-500 mb-8">
      Показано {{ filtered.length }} из {{ works.length }} работ
    </p>

    <!-- Masonry grid -->
    <div class="columns-1 sm:columns-2 lg:columns-3 gap-x-4">
      <a
        v-for="work in filtered"
        :key="work.id"
        :href="`/portfolio/${work.id}`"
        class="mb-4 block break-inside-avoid rounded-2xl overflow-hidden relative group"
      >
        <img
          :src="work.images[0]"
          :alt="work.title"
          loading="lazy"
          decoding="async"
          class="w-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div class="absolute bottom-0 left-0 right-0 p-4">
          <span class="inline-block text-xs font-extrabold uppercase tracking-wider bg-teal-500 text-white px-2 py-0.5 rounded mb-1.5">
            {{ CATEGORY_LABELS[work.category] }}
          </span>
          <h3 class="text-sm font-bold text-white leading-snug">{{ work.title }}</h3>
          <p class="text-xs text-white/65 mt-1">📍 {{ work.location }}</p>
        </div>
      </a>
    </div>

    <!-- Empty state -->
    <p v-if="filtered.length === 0" class="text-slate-500 text-base py-12 text-center">
      Работ по этой категории пока нет.
    </p>
  </div>
</template>
```

- [ ] **Step 2: Create `src/pages/portfolio/index.astro`**

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro'
import PortfolioGrid from '../../components/portfolio/PortfolioGrid.vue'
import { PORTFOLIO_WORKS } from '../../data/portfolio-works'

const works = [...PORTFOLIO_WORKS].sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
)

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Главная', item: 'https://vfd74.ru' },
    { '@type': 'ListItem', position: 2, name: 'Наши работы', item: 'https://vfd74.ru/portfolio' },
  ],
}
---

<BaseLayout
  title="Наши работы — фотоотчёты монтажей дверей в Челябинске | ВФД"
  description="Фотоотчёты установки межкомнатных, скрытых, входных дверей и алюминиевых перегородок в Челябинске. Реальные объекты от салона ВФД."
  structuredData={[breadcrumbSchema]}
>
  <section class="section">
    <div class="container">

      <nav aria-label="Хлебные крошки" class="mb-6">
        <ol class="flex items-center gap-2 text-sm text-slate-500">
          <li><a href="/" class="hover:text-teal-600 transition-colors">Главная</a></li>
          <li aria-hidden="true" class="text-slate-300">/</li>
          <li class="text-slate-700 font-medium">Наши работы</li>
        </ol>
      </nav>

      <header class="max-w-3xl mb-10 md:mb-12">
        <p class="mb-3 text-xs font-extrabold uppercase tracking-widest text-teal-600">
          Портфолио
        </p>
        <h1 class="text-3xl font-extrabold leading-tight tracking-tight text-slate-900 md:text-5xl">
          Наши работы — фотоотчёты с объектов
        </h1>
        <p class="mt-4 text-base leading-relaxed text-slate-600 md:text-lg">
          Реальные проекты монтажа дверей и перегородок в Челябинске
        </p>
      </header>

      <PortfolioGrid works={works} client:visible />

    </div>
  </section>
</BaseLayout>
```

- [ ] **Step 3: Run dev server and verify**

```bash
npm run dev
```

Open `http://localhost:4321/portfolio` — expect:
- H1 «Наши работы — фотоотчёты с объектов»
- Filter pills (Все работы / Межкомнатные / Скрытые двери / Перегородки / Входные)
- Counter «Показано 5 из 5 работ»
- 5 cards in masonry layout with images, teal category tags, titles, locations
- Clicking a filter pill hides/shows cards correctly
- Clicking a card navigates to `/portfolio/2026-06-17-sekret-pod-pokrasku` (404 expected at this step — that's OK)

- [ ] **Step 4: Commit**

```bash
git add src/components/portfolio/PortfolioGrid.vue src/pages/portfolio/index.astro
git commit -m "feat: add portfolio listing page with masonry grid and category filters"
```

---

### Task 3: Project detail page (`ProjectSlider.vue` + `portfolio/[slug].astro`)

**Files:**
- Create: `src/components/portfolio/ProjectSlider.vue`
- Create: `src/pages/portfolio/[slug].astro`

**Interfaces:**
- Consumes: `PORTFOLIO_WORKS`, `CATEGORY_LABELS`, `OBJECT_TYPE_LABELS`, `PortfolioWork` from `../../data/portfolio-works`; `companyLegalInfo` from `../../lib/contacts-data`
- Produces: `/portfolio/[slug]` pages; `ProjectSlider` component used by the page

- [ ] **Step 1: Create `src/components/portfolio/ProjectSlider.vue`**

```vue
<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps<{ images: string[] }>()

const current = ref(0)

const prev = () => {
  current.value = (current.value - 1 + props.images.length) % props.images.length
}
const next = () => {
  current.value = (current.value + 1) % props.images.length
}

const onKey = (e: KeyboardEvent) => {
  if (e.key === 'ArrowLeft')  prev()
  if (e.key === 'ArrowRight') next()
}

onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <div>
    <!-- Main photo -->
    <div class="relative overflow-hidden rounded-2xl bg-slate-100 aspect-[4/3]">
      <img
        :src="images[current]"
        :alt="`Фото ${current + 1} из ${images.length}`"
        loading="eager"
        decoding="async"
        class="w-full h-full object-cover"
      />

      <!-- Prev arrow -->
      <button
        v-if="images.length > 1"
        @click="prev"
        aria-label="Предыдущее фото"
        class="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/40 text-white flex items-center justify-center text-xl hover:bg-black/60 transition-colors"
      >‹</button>

      <!-- Next arrow -->
      <button
        v-if="images.length > 1"
        @click="next"
        aria-label="Следующее фото"
        class="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/40 text-white flex items-center justify-center text-xl hover:bg-black/60 transition-colors"
      >›</button>

      <!-- Counter -->
      <div
        v-if="images.length > 1"
        class="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2.5 py-1 rounded-full"
      >
        {{ current + 1 }} / {{ images.length }}
      </div>
    </div>

    <!-- Thumbnails -->
    <div v-if="images.length > 1" class="flex gap-2 mt-3 overflow-x-auto pb-1">
      <button
        v-for="(img, i) in images"
        :key="i"
        @click="current = i"
        :aria-label="`Фото ${i + 1}`"
        :class="[
          'flex-none w-16 h-16 overflow-hidden rounded-lg border-2 transition-colors',
          i === current ? 'border-teal-500' : 'border-transparent hover:border-slate-300'
        ]"
      >
        <img
          :src="img"
          :alt="`Миниатюра ${i + 1}`"
          loading="lazy"
          decoding="async"
          class="w-full h-full object-cover"
        />
      </button>
    </div>
  </div>
</template>
```

- [ ] **Step 2: Create `src/pages/portfolio/[slug].astro`**

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro'
import ProjectSlider from '../../components/portfolio/ProjectSlider.vue'
import { PORTFOLIO_WORKS, CATEGORY_LABELS, OBJECT_TYPE_LABELS } from '../../data/portfolio-works'
import { companyLegalInfo } from '../../lib/contacts-data'

export async function getStaticPaths() {
  return PORTFOLIO_WORKS.map((work) => ({
    params: { slug: work.id },
    props:  { work },
  }))
}

const { work } = Astro.props
const canonicalUrl = `https://vfd74.ru/portfolio/${work.id}`
const phone = companyLegalInfo.contacts.phone[0]!

const imageGallerySchema = {
  '@context':       'https://schema.org',
  '@type':          'ImageGallery',
  name:             work.title,
  description:      work.description,
  dateCreated:      work.date,
  image:            work.images,
  contentLocation:  { '@type': 'Place', name: work.location },
  author: {
    '@type': 'Organization',
    name:    'ВФД — Салон дверей в Челябинске',
    url:     'https://vfd74.ru',
  },
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type':    'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Главная',      item: 'https://vfd74.ru' },
    { '@type': 'ListItem', position: 2, name: 'Наши работы',  item: 'https://vfd74.ru/portfolio' },
    { '@type': 'ListItem', position: 3, name: work.title,     item: canonicalUrl },
  ],
}
---

<BaseLayout
  title={`${work.title} — ВФД Челябинск`}
  description={work.description}
  ogImage={work.images[0]}
  structuredData={[imageGallerySchema, breadcrumbSchema]}
>
  <article class="section">
    <div class="container">
      <div class="max-w-4xl mx-auto">

        <!-- Breadcrumb -->
        <nav aria-label="Хлебные крошки" class="mb-6">
          <ol class="flex items-center gap-2 text-sm text-slate-500 flex-wrap">
            <li><a href="/" class="hover:text-teal-600 transition-colors">Главная</a></li>
            <li aria-hidden="true" class="text-slate-300">/</li>
            <li><a href="/portfolio" class="hover:text-teal-600 transition-colors">Наши работы</a></li>
            <li aria-hidden="true" class="text-slate-300">/</li>
            <li class="text-slate-700 font-medium truncate max-w-48">{work.title}</li>
          </ol>
        </nav>

        <!-- Photo slider -->
        <ProjectSlider images={work.images} client:load />

        <!-- Header -->
        <header class="mt-8 mb-6">
          <div class="flex flex-wrap items-center gap-2 mb-3">
            <span class="inline-block text-xs font-extrabold uppercase tracking-wider bg-teal-500 text-white px-2.5 py-1 rounded">
              {CATEGORY_LABELS[work.category]}
            </span>
            <span class="text-xs text-slate-500">{OBJECT_TYPE_LABELS[work.objectType]}</span>
            <time datetime={work.date} class="text-xs text-slate-500">· {work.label}</time>
          </div>
          <h1 class="text-2xl font-extrabold leading-tight tracking-tight text-slate-900 md:text-3xl">
            {work.title}
          </h1>
          <p class="mt-2 text-sm text-slate-500">📍 {work.location}{work.doorCount ? ` · ${work.doorCount} ${work.doorCount === 1 ? 'дверь' : work.doorCount < 5 ? 'двери' : 'дверей'}` : ''}</p>
        </header>

        <!-- Story -->
        {work.story && (
          <p class="text-base leading-relaxed text-slate-700 mb-6">{work.story}</p>
        )}

        <!-- Model -->
        {work.model && (
          <p class="text-sm text-slate-600 mb-4">
            <span class="font-semibold text-slate-800">Модель / серия:</span> {work.model}
          </p>
        )}

        <!-- Features -->
        {work.features && work.features.length > 0 && (
          <div class="flex flex-wrap gap-2 mb-8">
            {work.features.map(f => (
              <span class="text-xs font-semibold bg-slate-100 text-slate-700 px-3 py-1.5 rounded-full">
                {f}
              </span>
            ))}
          </div>
        )}

        <!-- CTA -->
        <div class="mt-10 pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div>
            <p class="text-base font-bold text-slate-900 mb-1">Хотите так же?</p>
            <p class="text-sm text-slate-600">Позвоните нам — бесплатно приедем, замерим и рассчитаем</p>
          </div>
          <a
            href={`tel:${phone.raw}`}
            class="flex-none inline-flex items-center gap-2 rounded-full bg-teal-500 px-6 py-3 text-sm font-bold text-white hover:bg-teal-600 transition-colors"
          >
            {phone.label}
          </a>
        </div>

        <!-- Back link -->
        <div class="mt-8">
          <a href="/portfolio" class="inline-flex items-center gap-2 text-sm font-semibold text-teal-600 hover:text-teal-700 transition-colors">
            <svg viewBox="0 0 16 16" fill="none" class="w-4 h-4" aria-hidden="true">
              <path d="M13 8H3M7 4l-4 4 4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Все работы
          </a>
        </div>

      </div>
    </div>
  </article>
</BaseLayout>
```

- [ ] **Step 3: Verify in dev server**

```bash
npm run dev
```

- Open `http://localhost:4321/portfolio` — cards now link correctly
- Open `http://localhost:4321/portfolio/2026-06-17-sekret-pod-pokrasku` — expect:
  - Photo slider with 4 images, prev/next arrows, thumbnail strip
  - Keyboard ←/→ switches photos
  - H1 «Скрытые двери «Секрет» под покраску в частной квартире»
  - Green «Скрытые двери» badge + «Квартира» + date
  - Location, story paragraph, feature chips
  - CTA block with phone
  - «Все работы» back link

- [ ] **Step 4: Commit**

```bash
git add src/components/portfolio/ProjectSlider.vue src/pages/portfolio/[slug].astro
git commit -m "feat: add portfolio project detail page with photo slider"
```

---

### Task 4: Homepage preview `PortfolioPreview.astro`

**Files:**
- Create: `src/components/portfolio/PortfolioPreview.astro`

**Interfaces:**
- Consumes: `PORTFOLIO_WORKS`, `CATEGORY_LABELS` from `../../data/portfolio-works`
- Produces: SSR Astro component rendered as HTML, no JS; consumed by Task 5

- [ ] **Step 1: Create `src/components/portfolio/PortfolioPreview.astro`**

```astro
---
import { PORTFOLIO_WORKS, CATEGORY_LABELS } from '../../data/portfolio-works'

const preview = [...PORTFOLIO_WORKS]
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  .slice(0, 3)
---

{preview.length > 0 && (
  <section class="section" aria-labelledby="portfolio-preview-heading">
    <div class="container">

      <header class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 md:mb-10">
        <div>
          <p class="mb-2 text-xs font-extrabold uppercase tracking-widest text-teal-600">
            Наши работы
          </p>
          <h2 id="portfolio-preview-heading" class="text-3xl font-extrabold leading-tight tracking-tight text-slate-900 md:text-4xl">
            Фотоотчёты с объектов
          </h2>
          <p class="mt-2 text-base text-slate-600">
            Реальные проекты монтажа дверей в Челябинске
          </p>
        </div>
        <a
          href="/portfolio"
          class="flex-none inline-flex items-center gap-2 rounded-full border-[1.5px] border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-900 hover:border-teal-500 hover:bg-teal-500 hover:text-white transition-colors duration-200"
        >
          Все работы
          <svg viewBox="0 0 16 16" fill="none" class="w-3.5 h-3.5" aria-hidden="true">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </a>
      </header>

      <!-- Asymmetric grid: big card left (spans 2 rows) + 2 small cards right -->
      <div class="portfolio-grid">
        {preview.map((work, i) => (
          <a
            href={`/portfolio/${work.id}`}
            class:list={['portfolio-card', i === 0 ? 'portfolio-card--main' : '', 'group']}
          >
            <img
              src={work.images[0]}
              alt={work.title}
              loading={i === 0 ? 'eager' : 'lazy'}
              decoding="async"
              class="portfolio-card__img"
            />
            <div class="portfolio-card__overlay" />
            <div class="portfolio-card__meta">
              <span class="portfolio-card__tag">{CATEGORY_LABELS[work.category]}</span>
              <p class="portfolio-card__title">{work.title}</p>
              <p class="portfolio-card__loc">📍 {work.location}</p>
            </div>
          </a>
        ))}
      </div>

      <!-- Count chip -->
      <div class="mt-5 flex items-center gap-3">
        <span class="inline-flex items-center gap-1.5 text-sm text-slate-500 font-medium">
          <span class="w-1.5 h-1.5 rounded-full bg-teal-500 inline-block"></span>
          {PORTFOLIO_WORKS.length} {PORTFOLIO_WORKS.length === 1 ? 'фотоотчёт' : PORTFOLIO_WORKS.length < 5 ? 'фотоотчёта' : 'фотоотчётов'} в портфолио
        </span>
      </div>

    </div>
  </section>
)}

<style>
  .portfolio-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
  .portfolio-card {
    display: block;
    position: relative;
    overflow: hidden;
    border-radius: 1.25rem;
    min-height: 200px;
  }
  .portfolio-card__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }
  .portfolio-card:hover .portfolio-card__img {
    transform: scale(1.03);
  }
  .portfolio-card__overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.15) 50%, transparent 100%);
  }
  .portfolio-card__meta {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 1.25rem;
  }
  .portfolio-card__tag {
    display: inline-block;
    font-size: 0.65rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    background: #14b8a6;
    color: #fff;
    padding: 0.15em 0.55em;
    border-radius: 4px;
    margin-bottom: 0.4rem;
  }
  .portfolio-card__title {
    font-size: 0.875rem;
    font-weight: 700;
    color: #fff;
    line-height: 1.35;
  }
  .portfolio-card__loc {
    font-size: 0.7rem;
    color: rgba(255,255,255,0.65);
    margin-top: 0.2rem;
  }

  @media (min-width: 640px) {
    .portfolio-grid {
      grid-template-columns: 1.6fr 1fr;
      grid-template-rows: 240px 240px;
    }
    .portfolio-card--main {
      grid-row: 1 / 3;
    }
    .portfolio-card {
      min-height: unset;
    }
  }
</style>
```

- [ ] **Step 2: Verify component in isolation** (it will be wired in Task 5, but can check by temporarily adding to a page)

No dev check required at this step — verify when wiring in Task 5.

- [ ] **Step 3: Commit**

```bash
git add src/components/portfolio/PortfolioPreview.astro
git commit -m "feat: add PortfolioPreview SSR component for homepage"
```

---

### Task 5: Wire into homepage + update sitemap + final build

**Files:**
- Modify: `src/pages/index.astro`
- Modify: `astro.config.mjs`

**Interfaces:**
- Consumes: `PortfolioPreview.astro` from Task 4
- Produces: homepage with works preview, sitemap with `/portfolio` routes

- [ ] **Step 1: Add `PortfolioPreview` to `src/pages/index.astro`**

Add the import after the existing imports:

```astro
import PortfolioPreview from '../components/portfolio/PortfolioPreview.astro'
```

Place `<PortfolioPreview />` between `<Reviews client:visible />` and `<Promo client:idle />`:

```astro
  <HeroSlider client:load />
  <Features client:visible />
  <CatalogCategories client:visible />
  <Reviews client:visible />
  <PortfolioPreview />
  <Promo client:idle />
  <LatestArticles />
  <Faq client:idle />
```

- [ ] **Step 2: Update sitemap serialize in `astro.config.mjs`**

In the `serialize(item)` function, add two rules before the final `return`. Insert after the `/articles` rule:

```js
if (/\/portfolio\/?$/.test(u)) {
  return { ...item, changefreq: 'weekly', priority: 0.8 }
}
if (/\/portfolio\/.+/.test(u)) {
  return { ...item, changefreq: 'monthly', priority: 0.65 }
}
```

The full updated `serialize` function:

```js
serialize(item) {
  const u = item.url
  if (u === 'https://vfd74.ru/' || u === 'https://vfd74.ru') {
    return { ...item, changefreq: 'weekly', priority: 1.0 }
  }
  if (/\/(catalog|about|contacts|partitions)\/?$/.test(u)) {
    return { ...item, changefreq: 'weekly', priority: 0.8 }
  }
  if (/\/articles\/?$/.test(u)) {
    return { ...item, changefreq: 'weekly', priority: 0.7 }
  }
  if (/\/portfolio\/?$/.test(u)) {
    return { ...item, changefreq: 'weekly', priority: 0.8 }
  }
  if (/\/portfolio\/.+/.test(u)) {
    return { ...item, changefreq: 'monthly', priority: 0.65 }
  }
  return { ...item, changefreq: 'monthly', priority: 0.6 }
},
```

- [ ] **Step 3: Verify homepage in dev server**

```bash
npm run dev
```

Open `http://localhost:4321/` — expect:
- «Фотоотчёты с объектов» section between Reviews and Promo
- Asymmetric grid: large card on left spans full height, 2 smaller cards on right
- On mobile (< 640px): 3 cards stacked vertically
- Count chip: «5 фотоотчётов в портфолио»
- «Все работы →» button links to `/portfolio`

- [ ] **Step 4: Production build**

```bash
npm run build 2>&1 | tail -20
```

Expected output contains:
- `✓ Completed` with no errors
- Pages count increased (was 275, now should be ~282: +1 for /portfolio, +5 for /portfolio/[slug]×5, +1 for homepage rebuild = net +6-7 new routes)
- `/portfolio/` and `/portfolio/2026-06-17-sekret-pod-pokrasku` appear in build output

- [ ] **Step 5: Verify sitemap**

```bash
grep '/portfolio' dist/sitemap-0.xml
```

Expected output:
```
<loc>https://vfd74.ru/portfolio/</loc>
<changefreq>weekly</changefreq><priority>0.8</priority>
<loc>https://vfd74.ru/portfolio/2026-06-17-sekret-pod-pokrasku/</loc>
<changefreq>monthly</changefreq><priority>0.65</priority>
... (5 project pages total)
```

- [ ] **Step 6: Commit**

```bash
git add src/pages/index.astro astro.config.mjs
git commit -m "feat: wire portfolio preview on homepage, update sitemap rules"
```
