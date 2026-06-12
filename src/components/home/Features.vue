<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, useTemplateRef } from 'vue'

/* ============================================================
   Types
   ============================================================ */
interface Feature {
  id:        number
  title:     string
  text:      string
  imageUrl:  string
  stat:      string
  statLabel: string
  cta: { label: string; href: string; external?: boolean }
}

/* ============================================================
   Data — вынесено за пределы setup, не пересоздаётся
   ============================================================ */
const WORDS: string[] = [
  'официальный салон фабрики ВФД',
  'дилера с дверями в наличии',
  'салон с крупнейшей выставкой',
  'установку дверей «под ключ»',
]

const FEATURES: Feature[] = [
  {
    id: 1,
    title: 'Официальный дилер ВФД',
    text: 'Прямые поставки с Владимирской фабрики дверей. Сотни моделей постоянно в наличии на складе в Челябинске — без ожидания и переплат посредникам.',
    imageUrl: 'https://storage.yandexcloud.net/catalog-vfd/features_block/card-1.webp',
    stat: '500+',
    statLabel: 'моделей в наличии',
    cta: { label: 'О компании', href: '/about' },
  },
  {
    id: 2,
    title: 'Монтаж под ключ',
    text: 'Полный цикл без лишних забот: замер, расчёт, доставка и профессиональная установка дверей. Собственные монтажники с опытом более 20 лет.',
    imageUrl: 'https://storage.yandexcloud.net/catalog-vfd/features_block/card-2.webp',
    stat: '20+',
    statLabel: 'лет опыта монтажа',
    cta: { label: 'Фотоотчёты с монтажей', href: '/portfolio' },
  },
  {
    id: 3,
    title: 'Крупнейшая выставка',
    text: 'Самая большая экспозиция дверей ВФД в Челябинске. Более 80 моделей вживую — оцените фактуру, цвет и фурнитуру прежде чем принять решение.',
    imageUrl: 'https://storage.yandexcloud.net/catalog-vfd/features_block/card-3.webp',
    stat: '80+',
    statLabel: 'дверей на экспозиции',
    cta: { label: 'Как добраться', href: 'https://2gis.ru/chelyabinsk/firm/70000001093506304/tab/photos' },
  },
]

/* ============================================================
   State
   ============================================================ */
const sectionRef  = useTemplateRef<HTMLElement>('sectionEl')
const visible     = ref(false)
const currentWord = ref(WORDS[0])
const wordVisible = ref(true)

let wordIndex   = 0
let wordTimer:  ReturnType<typeof setTimeout>  | null = null
let cycleTimer: ReturnType<typeof setInterval> | null = null
let observer:   IntersectionObserver | null = null

/* ============================================================
   Word animation
   ============================================================ */
const advanceWord = () => {
  wordVisible.value = false
  wordTimer = setTimeout(() => {
    wordIndex = (wordIndex + 1) % WORDS.length
    currentWord.value = WORDS[wordIndex]!
    wordVisible.value = true
  }, 300)
}

const startCycle = () => {
  if (cycleTimer !== null) return
  cycleTimer = setInterval(advanceWord, 2800)
}

const stopCycle = () => {
  if (cycleTimer !== null) { clearInterval(cycleTimer); cycleTimer = null }
  if (wordTimer  !== null) { clearTimeout(wordTimer);  wordTimer  = null }
}

/* ============================================================
   Intersection Observer
   ============================================================ */
onMounted(() => {
  const el = sectionRef.value
  if (!el) return

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry) return
      if (entry.isIntersecting) {
        visible.value = true
        if (!prefersReduced) startCycle()
        observer?.unobserve(el)
      }
    },
    { threshold: 0.2 }
  )

  observer.observe(el)
})

onBeforeUnmount(() => {
  stopCycle()
  observer?.disconnect()
})
</script>

