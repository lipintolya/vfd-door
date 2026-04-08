<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ProductCard from './ProductCard.vue'
import catalogJson from '@/data/doors.json'
import type { Door, Tag, DoorSeries, DoorCover } from './types'
import Breadcrumbs from '@/components/ui/Breadcrumbs.vue'

interface Breadcrumb {
  label: string
  path?: string
  isActive?: boolean
}

const router = useRouter()
const route = useRoute()

const doors = ref<Door[]>(catalogJson as Door[])

// Список серий из данных каталога
const seriesList = computed(() => {
  const seriesSet = new Set(doors.value.map(d => d.series))
  return Array.from(seriesSet).sort((a, b) => a.localeCompare(b))
})

const tempFilters = ref({
  activeTags: new Set<Tag>(),
  inStock: false,
  series: '' as DoorSeries | '',
  cover: '' as DoorCover | '',
  material: '',
  colorName: '',
})

const appliedFilters = ref({
  activeTags: new Set<Tag>(),
  inStock: false,
  series: '' as DoorSeries | '',
  cover: '' as DoorCover | '',
  material: '',
  colorName: '',
})

const sortOption = ref<'price-asc' | 'price-desc' | 'name-asc' | 'name-desc' | 'series'>('price-asc')
const isMobileFiltersOpen = ref(false)
const currentPage = ref(1)
const itemsPerPage = ref(21)
const openFilterSections = ref<Set<string>>(new Set())

onMounted(() => {
  initFiltersFromUrl()
})

const initFiltersFromUrl = () => {
  const query = route.query
  if (query.series && isValidSeries(query.series as string)) {
    tempFilters.value.series = query.series as DoorSeries
    openFilterSections.value.add('series')
  }
  if (query.color) tempFilters.value.colorName = query.color as string
  if (query.tags) tempFilters.value.activeTags = new Set((query.tags as string).split(',') as Tag[])
  if (query.material) tempFilters.value.material = query.material as string
  if (query.cover) tempFilters.value.cover = query.cover as DoorCover
  if (query.inStock === 'true') tempFilters.value.inStock = true
  appliedFilters.value = JSON.parse(JSON.stringify(tempFilters.value))
}

const isValidSeries = (seriesId: string): boolean =>
  seriesList.value.includes(seriesId as any)

const allTags = computed(() => Array.from(new Set(doors.value.flatMap(d => d.tags))).sort())
const allCovers = computed(() => Array.from(new Set(doors.value.map(d => d.cover))).sort())
const allMaterials = computed(() => Array.from(new Set(doors.value.map(d => d.material))).sort())
const allColors = computed(() => {
  const colorsSet = new Set<string>()
  doors.value.forEach(door => {
    door.colors.forEach(color => {
      if (color.name) colorsSet.add(color.name)
    })
  })
  return Array.from(colorsSet).sort()
})

const getAppliedFilterCount = computed(() => {
  let count = 0
  if (appliedFilters.value.activeTags.size > 0) count++
  if (appliedFilters.value.inStock) count++
  if (appliedFilters.value.series) count++
  if (appliedFilters.value.cover) count++
  if (appliedFilters.value.material) count++
  if (appliedFilters.value.colorName) count++
  return count
})

const hasFilterChanges = computed(() => JSON.stringify(tempFilters.value) !== JSON.stringify(appliedFilters.value))

const activeSeriesTitle = computed(() => {
  return appliedFilters.value.series || null
})

const breadcrumbs = computed<Breadcrumb[]>(() => {
  if (activeSeriesTitle.value) {
    return [
      { label: 'Главная', path: '/' },
      { label: 'Каталог', path: '/catalog' },
      { label: activeSeriesTitle.value, isActive: true }
    ]
  }
  return [
    { label: 'Главная', path: '/' },
    { label: 'Каталог', path: '/catalog', isActive: true }
  ]
})

