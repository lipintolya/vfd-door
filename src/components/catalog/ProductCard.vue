<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import type { Door, Color, DoorSeries } from './types'
import { useSeriesTheme } from './theme/useSeriesTheme'
import { calculateDoorPrice, calculateSetPrice } from '@/services/pricing'

interface Props {
  door: Door
  modelValue: Color
}

const props = defineProps<Props>()

interface Emits {
  (e: 'update:modelValue', color: Color): void
}

const emit = defineEmits<Emits>()

const router = useRouter()
const seriesTheme = useSeriesTheme(props.door.series as DoorSeries)

const isDetailsOpen = ref(false)
const isMaterialOpen = ref(false)
const imageLoaded = ref(false)
const imageError = ref(false)
const isHovering = ref(false)
const passiveSupported = ref(false)
// NOTE: colorsScrollContainer removed - using native browser scrolling

interface TouchState {
  startX: number
  startY: number
  startTime: number
  isSwiping: boolean
}

const touchState = ref<TouchState>({
  startX: 0,
  startY: 0,
  startTime: 0,
  isSwiping: false
})

const SWIPE_THRESHOLD = 60
const SWIPE_VELOCITY_THRESHOLD = 0.3
const MAX_SWIPE_TIME = 300

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

const setPrice = computed<number>(() => {
  try {
    return calculateSetPrice(props.door, props.modelValue) ?? 0
  } catch (error) {
    console.error('[ProductCard] Set price calculation error:', error)
    return 0
  }
})

const hasMultipleColors = computed(() => {
  return props.door.colors && props.door.colors.length > 1
})

