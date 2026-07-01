# Homepage SEO + Keystatic Blog Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Улучшить SEO главной страницы и добавить блог с Keystatic CMS (редактор на localhost, статический билд без изменений деплоя).

**Architecture:** Keystatic локально редактирует `.mdoc` файлы в `src/content/articles/`, `@astrojs/markdoc` рендерит их через Astro content collections. В production-билде Keystatic автоматически выключается через `process.env.NODE_ENV !== 'production'` — деплой-пайплайн менять не нужно.

**Tech Stack:** Astro 6, Vue 3, Tailwind v4, `@keystatic/core`, `@keystatic/astro`, `@astrojs/markdoc`

## Global Constraints

- Не запускать `npm run deploy` и не делать `git push production main` — только локальная разработка
- Следовать паттерну компонентов: `section.section > div.container > header + content`
- Новые секции homepage — Vue islands с `client:visible` (ниже fold) или `client:load` (выше)
- `LatestArticles` — Astro-компонент (`.astro`), не Vue island — статический SSR, SEO-важен
- Кириллица в slug'ах запрещена — только Latin для URL статей
- `npm run build` — главный gate корректности после каждого таска

---

## File Map

**Создать:**
- `keystatic.config.ts` — конфиг коллекции articles
- `src/content/config.ts` — Astro content collection схема
- `src/content/articles/.gitkeep` — placeholder директории
- `src/components/home/Reviews.vue` — секция отзывов
- `src/components/home/LatestArticles.astro` — превью статей на главной
- `src/pages/articles/index.astro` — листинг всех статей
- `src/pages/articles/[slug].astro` — страница статьи
- `src/content/articles/kak-vybrat-mezhkomnatnye-dveri/index.mdoc` — сид-статья

**Изменить:**
- `src/pages/index.astro` — title, description, schema, новые секции
- `src/components/home/HeroSlider.vue` — первый слайд (H1)
- `src/components/home/Promo.vue` — обновить validUntil
- `astro.config.mjs` — markdoc + keystatic интеграции, sitemap правила

---

## Task 1: SEO metadata, H1, promo dates

**Files:**
- Modify: `src/pages/index.astro`
- Modify: `src/components/home/HeroSlider.vue:17-26`
- Modify: `src/components/home/Promo.vue:28-59`

**Interfaces:**
- Produces: обновлённый `<title>`, `<meta description>`, H1 в SSR HTML, работающая секция акций

- [ ] **Step 1: Обновить title и description в index.astro**

Заменить атрибуты `BaseLayout`:

```astro
<BaseLayout
  title="Межкомнатные и входные двери в Челябинске — ВФД"
  description="Официальный салон ВФД в Челябинске — 80+ моделей в наличии, бесплатный замер, монтаж под ключ. Межкомнатные, входные двери и алюминиевые перегородки на Кашириных, 131Б."
  structuredData={[faqSchema, localBusinessSchema]}
  preloadHero={true}
>
```

- [ ] **Step 2: Добавить aggregateRating в localBusinessSchema**

В `src/pages/index.astro` добавить после `priceRange: '₽₽'`:

```ts
aggregateRating: {
  '@type': 'AggregateRating',
  ratingValue: '4.9',
  reviewCount: '4',
  bestRating: '5',
},
```

- [ ] **Step 3: Обновить первый слайд HeroSlider (H1)**

В `src/components/home/HeroSlider.vue` заменить объект первого слайда (id: 1):

```ts
{
  id: 1,
  image: 'https://storage.yandexcloud.net/catalog-vfd/renders/hero-cover.webp',
  title: 'Межкомнатные и входные двери в Челябинске',
  subtitle: 'Официальный дилер ВФД с 2014 года',
  description: 'Фирменный салон на Братьев Кашириных, 131Б — 80+ моделей в наличии, замер и монтаж под ключ',
  cta: 'Смотреть каталог',
  ctaHref: '/catalog',
},
```

- [ ] **Step 4: Обновить validUntil в Promo.vue**

В `src/components/home/Promo.vue` обновить даты двух просроченных акций:

Акция id:1 (Майами) — заменить `validUntil: '2026-06-10'` на:
```ts
validUntil: '2026-09-01',
```