const filteredDoors = computed<Door[]>(() => {
  let list = [...doors.value]

  if (appliedFilters.value.activeTags.size > 0)
    list = list.filter(d => Array.from(appliedFilters.value.activeTags).every(tag => d.tags.includes(tag)))

  if (appliedFilters.value.inStock) list = list.filter(d => d.tags.includes('в наличии'))
  if (appliedFilters.value.series) {
    list = list.filter(d => d.series === appliedFilters.value.series)
  }
  if (appliedFilters.value.cover) list = list.filter(d => d.cover === appliedFilters.value.cover)
  if (appliedFilters.value.material) list = list.filter(d => d.material === appliedFilters.value.material)
  if (appliedFilters.value.colorName) {
    const sel = appliedFilters.value.colorName.toLowerCase().trim()
    list = list.filter(d => d.colors.some(c => c.name.toLowerCase().trim() === sel))
  }

  return list.sort((a,b) => {
    switch(sortOption.value) {
      case 'price-asc': return (a.price ?? 0) - (b.price ?? 0)
      case 'price-desc': return (b.price ?? 0) - (a.price ?? 0)
      case 'name-asc': return a.name.localeCompare(b.name)
      case 'name-desc': return b.name.localeCompare(a.name)
      case 'series': return a.series.localeCompare(b.series)
      default: return 0
    }
  })
})

const paginatedDoors = computed(() => {
  const start = (currentPage.value-1)*itemsPerPage.value
  return filteredDoors.value.slice(start,start+itemsPerPage.value)
})

const totalPages = computed(() => Math.ceil(filteredDoors.value.length / itemsPerPage.value))

const canGoPrev = computed(() => currentPage.value > 1)
const canGoNext = computed(() => currentPage.value < totalPages.value)

const visiblePages = computed<(number | string)[]>(() => {
  const total = totalPages.value
  const current = currentPage.value
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages: (number | string)[] = []
  if (current <= 4) {
    for (let i = 1; i <= 5; i++) pages.push(i)
    pages.push('...')
    pages.push(total)
  } else if (current >= total - 3) {
    pages.push(1)
    pages.push('...')
    for (let i = total - 4; i <= total; i++) pages.push(i)
  } else {
    pages.push(1)
    pages.push('...')
    for (let i = current - 1; i <= current + 1; i++) pages.push(i)
    pages.push('...')
    pages.push(total)
  }
  return pages
})

const goToPage = (page: number) => {
  currentPage.value = Math.max(1, Math.min(page, totalPages.value))
}

const toggleFilterSection = (s:string) => openFilterSections.value.has(s) ? openFilterSections.value.delete(s) : openFilterSections.value.add(s)
const toggleTempTagFilter = (tag:Tag) => tempFilters.value.activeTags.has(tag) ? tempFilters.value.activeTags.delete(tag) : tempFilters.value.activeTags.add(tag)

const openMobileFilters = () => {
  isMobileFiltersOpen.value = true
  document.body.style.overflow = 'hidden'
  document.body.style.paddingRight = getCachedScrollbarWidth() + 'px'
}

const closeMobileFilters = () => {
  isMobileFiltersOpen.value = false
  document.body.style.overflow = ''
  document.body.style.paddingRight = ''
}

const getScrollbarWidth = (): number => {
  const outer = document.createElement('div')
  outer.style.visibility = 'hidden'
  outer.style.overflow = 'scroll'
  document.body.appendChild(outer)
  const inner = document.createElement('div')
  outer.appendChild(inner)
  const scrollbarWidth = outer.offsetWidth - inner.offsetWidth
  outer.parentNode?.removeChild(outer)
  return scrollbarWidth
}

// Кэшируем значение scrollbarWidth для предотвращения лишних DOM-операций
let cachedScrollbarWidth: number | null = null
const getCachedScrollbarWidth = (): number => {
  if (cachedScrollbarWidth !== null) return cachedScrollbarWidth
  cachedScrollbarWidth = getScrollbarWidth()
  return cachedScrollbarWidth
}

let applyTimeout: number | null = null

// Debounce для фильтров — предотвращает гонку данных при быстрой смене
const applyFilters = () => {
  if (applyTimeout) clearTimeout(applyTimeout)

  applyTimeout = window.setTimeout(() => {
    appliedFilters.value = JSON.parse(JSON.stringify(tempFilters.value))
    currentPage.value = 1
    updateUrlWithFilters()
    closeMobileFilters()
  }, 300)
}