<template>
  <section
    ref="sectionEl"
    class="features-section section"
    aria-labelledby="features-heading"
    itemscope
    itemtype="https://schema.org/ItemList"
  >
    <div class="container">

      <!-- ── Header ── -->
      <header class="features-header">
        <p class="features-eyebrow" aria-hidden="true">Почему выбирают нас</p>

        <h2 id="features-heading" class="features-title">
          Вы нашли
          <span class="sr-only">официальный салон ВФД</span>
          <span
            class="features-word"
            :class="{ 'is-visible': wordVisible }"
            aria-hidden="true"
          >{{ currentWord }}</span>
        </h2>

        <p class="features-lead">
          Официальный салон Владимирской фабрики дверей в Челябинске.
          Берём на себя всё — от подбора до профессионального монтажа.
        </p>
      </header>

      <!-- ── Cards ── -->
      <ul
        class="features-grid"
        role="list"
        itemprop="itemListElement"
      >
        <li
          v-for="(feature, idx) in FEATURES"
          :key="feature.id"
          class="features-card"
          :class="{ 'is-visible': visible }"
          :style="{ '--delay': `${idx * 130}ms` }"
          itemprop="item"
          itemscope
          itemtype="https://schema.org/Thing"
        >
          <!-- Image -->
          <div class="features-card__media" aria-hidden="true">
            <img
              :src="feature.imageUrl"
              alt=""
              class="features-card__image"
              loading="lazy"
              decoding="async"
              width="400"
              height="300"
            />
            <div class="features-card__stat">
              <span class="features-card__stat-num">{{ feature.stat }}</span>
              <span class="features-card__stat-label">{{ feature.statLabel }}</span>
            </div>
          </div>

          <!-- Body -->
          <div class="features-card__body">
            <div class="features-card__content">
              <h3 class="features-card__title" itemprop="name">{{ feature.title }}</h3>
              <p  class="features-card__text"  itemprop="description">{{ feature.text }}</p>
            </div>

            <!-- CTA -->
            <a
              :href="feature.cta.href"
              class="features-card__cta"
              :target="feature.cta.external ? '_blank' : undefined"
              :rel="feature.cta.external ? 'noopener noreferrer' : undefined"
              :aria-label="feature.cta.external
                ? `${feature.cta.label} (открывается в новой вкладке)`
                : undefined"
            >
              {{ feature.cta.label }}
              <!-- Стрелка — внешняя ссылка получает иконку «открыть» -->
              <svg
                v-if="feature.cta.external"
                class="features-card__cta-icon"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
              >
                <path d="M6 2H3a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V9M9 2h5m0 0v5m0-5L7 9" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <svg
                v-else
                class="features-card__cta-icon"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
              >
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </a>
          </div>
        </li>
      </ul>

    </div>
  </section>
</template>

<style scoped>
/* ============================================================
   Section
   ============================================================ */
