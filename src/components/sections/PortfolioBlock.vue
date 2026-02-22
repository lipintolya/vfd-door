<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, shallowRef } from 'vue'
import { useRouter } from 'vue-router'
import AppSection from '@/components/layout/AppSection.vue'
import AppContainer from '@/components/layout/AppContainer.vue'
import { portfolioWorks } from '@/data/portfolio'
import type { PortfolioWork } from '@/data/portfolio'

/* ============================================
   КОНСТАНТЫ
============================================ */
const WORKS_PER_PAGE = 3
const AUTOPLAY_DELAY = 4000
const ANIMATION_DURATION = 400

const PRODUCT_TYPE_LABELS: Record<PortfolioWork['productType'], string> = {
  door: 'Двери',
  partition: 'Перегородки',
  entrance: 'Входные группы',
}

const PRODUCT_TYPE_ICONS: Record<PortfolioWork['productType'], string> = {
  door: '🚪',
  partition: '🪟',
  entrance: '🏢',
}

/* ============================================
   STATE
============================================ */
const router = useRouter()
const currentIndex = ref(0)
const isAnimating = ref(false)
const touchStartX = ref(0)
const touchStartY = ref(0)
const autoplayTimer = ref<number | null>(null)
const cardImageIndex = ref<Record<string, number>>({})

// Оптимизированное хранение состояния изображений
const imageLoaded = shallowRef<Set<string>>(new Set())
const imageError = shallowRef<Set<string>>(new Set())

/* ============================================
   COMPUTED
============================================ */
const totalWorks = computed(() => portfolioWorks.length)

const visibleWorks = computed(() => {
  const len = portfolioWorks.length
  if (!len) return []

  const result: Array<{ work: PortfolioWork; position: number }> = []
  for (let i = 0; i < WORKS_PER_PAGE; i++) {
    const idx = ((currentIndex.value + i) % len + len) % len
    const work = portfolioWorks[idx]
    if (work) result.push({ work, position: i })
  }
  return result
})

const totalPages = computed(() => Math.ceil(totalWorks.value / WORKS_PER_PAGE))

const currentPage = computed(() => Math.floor(currentIndex.value / WORKS_PER_PAGE))

/* ============================================
   НАВИГАЦИЯ
============================================ */
const goTo = (index: number) => {
  if (isAnimating.value || !portfolioWorks.length) return
  isAnimating.value = true

  const len = portfolioWorks.length
  const newIndex = ((index % len) + len) % len
  currentIndex.value = newIndex

  setTimeout(() => {
    isAnimating.value = false
  }, ANIMATION_DURATION)
}

const next = () => goTo(currentIndex.value + 1)
const prev = () => goTo(currentIndex.value - 1)

/* ============================================
   АВТОПЛЕЙ
============================================ */
const startAutoplay = () => {
  if (autoplayTimer.value) return
  autoplayTimer.value = window.setInterval(next, AUTOPLAY_DELAY)
}

const stopAutoplay = () => {
  if (autoplayTimer.value) {
    clearInterval(autoplayTimer.value)
    autoplayTimer.value = null
  }
}

const pauseAutoplay = () => stopAutoplay()
const resumeAutoplay = () => startAutoplay()

/* ============================================
   СВАЙП
============================================ */
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

/* ============================================
   IMAGE HANDLERS
============================================ */
const handleImageLoad = (workId: string) => {
  imageLoaded.value.add(workId)
}

const handleImageError = (workId: string) => {
  imageError.value.add(workId)
}

/* ============================================
   MINI SLIDER ДЛЯ КАРТОЧКИ
============================================ */
const getCardImageIndex = (workId: string): number => {
  return cardImageIndex.value[workId] ?? 0
}

const nextCardImage = (workId: string, imagesCount: number, event: Event) => {
  event.stopPropagation()
  const currentIdx = cardImageIndex.value[workId] ?? 0
  cardImageIndex.value[workId] = (currentIdx + 1) % imagesCount
}

const prevCardImage = (workId: string, imagesCount: number, event: Event) => {
  event.stopPropagation()
  const currentIdx = cardImageIndex.value[workId] ?? 0
  cardImageIndex.value[workId] = (currentIdx - 1 + imagesCount) % imagesCount
}

const handleCardTouchStart = (e: TouchEvent, _workId: string) => {
  if (!e.touches?.[0]) return
  touchStartX.value = e.touches[0].clientX
}

const handleCardTouchEnd = (e: TouchEvent, workId: string, imagesCount: number) => {
  if (!e.changedTouches?.[0]) return
  const dx = touchStartX.value - e.changedTouches[0].clientX
  if (Math.abs(dx) > 50) {
    dx > 0 ? nextCardImage(workId, imagesCount, e) : prevCardImage(workId, imagesCount, e)
  }
}

/* ============================================
   ФОРМАТТЕРЫ
============================================ */
const formatDateCache = new Map<string, string>()

