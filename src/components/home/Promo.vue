<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, useTemplateRef } from 'vue'

/* ============================================================
   Types
   ============================================================ */
interface Promo {
  id: number
  title: string
  subtitle: string
  description: string
  image: string
  ctaText?: string
  ctaLink?: string
  discount?: string
  validUntil: string
}

/* ============================================================
   Props — данные передаются из Astro (серверный рендер = SEO)
   ============================================================ */
const props = withDefaults(defineProps<{
  promos?: Promo[]
}>(), {
  promos: () => [
    {
      id: 1,
      title: 'Скидка на модель Майами в эмали',
      subtitle: 'До 10%',
      description:
        'Успейте приобрести стильную дверь с трендовой фрезировкой по выгодной цене! Акция действует до 10 июня 2026 года. Майами — это современный дизайн, высокое качество и доступная цена в одном флаконе.',
      image: 'https://storage.yandexcloud.net/catalog-vfd/promo/promo-miami.webp',
      ctaText: 'Заказать',
      ctaLink: '#',
      discount: '-10%',
      validUntil: '2026-06-10',
    },
    {
      id: 2,
      title: 'Бесплатный замер',
      subtitle: 'При оформлении заказа',
      description:
        'При заказе межкомнатных дверей в нашем салоне на Братьев Кашириных. Гарантируем точность замеров и расчёт без лишних позиций.',
      image: 'https://storage.yandexcloud.net/catalog-vfd/covers/roulette.webp',
      ctaText: 'Подробнее',
      ctaLink: '#',
      discount: 'Бесплатно',
      validUntil: '2026-12-31',
    },
    {
      id: 3,
      title: 'Скидка на модель Флэт 2 в эмали',
      subtitle: 'Распродажа',
      description:
        'Акция на популярную модель Флэт 2 в эмали! Современный дизайн и высокое качество по специальной цене. Предложение действует до 15 июня 2026 года. Не упустите шанс обновить интерьер с выгодой!',
      image: 'https://storage.yandexcloud.net/catalog-vfd/promo/promo-flat2.webp',
      discount: 'Распродажа',
      validUntil: '2026-06-15',
    },
  ]
})

/* ============================================================
   Date helpers
   ============================================================ */
const parseLocalDate = (dateStr: string): Date => {
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(year, (month || 1) - 1, day || 1)
}

const isPromoActive = (validUntil: string): boolean => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const deadline = parseLocalDate(validUntil)
  deadline.setHours(23, 59, 59, 999)
  return today <= deadline
}

const getDaysLeft = (validUntil: string): number => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const deadline = parseLocalDate(validUntil)
  deadline.setHours(0, 0, 0, 0)
  const diffDays = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  return Math.max(0, diffDays)
}

const formatDate = (dateStr: string): string => {
  return parseLocalDate(dateStr).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

/* ============================================================
   Computed & State
   ============================================================ */
const activePromos = computed(() => props.promos.filter(p => isPromoActive(p.validUntil)))
const activeIndex = ref<number | null>(null)
const hoveredIndex = ref<number | null>(null)

const togglePromo = (index: number): void => {
  activeIndex.value = activeIndex.value === index ? null : index
}

const handleCtaClick = (event: Event, link: string): void => {
  if (link === '#') event.preventDefault()
}

/* ============================================================
   Entrance animation
   ============================================================ */
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
      if (entry?.isIntersecting) {
        visible.value = true
        observer?.disconnect()
      }
    },
    { threshold: 0.1 }
  )
  observer.observe(el)
})

onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <section
    ref="sectionEl"
    class="promo-section section section--lg bg-white"
    aria-labelledby="promo-heading"
  >
    <div class="container">

      <!-- ── Header ── -->
      <header
        class="promo-header"
        :class="{ 'is-visible': visible }"
      >
        <p class="promo-eyebrow">Специальные предложения</p>
        <h2 id="promo-heading" class="promo-title">Акции и скидки</h2>
        <p class="promo-lead">
          Получите лучшие условия для вашего заказа — следите за нашими акциями
          и не упустите возможность сэкономить
        </p>
      </header>

      <!-- ── Empty state ── -->
      <div v-if="activePromos.length === 0" class="py-20 text-center bg-gray-50 rounded-3xl">
        <p class="text-lg text-gray-500">Нет активных акций. Следите за обновлениями 👀</p>
      </div>

      <!-- ── Promos grid ── -->
      <ul
        v-else
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 list-none p-0 m-0"
        role="list"
      >
        <li
          v-for="(promo, index) in activePromos"
          :key="promo.id"
          :style="{ '--delay': `${index * 100}ms` }"
        >
          <article
            class="promo-card group bg-white rounded-2xl border border-gray-200 overflow-hidden cursor-pointer flex flex-col h-full transition-all duration-300 hover:border-teal-400 hover:shadow-lg"
            :class="{
              'is-visible': visible,
              'ring-2 ring-teal-500 border-teal-500': activeIndex === index,
            }"
            role="button"
            tabindex="0"
            :aria-expanded="activeIndex === index"
            :aria-label="`${promo.title}. ${activeIndex === index ? 'Свернуть описание' : 'Развернуть описание'}`"
            @click="togglePromo(index)"
            @keyup.enter="togglePromo(index)"
            @keyup.space.prevent="togglePromo(index)"
            @mouseenter="hoveredIndex = index"
            @mouseleave="hoveredIndex = null"
          >
            <!-- Image -->
            <div class="relative h-72 w-full overflow-hidden bg-gray-100">
              <img
                :src="promo.image"
                :alt="promo.title"
                loading="lazy"
                decoding="async"
                width="600"
                height="288"
                class="w-full h-full object-cover transition-transform duration-500"
                :class="hoveredIndex === index || activeIndex === index ? 'scale-110' : 'scale-100'"
              />

              <!-- Discount badge -->
              <span
                v-if="promo.discount"
                class="absolute top-3 right-3 bg-teal-600 text-white px-3 py-1.5 rounded-lg text-sm font-semibold shadow-sm"
                aria-label="`Скидка: ${promo.discount}`"
              >
                {{ promo.discount }}
              </span>

              <!-- Days left badge -->
              <span
                class="absolute bottom-3 left-3 bg-white/95 text-gray-900 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm"
                :aria-label="`Осталось ${getDaysLeft(promo.validUntil)} дней`"
              >
                {{ getDaysLeft(promo.validUntil) }} дн.
              </span>
            </div>

            <!-- Content -->
            <div class="p-5 sm:p-6 flex flex-col flex-1">
              <h3 class="text-lg font-semibold text-gray-900 line-clamp-2">{{ promo.title }}</h3>
              <p class="text-sm text-teal-600 font-medium mt-1 mb-3">{{ promo.subtitle }}</p>

              <!-- Expandable description -->
              <div
                class="overflow-hidden transition-all duration-300"
                :class="activeIndex === index ? 'max-h-72 opacity-100' : 'max-h-0 opacity-0'"
                :aria-hidden="activeIndex !== index"
              >
                <p class="text-sm text-gray-600 leading-relaxed mb-4">{{ promo.description }}</p>
                <a
                  v-if="promo.ctaText && promo.ctaLink"
                  :href="promo.ctaLink"
                  class="inline-flex items-center justify-center w-full px-4 py-2.5 bg-teal-600 text-white text-sm font-semibold rounded-lg hover:bg-teal-700 transition-colors focus-visible:outline-2 focus-visible:outline-teal-500"
                  @click.stop="handleCtaClick($event, promo.ctaLink!)"
                >
                  {{ promo.ctaText }}
                </a>
              </div>

              <!-- Footer with date & toggle -->
              <div class="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
                <time
                  :datetime="promo.validUntil"
                  class="text-xs text-gray-500"
                >
                  До {{ formatDate(promo.validUntil) }}
                </time>

                <button
                  type="button"
                  class="w-9 h-9 flex items-center justify-center rounded-lg bg-teal-50 text-teal-600 hover:bg-teal-100 transition-colors focus-visible:outline-2 focus-visible:outline-teal-500"
                  :aria-label="activeIndex === index ? 'Свернуть описание' : 'Развернуть описание'"
                  tabindex="-1"
                  @click.stop="togglePromo(index)"
                >
                  <svg
                    class="w-5 h-5 transition-transform duration-300"
                    :class="{ 'rotate-180': activeIndex === index }"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>
          </article>
        </li>
      </ul>

    </div>
  </section>
</template>

<style scoped>
/* ── Section ── */
.promo-section {
  background: #fff;
}

/* ── Header entrance ── */
.promo-header {
  max-width: 52rem;
  margin: 0 auto clamp(2.5rem, 5vw, 4rem);
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 600ms ease-out, transform 600ms ease-out;
  text-align: center;
}
.promo-header.is-visible {
  opacity: 1;
  transform: translateY(0);
}

/* ── Header typography ── */
.promo-eyebrow {
  margin: 0 0 0.85rem;
  color: #0d9488;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
.promo-title {
  margin: 0 0 1rem;
  color: #0f172a;
  font-size: clamp(2rem, 4.5vw, 3rem);
  font-weight: 800;
  line-height: 1.12;
  letter-spacing: -0.02em;
}
.promo-lead {
  margin: 0 auto;
  max-width: 42rem;
  color: #475569;
  font-size: clamp(1rem, 2vw, 1.125rem);
  line-height: 1.65;
}

/* ── Card entrance ── */
.promo-card {
  opacity: 0;
  transform: translateY(24px);
  transition:
    opacity 600ms ease-out var(--delay, 0ms),
    transform 600ms ease-out var(--delay, 0ms);
}
.promo-card.is-visible {
  opacity: 1;
  transform: translateY(0);
}

/* ── Focus ── */
.promo-card:focus-visible {
  outline: 2px solid #14b8a6;
  outline-offset: 2px;
}

/* ── line-clamp fallback ── */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* ── Reduced motion ── */
@media (prefers-reduced-motion: reduce) {
  .promo-header,
  .promo-card {
    opacity: 1 !important;
    transform: none !important;
    transition: none !important;
  }
  .promo-card img {
    transition: none !important;
  }
}

/* ── Mobile ── */
@media (max-width: 640px) {
  .promo-header {
    margin-bottom: 2.5rem;
  }
  .promo-title {
    font-size: 2rem;
  }
}
</style>