<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import type { Door, Color } from './types'
import { useSeriesTheme } from './theme/useSeriesTheme'
import { calculateDoorPrice } from '@/services/pricing'

interface Props {
  door: Door
  modelValue: Color
}

const props = defineProps<Props>()

const router = useRouter()
const seriesTheme = useSeriesTheme(props.door.series)

// Маппинг покрытий для отображения
const COVER_NAMES: Record<string, string> = {
  'ПЭТ': 'ПЭТ',
  'emalex': 'Полипропилен',
  'emal': 'Эмаль'
}

const displayCover = computed(() => {
  return COVER_NAMES[props.door.cover] || props.door.cover
})

const isDetailsOpen = ref(false)
const isMaterialOpen = ref(false)
const isQuickViewOpen = ref(false)
const imageLoaded = ref(false)
const imageError = ref(false)
const isHovering = ref(false)

const TAG_STYLES: Record<string, string> = {
  'акция': 'bg-red-50 text-red-700 ring-1 ring-red-200',
  'скидка': 'bg-red-50 text-red-700 ring-1 ring-red-200',
  'новинка': 'bg-teal-50 text-teal-700 ring-1 ring-teal-200',
  'под заказ': 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  'хит': 'bg-teal-50 text-teal-700 ring-1 ring-teal-200'
}

const accent = computed(() => seriesTheme.value?.accent || '#14b8a6')

const currentImage = computed<string>(() => {
  const image = props.modelValue?.image
  return (image && typeof image === 'string') ? image : ''
})

const isInStock = computed<boolean>(() => {
  return props.door.tags?.includes('в наличии') ?? false
})

const displayTags = computed<string[]>(() => {
  return props.door.tags?.filter(tag => tag !== 'в наличии') ?? []
})

const doorPrice = computed<number>(() => {
  try {
    return calculateDoorPrice(props.door, props.modelValue) ?? 0
  } catch (error) {
    console.error('[ProductCard] Price calculation error:', error)
    return 0
  }
})

const formatPrice = (value: number): string => {
  if (!value || typeof value !== 'number') return 'Цена по запросу'
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value)
}

const getTagClass = (tag: string): string => {
  const normalized = tag.toLowerCase().trim()
  return TAG_STYLES[normalized] || 'bg-zinc-100 text-zinc-700 ring-1 ring-zinc-200'
}

const navigateToProduct = (): void => {
  const { id, series, cover } = props.door
  if (!id || !series || !cover) {
    console.error('[ProductCard] Missing required navigation data')
    return
  }

  router.push({
    name: 'ProductPage',
    params: { cover, series, id }
  })
}

const handleImageError = (): void => {
  imageError.value = true
  imageLoaded.value = false
}

const handleImageLoad = (): void => {
  imageLoaded.value = true
  imageError.value = false
}
</script>

