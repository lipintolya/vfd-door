<script setup lang="ts">
import { ref, computed, reactive, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import AppSection from '@/components/layout/AppSection.vue'
import AppContainer from '@/components/layout/AppContainer.vue'
import { portfolioWorks } from '@/data/portfolio'
import type { PortfolioWork } from '@/data/portfolio'

/* ============================================
   КОНСТАНТЫ
============================================ */
const WORKS_PER_PAGE_DESKTOP = 3
const WORKS_PER_PAGE_MOBILE = 1
const AUTOPLAY_DELAY = 7000
const ANIMATION_DURATION = 400
const MOBILE_BREAKPOINT = 640

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
   РЕАКТИВНЫЙ isMobile
   Computed от window.innerWidth не реагирует на resize —
   нужен ref, обновляемый слушателем.
============================================ */
const isMobile = ref(
  typeof window !== 'undefined' && window.innerWidth < MOBILE_BREAKPOINT,
)

let resizeTimer: ReturnType<typeof setTimeout> | null = null

const onResize = () => {
  if (resizeTimer) clearTimeout(resizeTimer)
  resizeTimer = setTimeout(() => {
    isMobile.value = window.innerWidth < MOBILE_BREAKPOINT
  }, 150)
}

/* ============================================
   STATE — слайдер
============================================ */
const router = useRouter()
const currentIndex = ref(0)
const isAnimating = ref(false)
const sliderTouchStartX = ref(0)
const sliderTouchStartY = ref(0)
const autoplayTimer = ref<ReturnType<typeof setInterval> | null>(null)

/* ============================================
   STATE — изображения карточек
   FIX: было shallowRef<Set> — мутации Set невидимы для Vue.
   reactive<Record> корректно отслеживает присваивание ключей.
============================================ */
const imageLoaded = reactive<Record<string, true>>({})
const imageError = reactive<Record<string, true>>({})
const cardImageIndex = reactive<Record<string, number>>({})

/* ============================================
   STATE — лайтбокс
============================================ */
const lightbox = reactive({
  open: false,
  workId: '' as string,
  index: 0,
})

const lightboxWork = computed(() =>
  portfolioWorks.find(w => w.id === lightbox.workId) ?? null,
)

const openLightbox = (workId: string, index: number) => {
  lightbox.workId = workId
  lightbox.index = index
  lightbox.open = true
  document.body.style.overflow = 'hidden'
}

const closeLightbox = () => {
  lightbox.open = false
  document.body.style.overflow = ''
}

const lightboxNext = () => {
  const work = lightboxWork.value
  if (!work) return
  lightbox.index = (lightbox.index + 1) % work.images.length
}

const lightboxPrev = () => {
  const work = lightboxWork.value
  if (!work) return
  lightbox.index = (lightbox.index - 1 + work.images.length) % work.images.length
}

/* ============================================
   COMPUTED — слайдер
============================================ */
const totalWorks = computed(() => portfolioWorks.length)

const worksPerPage = computed(() =>
  isMobile.value ? WORKS_PER_PAGE_MOBILE : WORKS_PER_PAGE_DESKTOP,
)

const visibleWorks = computed(() => {
  const len = portfolioWorks.length
  const perPage = worksPerPage.value
  if (!len) return []

  const result: Array<{ work: PortfolioWork; position: number }> = []
  for (let i = 0; i < perPage; i++) {
    const idx = ((currentIndex.value + i) % len + len) % len
    const work = portfolioWorks[idx]
    if (work) result.push({ work, position: i })
  }
  return result
})

const totalPages = computed(() => Math.ceil(totalWorks.value / worksPerPage.value))

const currentPage = computed(() =>
  Math.floor(currentIndex.value / worksPerPage.value),
)

/* ============================================
   НАВИГАЦИЯ — слайдер
============================================ */
const goTo = (index: number) => {
  if (isAnimating.value || !portfolioWorks.length) return
  isAnimating.value = true

  const len = portfolioWorks.length
  currentIndex.value = ((index % len) + len) % len

  setTimeout(() => { isAnimating.value = false }, ANIMATION_DURATION)
}

const next = () => goTo(currentIndex.value + worksPerPage.value)
const prev = () => goTo(currentIndex.value - worksPerPage.value)

/* ============================================
   АВТОПЛЕЙ (только десктоп)
============================================ */
const startAutoplay = () => {
  if (autoplayTimer.value || isMobile.value) return
  autoplayTimer.value = setInterval(next, AUTOPLAY_DELAY)
}

const stopAutoplay = () => {
  if (!autoplayTimer.value) return
  clearInterval(autoplayTimer.value)
  autoplayTimer.value = null
}

/* ============================================
   СВАЙП — основной слайдер
============================================ */
const onSliderTouchStart = (e: TouchEvent) => {
  if (!e.touches[0]) return
  sliderTouchStartX.value = e.touches[0].clientX
  sliderTouchStartY.value = e.touches[0].clientY
}

const onSliderTouchEnd = (e: TouchEvent) => {
  if (!e.changedTouches[0]) return
  const dx = sliderTouchStartX.value - e.changedTouches[0].clientX
  const dy = sliderTouchStartY.value - e.changedTouches[0].clientY
  if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
    dx > 0 ? next() : prev()
  }
}

