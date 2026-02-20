<script setup lang="ts">
import { ref, computed, onMounted, watch, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { Door, Color } from '@/components/catalog/types'
import catalogJson from '@/data/doors.json'
import Breadcrumbs from '@/components/ui/Breadcrumbs.vue'
import FaqFormSection from '@/components/sections/FaqLead.vue'
import { calculateDoorPrice, calculateSetPrice } from '@/services/pricing'

// ========================
// ROUTE & STATE
// ========================
const route = useRoute()
const router = useRouter()
const id = String(route.params.id ?? '')

const product = ref<Door | null>(null)
const selectedColor = ref<Color | null>(null)
const quantity = ref(1)
const activeImageIndex = ref(0)
const isImageLoading = ref(true)

// ========================
// GALLERY
// ========================
const galleryImages = computed<string[]>(() => {
  if (!product.value || !selectedColor.value) return []
  const images: string[] = []
  
  // Основное изображение цвета
  if (selectedColor.value.image) {
    images.push(selectedColor.value.image)
  }
  
  // Дополнительные изображения
  product.value.images?.forEach(img => {
    if (img && !images.includes(img)) {
      images.push(img)
    }
  })
  
  return images
})

const currentImage = computed(() => galleryImages.value[activeImageIndex.value] || '')

// ========================
// PRICING
// ========================
const doorPrice = computed(() => {
  if (!product.value || !selectedColor.value) return 0
  return calculateDoorPrice(product.value, selectedColor.value) * quantity.value
})

const setPrice = computed(() => {
  if (!product.value || !selectedColor.value) return 0
  return calculateSetPrice(product.value, selectedColor.value) * quantity.value
})

const formatPrice = (value: number): string => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

// ========================
// DESCRIPTION & SPECS
// ========================
const description = computed(() => {
  if (!product.value) return ''
  
  if (product.value.description) {
    return product.value.description
  }
  
  // Автогенерация описания
  const seriesName = product.value.series.charAt(0).toUpperCase() + product.value.series.slice(1)
  return `${product.value.name} — элегантное решение из серии ${seriesName}. 
Дверь выполнена из ${product.value.material.toLowerCase()} с покрытием ${product.value.cover}.

✓ Премиальное качество материалов
✓ Современный дизайн для любого интерьера
✓ Долговечность и простота в уходе
✓ Отличная звукоизоляция

Идеально подходит как для жилых, так и для коммерческих помещений.`
})

const characteristics = computed(() => {
  if (!product.value) return []
  
  const width = product.value.sizes.width?.join(', ') ?? '—'
  const height = product.value.sizes.height?.join(', ') ?? '—'
  
  return [
    { label: 'Серия', value: product.value.series.toUpperCase() },
    { label: 'Модель', value: product.value.model },
    { label: 'Материал', value: product.value.material },
    { label: 'Покрытие', value: product.value.cover },
    { label: 'Толщина полотна', value: product.value.thickness ? `${product.value.thickness} мм` : '—' },
    { label: 'Ширина', value: `${width} мм` },
    { label: 'Высота', value: `${height} мм` },
  ]
})

const packageItems = computed(() => {
  if (!product.value?.set?.length) {
    return [
      { name: 'Дверное полотно', image: 'https://storage.yandexcloud.net/catalog-vfd/icons/door-panel.svg' },
      { name: 'Коробка', note: 'по размеру проёма', image: 'https://storage.yandexcloud.net/catalog-vfd/icons/door-frame.svg' },
      { name: 'Наличники', note: '2 стороны', image: 'https://storage.yandexcloud.net/catalog-vfd/icons/door-casing.svg' },
      { name: 'Комплект крепежа', image: 'https://storage.yandexcloud.net/catalog-vfd/icons/hardware.svg' },
      { name: 'Инструкция', image: 'https://storage.yandexcloud.net/catalog-vfd/icons/instruction.svg' },
    ]
  }
  
  return product.value.set.map(item => ({
    name: item.name,
    note: item.note,
    image: '',
  }))
})

// ========================
// BREADCRUMBS
// ========================
const breadcrumbs = computed(() => [
  { label: 'Главная', path: '/' },
  { label: 'Каталог', path: '/catalog' },
  { label: product.value?.series.toUpperCase() || '', path: `/catalog?series=${product.value?.series}` },
  { label: product.value?.name || '', isActive: true },
])

// ========================
// RELATED PRODUCTS
// ========================
const relatedProducts = computed<Door[]>(() => {
  if (!product.value) return []
  return (catalogJson as Door[])
    .filter(d => d.series === product.value!.series && d.id !== product.value!.id)
    .slice(0, 4)
})

// ========================
// CTA LINK
// ========================
const telegramLink = computed(() => {
  if (!product.value || !selectedColor.value) return '#'
  const text = encodeURIComponent(
    `Заявка на расчёт:\n${product.value.name}\nЦвет: ${selectedColor.value.name}\nКоличество: ${quantity.value} шт.\n\n${route.path}`
  )
  return `https://t.me/vfddoors74?text=${text}`
})

// ========================
// GALLERY CONTROLS
// ========================
const nextImage = () => {
  if (galleryImages.value.length <= 1) return
  activeImageIndex.value = (activeImageIndex.value + 1) % galleryImages.value.length
  isImageLoading.value = true
}

const prevImage = () => {
  if (galleryImages.value.length <= 1) return
  activeImageIndex.value = (activeImageIndex.value - 1 + galleryImages.value.length) % galleryImages.value.length
  isImageLoading.value = true
}

const selectImage = (index: number) => {
  activeImageIndex.value = index
  isImageLoading.value = true
}

const selectColor = (color: Color) => {
  selectedColor.value = color
  activeImageIndex.value = 0
  isImageLoading.value = true
}

// ========================
// KEYBOARD NAVIGATION
// ========================
const handleKeydown = (e: KeyboardEvent) => {
  if (galleryImages.value.length <= 1) return
  
  if (e.key === 'ArrowLeft') prevImage()
  if (e.key === 'ArrowRight') nextImage()
}

// ========================
// LIFECYCLE
// ========================
onMounted(() => {
  const found = (catalogJson as Door[]).find(d => d.id === id) ?? null
  
  if (!found) {
    router.replace('/catalog')
    return
  }
  
  product.value = found
  selectedColor.value = found.colors[0] ?? null
  
  // SEO
  document.title = `${found.name} — купить в Челябинске | VFD Doors`
  
  // Keyboard navigation
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})

// Update SEO on product change
watch(product, (p) => {
  if (!p) return
  document.title = `${p.name} — купить в Челябинске | VFD Doors`
  
  const meta = document.querySelector('meta[name="description"]')
  if (meta) {
    meta.setAttribute('content', `${p.name} (${p.series}). Купить межкомнатную дверь в Челябинске. Цена: ${formatPrice(calculateDoorPrice(p, p.colors[0]))}.`)
  }
})
</script>

<template>
  <div v-if="product && selectedColor" class="min-h-screen bg-white">
    <!-- BREADCRUMBS -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 lg:pt-16">
      <div class="mb-4 sm:mb-6">
        <Breadcrumbs :items="breadcrumbs" />
      </div>
    </div>

    <!-- PRODUCT HEADER -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 sm:mt-6 mb-8 sm:mb-10">
      <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
        {{ product.name }}
      </h1>
      <div class="flex items-center gap-3 text-sm sm:text-base text-gray-600">
        <span class="font-medium text-teal-600">{{ product.series.toUpperCase() }}</span>
        <span>•</span>
        <span>{{ product.material }}</span>
        <span>•</span>
        <span>Покрытие: {{ product.cover }}</span>
      </div>
    </div>

    <!-- MAIN GRID -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 sm:mb-16">
      <div class="grid lg:grid-cols-12 gap-8 lg:gap-10">
        <!-- GALLERY (LEFT) -->
        <div class="lg:col-span-7">
          <!-- Main Image -->
          <div class="relative bg-gray-50 rounded-2xl sm:rounded-3xl overflow-hidden aspect-square sm:aspect-4/3 lg:aspect-3/2">
              <!-- Loading State -->
              <div
                v-if="isImageLoading"
                class="absolute inset-0 flex items-center justify-center bg-gray-100"
              >
                <div class="w-12 h-12 border-4 border-gray-200 border-t-teal-500 rounded-full animate-spin" />
              </div>
              
              <!-- Image -->
              <img
                v-if="currentImage"
                :src="currentImage"
                :alt="`${product.name} - ${selectedColor.name}`"
                class="w-full h-full object-contain p-4 sm:p-6 lg:p-8 transition-opacity duration-300"
                :class="isImageLoading ? 'opacity-0' : 'opacity-100'"
                @load="isImageLoading = false"
                @error="isImageLoading = false"
              />
              
              <!-- Navigation Arrows -->
              <button
                v-if="galleryImages.length > 1"
                @click="prevImage"
                @touchend.prevent
                class="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center text-gray-700 hover:bg-white hover:text-teal-600 transition-all focus:outline-none focus:ring-2 focus:ring-teal-500 touch-manipulation"
                aria-label="Предыдущее изображение"
              >
                <span class="text-2xl leading-none">‹</span>
              </button>

              <button
                v-if="galleryImages.length > 1"
                @click="nextImage"
                @touchend.prevent
                class="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center text-gray-700 hover:bg-white hover:text-teal-600 transition-all focus:outline-none focus:ring-2 focus:ring-teal-500 touch-manipulation"
                aria-label="Следующее изображение"
              >
                <span class="text-2xl leading-none">›</span>
              </button>
              
              <!-- Image Counter -->
              <div
                v-if="galleryImages.length > 1"
                class="absolute top-3 sm:top-4 right-3 sm:right-4 px-3 py-1.5 bg-black/60 backdrop-blur-sm rounded-full text-white text-xs sm:text-sm font-medium"
              >
                {{ activeImageIndex + 1 }} / {{ galleryImages.length }}
              </div>
            </div>

            <!-- Thumbnails -->
            <div
              v-if="galleryImages.length > 1"
              class="mt-4 flex gap-3 overflow-x-auto pb-2 scroll-smooth"
            >
              <button
                v-for="(img, idx) in galleryImages"
                :key="img"
                @click="selectImage(idx)"
                @touchend.prevent
                class="shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden border-2 transition-all focus:outline-none focus:ring-2 focus:ring-teal-500 touch-manipulation"
                :class="idx === activeImageIndex ? 'border-teal-600 ring-2 ring-teal-600/20' : 'border-gray-200 hover:border-gray-300'"
              >
                <img :src="img" class="w-full h-full object-cover" loading="lazy" />
              </button>
            </div>

            <!-- Color Selection -->
            <div class="mt-6 sm:mt-8">
              <h3 class="text-sm font-semibold text-gray-900 mb-3">
                Выберите цвет: <span class="font-normal text-gray-600">{{ selectedColor.name }}</span>
              </h3>
              <div class="flex flex-wrap gap-3 overflow-visible">
                <button
                  v-for="c in product.colors"
                  :key="c.name"
                  @click="selectColor(c)"
                  @touchend.prevent
                  class="group relative w-12 h-12 sm:w-14 sm:h-14 rounded-full shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 overflow-visible touch-manipulation"
                  :class="c.name === selectedColor.name ? 'ring-2 ring-teal-600 ring-offset-2 scale-110' : 'hover:scale-105'"
                  :style="{ backgroundColor: c.hex }"
                  :aria-label="`Выбрать цвет ${c.name}`"
                  :aria-pressed="c.name === selectedColor.name"
                >
                  <!-- Checkmark for selected -->
                  <span
                    v-if="c.name === selectedColor.name"
                    class="absolute inset-0 m-auto w-6 h-6 text-white drop-shadow-lg"
                    style="filter: drop-shadow(0 1px 2px rgba(0,0,0,0.3))"
                  >
                    <svg fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                  </span>
                </button>
              </div>
            </div>
        </div>

        <!-- PURCHASE PANEL (RIGHT) -->
        <div class="lg:col-span-5">
          <div class="sticky top-24 bg-white rounded-2xl sm:rounded-3xl border-2 border-gray-100 shadow-lg shadow-gray-100/50 p-6 sm:p-8">
            <!-- Price -->
            <div class="mb-6 pb-6 border-b border-gray-100">
              <p class="text-sm text-gray-500 mb-1">Цена за полотно</p>
              <div class="flex items-baseline gap-3">
                <span class="text-3xl sm:text-4xl font-bold text-gray-900">
                  {{ formatPrice(doorPrice) }}
                </span>
              </div>
              <p class="text-sm text-gray-500 mt-2">
                Комплект: <span class="font-semibold text-gray-900">{{ formatPrice(setPrice) }}</span>
              </p>
            </div>

            <!-- Quantity -->
            <div class="mb-6">
              <label class="text-sm font-semibold text-gray-900 mb-3 block">
                Количество
              </label>
              <div class="flex items-center gap-4">
                <button
                  @click="quantity = Math.max(1, quantity - 1)"
                  @touchend.prevent
                  class="w-11 h-11 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-600 hover:border-teal-500 hover:text-teal-600 transition-all focus:outline-none focus:ring-2 focus:ring-teal-500 touch-manipulation"
                  :disabled="quantity <= 1"
                  :class="quantity <= 1 ? 'opacity-40 cursor-not-allowed' : ''"
                >
                  <span class="text-xl leading-none">−</span>
                </button>

                <span class="w-12 text-center text-xl font-semibold text-gray-900">
                  {{ quantity }}
                </span>

                <button
                  @click="quantity++"
                  @touchend.prevent
                  class="w-11 h-11 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-600 hover:border-teal-500 hover:text-teal-600 transition-all focus:outline-none focus:ring-2 focus:ring-teal-500 touch-manipulation"
                >
                  <span class="text-xl leading-none">+</span>
                </button>
              </div>
            </div>

            <!-- Total -->
            <div class="mb-6 p-4 bg-gray-50 rounded-xl">
              <div class="flex justify-between items-center mb-2">
                <span class="text-sm text-gray-600">Полотна:</span>
                <span class="font-semibold">{{ formatPrice(doorPrice) }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600">Комплект:</span>
                <span class="font-semibold">{{ formatPrice(setPrice) }}</span>
              </div>
              <div class="mt-3 pt-3 border-t border-gray-200 flex justify-between items-center">
                <span class="text-sm font-semibold text-gray-900">Итого:</span>
                <span class="text-xl font-bold text-teal-600">{{ formatPrice(doorPrice + setPrice) }}</span>
              </div>
            </div>

            <!-- CTA Button -->
            <a
              :href="telegramLink"
              target="_blank"
              class="block w-full h-12 rounded-full bg-gray-900 text-white font-semibold text-center leading-12 hover:bg-teal-600 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 touch-manipulation"
              @touchend.prevent
            >
              Отправить на расчёт
            </a>

            <p class="text-xs text-gray-500 text-center mt-3">
              Менеджер свяжется для уточнения деталей
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- DESCRIPTION & SPECS -->
    <div class="bg-gray-50 py-12 sm:py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid lg:grid-cols-12 gap-8 lg:gap-12">
          <!-- Description -->
          <div class="lg:col-span-7">
            <h2 class="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
              Описание
            </h2>
            <div class="prose prose-gray max-w-none">
              <p class="text-gray-700 leading-relaxed whitespace-pre-line text-sm sm:text-base">
                {{ description }}
              </p>
            </div>
          </div>

          <!-- Characteristics -->
          <div class="lg:col-span-5">
            <h2 class="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
              Характеристики
            </h2>
            <div class="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <ul class="divide-y divide-gray-100">
                <li
                  v-for="item in characteristics"
                  :key="item.label"
                  class="flex justify-between px-4 sm:px-5 py-3 sm:py-4 text-sm"
                >
                  <span class="text-gray-500">{{ item.label }}</span>
                  <span class="font-semibold text-gray-900 text-right ml-4">{{ item.value }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- PACKAGE -->
    <div class="py-12 sm:py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8">
          Что входит в комплект
        </h2>
        <div class="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div
            v-for="item in packageItems"
            :key="item.name"
            class="bg-gray-50 rounded-2xl p-5 border border-gray-100 text-center hover:shadow-md transition-shadow"
          >
            <div class="w-16 h-16 mx-auto mb-3 bg-white rounded-xl flex items-center justify-center p-2">
              <img
                v-if="item.image"
                :src="item.image"
                :alt="item.name"
                class="w-full h-full object-contain"
                loading="lazy"
              />
              <div v-else class="w-full h-full bg-gray-200 rounded-lg" />
            </div>
            <div class="font-semibold text-gray-900 text-sm sm:text-base">{{ item.name }}</div>
            <div v-if="item.note" class="text-xs text-gray-500 mt-1">{{ item.note }}</div>
          </div>
        </div>
        <p class="text-xs text-gray-500 mt-6 text-center max-w-2xl mx-auto">
          Состав комплекта может изменяться в зависимости от выбранных размеров и конфигурации.
        </p>
      </div>
    </div>

    <!-- RELATED PRODUCTS -->
    <div v-if="relatedProducts.length" class="py-12 sm:py-16 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8">
          Похожие модели
        </h2>
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div
            v-for="rp in relatedProducts"
            :key="rp.id"
            @click="router.push({ name: 'ProductPage', params: { id: rp.id } })"
            @touchend.prevent
            class="group cursor-pointer touch-manipulation"
          >
            <div class="bg-gray-50 rounded-2xl overflow-hidden aspect-3/4 mb-3 transition-all group-hover:shadow-lg">
              <img
                :src="rp.colors[0]?.image || ''"
                :alt="rp.name"
                class="w-full h-full object-contain p-4 transition-transform group-hover:scale-105"
                loading="lazy"
              />
            </div>
            <div class="text-xs text-gray-500 mb-1">{{ rp.series.toUpperCase() }}</div>
            <div class="font-semibold text-gray-900 text-sm sm:text-base group-hover:text-teal-600 transition-colors line-clamp-2">
              {{ rp.name }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- FAQ -->
    <div class="py-12 sm:py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FaqFormSection />
      </div>
    </div>
  </div>

  <!-- Loading State -->
  <div v-else class="min-h-screen flex items-center justify-center bg-white">
    <div class="text-center">
      <div class="w-16 h-16 border-4 border-gray-200 border-t-teal-500 rounded-full animate-spin mx-auto mb-4" />
      <p class="text-gray-500">Загрузка...</p>
    </div>
  </div>
</template>

<style scoped>
/* Line clamp for titles */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  overflow: hidden;
}

/* Smooth scroll for thumbnails */
.scroll-smooth {
  scroll-behavior: smooth;
}

/* Hide scrollbar but keep functionality */
.scroll-smooth::-webkit-scrollbar {
  height: 4px;
}

.scroll-smooth::-webkit-scrollbar-track {
  background: transparent;
}

.scroll-smooth::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 2px;
}

/* Prose typography */
.prose p {
  margin-bottom: 1rem;
}

/* Focus visible for accessibility */
button:focus-visible {
  outline: 2px solid rgb(20 184 166);
  outline-offset: 2px;
}
</style>
