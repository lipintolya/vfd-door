<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import AppSection from '@/components/layout/AppSection.vue'
import AppContainer from '@/components/layout/AppContainer.vue'

/* ------------------------------
   КОНСТАНТЫ
------------------------------ */
const YANDEX_URL = 'https://yandex.ru/maps/-/CPQ0FXZV'
const DGIS_URL = 'https://go.2gis.com/06LJr'

/* ------------------------------
   ТИПЫ
------------------------------ */
interface ReviewCard {
  id: number
  name: string
  role: string
  rating: number
  text: string
  image: string
  projectType: string
  location: string
  date: string
}

/* ------------------------------
   ДАННЫЕ ОТЗЫВОВ
------------------------------ */
const reviews: ReviewCard[] = [
  {
    id: 1,
    name: 'Ольга',
    role: 'Клиент',
    rating: 5,
    text: 'Однозначно могу порекомендовать этот салон. Понравилось все от помощи в выборе до монтажа, все быстро и четко. Общительный и приятный менеджер, всегда был на связи.',
    image: 'https://storage.yandexcloud.net/catalog-vfd/review/myimage%20(12).webp',
    projectType: 'Двери в эмали Erica',
    location: 'Челябинск',
    date: '31 января 2024'
  },
  {
    id: 2,
    name: 'Айнур',
    role: 'Клиент',
    rating: 5,
    text: 'Заказали двери, и остались очень довольны 👏 Шикарный дизайн, смотрятся намного дороже, чем их стоимость 👏 Спасибо менеджеру Надежде, помогла подобрать, подробно все проконсультировала 👍',
    image: 'https://storage.yandexcloud.net/catalog-vfd/review/myimage%20(13).webp',
    projectType: 'Покрытие Emalex/Эмалекс',
    location: 'Челябинск',
    date: '20 января 2024'
  },
  {
    id: 3,
    name: 'Дмитрий',
    role: 'Клиент',
    rating: 5,
    text: 'Обратились в салон дверей ВФД — всё понравилось! Монтажники приехали быстро, аккуратно сделали замер, всё объяснили. Грамотный персонал и широкий выбор дверей и фурнитуры.',
    image: 'https://storage.yandexcloud.net/catalog-vfd/review/myimage%20(14).webp',
    projectType: 'Двери Loft',
    location: 'Копейск',
    date: '14 мая 2024'
  },
  {
    id: 4,
    name: 'Иван',
    role: 'Клиент',
    rating: 5,
    text: 'Большой салон дверей, широкий выбор входных и межкомнатных дверей. Ставим металл от этой фирмы с терморазрывом не в первый дом. Все супер, рекомендую.',
    image: 'https://storage.yandexcloud.net/catalog-vfd/review/myimage%20(15).webp',
    projectType: 'Входная дверь',
    location: 'Челябинск',
    date: '2 июля 2024'
  },
  {
    id: 5,
    name: 'Девелопер',
    role: 'Партнер',
    rating: 5,
    text: 'Отличные двери и фурнитура, наши партнеры более 10 лет. Быстрая доставка и много дверей в наличии. Рекомендуем',
    image: 'https://storage.yandexcloud.net/catalog-vfd/review/myimage%20(16).webp',
    projectType: 'Двери Emalex/Эмалекс',
    location: 'Челябинск',
    date: '26 октября 2024'
  },
  {
    id: 6,
    name: 'Диана',
    role: 'Клиент',
    rating: 5,
    text: 'Выбор дверей большой. Как входных дверей, так и фурнитуры. Актуальные расцветки и модели с алюминиевыми кромками, приятные цены.',
    image: 'https://storage.yandexcloud.net/catalog-vfd/review/myimage%20(17).webp',
    projectType: 'Двери Invisible/скрытые',
    location: 'ЖК НИКС-сити',
    date: '8 августа 2024'
  }
]

/* ------------------------------
   STATE
------------------------------ */
const currentIndex = ref(0)
const isAnimating = ref(false)
const touchStartX = ref(0)
const touchStartY = ref(0)
const autoplayTimer = ref<number | null>(null)

/* ------------------------------
   COMPUTED
------------------------------ */
const totalReviews = computed(() => reviews.length)

const currentReview = computed<ReviewCard | null>(() => {
  const len = reviews.length
  if (!len) return null
  const idx = ((currentIndex.value % len) + len) % len
  return reviews[idx] ?? null
})

const starsArray = Array.from({ length: 5 }, (_, i) => i)

/* ------------------------------
   НАВИГАЦИЯ
------------------------------ */
const goTo = (index: number) => {
  if (isAnimating.value || !reviews.length) return
  isAnimating.value = true

  const len = reviews.length
  const newIndex = ((index % len) + len) % len
  currentIndex.value = newIndex

  setTimeout(() => (isAnimating.value = false), 400)
}

