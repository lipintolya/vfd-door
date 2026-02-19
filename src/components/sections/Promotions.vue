<script setup lang="ts">
import { ref, computed } from 'vue'
import AppSection from '@/components/layout/AppSection.vue'
import AppContainer from '@/components/layout/AppContainer.vue'

interface Promo {
  id: number
  title: string
  subtitle: string
  description: string
  image: string
  ctaText?: string
  ctaLink?: string
  discount?: string
  validUntil: string // format: "2025-02-28"
  isActive?: boolean
}

const promos: Promo[] = [
  {
    id: 1,
    title: 'Скидка на межкомнатные двери',
    subtitle: 'До 20%',
    description:
      'Только до конца месяца! Успейте оформить заказ и получить скидку на любые межкомнатные двери из нашей премиум-коллекции.',
    image: 'https://storage.yandexcloud.net/catalog-vfd/slider/slide1.webp',
    ctaText: 'Заказать',
    ctaLink: '#',
    discount: '-20%',
    validUntil: '2026-02-28',
  },
  {
    id: 2,
    title: 'Бесплатный замер',
    subtitle: 'При оформлении заказа',
    description:
      'При заказе межкомнатных дверей в нашем салоне на Братьев Кашириных. Гарантируем точность замеров и расчёт без лишних позиций',
    image: 'https://storage.yandexcloud.net/catalog-vfd/covers/roulette.webp',
    ctaText: 'Подробнее',
    ctaLink: '#',
    discount: 'Бесплатно',
    validUntil: '2026-12-31',
  },
  {
    id: 3,
    title: 'Алюминиевые перегородки',
    subtitle: 'Экспресс-сборка',
    description:
      'Быстрая установка перегородок в офис или квартиру в течение 48 часов. Современный дизайн и надежная конструкция.',
    image: 'https://storage.yandexcloud.net/catalog-vfd/slider/slide3.png',
    discount: '-15%',
    validUntil: '2025-03-28',
  },
]

/* ----------------------------
   ЛОГИКА С ДЕДЛАЙНАМИ
   ----------------------------- */
const isPromoActive = (validUntil: string): boolean => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const deadline = new Date(validUntil)
  deadline.setHours(23, 59, 59, 999)
  return today <= deadline
}

const getDaysLeft = (validUntil: string): number => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const deadline = new Date(validUntil)
  deadline.setHours(0, 0, 0, 0)
  const diffTime = deadline.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return Math.max(0, diffDays)
}

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('ru-RU', { 
    month: 'long', 
    day: 'numeric' 
  }).replace(/\./g, '')
}

/* ----------------------------
   FILTERED PROMOS (только активные)
   ----------------------------- */
const activePromos = computed(() => {
  return promos.filter(promo => isPromoActive(promo.validUntil))
})

/* ----------------------------
   STATE
   ----------------------------- */
const activeIndex = ref<number | null>(null)
const hoveredIndex = ref<number | null>(null)

const togglePromo = (index: number): void => {
  activeIndex.value = activeIndex.value === index ? null : index
}

const isActive = (index: number): boolean => activeIndex.value === index
const isHovered = (index: number): boolean => hoveredIndex.value === index
</script>

<template>
  <AppSection size="lg" class="bg-white">
    <AppContainer>

      <!-- HEADER -->
      <div class="text-center mb-16">
        <div class="inline-flex items-center gap-2 px-4 py-2 bg-teal-100 rounded-full mb-6 border border-teal-200">
          <svg class="w-4 h-4 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
          </svg>
          <span class="text-sm sm:text-base font-medium text-teal-700">
            Специальные предложения
          </span>
        </div>

        <h2 class="text-3xl sm:text-4xl lg:text-5xl font-semibold text-gray-900 mb-4">
          Акции и скидки
        </h2>

        <p class="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
          Получите лучшие условия на двери и перегородки премиум-класса
        </p>
      </div>

      <!-- EMPTY STATE (если нет активных промо) -->
      <div
        v-if="activePromos.length === 0"
        class="py-20 text-center bg-gray-50 rounded-3xl"
      >
        <p class="text-lg text-gray-500">Нет активных акций. Следите за обновлениями! 👀</p>
      </div>

      <!-- GRID -->
      <div
        v-else
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
      >

        <div v-for="(promo, index) in activePromos" :key="promo.id">
          <div
            class="group bg-white rounded-2xl border border-gray-200 overflow-hidden cursor-pointer transition-all duration-500 hover:border-teal-400 hover:shadow-lg hover:shadow-teal-100 flex flex-col h-full"
            @click="togglePromo(index)"
            @mouseenter="hoveredIndex = index"
            @mouseleave="hoveredIndex = null"
            :class="isActive(index) ? 'ring-2 ring-teal-500 border-teal-500' : ''"
          >

            <!-- IMAGE -->
            <div class="relative h-56 w-full overflow-hidden bg-gray-100">
              <img
                :src="promo.image"
                :alt="promo.title"
                class="w-full h-full object-cover transition-transform duration-500"
                :class="isHovered(index) || isActive(index) ? 'scale-110' : 'scale-100'"
              />

              <!-- Discount Badge -->
              <div
                v-if="promo.discount"
                class="absolute top-3 right-3 bg-linear-to-r from-teal-600 to-teal-600 text-white font-semibold px-3 py-1.5 rounded-lg shadow-lg text-sm sm:text-base"
              >
                {{ promo.discount }}
              </div>

              <!-- Days Left Badge -->
              <div
                class="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm text-gray-900 font-semibold px-3 py-1.5 rounded-lg shadow-lg text-xs sm:text-sm"
              >
                {{ getDaysLeft(promo.validUntil) }} дн.
              </div>
            </div>

            <!-- CONTENT -->
            <div class="p-5 sm:p-6 flex flex-col flex-1">

              <h3 class="text-lg sm:text-xl font-semibold text-gray-900 mb-1 line-clamp-2">
                {{ promo.title }}
              </h3>

              <p class="text-sm font-medium text-teal-600 mb-3">
                {{ promo.subtitle }}
              </p>

              <!-- DESCRIPTION (collapsible) -->
              <div
                class="overflow-hidden transition-all duration-300 flex-1"
                :class="isActive(index) ? 'max-h-72 opacity-100' : 'max-h-0 opacity-0'"
              >
                <p class="text-sm text-gray-600 mb-4 leading-relaxed">
                  {{ promo.description }}
                </p>

                <a
                  v-if="promo.ctaText && promo.ctaLink"
                  :href="promo.ctaLink"
                  class="inline-flex items-center justify-center gap-2 px-4 py-2.5 w-full bg-teal-600 text-white text-sm font-semibold rounded-lg hover:bg-teal-700 transition-all hover:shadow-md hover:shadow-teal-200"
                >
                  {{ promo.ctaText }}
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </a>
              </div>

              <!-- EXPAND BUTTON -->
              <div class="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                <span class="text-xs text-gray-500 font-medium">
                  До {{ formatDate(promo.validUntil) }}
                </span>
                <button
                  class="w-9 h-9 flex items-center justify-center rounded-lg bg-teal-50 text-teal-600 hover:bg-teal-100 transition-all group-hover:shadow-md"
                  @click.stop="togglePromo(index)"
                >
                  <svg
                    :class="isActive(index) ? 'rotate-180' : ''"
                    class="w-5 h-5 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>

            </div>
          </div>
        </div>

      </div>

    </AppContainer>
  </AppSection>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>