Акция id:3 (Флэт 2) — заменить `validUntil: '2026-06-15'` на:
```ts
validUntil: '2026-09-01',
```

- [ ] **Step 5: Проверить билд**

```bash
npm run build
```

Ожидаемый результат: `dist/` создан без ошибок, в `dist/index.html` в теге `<title>` — "Межкомнатные и входные двери в Челябинске — ВФД".

```bash
grep -o '<title>[^<]*</title>' dist/index.html
```

Ожидаемый вывод: `<title>Межкомнатные и входные двери в Челябинске — ВФД</title>`

- [ ] **Step 6: Commit**

```bash
git add src/pages/index.astro src/components/home/HeroSlider.vue src/components/home/Promo.vue
git commit -m "seo: update title, description, H1 slide, promo dates"
```

---

## Task 2: Reviews section

**Files:**
- Create: `src/components/home/Reviews.vue`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes: ничего
- Produces: `<Reviews client:visible />` компонент, монтируется после CatalogCategories

- [ ] **Step 1: Создать Reviews.vue**

```vue
<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, useTemplateRef } from 'vue'

interface Review {
  id: number
  name: string
  date: string
  text: string
  rating: number
}

const REVIEWS: Review[] = [
  {
    id: 1,
    name: 'Ирина К.',
    date: '2025-11-15',
    text: 'Купили двери Иннова, очень довольны качеством. Замерщик приехал быстро, монтаж сделали аккуратно. Рекомендую!',
    rating: 5,
  },
  {
    id: 2,
    name: 'Алексей П.',
    date: '2025-10-08',
    text: 'Большой выбор, есть что посмотреть вживую. Помогли подобрать под интерьер. Поставили 3 двери — всё отлично.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Наталья С.',
    date: '2026-02-20',
    text: 'Заказывали алюминиевые перегородки для квартиры. Сделали за 40 дней как и обещали. Качество отличное.',
    rating: 5,
  },
  {
    id: 4,
    name: 'Дмитрий В.',
    date: '2026-04-12',
    text: 'Работаем с ВФД по проектам уже 2 года. Надёжные партнёры, всегда держат слово.',
    rating: 5,
  },
]

const formatDate = (dateStr: string): string =>
  new Date(dateStr).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })

const sectionRef = useTemplateRef<HTMLElement>('sectionEl')
const visible = ref(false)
let observer: IntersectionObserver | null = null

onMounted(() => {
  const el = sectionRef.value
  if (!el) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    visible.value = true
    return
  }
  observer = new IntersectionObserver(
    ([entry]) => {
      if (entry?.isIntersecting) { visible.value = true; observer?.disconnect() }
    },
    { threshold: 0.15 }
  )
  observer.observe(el)
})

onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <section
    ref="sectionEl"
    class="section bg-white"
    aria-labelledby="reviews-heading"
  >
    <div class="container">

      <!-- Header -->
      <header
        class="max-w-3xl mb-10 md:mb-16 transition-[opacity,transform] duration-700 ease-out motion-reduce:transition-none"
        :class="visible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'"
      >
        <p class="mb-3 text-xs font-extrabold uppercase tracking-widest text-teal-600">
          Отзывы клиентов
        </p>
        <h2 id="reviews-heading" class="text-3xl font-extrabold leading-tight tracking-tight text-slate-900 md:text-5xl">
          Нам доверяют
        </h2>
        <p class="mt-4 text-base leading-relaxed text-slate-600 md:text-lg">
          Более 5 000 довольных клиентов в Челябинске за 10 лет работы
        </p>
      </header>

      <!-- Grid -->
      <ul
        class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6"
        role="list"
        itemscope
        itemtype="https://schema.org/ItemList"
      >
        <li
          v-for="(review, idx) in REVIEWS"
          :key="review.id"
          class="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-6 transition-[opacity,transform] duration-700 ease-out motion-reduce:transition-none"
          :class="visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'"
          :style="{ transitionDelay: visible ? `${idx * 100}ms` : '0ms' }"
          itemprop="itemListElement"
          itemscope
          itemtype="https://schema.org/Review"
        >
          <!-- Stars -->
          <div class="flex gap-0.5" :aria-label="`Оценка: ${review.rating} из 5`">
            <svg
              v-for="i in review.rating"
              :key="i"
              class="h-4 w-4 fill-amber-400"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
          </div>

          <!-- Text -->
          <p
            class="flex-1 text-sm leading-relaxed text-slate-700"
            itemprop="reviewBody"
          >{{ review.text }}</p>

          <!-- Author + date -->
          <div class="flex items-center justify-between border-t border-slate-200 pt-4">
            <span
              class="text-sm font-semibold text-slate-900"
              itemprop="author"
              itemscope
              itemtype="https://schema.org/Person"
            >
              <span itemprop="name">{{ review.name }}</span>
            </span>
            <time
              :datetime="review.date"
              class="text-xs text-slate-500"
              itemprop="datePublished"
            >{{ formatDate(review.date) }}</time>
          </div>
        </li>
      </ul>

    </div>
  </section>
</template>
```

