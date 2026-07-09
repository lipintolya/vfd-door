<script setup lang="ts">
import { ref, computed } from 'vue'
import { useScrollReveal } from '../../composables/useScrollReveal'

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
      title: 'Бесплатный замер',
      subtitle: 'При оформлении заказа',
      description:
        'При заказе межкомнатных дверей в нашем салоне на Братьев Кашириных. Гарантируем точность замеров и расчёт без лишних позиций.',
      image: 'https://storage.yandexcloud.net/vfd74ru/Main_page/articles/article_1/zamer.webp',
      ctaText: 'Подробнее',
      ctaLink: '/contacts',
      discount: 'Бесплатно',
      validUntil: '2026-12-31',
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

const { sectionRef, visible } = useScrollReveal(0.1)
</script>

<template>
  <section
    ref="sectionEl"
    class="section bg-white"
    aria-labelledby="promo-heading"
  >
    <div class="container">

      <!-- ── Header ── -->
      <header
        class="mx-auto mb-10 max-w-3xl text-center transition-[opacity,transform] duration-700 ease-out motion-reduce:transition-none md:mb-16"
        :class="visible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'"
      >
        <p class="mb-3 text-xs font-extrabold uppercase tracking-widest text-teal-600">
          Специальные предложения
        </p>
        <h2 id="promo-heading" class="text-3xl font-extrabold leading-tight tracking-tight text-slate-900 md:text-5xl">
          Акции и скидки
        </h2>
        <p class="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-600 md:text-lg">
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
        >
          <article
            class="group flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition-[opacity,transform,border-color,box-shadow] duration-[600ms] ease-out hover:border-teal-400 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-teal-500 focus-visible:outline-offset-2 motion-reduce:transition-none"
            :class="{
              'translate-y-0 opacity-100': visible,
              'translate-y-6 opacity-0': !visible,
              'ring-2 ring-teal-500 border-teal-500': activeIndex === index,
            }"
            :style="{ transitionDelay: visible ? `${index * 100}ms` : '0ms' }"
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