const currentColorIndex = computed(() => {
  if (!hasMultipleColors.value) return 0
  return props.door.colors.findIndex(c => c?.name === props.modelValue?.name)
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

const handleSelectColor = (color: Color, event?: Event): void => {
  if (event) {
    event.stopPropagation()
  }
  if (!color || color.name === props.modelValue?.name) return
  emit('update:modelValue', color)
}

const navigateToProduct = (): void => {
  if (touchState.value.isSwiping) return
  
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
  // Попытка использовать fallback изображение серии
  if (!imageError.value) {
    const fallbackImage = seriesTheme.value?.fallbackImage
    if (fallbackImage && fallbackImage !== props.modelValue?.image) {
      // Пробуем загрузить fallback
      const img = new Image()
      img.onload = () => {
        imageError.value = false
        imageLoaded.value = true
      }
      img.onerror = () => {
        imageError.value = true
        imageLoaded.value = false
      }
      img.src = fallbackImage
      return
    }
  }
  imageError.value = true
  imageLoaded.value = false
}

const handleImageLoad = (): void => {
  imageLoaded.value = true
  imageError.value = false
}

const onTouchStart = (e: TouchEvent): void => {
  const touch = e.touches?.[0]
  if (!touch || !hasMultipleColors.value) return
  
  touchState.value = {
    startX: touch.clientX,
    startY: touch.clientY,
    startTime: Date.now(),
    isSwiping: false
  }
}

const onTouchMove = (e: TouchEvent): void => {
  if (!hasMultipleColors.value) return
  
  const touch = e.touches?.[0]
  if (!touch) return
  
  const deltaX = Math.abs(touch.clientX - touchState.value.startX)
  const deltaY = Math.abs(touch.clientY - touchState.value.startY)
  
  if (deltaX > 10 && deltaX > deltaY) {
    touchState.value.isSwiping = true
    e.preventDefault()
  }
}

const onTouchEnd = (e: TouchEvent): void => {
  if (!hasMultipleColors.value || !touchState.value.isSwiping) {
    touchState.value.isSwiping = false
    return
  }
  
  const touch = e.changedTouches?.[0]
  if (!touch) {
    touchState.value.isSwiping = false
    return
  }
  
  const deltaX = touch.clientX - touchState.value.startX
  const deltaY = touch.clientY - touchState.value.startY
  const deltaTime = Date.now() - touchState.value.startTime
  const velocity = Math.abs(deltaX) / deltaTime
  
  if (Math.abs(deltaY) > Math.abs(deltaX)) {
    touchState.value.isSwiping = false
    return
  }
  
  const isValidSwipe = 
    Math.abs(deltaX) >= SWIPE_THRESHOLD || 
    (velocity >= SWIPE_VELOCITY_THRESHOLD && deltaTime <= MAX_SWIPE_TIME)
  
  if (isValidSwipe) {
    changeColor(deltaX < 0 ? 1 : -1)
  }
  
  touchState.value.isSwiping = false
}

const onTouchCancel = (): void => {
  touchState.value.isSwiping = false
}

const changeColor = (direction: number): void => {
  const colors = props.door.colors
  if (!colors || colors.length <= 1) return
  
  const currentIdx = currentColorIndex.value
  if (currentIdx === -1) return
  
  const newIndex = (currentIdx + direction + colors.length) % colors.length
  const newColor = colors[newIndex]
  
  if (newColor) {
    handleSelectColor(newColor)
  }
}

onMounted(() => {
  try {
    const opts = Object.defineProperty({}, 'passive', {
      get() {
        passiveSupported.value = true
        return true
      }
    })
    window.addEventListener('test', () => {}, opts)
    window.removeEventListener('test', () => {}, opts)
  } catch (e) {
    passiveSupported.value = false
  }
})

onUnmounted(() => {
  // Cleanup if needed
})
</script>

<template>
  <article
    class="product-card group relative h-full flex flex-col rounded-2xl bg-white shadow-sm ring-1 ring-zinc-900/5
           transition-all duration-300 ease-out cursor-pointer
           hover:shadow-lg hover:ring-zinc-900/10"
    :class="{
      'hover:-translate-y-0.5': !touchState.isSwiping,
      'active:scale-[0.98]': touchState.isSwiping
    }"
    @click="navigateToProduct"
    @touchstart.passive="onTouchStart"
    @touchmove="onTouchMove"
    @touchend="onTouchEnd"
    @touchcancel="onTouchCancel"
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
    <div class="relative w-full px-3 sm:px-4">
      <div
        class="relative w-full h-64 sm:aspect-3/4
               bg-linear-to-br from-zinc-50 to-zinc-100/50 rounded-xl 
               flex items-center justify-center overflow-hidden"
      >
        <!-- Loading State -->
        <div 
          v-if="!imageLoaded && !imageError && currentImage" 
          class="absolute inset-0 flex items-center justify-center bg-zinc-50/80 backdrop-blur-sm"
        >
          <div class="w-10 h-10 border-3 border-zinc-200 border-t-teal-500 rounded-full animate-spin" />
        </div>

        <!-- Image -->
        <img
          v-if="currentImage && !imageError"
          :src="currentImage"
          :alt="props.door.name"
          class="w-full h-full object-contain p-3 sm:p-4 transition-transform duration-500 ease-out"
          :class="{
            'opacity-0 scale-95': !imageLoaded,
            'opacity-100 scale-100': imageLoaded,
            'group-hover:scale-105': !touchState.isSwiping && isHovering
          }"
          loading="lazy"
          decoding="async"
          fetchpriority="high"
          @error="handleImageError"
          @load="handleImageLoad"
        />

        <!-- Error State -->
        <div 
          v-if="!currentImage || imageError" 
          class="flex flex-col items-center justify-center text-zinc-400 p-6 text-center"
        >
          <svg 
            class="w-12 h-12 mb-2" 
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
    <div class="flex flex-col flex-1 p-3 sm:p-5 gap-2 sm:gap-3">
      <!-- Title -->
        <h3 class="font-semibold text-sm sm:text-base text-zinc-900 leading-tight line-clamp-2 h-10 sm:h-12">
          {{ props.door.name }}
        </h3>

        <!-- Pricing -->
        <div class="space-y-0.5">
          <p class="text-base sm:text-lg font-bold text-zinc-900 h-7">
            {{ formatPrice(doorPrice) }}
          </p>
          <p class="text-xs text-zinc-500 h-5">
            {{ formatPrice(setPrice) }}
          </p>
        </div>

      <!-- Material Toggle -->
      <div @click.stop>
        <button
          type="button"
          class="inline-flex items-center gap-1 text-xs sm:text-sm font-medium text-zinc-600 
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
          <p v-show="isMaterialOpen" class="mt-1 text-xs sm:text-sm text-zinc-700 leading-relaxed">
            {{ props.door.material }}
          </p>
        </Transition>
      </div>

      <!-- Colors Container - ОПТИМИЗИРОВАНО ДЛЯ МОБИЛКИ И CLS -->
      <div class="mt-auto pt-1 sm:pt-2 border-t border-zinc-200" @click.stop>
        <p class="text-xs text-zinc-500 mb-2.5 px-3 sm:px-5 pt-2">
          Цвет: <span class="font-medium text-zinc-700">{{ props.modelValue.name }}</span>
        </p>
        
        <!-- Color Buttons Container (prevent clipping on mobile) -->
        <div class="overflow-visible">
          <!-- Desktop: Grid of colors -->
          <div class="hidden sm:flex flex-wrap gap-2 sm:gap-2.5 px-3 sm:px-5 pb-3">
            <button
              v-for="color in props.door.colors"
              :key="color.name"
              type="button"
              class="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full transition-all duration-200 shrink-0
                     focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-teal-500
                     hover:scale-110"
              :style="{
                backgroundColor: color.hex,
                boxShadow: props.modelValue.name === color.name 
                  ? `0 0 0 2px white, 0 0 0 3.5px ${accent}`
                  : '0 1px 3px rgba(0, 0, 0, 0.1)'
              }"
              :title="color.name"
              :aria-label="`Выбрать цвет ${color.name}`"
              :aria-pressed="props.modelValue.name === color.name"
              @click="(e) => handleSelectColor(color, e)"
            >
              <svg
                v-if="props.modelValue.name === color.name"
                class="absolute inset-0 m-auto w-4 h-4 text-white drop-shadow pointer-events-none"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>

          <!-- Mobile: Horizontal scroll with larger buttons (no clipping) -->
          <div
            v-if="hasMultipleColors"
            class="sm:hidden flex gap-2.5 overflow-x-auto pb-3 pl-3 pr-6 py-3 scroll-smooth overflow-visible"
            @click.stop
          >
            <button
              v-for="color in props.door.colors"
              :key="color.name"
              type="button"
              class="relative w-11 h-11 rounded-full transition-all duration-200 shrink-0
                     focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-teal-500
                     active:scale-95 overflow-visible"
              :style="{
                backgroundColor: color.hex,
                boxShadow: props.modelValue.name === color.name
                  ? `0 0 0 2.5px white, 0 0 0 4px ${accent}`
                  : '0 2px 8px rgba(0, 0, 0, 0.15)'
              }"
              :title="color.name"
              :aria-label="`Выбрать цвет ${color.name}`"
              :aria-pressed="props.modelValue.name === color.name"
              @click="(e) => handleSelectColor(color, e)"
            >
              <svg
                v-if="props.modelValue.name === color.name"
                class="absolute inset-0 m-auto w-5 h-5 text-white drop-shadow pointer-events-none"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>

          <!-- Fallback for single color -->
          <div v-if="!hasMultipleColors" class="text-xs text-zinc-400 px-3 sm:px-5 pb-3">
            Доступен только в этом цвете
          </div>
        </div>
      </div>

      <!-- Specifications Toggle -->
      <div class="pt-2 sm:pt-3 border-t border-zinc-200" @click.stop>
        <button
          type="button"
          class="inline-flex items-center gap-1 text-xs sm:text-sm font-medium text-zinc-700 
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
          <span>{{ isDetailsOpen ? 'Скрыть' : 'Показать' }} характеристики</span>
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
              <span class="font-medium text-zinc-900">{{ props.door.cover }}</span>
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
    min-height: 2.5rem;
  }
  
  .product-card .space-y-0\.5 > p:first-child {
    min-height: 1.75rem;
  }
  
  .product-card .space-y-0\.5 > p:last-child {
    min-height: 1.25rem;
  }
}

@media (min-width: 641px) {
  .product-card h3 {
    min-height: 3rem;
  }
  
  .product-card .space-y-0\.5 > p:first-child {
    min-height: 1.75rem;
  }
  
  .product-card .space-y-0\.5 > p:last-child {
    min-height: 1.25rem;
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
</style>