- [ ] **Step 2: Подключить Reviews в index.astro**

Добавить импорт после остальных imports:
```ts
import Reviews from '../components/home/Reviews.vue'
```

Добавить компонент между `<CatalogCategories>` и `<Promo>`:
```astro
<CatalogCategories client:visible />
<Reviews client:visible />
<Promo client:idle />
```

- [ ] **Step 3: Проверить билд**

```bash
npm run build
```

Ожидаемый результат: `dist/index.html` содержит `id="reviews-heading"`.

```bash
grep -c 'reviews-heading' dist/index.html
```

Ожидаемый вывод: `1`

- [ ] **Step 4: Commit**

```bash
git add src/components/home/Reviews.vue src/pages/index.astro
git commit -m "feat: add Reviews section to homepage"
```

---

## Task 3: Keystatic + Markdoc setup

**Files:**
- Create: `keystatic.config.ts`
- Create: `src/content/config.ts`
- Create: `src/content/articles/.gitkeep`
- Modify: `astro.config.mjs`
- Install: `@keystatic/core @keystatic/astro @astrojs/markdoc`

**Interfaces:**
- Produces:
  - `getCollection('articles')` → `CollectionEntry<'articles'>[]` с полями `{ title: string, description: string, publishDate: Date, coverImage?: string }`
  - Dev сервер отдаёт `/keystatic` (admin UI) и `/api/keystatic/*`
  - Production билд не включает Keystatic маршруты

- [ ] **Step 1: Установить пакеты**

```bash
npm install @keystatic/core @keystatic/astro @astrojs/markdoc
```

Ожидаемый результат: три новых пакета в `node_modules/`, `package.json` обновлён.

- [ ] **Step 2: Создать keystatic.config.ts**

```ts
import { config, collection, fields } from '@keystatic/core'

export default config({
  storage: { kind: 'local' },
  ui: { brand: { name: 'ВФД — Редактор статей' } },
  collections: {
    articles: collection({
      label: 'Статьи',
      slugField: 'title',
      path: 'src/content/articles/*',
      format: { contentField: 'body' },
      schema: {
        title: fields.slug({ name: { label: 'Заголовок статьи' } }),
        description: fields.text({
          label: 'Описание (meta description, до 160 символов)',
          multiline: true,
        }),
        publishDate: fields.date({ label: 'Дата публикации' }),
        coverImage: fields.text({
          label: 'URL обложки на Yandex Cloud (необязательно)',
          validation: { isRequired: false },
        }),
        body: fields.markdoc({ label: 'Содержание статьи' }),
      },
    }),
  },
})
```

> **Примечание о slug:** При создании статьи в редакторе поле "Заголовок" содержит две части — название (по-русски) и slug (латиница). Slug генерируется автоматически, но его нужно вручную скорректировать на латинский вариант, например `kak-vybrat-dveri` вместо транслита.

- [ ] **Step 3: Создать src/content/config.ts**

```ts
import { defineCollection, z } from 'astro:content'

const articles = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.coerce.date(),
    coverImage: z.string().optional(),
  }),
})

export const collections = { articles }
```

- [ ] **Step 4: Создать директорию для статей**

```bash
mkdir -p src/content/articles && touch src/content/articles/.gitkeep
```

- [ ] **Step 5: Обновить astro.config.mjs**

Заменить содержимое файла на:

```js
// @ts-check
import { defineConfig } from 'astro/config'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'
import vue from '@astrojs/vue'
import markdoc from '@astrojs/markdoc'
import keystatic from '@keystatic/astro'

const isDev = process.env.NODE_ENV !== 'production'

export default defineConfig({
  site: 'https://vfd74.ru',

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [
    vue(),
    markdoc(),
    ...(isDev ? [keystatic()] : []),
    sitemap({
      filter: (page) =>
        page !== 'https://vfd74.ru/privacy/' &&
        page !== 'https://vfd74.ru/privacy' &&
        !page.startsWith('https://vfd74.ru/keystatic') &&
        !page.startsWith('https://vfd74.ru/api/keystatic') &&
        !/\/models\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\/?$/.test(page),
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
        return { ...item, changefreq: 'monthly', priority: 0.6 }
      },
    }),
  ],
})
```

- [ ] **Step 6: Проверить dev-сервер (Keystatic открывается)**

```bash
npm run dev
```

Открыть в браузере: `http://localhost:4321/keystatic`

Ожидаемый результат: открывается интерфейс "ВФД — Редактор статей" с пустой коллекцией "Статьи".

Остановить сервер: `Ctrl+C`

- [ ] **Step 7: Проверить production билд (Keystatic исключён)**

```bash
npm run build
```

Ожидаемый результат: билд без ошибок, в `dist/` нет файлов `/keystatic`.

```bash
ls dist/ | grep -i keystatic || echo "OK: keystatic not in dist"
```

Ожидаемый вывод: `OK: keystatic not in dist`

- [ ] **Step 8: Commit**

```bash
git add keystatic.config.ts src/content/config.ts src/content/articles/.gitkeep astro.config.mjs package.json package-lock.json
git commit -m "feat: add Keystatic CMS + Markdoc for articles blog"
```

---

## Task 4: Articles pages + seed article

**Files:**
- Create: `src/pages/articles/index.astro`
- Create: `src/pages/articles/[slug].astro`
- Create: `src/content/articles/kak-vybrat-mezhkomnatnye-dveri/index.mdoc`

**Interfaces:**
- Consumes: `getCollection('articles')` из `astro:content`, возвращает `CollectionEntry<'articles'>[]`
- Produces:
  - `/articles` — листинг статей
  - `/articles/[slug]` — страница статьи с `BlogPosting` JSON-LD и `BreadcrumbList`
  - Каждый entry: `article.data.title`, `article.data.description`, `article.data.publishDate`, `article.data.coverImage?`, `article.id` (формат `slug/index.mdoc` или `slug.mdoc`)

Для получения чистого slug из `article.id`:
```ts
const slug = article.id.split('/')[0]!.replace(/\.mdoc$/, '')
```

- [ ] **Step 1: Создать сид-статью**

Создать файл `src/content/articles/kak-vybrat-mezhkomnatnye-dveri/index.mdoc`:

```
---
title: Как выбрать межкомнатные двери
description: Полный гайд по выбору межкомнатных дверей — покрытия, размеры, стекло, цвет. Советы от специалистов салона ВФД в Челябинске.
publishDate: 2026-07-01
coverImage: ''
---

## Какие бывают покрытия

Межкомнатные двери бывают с покрытием **эмаль**, **экошпон** и **ПЭТ**. У каждого — свои плюсы и минусы.

- **Эмаль** — прочное лакокрасочное покрытие, широкая палитра цветов, хорошо моется.
- **Экошпон** — имитация дерева, доступная цена, подходит для большинства интерьеров.
- **ПЭТ** — инновационное покрытие, не оставляет отпечатков пальцев, устойчиво к царапинам.

## Как выбрать размер

Стандартный дверной проём — 2000×800 мм. Перед заказом обязательно сделайте замер: ширину и высоту коробки, а также глубину проёма.

Если вы не уверены в замерах — вызовите нашего специалиста. В пределах Челябинска при заказе замер бесплатный.

## Со стеклом или без

Двери со стеклянными вставками визуально увеличивают пространство и пропускают свет между комнатами. Хорошо подходят для гостиной, коридора.

Для спальни и детской — лучше выбирать глухие двери.

## Как записаться на консультацию

Приходите в наш салон на Братьев Кашириных, 131Б или звоните по телефону. Поможем подобрать двери под ваш интерьер и бюджет.
```

- [ ] **Step 2: Создать src/pages/articles/index.astro**