/* ============================================
   СВАЙП — мини-слайдер карточки
   Отдельные обработчики для свайпа внутри карточки
============================================ */
const cardTouchStartX = ref(0)

const onCardTouchStart = (e: TouchEvent) => {
  if (!e.touches[0]) return
  cardTouchStartX.value = e.touches[0].clientX
}

const onCardTouchEnd = (e: TouchEvent, work: PortfolioWork) => {
  if (!e.changedTouches[0]) return
  const dx = cardTouchStartX.value - e.changedTouches[0].clientX
  if (Math.abs(dx) > 30) {
    // Порог ниже для более отзывчивого свайпа
    if (dx > 0) {
      nextCardImage(work.id, work.images.length, e as unknown as Event)
    } else {
      prevCardImage(work.id, work.images.length, e as unknown as Event)
    }
  }
}

/* ============================================
   МИНИ-СЛАЙДЕР КАРТОЧКИ
============================================ */
const getCardImageIndex = (workId: string) => cardImageIndex[workId] ?? 0

const setCardImageIndex = (workId: string, idx: number) => {
  cardImageIndex[workId] = idx
}

const nextCardImage = (workId: string, total: number, e: Event) => {
  e.stopPropagation()
  const cur = getCardImageIndex(workId)
  setCardImageIndex(workId, (cur + 1) % total)
}

const prevCardImage = (workId: string, total: number, e: Event) => {
  e.stopPropagation()
  const cur = getCardImageIndex(workId)
  setCardImageIndex(workId, (cur - 1 + total) % total)
}

/* ============================================
   ОБРАБОТЧИК КЛИКА ПО КАРТОЧКЕ
   Открывает лайтбокс с текущим изображением мини-слайдера.
============================================ */
const onCardClick = (work: PortfolioWork) => {
  openLightbox(work.id, getCardImageIndex(work.id))
}

/* ============================================
   СВАЙП — лайтбокс
============================================ */
const lbTouchStartX = ref(0)

const onLbTouchStart = (e: TouchEvent) => {
  if (e.touches[0]) lbTouchStartX.value = e.touches[0].clientX
}

const onLbTouchEnd = (e: TouchEvent) => {
  if (!e.changedTouches[0]) return
  const dx = lbTouchStartX.value - e.changedTouches[0].clientX
  if (Math.abs(dx) > 50) {
    dx > 0 ? lightboxNext() : lightboxPrev()
  }
}

/* ============================================
   КЛАВИАТУРА
============================================ */
const onKeydown = (e: KeyboardEvent) => {
  if (lightbox.open) {
    if (e.key === 'Escape') closeLightbox()
    if (e.key === 'ArrowRight') lightboxNext()
    if (e.key === 'ArrowLeft') lightboxPrev()
    return
  }
  if (e.key === 'ArrowRight') next()
  if (e.key === 'ArrowLeft') prev()
}

/* ============================================
   ФОРМАТТЕР ДАТ
============================================ */
const dateFormatter = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})
const dateCache = new Map<string, string>()

const formatDate = (dateString: string): string => {
  if (dateCache.has(dateString)) return dateCache.get(dateString)!
  const result = dateFormatter.format(new Date(dateString))
  dateCache.set(dateString, result)
  return result
}

