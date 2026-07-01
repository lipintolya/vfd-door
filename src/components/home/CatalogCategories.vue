<script setup lang="ts">
import { useScrollReveal } from '../../composables/useScrollReveal'

/* ============================================================
   Types
   ============================================================ */
interface Category {
  title:    string
  subtitle: string
  image:    string
  href:     string
  cta:      string
}

/* ============================================================
   Data
   ============================================================ */
const CATEGORIES: Category[] = [
  {
    title:    'Межкомнатные двери',
    subtitle: 'Эмаль, экошпон, ПЭТ-покрытие, со стеклом. Большой выбор моделей в наличии и под заказ',
    image:    'https://storage.yandexcloud.net/catalog-vfd/catalog_preview/catalog-preview.webp',
    href:     '/catalog',
    cta:      'Смотреть межкомнатные',
  },
  {
    title:    'Входные двери',
    subtitle: 'Уличные и подъездные модели для частных домов и квартир',
    image:    'https://storage.yandexcloud.net/catalog-vfd/catalog_preview/catalog-preview2.webp',
    href:     '/catalog?series=innova',
    cta:      'Смотреть входные',
  },
  {
    title:    'Алюминиевые перегородки',
    subtitle: 'Стеклянные перегородки с алюминиевым профилем для квартир, домов, офисов — под ключ в течение 45 дней. Нестандартные решения по вашим чертежам и эскизам',
    image:    'https://storage.yandexcloud.net/catalog-vfd/catalog_preview/catalog-preview3.webp',
    href:     '/partitions',
    cta:      'Смотреть перегородки',
  },
]

const { sectionRef, visible } = useScrollReveal(0.15)
</script>

<template>
  <section
    ref="sectionEl"
    class="cat-section section"
    aria-labelledby="cat-heading"
  >
    <div class="container">

      <!-- ── Header ── -->
      <header
        class="mb-10 max-w-3xl transition-[opacity,transform] duration-700 ease-out motion-reduce:transition-none md:mb-16"
        :class="visible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'"
      >
        <p class="mb-3 text-xs font-extrabold uppercase tracking-widest text-teal-600">
          Что мы предлагаем
        </p>
        <h2 id="cat-heading" class="text-3xl font-extrabold leading-tight tracking-tight text-slate-900 md:text-5xl">
          Каталог
        </h2>
        <p class="mt-4 text-base leading-relaxed text-slate-600 md:text-lg">
          Межкомнатные и входные двери, алюминиевые перегородки
          от официального дилера Владимирской фабрики дверей
        </p>
      </header>

      <!-- ── Bento grid ── -->
      <div class="cat-grid" role="list">

        <!-- Главная карточка — межкомнатные -->
        <article
          class="cat-card cat-card--hero"
          :class="visible ? 'is-visible' : ''"
          style="--delay: 0ms"
          role="listitem"
        >
          <a :href="CATEGORIES[0]!.href" class="cat-card__link" :aria-label="CATEGORIES[0]!.title">
            <div class="cat-card__media">
              <div
                class="cat-card__bg"
                :style="{ backgroundImage: `url(${CATEGORIES[0]!.image})` }"
                aria-hidden="true"
              />
              <div class="cat-card__overlay" aria-hidden="true" />
            </div>
            <div class="cat-card__body">
              <div class="cat-card__text">
                <h3 class="cat-card__title">{{ CATEGORIES[0]!.title }}</h3>
                <p class="cat-card__subtitle">{{ CATEGORIES[0]!.subtitle }}</p>
              </div>
              <span class="cat-card__cta" aria-hidden="true">
                {{ CATEGORIES[0]!.cta }}
                <svg class="cat-card__cta-icon" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </span>
            </div>
          </a>
        </article>

        <!-- Правая колонка — 2 карточки -->
        <div class="cat-col" role="list">
          <article
            v-for="(cat, idx) in CATEGORIES.slice(1)"
            :key="cat.href"
            class="cat-card"
            :class="visible ? 'is-visible' : ''"
            :style="{ '--delay': `${(idx + 1) * 130}ms` }"
            role="listitem"
          >
            <a :href="cat.href" class="cat-card__link" :aria-label="cat.title">
              <div class="cat-card__media">
                <div
                  class="cat-card__bg"
                  :style="{ backgroundImage: `url(${cat.image})` }"
                  aria-hidden="true"
                />
                <div class="cat-card__overlay" aria-hidden="true" />
              </div>
              <div class="cat-card__body">
                <div class="cat-card__text">
                  <h3 class="cat-card__title">{{ cat.title }}</h3>
                  <p class="cat-card__subtitle">{{ cat.subtitle }}</p>
                </div>
                <span class="cat-card__cta" aria-hidden="true">
                  {{ cat.cta }}
                  <svg class="cat-card__cta-icon" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </span>
              </div>
            </a>
          </article>
        </div>

      </div>
    </div>
  </section>