```astro
---
import { getCollection } from 'astro:content'
import BaseLayout from '../../layouts/BaseLayout.astro'

const allArticles = await getCollection('articles')
const articles = allArticles.sort(
  (a, b) => b.data.publishDate.getTime() - a.data.publishDate.getTime()
)

const getSlug = (id: string) => id.split('/')[0]!.replace(/\.mdoc$/, '')

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Главная', item: 'https://vfd74.ru' },
    { '@type': 'ListItem', position: 2, name: 'Статьи', item: 'https://vfd74.ru/articles' },
  ],
}
---

<BaseLayout
  title="Статьи о дверях и ремонте — ВФД Челябинск"
  description="Полезные статьи о выборе дверей, покрытиях, монтаже и интерьере от специалистов салона ВФД в Челябинске."
  structuredData={[breadcrumbSchema]}
>
  <section class="section">
    <div class="container">
      <header class="max-w-3xl mb-10 md:mb-16">
        <nav aria-label="Хлебные крошки" class="mb-4">
          <ol class="flex items-center gap-2 text-sm text-slate-500">
            <li><a href="/" class="hover:text-teal-600 transition-colors">Главная</a></li>
            <li aria-hidden="true" class="text-slate-300">/</li>
            <li class="text-slate-700 font-medium">Статьи</li>
          </ol>
        </nav>
        <p class="mb-3 text-xs font-extrabold uppercase tracking-widest text-teal-600">Блог</p>
        <h1 class="text-3xl font-extrabold leading-tight tracking-tight text-slate-900 md:text-5xl">
          Полезные статьи о дверях
        </h1>
        <p class="mt-4 text-base leading-relaxed text-slate-600 md:text-lg">
          Советы по выбору, покрытиях, монтаже и уходе — от специалистов салона ВФД.
        </p>
      </header>

      {articles.length === 0 ? (
        <p class="text-slate-500 text-base">Статьи появятся совсем скоро.</p>
      ) : (
        <ul class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3" role="list">
          {articles.map((article) => {
            const slug = getSlug(article.id)
            return (
              <li>
                <a
                  href={`/articles/${slug}`}
                  class="group flex flex-col h-full rounded-2xl border border-slate-200 bg-white overflow-hidden hover:border-teal-400 hover:shadow-md transition-all duration-200"
                >
                  {article.data.coverImage && (
                    <div class="aspect-video overflow-hidden bg-slate-100">
                      <img
                        src={article.data.coverImage}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div class="flex flex-col flex-1 p-5">
                    <time
                      datetime={article.data.publishDate.toISOString()}
                      class="text-xs text-slate-500 mb-2"
                    >
                      {article.data.publishDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </time>
                    <h2 class="text-base font-bold text-slate-900 leading-snug mb-2 group-hover:text-teal-600 transition-colors">
                      {article.data.title}
                    </h2>
                    <p class="text-sm text-slate-600 leading-relaxed flex-1">
                      {article.data.description}
                    </p>
                    <span class="mt-4 text-sm font-semibold text-teal-600">
                      Читать →
                    </span>
                  </div>
                </a>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  </section>
</BaseLayout>
```

- [ ] **Step 3: Создать src/pages/articles/[slug].astro**

```astro
---
import { getCollection, render } from 'astro:content'
import BaseLayout from '../../layouts/BaseLayout.astro'

export async function getStaticPaths() {
  const articles = await getCollection('articles')
  return articles.map((article) => {
    const slug = article.id.split('/')[0]!.replace(/\.mdoc$/, '')
    return { params: { slug }, props: { article } }
  })
}

const { article } = Astro.props
const { Content } = await render(article)

const slug = article.id.split('/')[0]!.replace(/\.mdoc$/, '')
const canonicalUrl = `https://vfd74.ru/articles/${slug}`

const blogPostingSchema = {
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: article.data.title,
  description: article.data.description,
  ...(article.data.coverImage ? { image: article.data.coverImage } : {}),
  datePublished: article.data.publishDate.toISOString(),
  author: {
    '@type': 'Organization',
    name: 'ВФД — Салон дверей в Челябинске',
    url: 'https://vfd74.ru',
  },
  publisher: {
    '@type': 'Organization',
    name: 'ВФД — Салон дверей в Челябинске',
    logo: { '@type': 'ImageObject', url: 'https://vfd74.ru/favicon.svg' },
  },
  mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl },
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Главная', item: 'https://vfd74.ru' },
    { '@type': 'ListItem', position: 2, name: 'Статьи', item: 'https://vfd74.ru/articles' },
    { '@type': 'ListItem', position: 3, name: article.data.title, item: canonicalUrl },
  ],
}
---