const updateUrlWithFilters = () => {
  const query:Record<string,string>={}
  if(appliedFilters.value.series) query.series = appliedFilters.value.series
  if(appliedFilters.value.colorName) query.color = appliedFilters.value.colorName
  if(appliedFilters.value.material) query.material = appliedFilters.value.material
  if(appliedFilters.value.cover) query.cover = appliedFilters.value.cover
  if(appliedFilters.value.inStock) query.inStock='true'
  if(appliedFilters.value.activeTags.size>0) query.tags = Array.from(appliedFilters.value.activeTags).join(',')
  router.replace({query})
}

const resetFilters = () => {
  tempFilters.value = { activeTags:new Set(), inStock:false, series:'', cover:'', material:'', colorName:'' }
  appliedFilters.value = JSON.parse(JSON.stringify(tempFilters.value))
  currentPage.value=1
  router.replace({query:{}})
}

const selectSeriesFilter = (seriesId: DoorSeries | '') => {
  tempFilters.value.series = seriesId
}

const selectCoverFilter = (cover: DoorCover | '') => {
  tempFilters.value.cover = cover
}

const selectMaterialFilter = (material: string) => {
  tempFilters.value.material = material
}

const selectColorFilter = (colorName: string) => {
  tempFilters.value.colorName = colorName
}

const handleEscapeKey = (ev: KeyboardEvent) => {
  if (ev.key === 'Escape' && isMobileFiltersOpen.value) {
    closeMobileFilters()
  }
}

watch(()=>route.query,()=>initFiltersFromUrl())
watch([()=>appliedFilters.value],()=>currentPage.value=1,{deep:true})

onMounted(() => {
  window.addEventListener('keydown', handleEscapeKey)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleEscapeKey)
  // Cleanup: restore overflow if filters were open
  if (isMobileFiltersOpen.value) {
    document.body.style.overflow = ''
    document.body.style.paddingRight = ''
  }
  if (applyTimeout) clearTimeout(applyTimeout)
})
</script>

