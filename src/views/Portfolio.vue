<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { PortfolioWork } from '@/data/portfolio'
import AppContainer from '@/components/layout/AppContainer.vue'
import Breadcrumbs from '@/components/ui/Breadcrumbs.vue'
import type { BreadcrumbItem } from '@/components/ui/Breadcrumbs.vue'
import { portfolioWorks } from '@/data/portfolio'

/* ============================================
   STATE
============================================ */
const selectedType = ref<'all' | PortfolioWork['productType']>('all')
const searchQuery = ref('')
const imageLoaded = ref<Set<string>>(new Set())
const imageError = ref<Set<string>>(new Set())
// Состояние мини-слайдера для каждой карточки
const cardImageIndex = ref<Record<string, number>>({})

/* ============================================
   BREADCRUMBS
============================================ */
const breadcrumbs = computed<BreadcrumbItem[]>(() => [
  { label: 'Главная', path: '/' },
  { label: 'Портфолио', isActive: true }
])

/* ============================================
   FILTERS
============================================ */
const filteredWorks = computed(() => {
  let result = portfolioWorks

  // Filter by type
  if (selectedType.value !== 'all') {
    result = result.filter(work => work.productType === selectedType.value)
  }

  // Filter by search
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    result = result.filter(work =>
      work.title.toLowerCase().includes(query) ||
      work.description.toLowerCase().includes(query) ||
      work.location.toLowerCase().includes(query) ||
      work.series?.toLowerCase().includes(query)
    )
  }

  return result
})

const typeCounts = computed(() => ({
  all: portfolioWorks.length,
  door: portfolioWorks.filter(w => w.productType === 'door').length,
  partition: portfolioWorks.filter(w => w.productType === 'partition').length,
  entrance: portfolioWorks.filter(w => w.productType === 'entrance').length,
}))

/* ============================================
   LABELS & ICONS
============================================ */
const productTypeLabels: Record<PortfolioWork['productType'], string> = {
  door: 'Двери',
  partition: 'Перегородки',
  entrance: 'Входные группы',
}

const productTypeIcons: Record<PortfolioWork['productType'], string> = {
  door: '🚪',
  partition: '🪟',
  entrance: '🏢',
}

const filterTabs = [
  { id: 'all' as const, label: 'Все', icon: '📁' },
  { id: 'door' as const, label: 'Двери', icon: '🚪' },
  { id: 'partition' as const, label: 'Перегородки', icon: '🪟' },
  { id: 'entrance' as const, label: 'Входные', icon: '🏢' },
]

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
  // Можно использовать для будущей логики
  void _workId
}

const handleCardTouchEnd = (e: TouchEvent, workId: string, imagesCount: number) => {
  if (!e.changedTouches?.[0]) return
  const dx = (e.target as HTMLElement).getBoundingClientRect().left - e.changedTouches[0].clientX
  if (Math.abs(dx) > 50) {
    dx > 0 ? nextCardImage(workId, imagesCount, e) : prevCardImage(workId, imagesCount, e)
  }
}

/* ============================================
   FORMATTERS
============================================ */
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

/* ============================================
   LIFECYCLE
============================================ */
onMounted(() => {
  document.title = 'Портфолио работ VFD — реализованные проекты'

  const metaDescription = document.querySelector('meta[name="description"]')
  if (metaDescription) {
    metaDescription.setAttribute(
      'content',
      'Портфолио выполненных работ VFD: межкомнатные двери, алюминиевые перегородки, входные группы. Более 30 реализованных проектов в Челябинске и области.'
    )
  }
})
</script>

