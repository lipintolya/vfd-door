<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, shallowRef } from 'vue'
import type { PortfolioWork } from '@/data/portfolio'
import AppContainer from '@/components/layout/AppContainer.vue'
import Breadcrumbs from '@/components/ui/Breadcrumbs.vue'
import { portfolioWorks } from '@/data/portfolio'

/* ============================================
   STATE (оптимизировано)
============================================ */
const selectedType = ref<'all' | PortfolioWork['productType']>('all')
const searchQuery = ref('')
const imageLoaded = shallowRef<Set<string>>(new Set())

// Модальное окно
const selectedWork = ref<PortfolioWork | null>(null)
const currentImageIndex = ref(0)
const isModalOpen = ref(false)

/* ============================================
   BREADCRUMBS
============================================ */
const breadcrumbs = computed(() => [
  { label: 'Главная', path: '/' },
  { label: 'Портфолио', isActive: true }
])

/* ============================================
   FILTERS (мемоизация)
============================================ */
const filteredWorks = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  
  return portfolioWorks.filter(work => {
    // Filter by type
    if (selectedType.value !== 'all' && work.productType !== selectedType.value) {
      return false
    }
    
    // Filter by search
    if (query) {
      return (
        work.title.toLowerCase().includes(query) ||
        work.description.toLowerCase().includes(query) ||
        work.location.toLowerCase().includes(query) ||
        work.series?.toLowerCase().includes(query)
      )
    }
    
    return true
  })
})

const typeCounts = computed(() => {
  const counts = { all: portfolioWorks.length, door: 0, partition: 0, entrance: 0 }
  portfolioWorks.forEach(w => counts[w.productType]++)
  return counts
})

/* ============================================
   CONSTANTS
============================================ */
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

const FILTER_TABS = [
  { id: 'all' as const, label: 'Все', icon: '📁' },
  { id: 'door' as const, label: 'Двери', icon: '🚪' },
  { id: 'partition' as const, label: 'Перегородки', icon: '🪟' },
  { id: 'entrance' as const, label: 'Входные', icon: '🏢' },
]

/* ============================================
   MODAL (оптимизировано)
============================================ */
const touchStartX = ref(0)

const handleTouchStart = (e: TouchEvent) => {
  if (!e.touches?.[0]) return
  touchStartX.value = e.touches[0].clientX
}

const handleTouchEnd = (e: TouchEvent) => {
  if (!e.changedTouches?.[0]) return
  const dx = touchStartX.value - e.changedTouches[0].clientX
  if (Math.abs(dx) > 50) {
    dx > 0 ? nextImage() : prevImage()
  }
}

const openModal = (work: PortfolioWork, imageIndex = 0) => {
  selectedWork.value = work
  currentImageIndex.value = imageIndex
  isModalOpen.value = true
  document.body.style.overflow = 'hidden'
}

const closeModal = () => {
  isModalOpen.value = false
  selectedWork.value = null
  document.body.style.overflow = ''
}

const nextImage = () => {
  if (!selectedWork.value) return
  currentImageIndex.value = (currentImageIndex.value + 1) % selectedWork.value.images.length
}

const prevImage = () => {
  if (!selectedWork.value) return
  currentImageIndex.value = (currentImageIndex.value - 1 + selectedWork.value.images.length) % selectedWork.value.images.length
}

const handleKeydown = (e: KeyboardEvent) => {
  if (!isModalOpen.value) return
  if (e.key === 'Escape') closeModal()
  if (e.key === 'ArrowRight') nextImage()
  if (e.key === 'ArrowLeft') prevImage()
}

/* ============================================
   LIFECYCLE
============================================ */
onMounted(() => {
  window.addEventListener('keydown', handleKeydown, { passive: true })
  document.title = 'Портфолио работ VFD — реализованные проекты'
  
  const meta = document.querySelector('meta[name="description"]')
  if (meta) {
    meta.setAttribute('content', 'Портфолио выполненных работ VFD: межкомнатные двери, алюминиевые перегородки, входные группы. Более 30 реализованных проектов в Челябинске и области.')
  }
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
})

/* ============================================
   HELPERS
============================================ */
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