<template>
  <div class="min-h-screen bg-white">
    <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl pt-8 sm:pt-12 lg:pt-16 pb-12 sm:pb-16 lg:pb-20">

      <!-- Breadcrumbs -->
      <div class="mb-4 sm:mb-6">
        <Breadcrumbs :items="breadcrumbs" />
      </div>

      <!-- HEADER WITH SORT -->
      <div class="mb-6 sm:mb-8 products-section scroll-mt-20">
        <div class="flex items-center justify-between flex-wrap gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div>
            <h2 class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
              {{ activeSeriesTitle ? `Коллекция "${activeSeriesTitle}"` : 'Межкомнатные двери' }}
            </h2>
            <p class="text-xs sm:text-sm text-gray-600">
              Найдено: <span class="font-semibold text-gray-900">{{ filteredDoors.length }}</span> товаров
              <span v-if="getAppliedFilterCount > 0" class="ml-2 text-teal-600 font-medium">
                • Фильтров: {{ getAppliedFilterCount }}
              </span>
            </p>
          </div>

          <!-- MOBILE FILTER BUTTON -->
          <button
            @click="openMobileFilters"
            class="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-zinc-900 text-white rounded-lg font-medium text-sm hover:bg-zinc-800 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
            Фильтры
            <span v-if="getAppliedFilterCount > 0" class="px-2 py-0.5 bg-teal-600 text-white text-xs rounded-full ml-1">
              {{ getAppliedFilterCount }}
            </span>
          </button>

          <!-- DESKTOP SORT -->
          <div class="hidden lg:flex items-center gap-2">
            <span class="text-sm font-medium text-gray-600">Сортировка:</span>
            <select v-model="sortOption" class="px-3 py-2 bg-white border-2 border-gray-200 rounded-lg text-sm font-medium text-gray-900 focus:outline-none focus:border-teal-500 transition-colors hover:border-gray-300">
              <option value="price-asc">Цена: по возрастанию</option>
              <option value="price-desc">Цена: по убыванию</option>
              <option value="name-asc">Название: А-Я</option>
              <option value="name-desc">Название: Я-А</option>
              <option value="series">По серии</option>
            </select>
          </div>
        </div>

        <!-- MOBILE SORT -->
        <div class="lg:hidden flex items-center gap-2 overflow-x-auto pb-2 -mx-4 px-4">
          <button
            v-for="opt in ['price-asc', 'price-desc', 'name-asc', 'name-desc', 'series']"
            :key="opt"
            @click="sortOption = opt as any"
            class="px-3.5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors shrink-0 min-h-[44px] flex items-center justify-center active:scale-95"
            :class="sortOption === opt ? 'bg-teal-600 text-white shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
          >
            {{ opt === 'price-asc' ? '₽ возр.' : opt === 'price-desc' ? '₽ убыв.' : opt === 'name-asc' ? 'А-Я' : opt === 'name-desc' ? 'Я-А' : 'Серия' }}
          </button>
        </div>
      </div>

      <div class="flex flex-col lg:flex-row gap-6 lg:gap-8">

        <!-- DESKTOP FILTERS SIDEBAR -->
        <aside class="hidden lg:block lg:w-52 xl:w-60 shrink-0">
          <div class="sticky top-24 space-y-3 bg-linear-to-br from-zinc-900 to-zinc-800 rounded-2xl border border-zinc-700 p-4 shadow-lg">
            <div class="pb-3 border-b border-zinc-700">
              <h3 class="text-base font-semibold text-white">Фильтры</h3>
            </div>

            <!-- FILTER: Series -->
            <div class="border-b border-zinc-700 pb-3">
              <button @click="toggleFilterSection('series')"
                class="flex items-center justify-between w-full text-left py-1.5 group focus:outline-none">
                <span class="font-medium text-white text-sm">Серия</span>
                <svg class="w-4 h-4 text-zinc-400 transition-transform duration-200"
                     :class="{ 'rotate-180': openFilterSections.has('series') }"
                     fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div v-if="openFilterSections.has('series')" class="mt-2 space-y-0.5 max-h-56 overflow-y-auto">
                <button
                  @click="selectSeriesFilter('')"
                  class="w-full text-left py-1.5 px-2 rounded-lg hover:bg-zinc-700/50 transition-colors text-xs text-zinc-200"
                  :class="{ 'bg-teal-600/20 border border-teal-500/50': !tempFilters.series }"
                >
                  Все серии
                </button>
                <button
                  v-for="series in seriesList"
                  :key="series"
                  @click="selectSeriesFilter(series as DoorSeries)"
                  class="w-full text-left py-1.5 px-2 rounded-lg hover:bg-zinc-700/50 transition-colors text-xs text-zinc-200"
                  :class="{ 'bg-teal-600/20 border border-teal-500/50': tempFilters.series === series }"
                >
                  {{ series }}
                </button>
              </div>
            </div>

            <!-- FILTER: Cover -->
            <div class="border-b border-zinc-700 pb-3">
              <button @click="toggleFilterSection('cover')"
                class="flex items-center justify-between w-full text-left py-1.5 group focus:outline-none">
                <span class="font-medium text-white text-sm">Покрытие</span>
                <svg class="w-4 h-4 text-zinc-400 transition-transform duration-200"
                     :class="{ 'rotate-180': openFilterSections.has('cover') }"
                     fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div v-if="openFilterSections.has('cover')" class="mt-2 space-y-0.5 max-h-56 overflow-y-auto">
                <button
                  @click="selectCoverFilter('')"
                  class="w-full text-left py-1.5 px-2 rounded-lg hover:bg-zinc-700/50 transition-colors text-xs text-zinc-200"
                  :class="{ 'bg-teal-600/20 border border-teal-500/50': !tempFilters.cover }"
                >
                  Все покрытия
                </button>
                <button
                  v-for="cover in allCovers"
                  :key="cover"
                  @click="selectCoverFilter(cover as DoorCover)"
                  class="w-full text-left py-1.5 px-2 rounded-lg hover:bg-zinc-700/50 transition-colors text-xs text-zinc-200"
                  :class="{ 'bg-teal-600/20 border border-teal-500/50': tempFilters.cover === cover }"
                >
                  {{ cover }}
                </button>
              </div>
            </div>

            <!-- FILTER: Material -->
            <div class="border-b border-zinc-700 pb-3">
              <button @click="toggleFilterSection('material')"
                class="flex items-center justify-between w-full text-left py-1.5 group focus:outline-none">
                <span class="font-medium text-white text-sm">Материал</span>
                <svg class="w-4 h-4 text-zinc-400 transition-transform duration-200"
                     :class="{ 'rotate-180': openFilterSections.has('material') }"
                     fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div v-if="openFilterSections.has('material')" class="mt-2 space-y-0.5 max-h-56 overflow-y-auto">
                <button
                  @click="selectMaterialFilter('')"
                  class="w-full text-left py-1.5 px-2 rounded-lg hover:bg-zinc-700/50 transition-colors text-xs text-zinc-200"
                  :class="{ 'bg-teal-600/20 border border-teal-500/50': !tempFilters.material }"
                >
                  Все материалы
                </button>
                <button
                  v-for="material in allMaterials"
                  :key="material"
                  @click="selectMaterialFilter(material)"
                  class="w-full text-left py-1.5 px-2 rounded-lg hover:bg-zinc-700/50 transition-colors text-xs text-zinc-200"
                  :class="{ 'bg-teal-600/20 border border-teal-500/50': tempFilters.material === material }"
                >
                  {{ material }}
                </button>
              </div>
            </div>

            <!-- FILTER: Color -->
            <div class="border-b border-zinc-700 pb-3">
              <button @click="toggleFilterSection('color')"
                class="flex items-center justify-between w-full text-left py-1.5 group focus:outline-none">
                <span class="font-medium text-white text-sm">Цвет</span>
                <svg class="w-4 h-4 text-zinc-400 transition-transform duration-200"
                     :class="{ 'rotate-180': openFilterSections.has('color') }"
                     fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div v-if="openFilterSections.has('color')" class="mt-2 space-y-0.5 max-h-56 overflow-y-auto">
                <button
                  @click="selectColorFilter('')"
                  class="w-full text-left py-1.5 px-2 rounded-lg hover:bg-zinc-700/50 transition-colors text-xs text-zinc-200"
                  :class="{ 'bg-teal-600/20 border border-teal-500/50': !tempFilters.colorName }"
                >
                  Все цвета
                </button>
                <button
                  v-for="color in allColors"
                  :key="color"
                  @click="selectColorFilter(color)"
                  class="w-full text-left py-1.5 px-2 rounded-lg hover:bg-zinc-700/50 transition-colors text-xs text-zinc-200"
                  :class="{ 'bg-teal-600/20 border border-teal-500/50': tempFilters.colorName === color }"
                >
                  {{ color }}
                </button>
              </div>
            </div>

            <!-- FILTER: Tags -->
            <div class="border-b border-zinc-700 pb-3">
              <button @click="toggleFilterSection('tags')"
                class="flex items-center justify-between w-full text-left py-1.5 group focus:outline-none">
                <span class="font-medium text-white text-sm">Теги</span>
                <svg class="w-4 h-4 text-zinc-400 transition-transform duration-200"
                     :class="{ 'rotate-180': openFilterSections.has('tags') }"
                     fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div v-if="openFilterSections.has('tags')" class="mt-2 space-y-0.5 max-h-56 overflow-y-auto">
                <button
                  v-for="tag in allTags" :key="tag"
                  @click="toggleTempTagFilter(tag)"
                  class="w-full text-left py-1.5 px-2 rounded-lg hover:bg-zinc-700/50 transition-colors text-xs text-zinc-200"
                  :class="{ 'bg-teal-600/20 border border-teal-500/50': tempFilters.activeTags.has(tag) }"
                >
                  {{ tag }}
                </button>
              </div>
            </div>

            <!-- FILTER: Stock -->
            <div>
              <label class="flex items-center cursor-pointer py-1.5 px-2 rounded-lg hover:bg-zinc-700/50 transition-colors">
                <input type="checkbox" v-model="tempFilters.inStock"
                  class="w-3.5 h-3.5 mr-2 rounded border-zinc-600 text-teal-600 bg-zinc-700 focus:ring-teal-500 focus:ring-offset-0" />
                <span class="text-xs text-zinc-200">В наличии</span>
              </label>
            </div>

            <div class="space-y-2 pt-3 border-t border-zinc-700">
              <button v-if="hasFilterChanges" @click="applyFilters"
                class="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold text-xs transition-all duration-300 hover:shadow-lg hover:shadow-teal-500/30 focus:outline-none focus:ring-2 focus:ring-teal-500">
                Применить
              </button>
              <button v-if="getAppliedFilterCount>0" @click="resetFilters"
                class="w-full py-2 bg-red-500/10 hover:bg-red-500/20 text-red-300 rounded-lg font-semibold text-xs transition-colors focus:outline-none focus:ring-2 focus:ring-red-500">
                Сбросить
              </button>
            </div>
          </div>
        </aside>

        <!-- MOBILE FILTERS MODAL -->
        <Transition name="modal">
          <div
            v-if="isMobileFiltersOpen"
            class="fixed inset-0 z-50 lg:hidden"
          >
            <div
              class="absolute inset-0 bg-black/50 backdrop-blur-sm"
              @click="closeMobileFilters"
            />

            <div class="absolute inset-y-0 right-0 w-full max-w-sm bg-linear-to-br from-zinc-900 to-zinc-800 shadow-2xl overflow-y-auto">
              <div class="sticky top-0 z-10 bg-zinc-900 border-b border-zinc-700 px-4 py-4 flex items-center justify-between">
                <h3 class="text-lg font-semibold text-white">Фильтры</h3>
                <button
                  @click="closeMobileFilters"
                  class="p-2 hover:bg-zinc-800 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500"
                  aria-label="Закрыть фильтры"
                >
                  <svg class="w-6 h-6 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div class="p-4 space-y-4">
                <!-- Series -->
                <div class="border-b border-zinc-700 pb-4">
                  <button @click="toggleFilterSection('mobile-series')"
                    class="flex items-center justify-between w-full text-left py-2 group">
                    <span class="font-medium text-white">Серия</span>
                    <svg class="w-5 h-5 text-zinc-400 transition-transform duration-200"
                         :class="{ 'rotate-180': openFilterSections.has('mobile-series') }"
                         fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div v-if="openFilterSections.has('mobile-series')" class="mt-3 space-y-1 max-h-64 overflow-y-auto">
                    <button @click="selectSeriesFilter('')"
                      class="w-full text-left py-2 px-3 rounded-lg hover:bg-zinc-700/50 transition-colors text-sm text-zinc-200"
                      :class="{ 'bg-teal-600/20': !tempFilters.series }">
                      Все серии
                    </button>
                    <button v-for="series in seriesList" :key="series" @click="selectSeriesFilter(series as DoorSeries)"
                      class="w-full text-left py-2 px-3 rounded-lg hover:bg-zinc-700/50 transition-colors text-sm text-zinc-200"
                      :class="{ 'bg-teal-600/20': tempFilters.series === series }">
                      {{ series }}
                    </button>
                  </div>
                </div>

                <!-- Cover -->
                <div class="border-b border-zinc-700 pb-4">
                  <button @click="toggleFilterSection('mobile-cover')"
                    class="flex items-center justify-between w-full text-left py-2 group">
                    <span class="font-medium text-white">Покрытие</span>
                    <svg class="w-5 h-5 text-zinc-400 transition-transform duration-200"
                         :class="{ 'rotate-180': openFilterSections.has('mobile-cover') }"
                         fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div v-if="openFilterSections.has('mobile-cover')" class="mt-3 space-y-1 max-h-64 overflow-y-auto">
                    <button @click="selectCoverFilter('')"
                      class="w-full text-left py-2 px-3 rounded-lg hover:bg-zinc-700/50 transition-colors text-sm text-zinc-200"
                      :class="{ 'bg-teal-600/20': !tempFilters.cover }">
                      Все покрытия
                    </button>
                    <button v-for="cover in allCovers" :key="cover" @click="selectCoverFilter(cover as DoorCover)"
                      class="w-full text-left py-2 px-3 rounded-lg hover:bg-zinc-700/50 transition-colors text-sm text-zinc-200"
                      :class="{ 'bg-teal-600/20': tempFilters.cover === cover }">
                      {{ cover }}
                    </button>
                  </div>
                </div>

                <!-- Material -->
                <div class="border-b border-zinc-700 pb-4">
                  <button @click="toggleFilterSection('mobile-material')"
                    class="flex items-center justify-between w-full text-left py-2 group">
                    <span class="font-medium text-white">Материал</span>
                    <svg class="w-5 h-5 text-zinc-400 transition-transform duration-200"
                         :class="{ 'rotate-180': openFilterSections.has('mobile-material') }"
                         fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div v-if="openFilterSections.has('mobile-material')" class="mt-3 space-y-1 max-h-64 overflow-y-auto">
                    <button @click="selectMaterialFilter('')"
                      class="w-full text-left py-2 px-3 rounded-lg hover:bg-zinc-700/50 transition-colors text-sm text-zinc-200"
                      :class="{ 'bg-teal-600/20': !tempFilters.material }">
                      Все материалы
                    </button>
                    <button v-for="material in allMaterials" :key="material" @click="selectMaterialFilter(material)"
                      class="w-full text-left py-2 px-3 rounded-lg hover:bg-zinc-700/50 transition-colors text-sm text-zinc-200"
                      :class="{ 'bg-teal-600/20': tempFilters.material === material }">
                      {{ material }}
                    </button>
                  </div>
                </div>

                <!-- Color -->
                <div class="border-b border-zinc-700 pb-4">
                  <button @click="toggleFilterSection('mobile-color')"
                    class="flex items-center justify-between w-full text-left py-2 group">
                    <span class="font-medium text-white">Цвет</span>
                    <svg class="w-5 h-5 text-zinc-400 transition-transform duration-200"
                         :class="{ 'rotate-180': openFilterSections.has('mobile-color') }"
                         fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div v-if="openFilterSections.has('mobile-color')" class="mt-3 space-y-1 max-h-64 overflow-y-auto">
                    <button @click="selectColorFilter('')"
                      class="w-full text-left py-2 px-3 rounded-lg hover:bg-zinc-700/50 transition-colors text-sm text-zinc-200"
                      :class="{ 'bg-teal-600/20': !tempFilters.colorName }">
                      Все цвета
                    </button>
                    <button v-for="color in allColors" :key="color" @click="selectColorFilter(color)"
                      class="w-full text-left py-2 px-3 rounded-lg hover:bg-zinc-700/50 transition-colors text-sm text-zinc-200"
                      :class="{ 'bg-teal-600/20': tempFilters.colorName === color }">
                      {{ color }}
                    </button>
                  </div>
                </div>

                <!-- Tags -->
                <div class="border-b border-zinc-700 pb-4">
                  <button @click="toggleFilterSection('mobile-tags')"
                    class="flex items-center justify-between w-full text-left py-2 group">
                    <span class="font-medium text-white">Теги</span>
                    <svg class="w-5 h-5 text-zinc-400 transition-transform duration-200"
                         :class="{ 'rotate-180': openFilterSections.has('mobile-tags') }"
                         fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div v-if="openFilterSections.has('mobile-tags')" class="mt-3 space-y-1 max-h-64 overflow-y-auto">
                    <button v-for="tag in allTags" :key="tag" @click="toggleTempTagFilter(tag)"
                      class="w-full text-left py-2 px-3 rounded-lg hover:bg-zinc-700/50 transition-colors text-sm text-zinc-200"
                      :class="{ 'bg-teal-600/20': tempFilters.activeTags.has(tag) }">
                      {{ tag }}
                    </button>
                  </div>
                </div>

                <!-- Stock -->
                <label class="flex items-center cursor-pointer py-2 px-3 rounded-lg hover:bg-zinc-700/50 transition-colors">
                  <input type="checkbox" v-model="tempFilters.inStock"
                    class="w-4 h-4 mr-3 rounded border-zinc-600 text-teal-600 bg-zinc-700 focus:ring-teal-500" />
                  <span class="text-sm text-zinc-200">Только в наличии</span>
                </label>
              </div>

              <div class="sticky bottom-0 bg-zinc-900 border-t border-zinc-700 p-4 space-y-3">
                <button v-if="hasFilterChanges" @click="applyFilters"
                  class="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold text-sm transition-colors">
                  Применить
                </button>
                <button v-if="getAppliedFilterCount>0" @click="resetFilters"
                  class="w-full py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-300 rounded-lg font-semibold text-sm transition-colors">
                  Сбросить
                </button>
              </div>
            </div>
          </div>
        </Transition>

        <!-- PRODUCTS GRID -->
        <div class="flex-1 min-w-0">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 auto-rows-max items-stretch">
            <ProductCard
              v-for="door in paginatedDoors" :key="door.id"
              :door="door"
              :modelValue="door.colors[0] ?? { name: '', hex: '#ccc' }"
            />
          </div>

          <!-- EMPTY STATE -->
          <div v-if="!paginatedDoors.length" class="flex flex-col items-center justify-center py-12 sm:py-16 lg:py-20 bg-white rounded-xl sm:rounded-2xl border-2 border-dashed border-gray-200 text-center">
            <svg class="w-16 h-16 sm:w-20 sm:h-20 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 class="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Ничего не найдено</h3>
            <p class="text-sm sm:text-base text-gray-600 mb-6 max-w-md">Попробуйте изменить параметры фильтрации</p>
            <button @click="resetFilters" class="px-6 py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-all hover:shadow-lg hover:shadow-teal-500/30 focus:outline-none focus:ring-2 focus:ring-teal-500">
              Сбросить фильтры
            </button>
          </div>

          <!-- PAGINATION -->
          <div v-if="totalPages > 1" class="mt-8 sm:mt-10">
            <!-- Mobile: scrollable page numbers -->
            <div class="sm:hidden">
              <div class="flex items-center justify-between mb-3">
                <button
                  @click="goToPage(currentPage - 1)"
                  :disabled="!canGoPrev"
                  class="flex items-center gap-1.5 px-4 py-3 rounded-xl border-2 border-gray-200 text-gray-700 font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95 min-h-[48px] min-w-[48px] justify-center"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <span class="text-sm font-medium text-gray-500">
                  {{ currentPage }} из {{ totalPages }}
                </span>
                <button
                  @click="goToPage(currentPage + 1)"
                  :disabled="!canGoNext"
                  class="flex items-center gap-1.5 px-4 py-3 rounded-xl border-2 border-gray-200 text-gray-700 font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95 min-h-[48px] min-w-[48px] justify-center"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              <div class="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
                <button
                  v-for="page in visiblePages"
                  :key="page"
                  @click="typeof page === 'number' && goToPage(page)"
                  class="shrink-0 w-11 h-11 rounded-xl text-sm font-semibold transition-all active:scale-95 flex items-center justify-center min-w-[44px]"
                  :class="page === currentPage
                    ? 'bg-teal-600 text-white shadow-sm'
                    : page === '...' ? 'text-gray-400 cursor-default' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
                >
                  {{ page }}
                </button>
              </div>
            </div>

            <!-- Desktop: classic pagination -->
            <div class="hidden sm:flex items-center justify-center gap-1.5">
              <button
                @click="goToPage(currentPage - 1)"
                :disabled="!canGoPrev"
                class="px-4 py-2.5 rounded-lg border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all min-h-[44px]"
              >
                ← Назад
              </button>
              <button
                v-for="page in visiblePages"
                :key="page"
                @click="typeof page === 'number' && goToPage(page)"
                class="w-10 h-10 rounded-lg text-sm font-semibold transition-all min-h-[44px] flex items-center justify-center"
                :class="page === currentPage
                  ? 'bg-teal-600 text-white shadow-sm'
                  : page === '...' ? 'text-gray-400 cursor-default' : 'border-2 border-gray-300 text-gray-700 hover:bg-gray-50'"
              >
                {{ page }}
              </button>
              <button
                @click="goToPage(currentPage + 1)"
                :disabled="!canGoNext"
                class="px-4 py-2.5 rounded-lg border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all min-h-[44px]"
              >
                Далее →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Modal transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

/* Scrollbar for filter sections */
.max-h-64::-webkit-scrollbar {
  width: 4px;
}
.max-h-64::-webkit-scrollbar-track {
  background: transparent;
}
.max-h-64::-webkit-scrollbar-thumb {
  background: rgba(113, 113, 122, 0.4);
  border-radius: 2px;
}
</style>