function formatDate(dateString: string): string {
  if (formatDateCache.has(dateString)) {
    return formatDateCache.get(dateString)!
  }
  const formatted = new Date(dateString).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  formatDateCache.set(dateString, formatted)
  return formatted
}

/* ============================================
   НАВИГАЦИЯ К ПОЛНОМУ ПОРТФОЛИО
============================================ */
const navigateToPortfolio = () => {
  router.push('/portfolio')
}

/* ============================================
   LIFECYCLE
============================================ */
onMounted(() => {
  startAutoplay()
})

onBeforeUnmount(() => {
  stopAutoplay()
  imageLoaded.value.clear()
  imageError.value.clear()
  cardImageIndex.value = {}
})
</script>

<template>
  <AppSection size="lg" class="bg-zinc-50">
    <AppContainer>
      <!-- HEADER -->
      <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10 sm:mb-12">
        <div>
          <h2 class="text-3xl sm:text-4xl lg:text-5xl font-semibold text-zinc-900 mb-3">
            Наши работы
          </h2>
          <p class="text-base sm:text-lg text-zinc-600 max-w-2xl">
            Реализованные проекты: от уютных квартир до крупных коммерческих объектов
          </p>
        </div>
        <button
          @click="navigateToPortfolio"
          class="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-teal-600 text-white text-sm font-semibold hover:bg-teal-700 transition-all hover:shadow-lg hover:shadow-teal-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 self-start sm:self-auto"
        >
          <span>Все работы</span>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <!-- EMPTY STATE -->
      <div
        v-if="!totalWorks"
        class="py-16 text-center text-zinc-500 bg-white rounded-2xl border border-zinc-200"
      >
        <svg class="w-16 h-16 mx-auto mb-4 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p class="text-lg font-medium">Портфолио в разработке</p>
        <p class="text-sm mt-1">Скоро здесь появятся наши работы</p>
      </div>

      <!-- SLIDER -->
      <div
        v-else
        class="relative max-w-6xl mx-auto group"
        @mouseenter="pauseAutoplay"
        @mouseleave="resumeAutoplay"
      >
        <div
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 transition-all duration-400"
          :class="isAnimating ? 'opacity-90 scale-[0.99]' : ''"
          @touchstart.passive="handleTouchStart"
          @touchend="handleTouchEnd"
        >
          <div
            v-for="{ work, position } in visibleWorks"
            :key="`${work.id}-${position}`"
            class="group/card relative bg-white rounded-2xl overflow-hidden border border-zinc-200 hover:border-teal-300 transition-all duration-300 hover:shadow-xl hover:shadow-teal-100/50 hover:-translate-y-1 cursor-pointer"
            @touchstart.passive="(e) => handleCardTouchStart(e, work.id)"
            @touchend="(e) => handleCardTouchEnd(e, work.id, work.images.length)"
          >
            <!-- IMAGE GALLERY -->
            <div class="relative aspect-4/3 overflow-hidden bg-zinc-100">
              <!-- Loading State -->
              <div
                v-if="!imageLoaded.has(work.id) && !imageError.has(work.id)"
                class="absolute inset-0 flex items-center justify-center"
              >
                <div class="w-10 h-10 border-2 border-zinc-300 border-t-teal-500 rounded-full animate-spin" />
              </div>

              <!-- Error State -->
              <div
                v-if="imageError.has(work.id)"
                class="absolute inset-0 flex items-center justify-center bg-zinc-100"
              >
                <svg class="w-12 h-12 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>

              <!-- Images Slider -->
              <div
                class="w-full h-full flex transition-transform duration-300 ease-out"
                :style="{ transform: `translateX(-${getCardImageIndex(work.id) * 100}%)` }"
              >
                <div
                  v-for="(img, idx) in work.images"
                  :key="idx"
                  class="w-full h-full relative shrink-0"
                >
                  <img
                    :src="img"
                    :alt="`${work.title} - фото ${idx + 1}`"
                    class="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-110"
                    loading="lazy"
                    decoding="async"
                    @load="handleImageLoad(work.id)"
                    @error="handleImageError(work.id)"
                  />
                  <!-- Watermark -->
                  <div class="absolute bottom-3 right-3 px-2 py-1 bg-black/60 backdrop-blur-sm rounded text-xs font-medium text-white/90 pointer-events-none">
                    © VFD Doors
                  </div>
                </div>
              </div>

              <!-- Navigation Arrows (show on hover) -->
              <template v-if="work.images.length > 1">
                <!-- Prev Button -->
                <button
                  @click="(e) => prevCardImage(work.id, work.images.length, e)"
                  class="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/90 backdrop-blur-sm border border-zinc-200 shadow-md text-zinc-700 opacity-0 group-hover/card:opacity-100 hover:bg-white hover:text-teal-600 transition-all disabled:opacity-0"
                  :disabled="work.images.length <= 1"
                  aria-label="Предыдущее фото"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <!-- Next Button -->
                <button
                  @click="(e) => nextCardImage(work.id, work.images.length, e)"
                  class="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/90 backdrop-blur-sm border border-zinc-200 shadow-md text-zinc-700 opacity-0 group-hover/card:opacity-100 hover:bg-white hover:text-teal-600 transition-all disabled:opacity-0"
                  :disabled="work.images.length <= 1"
                  aria-label="Следующее фото"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                <!-- Dots Indicator -->
                <div class="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                  <span
                    v-for="(_, idx) in work.images"
                    :key="idx"
                    class="w-1.5 h-1.5 rounded-full transition-all duration-300"
                    :class="getCardImageIndex(work.id) === idx ? 'bg-white w-4' : 'bg-white/50'"
                  />
                </div>

                <!-- Image Counter -->
                <div class="absolute top-3 right-3 flex items-center gap-2">
                  <span
                    v-if="work.series"
                    class="px-3 py-1.5 rounded-full bg-teal-600/95 backdrop-blur-sm text-xs font-semibold text-white shadow-sm"
                  >
                    {{ work.series }}
                  </span>
                  <span class="px-2 py-1 rounded-md bg-black/50 backdrop-blur-sm text-xs font-medium text-white">
                    {{ getCardImageIndex(work.id) + 1 }} / {{ work.images.length }}
                  </span>
                </div>
              </template>

              <!-- Type Badge -->
              <div class="absolute top-3 left-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-sm text-xs font-semibold text-zinc-700 shadow-sm" :class="work.images.length > 1 ? 'mt-0' : ''">
                <span>{{ PRODUCT_TYPE_ICONS[work.productType] }}</span>
                <span>{{ PRODUCT_TYPE_LABELS[work.productType] }}</span>
              </div>
            </div>

            <!-- CONTENT -->
            <div class="p-4 sm:p-5">
              <h3 class="text-base sm:text-lg font-semibold text-zinc-900 mb-2 line-clamp-2 group-hover/card:text-teal-700 transition-colors">
                {{ work.title }}
              </h3>
              <p class="text-sm text-zinc-600 mb-4 line-clamp-2">
                {{ work.description }}
              </p>

              <!-- META -->
              <div class="flex items-center justify-between text-xs text-zinc-500">
                <div class="flex items-center gap-1.5">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span class="truncate">{{ work.location.replace(/,.*$/, '') }}</span>
                </div>
                <div class="flex items-center gap-1.5 shrink-0">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{{ formatDate(work.date) }}</span>
                </div>
              </div>

              <!-- AREA (if available) -->
              <div
                v-if="work.area"
                class="mt-3 pt-3 border-t border-zinc-100 flex items-center gap-1.5 text-xs text-zinc-500"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
                <span>Площадь: {{ work.area }} м²</span>
              </div>
            </div>
          </div>
        </div>

        <!-- NAVIGATION ARROWS -->
        <button
          @click="prev"
          class="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 lg:-translate-x-4 p-2.5 sm:p-3 rounded-full bg-white border border-zinc-200 shadow-lg text-zinc-700 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all hover:bg-teal-50 hover:border-teal-500 hover:text-teal-600 disabled:opacity-30 disabled:cursor-not-allowed z-10"
          :disabled="isAnimating"
          aria-label="Предыдущие работы"
        >
          <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          @click="next"
          class="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 lg:translate-x-4 p-2.5 sm:p-3 rounded-full bg-white border border-zinc-200 shadow-lg text-zinc-700 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all hover:bg-teal-50 hover:border-teal-500 hover:text-teal-600 disabled:opacity-30 disabled:cursor-not-allowed z-10"
          :disabled="isAnimating"
          aria-label="Следующие работы"
        >
          <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <!-- PAGINATION DOTS -->
        <div class="flex justify-center gap-2 mt-8">
          <button
            v-for="(_, idx) in totalPages"
            :key="idx"
            @click="goTo(idx * WORKS_PER_PAGE)"
            class="w-2.5 h-2.5 rounded-full transition-all duration-300"
            :class="currentPage === idx ? 'bg-teal-600 w-8' : 'bg-zinc-300 hover:bg-zinc-400'"
            :aria-label="`Перейти к странице ${idx + 1}`"
          />
        </div>

        <!-- WORKS COUNTER -->
        <div class="text-center mt-6 text-sm text-zinc-500">
          Показано {{ Math.min(WORKS_PER_PAGE, totalWorks) }} из {{ totalWorks }} работ
        </div>
        
        <!-- COPYRIGHT NOTICE -->
        <div class="mt-8 pt-6 border-t border-zinc-200 text-center">
          <p class="text-xs text-zinc-500">
            📸 Все фотографии являются объектами авторского права VFD Doors.
            <br class="sm:hidden" />
            Использование возможно только с указанием источника:
            <a href="https://vfd-door.vercel.app" class="text-teal-600 hover:text-teal-700 hover:underline font-medium">vfd-door.vercel.app</a>
          </p>
        </div>
      </div>
    </AppContainer>
  </AppSection>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  overflow: hidden;
}

.no-scrollbar {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>