const handleImageLoad = (workId: string) => {
  imageLoaded.value.add(workId)
}
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
            Более {{ portfolioWorks.length }} реализованных проектов
          </p>
        </div>
      </AppContainer>
    </div>

    <!-- FILTERS -->
    <div class="pb-8 sm:pb-12 lg:pb-16 bg-zinc-50">
      <AppContainer>
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <!-- TYPE TABS -->
          <div class="flex flex-wrap gap-2">
            <button
              v-for="tab in FILTER_TABS"
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
              placeholder="Поиск..."
              class="w-full lg:w-64 px-4 py-2.5 pl-11 rounded-full border border-zinc-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
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
        <div v-if="!filteredWorks.length" class="py-20 text-center">
          <svg class="w-16 h-16 mx-auto mb-4 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 class="text-xl font-semibold text-zinc-900 mb-2">Ничего не найдено</h3>
          <p class="text-zinc-500 mb-6">Попробуйте изменить параметры поиска</p>
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
            class="group/card relative bg-white rounded-2xl overflow-hidden border border-zinc-200 hover:border-teal-300 hover:shadow-xl hover:shadow-teal-100/50 transition-all duration-300 cursor-pointer"
            @click="openModal(work, 0)"
          >
            <!-- IMAGE -->
            <div class="relative aspect-4/3 overflow-hidden bg-zinc-100">
              <!-- Loading -->
              <div
                v-if="!imageLoaded.has(work.id)"
                class="absolute inset-0 flex items-center justify-center"
              >
                <div class="w-8 h-8 border-2 border-zinc-300 border-t-teal-500 rounded-full animate-spin" />
              </div>

              <!-- First Image (LCP оптимизация) -->
              <img
                :src="work.images[0]"
                :alt="work.title"
                class="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-110"
                :loading="work.id === '1' ? 'eager' : 'lazy'"
                :fetchpriority="work.id === '1' ? 'high' : 'auto'"
                decoding="async"
                @load="handleImageLoad(work.id)"
              />

              <!-- Badge -->
              <div class="absolute top-3 left-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-sm text-xs font-semibold text-zinc-700 shadow-sm">
                <span>{{ PRODUCT_TYPE_ICONS[work.productType] }}</span>
                <span>{{ PRODUCT_TYPE_LABELS[work.productType] }}</span>
              </div>

              <!-- Counter -->
              <div
                v-if="work.images.length > 1"
                class="absolute bottom-3 right-3 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-sm text-xs font-semibold text-white shadow-sm"
              >
                📸 {{ work.images.length }}
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

              <!-- AREA -->
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

        <!-- COUNT -->
        <div
          v-if="filteredWorks.length"
          class="mt-10 text-center text-sm text-zinc-500"
        >
          Показано {{ filteredWorks.length }} из {{ portfolioWorks.length }} работ
        </div>
      </AppContainer>
    </div>

    <!-- MODAL (оптимизировано) -->
    <div
      v-if="isModalOpen && selectedWork"
      class="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm"
      @click="closeModal"
      @touchstart.passive="handleTouchStart"
      @touchend="handleTouchEnd"
    >
      <!-- Close -->
      <button
        @click="closeModal"
        class="absolute top-4 right-4 sm:top-6 sm:right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors z-10"
        aria-label="Закрыть"
      >
        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <!-- Prev -->
      <button
        @click.stop="prevImage"
        class="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors z-10"
        aria-label="Предыдущее фото"
      >
        <svg class="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <!-- Next -->
      <button
        @click.stop="nextImage"
        class="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors z-10"
        aria-label="Следующее фото"
      >
        <svg class="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <!-- Image -->
      <div class="relative w-full h-full flex items-center justify-center p-4 sm:p-8" @click.stop>
        <img
          :src="selectedWork.images[currentImageIndex]"
          :alt="selectedWork.title"
          class="max-w-full max-h-full object-contain"
          loading="eager"
          fetchpriority="high"
        />

        <!-- Info -->
        <div class="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 text-center">
          <h3 class="text-white text-lg sm:text-xl font-semibold mb-2">
            {{ selectedWork.title }}
          </h3>
          <div class="flex items-center justify-center gap-4 text-white/80 text-sm">
            <span>{{ currentImageIndex + 1 }} / {{ selectedWork.images.length }}</span>
            <span v-if="selectedWork.series">• {{ selectedWork.series }}</span>
          </div>
        </div>
      </div>
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
