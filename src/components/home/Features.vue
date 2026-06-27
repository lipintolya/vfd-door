<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, useTemplateRef } from 'vue'

/* ============================================================
   Types
   ============================================================ */
interface Feature {
  id:    number
  title: string
  text:  string
  cta:   { label: string; href: string; external?: boolean }
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
    cta: { label: 'О компании', href: '/about' },
  },
  {
    id: 2,
    title: 'Монтаж под ключ',
    text: 'Полный цикл без лишних забот: замер, расчёт, доставка и профессиональная установка дверей. Более 15 лет опыта — работаем с 2011 года.',
    cta: { label: 'Фотоотчёты с монтажей', href: '/portfolio' },
  },
  {
    id: 3,
    title: 'Крупнейшая выставка',
    text: 'Самая большая экспозиция дверей ВФД в Челябинске. Более 70 дверей на выставке — оцените фактуру, цвет и фурнитуру вживую.',
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
          <a
            :href="feature.cta.href"
            class="features-card__link"
            :target="feature.cta.external ? '_blank' : undefined"
            :rel="feature.cta.external ? 'noopener noreferrer' : undefined"
            :aria-label="feature.cta.external
              ? `${feature.title} — ${feature.cta.label} (открывается в новой вкладке)`
              : `${feature.title} — ${feature.cta.label}`"
          >
            <span class="features-card__arrow" aria-hidden="true">
              <svg viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </span>

            <h3 class="features-card__title" itemprop="name">{{ feature.title }}</h3>
            <p  class="features-card__text"  itemprop="description">{{ feature.text }}</p>

            <span class="features-card__cta">{{ feature.cta.label }}</span>
          </a>
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
   Card — flat tile, no photo: soft tint + arrow circle + link
   ============================================================ */
.features-card {
  border-radius: 1.25rem;
  overflow: hidden;

  opacity: 0;
  transform: translateY(24px);
  transition:
    opacity    600ms ease-out var(--delay, 0ms),
    transform  600ms ease-out var(--delay, 0ms);
}
.features-card.is-visible {
  opacity: 1;
  transform: translateY(0);
}

/* Чередующийся мягкий тинт фона — средняя карточка в фирменном teal */
.features-card:nth-child(odd) {
  background: #f8fafc;
}
.features-card:nth-child(even) {
  background: #f0fdfa;
}

.features-card__link {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  height: 100%;
  padding: clamp(1.25rem, 2.5vw, 1.75rem);
  text-decoration: none;
  transition: background-color 200ms ease-out;
}
.features-card:nth-child(odd) .features-card__link:hover {
  background: color-mix(in srgb, var(--color-accent, #14b8a6) 6%, #f8fafc);
}
.features-card:nth-child(even) .features-card__link:hover {
  background: color-mix(in srgb, var(--color-accent, #14b8a6) 12%, #f0fdfa);
}
.features-card__link:focus-visible {
  outline: 2px solid var(--color-accent, #14b8a6);
  outline-offset: -2px;
}

.features-card__arrow {
  align-self: flex-end;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  flex-shrink: 0;
  border-radius: 50%;
  background: #fff;
  color: #0f172a;
  box-shadow: 0 1px 4px rgba(15, 23, 42, 0.12);
  transition: transform 200ms ease-out, background-color 200ms ease-out, color 200ms ease-out;
}
.features-card__arrow svg {
  width: 0.9rem;
  height: 0.9rem;
}
.features-card__link:hover .features-card__arrow {
  background: var(--color-accent, #14b8a6);
  color: #fff;
  transform: translate(2px, -2px);
}

.features-card__title {
  margin: 0;
  color: #0f172a;
  font-size: 1.125rem;
  font-weight: 800;
  line-height: 1.25;
}
.features-card__text {
  margin: 0;
  flex: 1;
  color: #475569;
  font-size: 0.9rem;
  line-height: 1.65;
}

.features-card__cta {
  margin-top: 0.4rem;
  color: #0f172a;
  font-size: 0.8125rem;
  font-weight: 700;
}

/* ============================================================
   Reduced motion
   ============================================================ */
@media (prefers-reduced-motion: reduce) {
  .features-card {
    opacity: 1;
    transform: none;
    transition: none;
  }
  .features-word {
    opacity: 1;
    transform: none;
    transition: none;
  }
  .features-card__link,
  .features-card__arrow {
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
}
</style>