const next = () => goTo(currentIndex.value + 1)
const prev = () => goTo(currentIndex.value - 1)

/* ------------------------------
   АВТОПЛЕЙ
------------------------------ */
const startAutoplay = () => {
  if (autoplayTimer.value) return
  autoplayTimer.value = window.setInterval(next, 5000)
}

const stopAutoplay = () => {
  if (autoplayTimer.value) {
    clearInterval(autoplayTimer.value)
    autoplayTimer.value = null
  }
}

const pauseAutoplay = () => stopAutoplay()
const resumeAutoplay = () => startAutoplay()

/* ------------------------------
   СВАЙП
------------------------------ */
const handleTouchStart = (e: TouchEvent) => {
  if (!e.touches?.[0]) return
  touchStartX.value = e.touches[0].clientX
  touchStartY.value = e.touches[0].clientY
}

const handleTouchEnd = (e: TouchEvent) => {
  if (!e.changedTouches?.[0]) return
  const dx = touchStartX.value - e.changedTouches[0].clientX
  const dy = touchStartY.value - e.changedTouches[0].clientY
  if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
    dx > 0 ? next() : prev()
  }
}

const handleMouseDown = (e: MouseEvent) => {
  touchStartX.value = e.clientX
  touchStartY.value = e.clientY
}

const handleMouseUp = (e: MouseEvent) => {
  const dx = touchStartX.value - e.clientX
  const dy = touchStartY.value - e.clientY
  if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
    dx > 0 ? next() : prev()
  }
}

/* ------------------------------
   FALLBACK ДЛЯ ИЗОБРАЖЕНИЙ
------------------------------ */
const handleImageError = (e: Event) => {
  const img = e.target as HTMLImageElement
  img.src = 'https://storage.yandexcloud.net/catalog-vfd/placeholders/review-fallback.png'
}

/* ------------------------------
   LIFECYCLE
------------------------------ */
onMounted(() => {
  startAutoplay()
})

onBeforeUnmount(() => {
  stopAutoplay()
})
</script>