<template>
  <article
    class="product-card group relative h-full flex flex-col rounded-2xl bg-white shadow-sm ring-1 ring-zinc-900/5
           transition-all duration-300 ease-out cursor-pointer
           hover:shadow-lg hover:ring-zinc-900/10 hover:-translate-y-0.5"
    @click="navigateToProduct"
    @mouseenter="isHovering = true"
    @mouseleave="isHovering = false"
  >
    <!-- Tags Section -->
    <div class="flex flex-wrap gap-1.5 p-3 sm:p-4">
      <span
        class="inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full text-white shrink-0 shadow-sm"
        :style="{ backgroundColor: accent }"
      >
        {{ props.door.series.toUpperCase() }}
      </span>

      <span
        v-for="tag in displayTags.slice(0, 2)"
        :key="tag"
        class="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full shrink-0"
        :class="getTagClass(tag)"
      >
        {{ tag }}
      </span>

      <span
        v-if="displayTags.length > 2"
        class="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full bg-zinc-100 text-zinc-700 ring-1 ring-zinc-200 shrink-0"
      >
        +{{ displayTags.length - 2 }}
      </span>
    </div>

    <!-- Image Section - ОПТИМИЗИРОВАНО ДЛЯ МОБИЛКИ -->
    <div class="relative w-full px-2 sm:px-4">
      <div
        class="relative w-full h-48 sm:h-64 lg:aspect-3/4
               bg-linear-to-br from-zinc-50 to-zinc-100/50 rounded-xl
               flex items-center justify-center overflow-hidden"
      >
        <!-- Loading State -->
        <div
          v-if="!imageLoaded && !imageError && currentImage"
          class="absolute inset-0 flex items-center justify-center bg-zinc-50/80 backdrop-blur-sm"
        >
          <div class="w-8 h-8 sm:w-10 sm:h-10 border-2 sm:border-3 border-zinc-200 border-t-teal-500 rounded-full animate-spin" />
        </div>

        <!-- Image -->
        <img
          v-if="currentImage && !imageError"
          :src="currentImage"
          :alt="props.door.name"
          class="w-full h-full object-contain p-2 sm:p-4 transition-transform duration-500 ease-out"
          :class="{
            'opacity-0 scale-95': !imageLoaded,
            'opacity-100 scale-100': imageLoaded,
            'group-hover:scale-105': isHovering
          }"
          loading="lazy"
          decoding="async"
          @error="handleImageError"
          @load="handleImageLoad"
        />

        <!-- Quick View Button - Desktop (наведение) -->
        <button
          class="hidden sm:flex absolute top-3 right-3 w-10 h-10 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm text-zinc-700 shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-teal-600 hover:text-white hover:scale-110 focus:outline-none focus:ring-2 focus:ring-teal-500"
          @click.stop="isQuickViewOpen = true"
          @mouseenter.stop
          @mouseleave.stop
          aria-label="Быстрый просмотр"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </button>

        <!-- Error State -->
        <div
          v-if="!currentImage || imageError"
          class="flex flex-col items-center justify-center text-zinc-400 p-6 text-center"
        >
          <svg
            class="w-10 h-10 sm:w-12 sm:h-12 mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span class="text-xs font-medium">
            {{ !currentImage ? 'Нет изображения' : 'Ошибка загрузки' }}
          </span>
        </div>
      </div>
    </div>

    <!-- Content Section -->
    <div class="flex flex-col flex-1 p-2.5 sm:p-5 gap-1.5 sm:gap-3">
      <!-- Title -->
        <h3 class="font-semibold text-xs sm:text-base text-zinc-900 leading-snug line-clamp-2 min-h-10 sm:min-h-18">
          {{ props.door.name }}
        </h3>

        <!-- Pricing -->
        <div>
          <p class="text-sm sm:text-lg font-bold text-zinc-900">
            {{ formatPrice(doorPrice) }} <span class="text-xs font-medium text-zinc-500">за полотно</span>
          </p>
        </div>

      <!-- Material Toggle -->
      <div @click.stop>
        <button
          type="button"
          class="inline-flex items-center gap-1 text-xs font-medium text-zinc-600
                 hover:text-teal-600 transition-colors focus:outline-none focus-visible:ring-1
                 focus-visible:ring-teal-500 rounded px-0.5 py-0.5"
          @click="isMaterialOpen = !isMaterialOpen"
        >
          <span>Материал</span>
          <svg
            class="w-3 h-3 transition-transform duration-200"
            :class="{ 'rotate-180': isMaterialOpen }"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <Transition
          enter-active-class="transition-all duration-200 ease-out"
          leave-active-class="transition-all duration-150 ease-in"
          enter-from-class="opacity-0 -translate-y-0.5"
          enter-to-class="opacity-100 translate-y-0"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-0.5"
        >
          <p v-show="isMaterialOpen" class="mt-1 text-xs text-zinc-700 leading-relaxed">
            {{ props.door.material }}
          </p>
        </Transition>
      </div>

      <!-- Color Display -->
      <div class="mt-auto pt-1 sm:pt-2 border-t border-zinc-200">
        <div class="flex items-center gap-1.5 px-2 sm:px-5 pb-2 pt-1">
          <div
            class="w-4 h-4 rounded-full shrink-0"
            :style="{ backgroundColor: props.modelValue.hex, boxShadow: '0 1px 3px rgba(0,0,0,0.15)' }"
          />
          <span class="text-xs text-zinc-500 truncate">{{ props.modelValue.name }}</span>
        </div>
      </div>

      <!-- Specifications Toggle -->
      <div class="pt-1.5 sm:pt-3 border-t border-zinc-200" @click.stop>
        <button
          type="button"
          class="inline-flex items-center gap-1 text-xs font-medium text-zinc-700
                 hover:text-zinc-900 transition-colors focus:outline-none focus-visible:ring-1
                 focus-visible:ring-teal-500 rounded px-0.5 py-0.5"
          @click="isDetailsOpen = !isDetailsOpen"
        >
          <svg
            class="w-3 h-3 transition-transform duration-200"
            :class="{ 'rotate-180': isDetailsOpen }"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7" />
          </svg>
          <span>{{ isDetailsOpen ? 'Скрыть' : 'Характеристики' }}</span>
        </button>

        <Transition
          enter-active-class="transition-all duration-200 ease-out"
          leave-active-class="transition-all duration-150 ease-in"
          enter-from-class="opacity-0 max-h-0"
          enter-to-class="opacity-100 max-h-32"
          leave-from-class="opacity-100 max-h-32"
          leave-to-class="opacity-0 max-h-0"
        >
          <div v-show="isDetailsOpen" class="mt-2 text-xs sm:text-sm text-zinc-600 space-y-1 overflow-hidden">
            <p class="flex justify-between">
              <span class="text-zinc-500">Серия:</span>
              <span class="font-medium text-zinc-900">{{ props.door.series }}</span>
            </p>
            <p class="flex justify-between">
              <span class="text-zinc-500">Покрытие:</span>
              <span class="font-medium text-zinc-900">{{ displayCover }}</span>
            </p>
            <p v-if="props.door.thickness" class="flex justify-between">
              <span class="text-zinc-500">Толщина:</span>
              <span class="font-medium text-zinc-900">{{ props.door.thickness }} мм</span>
            </p>
            <p v-if="isInStock" class="flex items-center gap-1 text-teal-600 font-medium">
              <svg class="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              <span>В наличии</span>
            </p>
          </div>
        </Transition>
      </div>
    </div>

    <!-- QUICK VIEW MODAL - Только изображение -->
    <Transition name="fade">
      <div
        v-if="isQuickViewOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        @click.stop="isQuickViewOpen = false"
      >
        <div
          class="relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          @click.stop
        >
          <!-- Close Button -->
          <button
            class="absolute top-3 right-3 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-lg text-zinc-500 hover:text-zinc-900 hover:bg-white transition-all focus:outline-none focus:ring-2 focus:ring-teal-500"
            @click.stop="isQuickViewOpen = false"
            aria-label="Закрыть"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <!-- Image Container -->
          <div class="w-full h-[70vh] sm:h-[80vh] bg-zinc-50 flex items-center justify-center p-6 sm:p-10">
            <img
              v-if="currentImage && !imageError"
              :src="currentImage"
              :alt="props.door.name"
              class="max-w-full max-h-full object-contain"
              loading="eager"
            />
            <div v-else class="flex flex-col items-center justify-center text-zinc-400">
              <svg class="w-20 h-20 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p class="text-sm">Изображение недоступно</p>
            </div>
          </div>

          <!-- Color Label -->
          <div class="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-white/95 backdrop-blur-sm rounded-full shadow-lg">
            <p class="text-sm font-medium text-zinc-700">
              {{ props.modelValue?.name?.split('/')[0] || 'Выберите цвет' }}
            </p>
          </div>
        </div>
      </div>
    </Transition>
  </article>