/* ============================================
   LIFECYCLE
============================================ */
onMounted(() => {
  window.addEventListener('resize', onResize, { passive: true })
  window.addEventListener('keydown', onKeydown)
  startAutoplay()
})

onBeforeUnmount(() => {
  stopAutoplay()
  window.removeEventListener('resize', onResize)
  window.removeEventListener('keydown', onKeydown)
  if (resizeTimer) clearTimeout(resizeTimer)
  document.body.style.overflow = ''
})
</script>

<template>
  <AppSection size="lg" class="bg-zinc-50">
    <AppContainer>

      <!-- HEADER -->
      <div class="mb-10 sm:mb-12">
        <h2 class="text-3xl sm:text-4xl lg:text-5xl font-semibold text-zinc-900 mb-3">
          Наши работы
        </h2>
        <p class="text-base sm:text-lg text-zinc-600 max-w-3xl">
          Реализованные проекты: от уютных квартир до крупных коммерческих объектов
        </p>
      </div>

      <!-- EMPTY STATE -->
      <div
        v-if="!totalWorks"
        class="py-16 text-center text-zinc-500 bg-white rounded-2xl border border-zinc-200"
        role="status"
      >
        <svg class="w-16 h-16 mx-auto mb-4 text-zinc-300" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p class="text-lg font-medium">Портфолио в разработке</p>
        <p class="text-sm mt-1">Скоро здесь появятся наши работы</p>
      </div>

      <!-- SLIDER -->
      <div
        v-else
        class="relative group/slider"
        @mouseenter="stopAutoplay"
        @mouseleave="startAutoplay"
        @touchstart.passive="onSliderTouchStart"
        @touchend="onSliderTouchEnd"
      >
        <!-- CARDS GRID -->
        <div
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 transition-opacity duration-300"
          :class="isAnimating ? 'opacity-70' : 'opacity-100'"
        >
          <article
            v-for="{ work, position } in visibleWorks"
            :key="`${work.id}-${position}`"
            class="group/card relative bg-white rounded-2xl overflow-hidden border border-zinc-200 hover:border-teal-300 transition-all duration-300 hover:shadow-xl hover:shadow-teal-100/50 hover:-translate-y-1 cursor-pointer"
            :aria-label="`${work.title} — открыть галерею`"
            tabindex="0"
            role="button"
            @click="onCardClick(work)"
            @keydown.enter.prevent="onCardClick(work)"
            @keydown.space.prevent="onCardClick(work)"
            @touchstart.passive="onCardTouchStart"
            @touchend="onCardTouchEnd($event, work)"
          >
            <!-- IMAGE CONTAINER -->
            <div class="relative aspect-3/2 sm:aspect-4/3 overflow-hidden bg-zinc-100">
              <!-- Skeleton placeholder -->
              <div
                v-if="!imageLoaded[work.id] && !imageError[work.id]"
                class="absolute inset-0 bg-zinc-200 animate-pulse"
                aria-hidden="true"
              />

              <!-- Error state -->
              <div
                v-if="imageError[work.id]"
                class="absolute inset-0 flex items-center justify-center bg-zinc-100"
                aria-hidden="true"
              >
                <svg class="w-12 h-12 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>

              <!-- Images strip (CSS translate mini-slider) -->
              <div
                class="w-full h-full flex transition-transform duration-300 ease-out"
                :style="{ transform: `translateX(-${getCardImageIndex(work.id) * 100}%)` }"
              >
                <div
                  v-for="(img, idx) in work.images"
                  :key="idx"
                  class="w-full h-full shrink-0"
                >
                  <img
                    :src="img"
                    :alt="`${work.title} — фото ${idx + 1}`"
                    class="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-105"
                    :class="{ 'opacity-0': !imageLoaded[work.id] }"
                    :loading="idx === 0 ? 'eager' : 'lazy'"
                    :fetchpriority="idx === 0 ? 'high' : 'auto'"
                    decoding="async"
                    width="800"
                    height="600"
                    @load="imageLoaded[work.id] = true"
                    @error="imageError[work.id] = true"
                  />
                </div>
              </div>

              <!-- Tap zones для свайпа на мобильных (iOS Photos pattern) -->
              <template v-if="work.images.length > 1">
                <!-- Левая tap-зона: невидимая, но доступная для focus -->
                <button
                  type="button"
                  class="absolute inset-y-0 left-0 w-1/3 sm:w-1/4 z-10 sm:opacity-0 sm:group-hover/card:opacity-100 focus:opacity-100 transition-opacity duration-200"
                  aria-label="Предыдущее фото"
                  @click.stop="prevCardImage(work.id, work.images.length, $event)"
                >
                  <!-- Визуальная стрелка только для десктопа при ховере -->
                  <span class="hidden sm:flex absolute left-2 top-1/2 -translate-y-1/2 items-center justify-center w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm border border-zinc-200 shadow-md text-zinc-700 opacity-0 group-hover/card:opacity-100 transition-opacity pointer-events-none">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                    </svg>
                  </span>
                </button>
                <!-- Правая tap-зона: невидимая, но доступная для focus -->
                <button
                  type="button"
                  class="absolute inset-y-0 right-0 w-1/3 sm:w-1/4 z-10 sm:opacity-0 sm:group-hover/card:opacity-100 focus:opacity-100 transition-opacity duration-200"
                  aria-label="Следующее фото"
                  @click.stop="nextCardImage(work.id, work.images.length, $event)"
                >
                  <!-- Визуальная стрелка только для десктопа при ховере -->
                  <span class="hidden sm:flex absolute right-2 top-1/2 -translate-y-1/2 items-center justify-center w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm border border-zinc-200 shadow-md text-zinc-700 opacity-0 group-hover/card:opacity-100 transition-opacity pointer-events-none">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </button>
              </template>

              <!-- Hover overlay: подсказка открыть -->
              <div
                aria-hidden="true"
                class="absolute inset-0 bg-black/0 group-hover/card:bg-black/20 transition-colors duration-300 flex items-center justify-center pointer-events-none"
              >
                <div class="opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2 text-zinc-800 text-sm font-medium shadow">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Открыть
                </div>
              </div>

              <!-- Мини-слайдер: точки + счётчик (только если > 1 фото) -->
              <template v-if="work.images.length > 1">
                <!-- Точки-индикаторы -->
                <div class="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10" aria-hidden="true">
                  <span
                    v-for="(_, idx) in work.images"
                    :key="idx"
                    class="h-1.5 rounded-full transition-all duration-300"
                    :class="getCardImageIndex(work.id) === idx ? 'bg-white w-4' : 'bg-white/50 w-1.5'"
                  />
                </div>

                <!-- Счётчик фото -->
                <div class="absolute top-3 right-3 flex items-center gap-2 z-10" aria-hidden="true">
                  <span
                    v-if="work.series"
                    class="px-3 py-1.5 rounded-full bg-teal-600/95 backdrop-blur-sm text-xs font-semibold text-white shadow-sm"
                  >
                    {{ work.series }}
                  </span>
                  <span class="px-2 py-1 rounded-md bg-black/50 backdrop-blur-sm text-xs font-medium text-white">
                    {{ getCardImageIndex(work.id) + 1 }}&nbsp;/&nbsp;{{ work.images.length }}
                  </span>
                </div>
              </template>

              <!-- Бейдж типа продукта -->
              <div class="absolute top-3 left-3 z-10 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-sm text-xs font-semibold text-zinc-700 shadow-sm">
                <span aria-hidden="true">{{ PRODUCT_TYPE_ICONS[work.productType] }}</span>
                <span>{{ PRODUCT_TYPE_LABELS[work.productType] }}</span>
              </div>
            </div>

            <!-- ТЕКСТОВЫЙ БЛОК -->
            <div class="p-4 sm:p-5">
              <h3 class="text-base sm:text-lg font-semibold text-zinc-900 mb-2 line-clamp-2 group-hover/card:text-teal-700 transition-colors">
                {{ work.title }}
              </h3>
              <p class="text-sm text-zinc-600 mb-4 line-clamp-2">
                {{ work.description }}
              </p>

              <div class="flex items-center justify-between text-xs text-zinc-500">
                <div class="flex items-center gap-1.5 min-w-0">
                  <svg class="w-3.5 h-3.5 shrink-0" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span class="truncate">{{ work.location.replace(/,.*$/, '') }}</span>
                </div>
                <div class="flex items-center gap-1.5 shrink-0">
                  <svg class="w-3.5 h-3.5 shrink-0" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <time :datetime="work.date">{{ formatDate(work.date) }}</time>
                </div>
              </div>

              <div
                v-if="work.area"
                class="mt-3 pt-3 border-t border-zinc-100 flex items-center gap-1.5 text-xs text-zinc-500"
              >
                <svg class="w-3.5 h-3.5 shrink-0" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
                <span>Площадь: {{ work.area }}&nbsp;м²</span>
              </div>
            </div>
          </article>
        </div>

        <!-- СТРЕЛКИ СЛАЙДЕРА
             Десктоп: появляются при наведении на слайдер (group-hover/slider)
             Мобильные: всегда видимы, расположены под карточкой (статично) -->
        <div class="hidden sm:block">
          <button
            type="button"
            class="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-5 p-2.5 rounded-full bg-white border border-zinc-200 shadow-lg text-zinc-700 opacity-0 group-hover/slider:opacity-100 focus-visible:opacity-100 transition-all hover:bg-teal-50 hover:border-teal-400 hover:text-teal-600 disabled:opacity-30 disabled:cursor-not-allowed z-10"
            :disabled="isAnimating"
            aria-label="Предыдущие работы"
            @click="prev"
          >
            <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            class="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-5 p-2.5 rounded-full bg-white border border-zinc-200 shadow-lg text-zinc-700 opacity-0 group-hover/slider:opacity-100 focus-visible:opacity-100 transition-all hover:bg-teal-50 hover:border-teal-400 hover:text-teal-600 disabled:opacity-30 disabled:cursor-not-allowed z-10"
            :disabled="isAnimating"
            aria-label="Следующие работы"
            @click="next"
          >
            <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <!-- Мобильная навигация: явные кнопки под карточкой -->
        <div class="flex sm:hidden items-center justify-center gap-6 mt-5">
          <button
            type="button"
            class="p-3 rounded-full bg-white border border-zinc-200 shadow text-zinc-700 hover:bg-teal-50 hover:border-teal-400 hover:text-teal-600 active:scale-95 transition-all disabled:opacity-30"
            :disabled="isAnimating"
            aria-label="Предыдущая работа"
            @click="prev"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <!-- Точки пагинации (мобильные) -->
          <div class="flex items-center gap-2" role="tablist" aria-label="Навигация по работам">
            <button
              v-for="(_, idx) in totalPages"
              :key="idx"
              type="button"
              role="tab"
              :aria-selected="currentPage === idx"
              :aria-label="`Работа ${idx + 1}`"
              class="h-2 rounded-full transition-all duration-300"
              :class="currentPage === idx ? 'bg-teal-600 w-6' : 'bg-zinc-300 w-2 hover:bg-zinc-400'"
              @click="goTo(idx * worksPerPage)"
            />
          </div>

          <button
            type="button"
            class="p-3 rounded-full bg-white border border-zinc-200 shadow text-zinc-700 hover:bg-teal-50 hover:border-teal-400 hover:text-teal-600 active:scale-95 transition-all disabled:opacity-30"
            :disabled="isAnimating"
            aria-label="Следующая работа"
            @click="next"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <!-- Десктопная пагинация + счётчик + CTA -->
        <div class="hidden sm:flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
          <p class="text-sm text-zinc-500">
            Показано <strong class="text-zinc-700">{{ visibleWorks.length }}</strong>
            из <strong class="text-zinc-700">{{ totalWorks }}</strong> работ
          </p>

          <!-- Точки пагинации (десктоп) -->
          <div class="flex items-center gap-2" role="tablist" aria-label="Навигация по страницам">
            <button
              v-for="(_, idx) in totalPages"
              :key="idx"
              type="button"
              role="tab"
              :aria-selected="currentPage === idx"
              :aria-label="`Страница ${idx + 1}`"
              class="h-2.5 rounded-full transition-all duration-300"
              :class="currentPage === idx ? 'bg-teal-600 w-8' : 'bg-zinc-300 w-2.5 hover:bg-zinc-400'"
              @click="goTo(idx * worksPerPage)"
            />
          </div>

          <button
            type="button"
            class="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-teal-600 text-teal-600 text-sm font-semibold hover:bg-teal-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
            @click="router.push('/portfolio')"
          >
            Смотреть все работы
            <svg class="w-4 h-4" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <!-- CTA на мобильных -->
        <div class="flex sm:hidden justify-center mt-6">
          <button
            type="button"
            class="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-teal-600 text-teal-600 text-sm font-semibold hover:bg-teal-50 active:bg-teal-100 transition-colors"
            @click="router.push('/portfolio')"
          >
            Смотреть все работы
            <svg class="w-4 h-4" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </AppContainer>
  </AppSection>

  <!-- =============================================
       ЛАЙТБОКС
       Телепортируется в <body> чтобы не конфликтовать
       со стеком z-index родительских элементов.
  ============================================== -->
  <Teleport to="body">
    <Transition name="lb">
      <div
        v-if="lightbox.open && lightboxWork"
        class="fixed inset-0 z-200 flex items-center justify-center bg-black/95 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        :aria-label="`Галерея: ${lightboxWork.title}`"
        @click.self="closeLightbox"
        @touchstart.passive="onLbTouchStart"
        @touchend="onLbTouchEnd"
      >
        <!-- Закрыть -->
        <button
          type="button"
          class="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          aria-label="Закрыть"
          @click="closeLightbox"
        >
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- Стрелка назад -->
        <button
          v-if="lightboxWork.images.length > 1"
          type="button"
          class="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-10 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          aria-label="Предыдущее фото"
          @click="lightboxPrev"
        >
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <!-- Стрелка вперёд -->
        <button
          v-if="lightboxWork.images.length > 1"
          type="button"
          class="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-10 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          aria-label="Следующее фото"
          @click="lightboxNext"
        >
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <!-- Изображение с плавной сменой -->
        <Transition name="lb-img" mode="out-in">
          <div
            :key="lightbox.index"
            class="relative flex items-center justify-center w-full h-full p-16 sm:p-20"
            @click.self="closeLightbox"
          >
            <img
              :src="lightboxWork.images[lightbox.index]"
              :alt="`${lightboxWork.title} — фото ${lightbox.index + 1} из ${lightboxWork.images.length}`"
              class="max-w-full max-h-full object-contain rounded-lg shadow-2xl select-none"
              draggable="false"
              loading="eager"
            />
          </div>
        </Transition>

        <!-- Информация внизу -->
        <div class="absolute bottom-5 sm:bottom-8 left-1/2 -translate-x-1/2 text-center pointer-events-none px-4">
          <p class="text-white font-semibold text-base sm:text-lg mb-1 truncate max-w-xs sm:max-w-md">
            {{ lightboxWork.title }}
          </p>
          <div class="flex items-center justify-center gap-3 text-white/60 text-sm">
            <span v-if="lightboxWork.images.length > 1">
              {{ lightbox.index + 1 }} / {{ lightboxWork.images.length }}
            </span>
            <span v-if="lightboxWork.series" class="text-teal-400">
              {{ lightboxWork.series }}
            </span>
          </div>
          <!-- Точки лайтбокса -->
          <div
            v-if="lightboxWork.images.length > 1"
            class="flex items-center justify-center gap-1.5 mt-3"
            aria-hidden="true"
          >
            <span
              v-for="(_, idx) in lightboxWork.images"
              :key="idx"
              class="h-1.5 rounded-full transition-all duration-300"
              :class="lightbox.index === idx ? 'bg-teal-400 w-5' : 'bg-white/30 w-1.5'"
            />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  overflow: hidden;
}

/* Лайтбокс: появление/скрытие */
.lb-enter-active,
.lb-leave-active {
  transition: opacity 0.2s ease;
}
.lb-enter-from,
.lb-leave-to {
  opacity: 0;
}

/* Лайтбокс: смена изображения */
.lb-img-enter-active,
.lb-img-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.lb-img-enter-from {
  opacity: 0;
  transform: scale(0.97);
}
.lb-img-leave-to {
  opacity: 0;
  transform: scale(1.03);
}

@media (prefers-reduced-motion: reduce) {
  .lb-enter-active,
  .lb-leave-active,
  .lb-img-enter-active,
  .lb-img-leave-active {
    transition: none;
  }
}
</style>