<template>
  <AppSection size="lg" class="bg-white">
    <AppContainer>

      <!-- HEADER -->
      <div class="text-center mb-12">
        <h2 class="text-3xl sm:text-4xl lg:text-5xl font-semibold text-gray-900">
          Отзывы клиентов
        </h2>
        <p class="text-base sm:text-lg text-gray-600 mt-3 prose-subtitle mx-auto">
          Реальные истории наших клиентов — честно, без прикрас.
        </p>
      </div>

      <!-- EMPTY STATE -->
      <div
        v-if="!totalReviews"
        class="py-20 text-center text-gray-500 bg-gray-50 rounded-3xl"
      >
        <p class="text-lg">Пока нет отзывов, но скоро появятся</p>
      </div>

      <!-- ОСНОВНАЯ КАРТОЧКА -->
      <div
        v-else-if="currentReview"
        class="relative max-w-5xl mx-auto group px-2 sm:px-0"
        @mouseenter="pauseAutoplay"
        @mouseleave="resumeAutoplay"
      >
        <div
          class="bg-white rounded-3xl border border-gray-200 overflow-hidden transition-all duration-500 select-none hover:border-gray-300 hover:shadow-lg"
          :class="isAnimating ? 'scale-[0.98] opacity-90' : ''"
          @touchstart.passive="handleTouchStart"
          @touchend="handleTouchEnd"
          @mousedown="handleMouseDown"
          @mouseup="handleMouseUp"
        >
          <!-- BENTO GRID -->
          <div class="p-5 sm:p-8 grid grid-cols-1 sm:grid-cols-[160px_1fr] gap-5 sm:gap-6 items-start">

            <!-- ЛЕВАЯ КОЛОНКА: ФОТО + МЕТКИ -->
            <div>
              <img
                :src="currentReview.image"
                :alt="`Фото ${currentReview.name}`"
                class="w-full h-36 sm:h-40 object-cover rounded-xl bg-gray-100"
                loading="lazy"
                decoding="async"
                @error="handleImageError"
              />
              <div class="flex flex-wrap gap-2 mt-3">
                <span class="px-3 py-1 bg-linear-to-r from-teal-50 to-teal-100 rounded-full text-sm font-medium text-teal-700 border border-teal-200">
                  {{ currentReview.projectType }}
                </span>
                <span class="px-3 py-1 bg-linear-to-r from-gray-50 to-gray-100 rounded-full text-sm font-medium text-gray-700 border border-gray-200">
                  📍 {{ currentReview.location }}
                </span>
              </div>
            </div>

            <!-- ПРАВАЯ КОЛОНКА: ТЕКСТ, КНОПКИ -->
            <div class="flex flex-col gap-4">
              <div>
                <h3 class="text-xl sm:text-2xl font-semibold text-gray-900">
                  {{ currentReview.name }}
                </h3>
                <p class="text-gray-500">
                  {{ currentReview.role }}
                </p>
              </div>

              <!-- ЗВЁЗДЫ -->
              <div class="flex items-center gap-2">
                <span
                  v-for="star in starsArray"
                  :key="star"
                  class="text-xl"
                  :class="star < currentReview.rating ? 'text-yellow-400' : 'text-gray-300'"
                  aria-hidden="true"
                >
                  ★
                </span>
                <span class="text-gray-700 font-medium">
                  {{ currentReview.rating }}.0
                </span>
              </div>

              <!-- ТЕКСТ ОТЗЫВА -->
              <p class="text-gray-700 leading-relaxed review-text">
                {{ currentReview.text }}
              </p>

              <p class="text-gray-500 text-sm">
                {{ currentReview.date }}
              </p>

              <!-- КНОПКИ КАРТ -->
              <div class="flex flex-wrap gap-3 mt-2">
                <a
                  :href="YANDEX_URL"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600 text-white text-sm font-semibold hover:bg-teal-700 transition-all hover:shadow-md hover:shadow-teal-200"
                >
                  <img
                    src="https://storage.yandexcloud.net/catalog-vfd/icons/yandex.svg"
                    alt=""
                    class="w-5 h-5"
                    aria-hidden="true"
                  />
                  <span>Яндекс Карты</span>
                </a>
                <a
                  :href="DGIS_URL"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-700 text-white text-sm font-semibold hover:bg-gray-800 transition-all hover:shadow-md hover:shadow-gray-300"
                >
                  <img
                    src="https://storage.yandexcloud.net/catalog-vfd/icons/2gis.svg"
                    alt=""
                    class="w-5 h-5"
                    aria-hidden="true"
                  />
                  <span>2ГИС</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- СТРЕЛКИ -->
        <button
          @click="prev"
          class="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 p-3 rounded-full bg-white border border-gray-200 shadow-md text-gray-700 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all hover:bg-gray-50 hover:border-teal-500 hover:text-teal-600 disabled:opacity-30"
          :disabled="isAnimating"
          aria-label="Предыдущий отзыв"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          @click="next"
          class="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 p-3 rounded-full bg-white border border-gray-200 shadow-md text-gray-700 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all hover:bg-gray-50 hover:border-teal-500 hover:text-teal-600 disabled:opacity-30"
          :disabled="isAnimating"
          aria-label="Следующий отзыв"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <!-- ИНДИКАТОРЫ ПАГИНАЦИИ -->
        <div class="flex justify-center gap-2 mt-6">
          <button
            v-for="(_, idx) in reviews"
            :key="idx"
            @click="goTo(idx)"
            class="w-2.5 h-2.5 rounded-full transition-all"
            :class="currentIndex === idx ? 'bg-teal-600 w-6' : 'bg-gray-300 hover:bg-gray-400'"
            :aria-label="`Перейти к отзыву ${idx + 1}`"
          />
        </div>
      </div>

      <!-- МИНИАТЮРЫ (СПИСОК ОТЗЫВОВ) - скроллбар скрыт -->
      <div
        class="mt-8 sm:mt-10 flex gap-3 overflow-x-auto pb-2 px-1 sm:px-0"
        style="scrollbar-width: none; -ms-overflow-style: none;"
      >
        <button
          v-for="(review, index) in reviews"
          :key="review.id"
          @click="goTo(index)"
          class="flex items-center gap-2 p-2 rounded-lg min-w-45 transition-all border sm:min-w-50 sm:p-3"
          :class="currentIndex === index
            ? 'bg-linear-to-r from-teal-600 to-teal-600 text-white border-teal-600 shadow-lg shadow-teal-200'
            : 'bg-white border-gray-200 hover:border-teal-300 hover:bg-teal-50'"
        >
          <img
            :src="review.image"
            :alt="`Аватар ${review.name}`"
            class="w-10 h-10 rounded-lg object-cover sm:w-12 sm:h-12 bg-gray-200"
            loading="lazy"
            decoding="async"
            @error="handleImageError"
          />
          <div class="flex flex-col">
            <p class="font-medium truncate text-sm sm:text-base" :class="currentIndex === index ? 'text-white' : 'text-gray-900'">{{ review.name }}</p>
            <p class="text-xs truncate sm:text-sm" :class="currentIndex === index ? 'text-teal-100' : 'text-gray-500'">{{ review.role }}</p>
          </div>
        </button>
      </div>

    </AppContainer>
  </AppSection>
</template>

<style scoped>
.review-text::before {
  content: '«';
  margin-right: 0.1em;
}
.review-text::after {
  content: '»';
  margin-left: 0.1em;
}

/* Скрываем скроллбар для WebKit браузеров */
.custom-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>