</template>

<style scoped>
/* ============================================================
   Grid
   ============================================================ */
.cat-grid {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: clamp(0.85rem, 1.8vw, 1.25rem);
  align-items: stretch;
}
.cat-col {
  display: grid;
  grid-template-rows: 1fr 1fr;
  gap: clamp(0.85rem, 1.8vw, 1.25rem);
}

/* ============================================================
   Card
   ============================================================ */
.cat-card {
  border-radius: 1.5rem;
  overflow: hidden;
  opacity: 0;
  transform: translateY(24px);
  transition:
    opacity  600ms ease-out var(--delay, 0ms),
    transform 600ms ease-out var(--delay, 0ms);
}
.cat-card.is-visible {
  opacity: 1;
  transform: translateY(0);
}

/* Полностью кликабельная карточка через ссылку-блок */
.cat-card__link {
  display: flex;
  flex-direction: column;
  height: 100%;
  text-decoration: none;
  color: inherit;
  position: relative;
  overflow: hidden;
  border-radius: 1.5rem;
}

/* Медиа */
.cat-card__media {
  position: absolute;
  inset: 0;
}
.cat-card__bg {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  transition: transform 600ms ease-out;
}
.cat-card__link:hover .cat-card__bg {
  transform: scale(1.04);
}
.cat-card__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(4, 6, 11, 0.75) 0%, rgba(15,23,42,.25) 55%, transparent 100%);
  transition: background 300ms ease-out;
}
.cat-card__link:hover .cat-card__overlay {
  background: linear-gradient(to top, rgba(29, 30, 30, 0.82) 0%, rgba(15,23,42,.3) 55%, transparent 100%);
}

/* Высоты */
.cat-card--hero .cat-card__link {
  min-height: 540px;
}
.cat-col .cat-card .cat-card__link {
  min-height: 255px;
}

/* Body */
.cat-card__body {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  flex: 1;
  padding: clamp(1.25rem, 2.5vw, 2rem);
  gap: 1.1rem;
}
.cat-card__text {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.cat-card__title {
  margin: 0;
  color: #fff;
  font-size: clamp(1.1rem, 2.2vw, 1.4rem);
  font-weight: 800;
  line-height: 1.2;
}
.cat-card__subtitle {
  margin: 0;
  color: rgba(255,255,255,0.78);
  font-size: 0.875rem;
  line-height: 1.6;
  max-width: 36rem;
}

/* CTA — pill, стиль как features/bento */
.cat-card__cta {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  align-self: flex-start;
  padding: 0.55rem 1.1rem;
  border-radius: 9999px;
  border: 1.5px solid rgba(255,255,255,0.5);
  background: transparent;
  color: #fff;
  font-size: 0.8125rem;
  font-weight: 700;
  white-space: nowrap;
  transition:
    background-color 200ms ease-out,
    border-color     200ms ease-out,
    transform        200ms ease-out;
}
.cat-card__link:hover .cat-card__cta {
  background: rgba(255,255,255,0.15);
  border-color: #fff;
  transform: translateY(-1px);
}
.cat-card__link:focus-visible {
  outline: 2px solid var(--color-accent, #14b8a6);
  outline-offset: 3px;
}
.cat-card__cta-icon {
  width: 0.875rem;
  height: 0.875rem;
  flex-shrink: 0;
  transition: transform 200ms ease-out;
}
.cat-card__link:hover .cat-card__cta-icon {
  transform: translateX(2px);
}

/* ============================================================
   Responsive
   ============================================================ */
@media (max-width: 1024px) {
  .cat-grid {
    grid-template-columns: 1fr 1fr;
  }
  .cat-card--hero .cat-card__link {
    min-height: 420px;
  }
  .cat-col .cat-card .cat-card__link {
    min-height: 200px;
  }
}

@media (max-width: 680px) {
  .cat-grid {
    grid-template-columns: 1fr;
  }
  .cat-col {
    grid-template-rows: unset;
    grid-template-columns: 1fr;
  }
  .cat-card--hero .cat-card__link {
    min-height: 320px;
  }
  .cat-col .cat-card .cat-card__link {
    min-height: 220px;
  }
}

/* ============================================================
   Reduced motion
   ============================================================ */
@media (prefers-reduced-motion: reduce) {
  .cat-header,
  .cat-card {
    opacity: 1;
    transform: none;
    transition: none;
  }
  .cat-card__bg,
  .cat-card__cta,
  .cat-card__cta-icon {
    transition: none;
  }
}
</style>