</template>

<style scoped>
.product-card {
  user-select: none;
  -webkit-user-select: none;
  -webkit-touch-callout: none;
  -webkit-tap-highlight-color: transparent;
  contain: layout style paint;
  content-visibility: auto;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.product-card,
.product-card img {
  transform: translateZ(0);
  backface-visibility: hidden;
  -webkit-font-smoothing: antialiased;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  overflow: hidden;
}

button {
  touch-action: manipulation;
}

/* Prevent scrollbar overflow on mobile */
.overflow-visible {
  overflow: visible;
}

/* Smooth scrolling for colors on mobile */
.scroll-smooth {
  scroll-behavior: smooth;
  scrollbar-gutter: stable;
}

/* Fixed heights to prevent CLS */
@media (max-width: 640px) {
  .product-card h3 {
    min-height: 2.5rem; /* min-h-10 for mobile */
  }
}

@media (min-width: 641px) {
  .product-card h3 {
    min-height: 4.5rem; /* min-h-[4.5rem] for desktop */
  }
}

/* Scrollbar */
.product-card ::-webkit-scrollbar {
  width: 3px;
  height: 3px;
}

.product-card ::-webkit-scrollbar-track {
  background: transparent;
}

.product-card ::-webkit-scrollbar-thumb {
  background: #d4d4d8;
  border-radius: 1.5px;
}

.product-card ::-webkit-scrollbar-thumb:hover {
  background: #a1a1a5;
}

/* Quick View Fade Transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-active > div:last-child,
.fade-leave-active > div:last-child {
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.fade-enter-from > div:last-child,
.fade-leave-to > div:last-child {
  transform: scale(0.95);
  opacity: 0;
}
</style>