.features-section {
  background:
    radial-gradient(ellipse 70% 50% at 50% 0%, color-mix(in srgb, #14b8a6 8%, transparent), transparent),
    #f8f9fa;
}

/* ============================================================
   Header
   ============================================================ */
.features-header {
  max-width: 52rem;
  margin-bottom: clamp(2.5rem, 5vw, 4rem);
}
.features-eyebrow {
  margin: 0 0 0.85rem;
  color: var(--color-accent-hover, #0d9488);
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
.features-title {
  margin: 0 0 1.1rem;
  color: #0f172a;
  font-size: clamp(2rem, 4.5vw, 3rem);
  font-weight: 800;
  line-height: 1.12;
  letter-spacing: -0.02em;
}
.features-word {
  display: inline-block;
  color: var(--color-accent-hover, #0d9488);
  opacity: 0;
  transform: translateY(6px);
  transition: opacity 300ms ease-out, transform 300ms ease-out;
}
.features-word.is-visible {
  opacity: 1;
  transform: translateY(0);
}
.features-lead {
  margin: 0;
  max-width: 42rem;
  color: #475569;
  font-size: clamp(1rem, 2vw, 1.125rem);
  line-height: 1.65;
}

/* ============================================================
   Grid
   ============================================================ */
.features-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: clamp(1rem, 2.5vw, 1.5rem);
  padding: 0;
  margin: 0;
  list-style: none;
}

/* ============================================================
   Card
   ============================================================ */
.features-card {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: 1.25rem;
  border: 1px solid #e2e8f0;
  background: #fff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);

  opacity: 0;
  transform: translateY(24px);
  transition:
    opacity     600ms ease-out var(--delay, 0ms),
    transform   600ms ease-out var(--delay, 0ms),
    box-shadow  220ms ease-out,
    border-color 220ms ease-out;
}
.features-card.is-visible {
  opacity: 1;
  transform: translateY(0);
}
.features-card:hover {
  border-color: color-mix(in srgb, var(--color-accent, #14b8a6) 35%, #e2e8f0);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1);
}

/* ── Media ── */
.features-card__media {
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  background: linear-gradient(135deg, #f0fdfa, #e6f7f5);
  flex-shrink: 0;
}
.features-card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 500ms ease-out;
}
.features-card:hover .features-card__image {
  transform: scale(1.04);
}

/* Stat badge */
.features-card__stat {
  position: absolute;
  bottom: 0.85rem;
  right: 0.85rem;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding: 0.55rem 0.85rem;
  border-radius: 0.75rem;
  background: rgba(15, 23, 42, 0.82);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  color: #fff;
  line-height: 1.1;
}
.features-card__stat-num {
  font-size: 1.5rem;
  font-weight: 900;
  color: #5eead4;
  letter-spacing: -0.03em;
}
.features-card__stat-label {
  margin-top: 0.1rem;
  font-size: 0.68rem;
  font-weight: 600;
  color: #94a3b8;
  white-space: nowrap;
}

/* ── Body ── */
.features-card__body {
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 1.1rem;
  padding: clamp(1.1rem, 2vw, 1.4rem);
}
.features-card__content {
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 0.65rem;
}
.features-card__title {
  margin: 0;
  color: #0f172a;
  font-size: 1.05rem;
  font-weight: 800;
  line-height: 1.25;
}
.features-card__text {
  margin: 0;
  color: #475569;
  font-size: 0.875rem;
  line-height: 1.65;
}

/* ── CTA ── */
.features-card__cta {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  align-self: flex-start;        /* не растягивается на всю ширину */
  padding: 0.55rem 1.1rem;
  border-radius: 9999px;
  border: 1.5px solid var(--color-accent, #14b8a6);
  background: transparent;
  color: var(--color-accent-hover, #0d9488);
  font-size: 0.8125rem;
  font-weight: 700;
  text-decoration: none;
  white-space: nowrap;
  transition:
    background-color 200ms ease-out,
    color            200ms ease-out,
    border-color     200ms ease-out,
    transform        200ms ease-out;
}
.features-card__cta:hover {
  background: var(--color-accent, #14b8a6);
  border-color: var(--color-accent, #14b8a6);
  color: #fff;
  transform: translateY(-1px);
}
.features-card__cta:focus-visible {
  outline: 2px solid var(--color-accent, #14b8a6);
  outline-offset: 3px;
}
.features-card__cta-icon {
  width: 0.875rem;
  height: 0.875rem;
  flex-shrink: 0;
  transition: transform 200ms ease-out;
}
.features-card__cta:hover .features-card__cta-icon {
  transform: translateX(2px);
}

/* ============================================================
   Reduced motion
   ============================================================ */
@media (prefers-reduced-motion: reduce) {
  .features-card {
    opacity: 1;
    transform: none;
    transition: box-shadow 220ms ease-out, border-color 220ms ease-out;
  }
  .features-word {
    opacity: 1;
    transform: none;
    transition: none;
  }
  .features-card__image,
  .features-card__cta,
  .features-card__cta-icon {
    transition: none;
  }
}

/* ============================================================
   Responsive
   ============================================================ */
@media (max-width: 900px) {
  .features-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 560px) {
  .features-grid {
    grid-template-columns: 1fr;
  }
  .features-card__media {
    aspect-ratio: 3 / 2;
  }
}
</style>