<BaseLayout
  title={`${article.data.title} — ВФД Челябинск`}
  description={article.data.description}
  structuredData={[blogPostingSchema, breadcrumbSchema]}
>
  <article class="section">
    <div class="container">
      <div class="max-w-3xl mx-auto">

        <!-- Breadcrumb -->
        <nav aria-label="Хлебные крошки" class="mb-6">
          <ol class="flex items-center gap-2 text-sm text-slate-500 flex-wrap">
            <li><a href="/" class="hover:text-teal-600 transition-colors">Главная</a></li>
            <li aria-hidden="true" class="text-slate-300">/</li>
            <li><a href="/articles" class="hover:text-teal-600 transition-colors">Статьи</a></li>
            <li aria-hidden="true" class="text-slate-300">/</li>
            <li class="text-slate-700 font-medium truncate max-w-48">{article.data.title}</li>
          </ol>
        </nav>

        <!-- Cover image -->
        {article.data.coverImage && (
          <div class="aspect-video overflow-hidden rounded-2xl mb-8 bg-slate-100">
            <img
              src={article.data.coverImage}
              alt=""
              loading="eager"
              decoding="async"
              class="w-full h-full object-cover"
            />
          </div>
        )}

        <!-- Header -->
        <header class="mb-8">
          <time
            datetime={article.data.publishDate.toISOString()}
            class="text-sm text-slate-500 mb-3 block"
          >
            {article.data.publishDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
          </time>
          <h1 class="text-3xl font-extrabold leading-tight tracking-tight text-slate-900 md:text-4xl">
            {article.data.title}
          </h1>
        </header>

        <!-- Body -->
        <div class="article-body">
          <Content />
        </div>

        <!-- Back link -->
        <div class="mt-12 pt-8 border-t border-slate-200">
          <a href="/articles" class="inline-flex items-center gap-2 text-sm font-semibold text-teal-600 hover:text-teal-700 transition-colors">
            <svg viewBox="0 0 16 16" fill="none" class="w-4 h-4" aria-hidden="true">
              <path d="M13 8H3M7 4l-4 4 4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Все статьи
          </a>
        </div>

      </div>
    </div>
  </article>
</BaseLayout>

<style>
  .article-body :global(h2) {
    @apply text-2xl font-extrabold text-slate-900 mt-8 mb-4;
  }
  .article-body :global(h3) {
    @apply text-xl font-bold text-slate-900 mt-6 mb-3;
  }
  .article-body :global(p) {
    @apply text-slate-700 leading-relaxed mb-4 text-base;
  }
  .article-body :global(ul) {
    @apply list-disc pl-6 mb-4 space-y-1;
  }
  .article-body :global(ol) {
    @apply list-decimal pl-6 mb-4 space-y-1;
  }
  .article-body :global(li) {
    @apply text-slate-700;
  }
  .article-body :global(strong) {
    @apply font-semibold text-slate-900;
  }
  .article-body :global(a) {
    @apply text-teal-600 hover:underline;
  }
  .article-body :global(blockquote) {
    @apply border-l-4 border-teal-500 pl-4 italic text-slate-600 my-4;
  }
</style>
```

- [ ] **Step 4: Проверить билд со статьёй**

```bash
npm run build
```

Ожидаемый результат: в `dist/` появляются директории `articles/` и `articles/kak-vybrat-mezhkomnatnye-dveri/`.

```bash
ls dist/articles/
```

Ожидаемый вывод: `index.html kak-vybrat-mezhkomnatnye-dveri/`

- [ ] **Step 5: Проверить H1 на странице статьи**

```bash
grep -o '<h1[^>]*>[^<]*</h1>' dist/articles/kak-vybrat-mezhkomnatnye-dveri/index.html
```

Ожидаемый вывод содержит: `Как выбрать межкомнатные двери`

- [ ] **Step 6: Commit**

```bash
git add src/pages/articles/ src/content/articles/
git commit -m "feat: add articles listing and detail pages with seed article"
```

---

## Task 5: LatestArticles on homepage + final verification

**Files:**
- Create: `src/components/home/LatestArticles.astro`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes: `getCollection('articles')` → массив статей (может быть пустым)
- Produces: секция "Полезные статьи" между `<Promo>` и `<Faq>`, скрытая если статей нет

- [ ] **Step 1: Создать LatestArticles.astro**

```astro
---
import { getCollection } from 'astro:content'

const all = await getCollection('articles')
const articles = all
  .sort((a, b) => b.data.publishDate.getTime() - a.data.publishDate.getTime())
  .slice(0, 3)

const getSlug = (id: string) => id.split('/')[0]!.replace(/\.mdoc$/, '')
---

{articles.length > 0 && (
  <section class="section bg-slate-50" aria-labelledby="articles-heading">
    <div class="container">

      <header class="max-w-3xl mb-10 md:mb-16">
        <p class="mb-3 text-xs font-extrabold uppercase tracking-widest text-teal-600">
          Блог
        </p>
        <h2 id="articles-heading" class="text-3xl font-extrabold leading-tight tracking-tight text-slate-900 md:text-5xl">
          Полезные статьи о дверях
        </h2>
        <p class="mt-4 text-base leading-relaxed text-slate-600 md:text-lg">
          Советы по выбору, покрытиям и монтажу от специалистов ВФД
        </p>
      </header>

      <ul class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-10" role="list">
        {articles.map((article) => {
          const slug = getSlug(article.id)
          return (
            <li>
              <a
                href={`/articles/${slug}`}
                class="group flex flex-col h-full rounded-2xl border border-slate-200 bg-white overflow-hidden hover:border-teal-400 hover:shadow-md transition-all duration-200"
              >
                {article.data.coverImage && (
                  <div class="aspect-video overflow-hidden bg-slate-100">
                    <img
                      src={article.data.coverImage}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div class="flex flex-col flex-1 p-5">
                  <time
                    datetime={article.data.publishDate.toISOString()}
                    class="text-xs text-slate-500 mb-2"
                  >
                    {article.data.publishDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </time>
                  <h3 class="text-base font-bold text-slate-900 leading-snug mb-2 group-hover:text-teal-600 transition-colors">
                    {article.data.title}
                  </h3>
                  <p class="text-sm text-slate-600 leading-relaxed line-clamp-2 flex-1">
                    {article.data.description}
                  </p>
                  <span class="mt-4 text-sm font-semibold text-teal-600">
                    Читать →
                  </span>
                </div>
              </a>
            </li>
          )
        })}
      </ul>

      <a
        href="/articles"
        class="inline-flex items-center gap-2 rounded-full border-[1.5px] border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-900 hover:border-teal-500 hover:bg-teal-500 hover:text-white transition-colors duration-200"
      >
        Все статьи
        <svg viewBox="0 0 16 16" fill="none" class="w-3.5 h-3.5" aria-hidden="true">
          <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </a>

    </div>
  </section>
)}
```

- [ ] **Step 2: Добавить LatestArticles в index.astro**

Добавить импорт (это Astro-компонент, без `client:`):
```ts
import LatestArticles from '../components/home/LatestArticles.astro'
```

Добавить между `<Promo>` и `<Faq>`:
```astro
<Promo client:idle />
<LatestArticles />
<Faq client:idle />
```

- [ ] **Step 3: Финальный билд**

```bash
npm run build
```

Ожидаемый результат: билд без ошибок.

- [ ] **Step 4: Проверить homepage содержит секцию статей**

```bash
grep -c 'articles-heading' dist/index.html
```

Ожидаемый вывод: `1`

- [ ] **Step 5: Проверить sitemap содержит /articles**

```bash
grep '/articles' dist/sitemap-0.xml
```

Ожидаемый вывод содержит: `https://vfd74.ru/articles/` и `https://vfd74.ru/articles/kak-vybrat-mezhkomnatnye-dveri/`

- [ ] **Step 6: Commit**

```bash
git add src/components/home/LatestArticles.astro src/pages/index.astro
git commit -m "feat: add LatestArticles section to homepage"
```