<template>
  <div class="min-h-screen bg-white">
    <!-- BREADCRUMBS -->
    <div class="pt-6 sm:pt-8 lg:pt-10 pb-4 sm:pb-6">
      <AppContainer>
        <Breadcrumbs :items="breadcrumbs" :show-home="false" />
      </AppContainer>
    </div>

    <!-- HEADER -->
    <div class="pb-8 sm:pb-12 lg:pb-16">
      <AppContainer>
        <div class="max-w-3xl">
          <h1 class="text-3xl sm:text-4xl lg:text-5xl font-semibold text-zinc-900 mb-3">
            Портфолио работ
          </h1>
          <p class="text-base sm:text-lg text-zinc-600">
            Более {{ portfolioWorks.length }} реализованных проектов: от уютных квартир до крупных коммерческих объектов
          </p>
        </div>
      </AppContainer>
    </div>

    <!-- FILTERS & SEARCH -->
    <div class="pb-8 sm:pb-12 lg:pb-16 bg-zinc-50">
      <AppContainer>
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <!-- TYPE TABS -->
          <div class="flex flex-wrap gap-2">
            <button
              v-for="tab in filterTabs"
              :key="tab.id"
              @click="selectedType = tab.id"
              class="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-all border"
              :class="selectedType === tab.id
                ? 'bg-teal-600 border-teal-600 text-white shadow-lg shadow-teal-200'
                : 'bg-white border-zinc-200 text-zinc-700 hover:border-teal-300 hover:bg-teal-50'"
            >
              <span>{{ tab.icon }}</span>
              <span>{{ tab.label }}</span>
              <span
                class="px-2 py-0.5 rounded-full text-xs"
                :class="selectedType === tab.id ? 'bg-white/20 text-white' : 'bg-zinc-100 text-zinc-600'"
              >
                {{ typeCounts[tab.id] }}
              </span>
            </button>
          </div>

          <!-- SEARCH -->
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Поиск по названию, серии..."
              class="w-full lg:w-80 px-4 py-2.5 pl-11 rounded-full border border-zinc-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
            <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </AppContainer>
    </div>

    <!-- WORKS GRID -->
    <div class="pb-12 sm:pb-16 lg:pb-20">
      <AppContainer>
        <!-- EMPTY STATE -->
        <div
          v-if="!filteredWorks.length"
          class="py-20 text-center"
        >
          <svg class="w-20 h-20 mx-auto mb-6 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 class="text-xl font-semibold text-zinc-900 mb-2">Ничего не найдено</h3>
          <p class="text-zinc-500 mb-6">Попробуйте изменить параметры поиска или фильтра</p>
          <button
            @click="() => { selectedType = 'all'; searchQuery = '' }"
            class="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-teal-600 text-white font-semibold hover:bg-teal-700 transition-all"
          >
            Сбросить фильтры
          </button>
        </div>

        <!-- GRID -->
        <div
          v-else
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6 lg:gap-8"
        >
          <div
            v-for="work in filteredWorks"
            :key="work.id"
            class="group/card relative bg-white rounded-2xl overflow-hidden border border-zinc-200 hover:border-teal-300 transition-all duration-300 hover:shadow-xl hover:shadow-teal-100/50 hover:-translate-y-1"
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
                    class="w-full h-full object-cover shrink-0 transition-transform duration-500 group-hover/card:scale-110"
                    :loading="idx === 0 ? 'eager' : 'lazy'"
                    :fetchpriority="idx === 0 ? 'high' : 'auto'"
                    decoding="async"
                    @load="handleImageLoad(work.id)"
                    @error="handleImageError(work.id)"
                  />
                </div>
              </div>

              <!-- Navigation Arrows (show on hover) -->
              <template v-if="work.images.length > 1">
                <!-- Prev Button -->
                <button
                  @click="(e) => prevCardImage(work.id, work.images.length, e)"
                  class="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/90 backdrop-blur-sm border border-zinc-200 shadow-md text-zinc-700 opacity-0 group-hover/card:opacity-100 hover:bg-white hover:text-teal-600 transition-all"
                  aria-label="Предыдущее фото"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <!-- Next Button -->
                <button
                  @click="(e) => nextCardImage(work.id, work.images.length, e)"
                  class="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/90 backdrop-blur-sm border border-zinc-200 shadow-md text-zinc-700 opacity-0 group-hover/card:opacity-100 hover:bg-white hover:text-teal-600 transition-all"
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
              <div class="absolute top-3 left-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-sm text-xs font-semibold text-zinc-700 shadow-sm">
                <span>{{ productTypeIcons[work.productType] }}</span>
                <span>{{ productTypeLabels[work.productType] }}</span>
              </div>
            </div>

            <!-- CONTENT -->
            <div class="p-4">
              <h3 class="text-base font-semibold text-zinc-900 mb-2 line-clamp-2 group-hover/card:text-teal-700 transition-colors">
                {{ work.title }}
              </h3>
              <p class="text-sm text-zinc-600 mb-3 line-clamp-2">
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

        <!-- RESULTS COUNT -->
        <div
          v-if="filteredWorks.length"
          class="mt-10 text-center text-sm text-zinc-500"
        >
          Показано {{ filteredWorks.length }} из {{ portfolioWorks.length }} работ
        </div>
      </AppContainer>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  overflow: hidden;
}
</style>
