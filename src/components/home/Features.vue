<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, useTemplateRef } from 'vue'

/* ============================================================
   Types
   ============================================================ */
interface Feature {
  id:       number
  title:    string
  text:     string
  imageUrl: string
  cta:      { label: string; href: string; external?: boolean }
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
    text: 'Прямые поставки с Владимирской фабрики дверей. Более 80 моделей в наличии на складе в Челябинске — без ожидания и переплат посредникам.',
    imageUrl: 'https://storage.yandexcloud.net/catalog-vfd/features_block/card-1.webp',
    cta: { label: 'О компании', href: '/about' },
  },
  {
    id: 2,
    title: 'Монтаж под ключ',
    text: 'Полный цикл без лишних забот: замер, расчёт, доставка и профессиональная установка дверей. Более 15 лет опыта — работаем с 2011 года.',
    imageUrl: 'https://storage.yandexcloud.net/catalog-vfd/features_block/card-2.webp',
    cta: { label: 'Фотоотчёты с монтажей', href: '/portfolio' },
  },
  {
    id: 3,
    title: 'Крупнейшая выставка',
    text: 'Самая большая экспозиция дверей ВФД в Челябинске. Более 70 дверей на выставке — оцените фактуру, цвет и фурнитуру вживую.',
    imageUrl: 'https://storage.yandexcloud.net/catalog-vfd/features_block/card-3.webp',
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
          <div class="features-card__media">
            <img
              :src="feature.imageUrl"
              alt=""
              class="features-card__image"
              loading="lazy"
              decoding="async"
              width="400"
              height="300"
            />
          </div>

          <div class="features-card__body">
            <h3 class="features-card__title" itemprop="name">{{ feature.title }}</h3>
            <p  class="features-card__text"  itemprop="description">{{ feature.text }}</p>

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
            </a>
          </div>
        </li>
      </ul>

    </div>
  </section>
</template>

<style scoped>
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
   Card — photo top, body below (Sofia-reference: framed photo +
   title + text + pill CTA)
   ============================================================ */
.features-card {
  display: flex;
  flex-direction: column;
  border-radius: 1.5rem;
  padding: 0.75rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;

  opacity: 0;
  transform: translateY(24px);
  transition:
    opacity     600ms ease-out var(--delay, 0ms),
    transform   600ms ease-out var(--delay, 0ms),
    border-color 220ms ease-out;
}
.features-card.is-visible {
  opacity: 1;
  transform: translateY(0);
}
.features-card:hover {
  border-color: color-mix(in srgb, var(--color-accent, #14b8a6) 35%, #e2e8f0);
}

/* ── Media ── */
.features-card__media {
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  border-radius: 1.25rem;
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

/* ── Body ── */
.features-card__body {
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 0.65rem;
  padding: 1.25rem 0.5rem 0.5rem;
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
  flex: 1;
  color: #475569;
  font-size: 0.875rem;
  line-height: 1.65;
}

/* ── CTA — rounded outline pill, like «Смотреть проект» в референсе ── */
.features-card__cta {
  display: inline-flex;
  align-items: center;
  align-self: flex-start;
  margin-top: 0.5rem;
  padding: 0.6rem 1.25rem;
  border-radius: 9999px;
  border: 1.5px solid #e2e8f0;
  background: #fff;
  color: #0f172a;
  font-size: 0.8125rem;
  font-weight: 700;
  text-decoration: none;
  white-space: nowrap;
  transition:
    background-color 200ms ease-out,
    border-color     200ms ease-out,
    color            200ms ease-out;
}
.features-card__cta:hover {
  background: var(--color-accent, #14b8a6);
  border-color: var(--color-accent, #14b8a6);
  color: #fff;
}
.features-card__cta:focus-visible {
  outline: 2px solid var(--color-accent, #14b8a6);
  outline-offset: 2px;
}

/* ============================================================
   Reduced motion
   ============================================================ */
@media (prefers-reduced-motion: reduce) {
  .features-card {
    opacity: 1;
    transform: none;
    transition: border-color 220ms ease-out;
  }
  .features-word {
    opacity: 1;
    transform: none;
    transition: none;
  }
  .features-card__image,
  .features-card__cta {
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