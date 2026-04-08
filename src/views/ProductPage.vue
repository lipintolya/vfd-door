<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { Door, Color } from '@/components/catalog/types'
import catalogJson from '@/data/doors.json'
import Breadcrumbs from '@/components/ui/Breadcrumbs.vue'
import FaqFormSection from '@/components/sections/FaqLead.vue'
import { calculateDoorPrice } from '@/services/pricing'

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
  if (!selectedColor.value) return []
  // Только изображение текущего цвета — без подмешивания изображений других вариантов
  if (selectedColor.value.image) return [selectedColor.value.image]
  return []
})

const currentImage = computed(() => galleryImages.value[activeImageIndex.value] || '')

// ========================
// PRICING
// ========================
const doorPrice = computed(() => {
  if (!product.value || !selectedColor.value) return 0
  return calculateDoorPrice(product.value, selectedColor.value) * quantity.value
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
  if (product.value.description) return product.value.description

  const seriesName = product.value.series.charAt(0).toUpperCase() + product.value.series.slice(1)
  const colorInfo = selectedColor.value ? ` в цвете «${selectedColor.value.name}»` : ''
  return `${product.value.name}${colorInfo} — элегантное решение из серии ${seriesName}.
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

  document.title = `${found.name} — купить в Челябинске | VFD Doors`

  window.addEventListener('keydown', () => {})
})

watch(product, (p) => {
  if (!p) return
  document.title = `${p.name} — купить в Челябинске | VFD Doors`
  const meta = document.querySelector('meta[name="description"]')
  if (meta) {
    meta.setAttribute('content', `${p.name} (${p.series}). Купить межкомнатную дверь в Челябинске. Цена: ${formatPrice(calculateDoorPrice(p, p.colors[0]))}.`)
  }
})

// ========================
// METHODS
// ========================
const selectImage = (idx: number) => {
  activeImageIndex.value = idx
}
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
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-2 sm:mt-6 mb-4 sm:mb-8">
      <h1 class="text-xl sm:text-3xl lg:text-4xl font-medium text-gray-900 mb-1.5 sm:mb-2 leading-tight">
        {{ product.name }}
      </h1>
      <div class="flex flex-wrap items-center gap-2 text-xs sm:text-sm sm:text-base text-gray-600">
        <span class="font-medium text-teal-600">{{ product.series.toUpperCase() }}</span>
        <span class="hidden sm:inline">•</span>
        <span class="line-clamp-1">{{ product.material }}</span>
        <span class="hidden sm:inline">•</span>
        <span class="hidden sm:inline">Покрытие: {{ product.cover }}</span>
      </div>
    </div>

    <!-- MAIN GRID -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 sm:mb-16">
      <div class="grid lg:grid-cols-12 gap-8 lg:gap-10">
        <!-- GALLERY (LEFT) -->
        <div class="lg:col-span-7">
          <!-- Main Image -->
          <div
            class="relative bg-gray-50 rounded-2xl sm:rounded-3xl overflow-hidden aspect-[4/5] sm:aspect-4/3 lg:aspect-3/2"
          >
            <div
              v-if="isImageLoading"
              class="absolute inset-0 flex items-center justify-center bg-gray-100"
            >
              <div class="w-10 h-10 sm:w-12 sm:h-12 border-4 border-gray-200 border-t-teal-500 rounded-full animate-spin" />
            </div>

            <img
              v-if="currentImage"
              :src="currentImage"
              :alt="product.name"
              class="w-full h-full object-contain p-4 sm:p-6 lg:p-8 transition-opacity duration-300"
              :class="isImageLoading ? 'opacity-0' : 'opacity-100'"
              @load="isImageLoading = false"
              @error="isImageLoading = false"
            />
          </div>

          <!-- Thumbnails — only if more than 1 image -->
          <div
            v-if="galleryImages.length > 1"
            class="mt-3 sm:mt-4 flex gap-2 sm:gap-3 overflow-x-auto pb-2 scroll-smooth"
          >
            <button
              v-for="(img, idx) in galleryImages"
              :key="img"
              @click="selectImage(idx)"
              class="shrink-0 w-14 h-14 sm:w-20 sm:h-20 rounded-lg sm:rounded-xl overflow-hidden border-2 transition-all focus:outline-none focus:ring-2 focus:ring-teal-500 active:scale-95"
              :class="idx === activeImageIndex ? 'border-teal-600 ring-2 ring-teal-600/20' : 'border-gray-200 hover:border-gray-300'"
            >
              <img :src="img" class="w-full h-full object-cover" loading="lazy" />
            </button>
          </div>

          <!-- Color Display -->
          <div class="mt-4 sm:mt-8">
            <div class="flex items-center gap-3 px-2">
              <div
                class="w-5 h-5 sm:w-6 sm:h-6 rounded-full shrink-0"
                :style="{ backgroundColor: selectedColor.hex, boxShadow: '0 1px 3px rgba(0,0,0,0.15)' }"
              />
              <span class="text-sm text-gray-600">{{ selectedColor.name }}</span>
            </div>
          </div>
        </div>

        <!-- PURCHASE PANEL (RIGHT) -->
        <div class="lg:col-span-5">
          <div class="sticky top-24 bg-white rounded-2xl sm:rounded-3xl border border-gray-200 shadow-lg shadow-gray-100/50 p-4 sm:p-8">
            <!-- Price -->
            <div class="mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-gray-100">
              <p class="text-xs sm:text-sm text-gray-500 mb-1">Цена за полотно</p>
              <div class="flex items-baseline gap-2 sm:gap-3">
                <span class="text-2xl sm:text-4xl font-bold text-gray-900">
                  {{ formatPrice(doorPrice) }}
                </span>
              </div>
            </div>

            <!-- Quantity -->
            <div class="mb-4 sm:mb-6">
              <label class="text-sm font-semibold text-gray-900 mb-2 sm:mb-3 block">
                Количество
              </label>
              <div class="flex items-center gap-3 sm:gap-4">
                <button
                  @click="quantity = Math.max(1, quantity - 1)"
                  class="w-10 h-10 sm:w-11 sm:h-11 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-600 hover:border-teal-500 hover:text-teal-600 transition-all focus:outline-none focus:ring-2 focus:ring-teal-500 active:scale-90"
                  :disabled="quantity <= 1"
                  :class="quantity <= 1 ? 'opacity-40 cursor-not-allowed' : ''"
                >
                  <span class="text-lg sm:text-xl leading-none">−</span>
                </button>

                <span class="w-10 sm:w-12 text-center text-lg sm:text-xl font-semibold text-gray-900">
                  {{ quantity }}
                </span>

                <button
                  @click="quantity++"
                  class="w-10 h-10 sm:w-11 sm:h-11 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-600 hover:border-teal-500 hover:text-teal-600 transition-all focus:outline-none focus:ring-2 focus:ring-teal-500 active:scale-90"
                >
                  <span class="text-lg sm:text-xl leading-none">+</span>
                </button>
              </div>
            </div>

            <!-- Total -->
            <div class="mb-4 sm:mb-6 p-3 sm:p-4 bg-gray-50 rounded-xl">
              <div class="flex justify-between items-center">
                <span class="text-sm font-semibold text-gray-900">Итого:</span>
                <span class="text-lg sm:text-xl font-bold text-teal-600">{{ formatPrice(doorPrice) }}</span>
              </div>
            </div>

            <!-- CTA Button -->
            <a
              :href="telegramLink"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center justify-center w-full h-12 sm:h-14 rounded-full bg-gray-900 text-white font-semibold text-sm sm:text-base hover:bg-teal-600 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 active:scale-[0.98]"
            >
              Отправить на расчёт
            </a>

            <p class="text-xs text-gray-500 text-center mt-2 sm:mt-3">
              Менеджер свяжется для уточнения деталей
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- DESCRIPTION & SPECS -->
    <div class="bg-gray-50 py-8 sm:py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid lg:grid-cols-12 gap-6 lg:gap-12">
          <div class="lg:col-span-7">
            <h2 class="text-lg sm:text-2xl font-medium text-gray-900 mb-3 sm:mb-6">
              Описание
            </h2>
            <div class="prose prose-gray max-w-none">
              <p class="text-gray-700 leading-relaxed whitespace-pre-line text-sm sm:text-base">
                {{ description }}
              </p>
            </div>
          </div>

          <div class="lg:col-span-5">
            <h2 class="text-lg sm:text-2xl font-medium text-gray-900 mb-3 sm:mb-6">
              Характеристики
            </h2>
            <div class="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <ul class="divide-y divide-gray-100">
                <li
                  v-for="item in characteristics"
                  :key="item.label"
                  class="flex justify-between px-3 sm:px-5 py-2.5 sm:py-4 text-sm"
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
    <div class="py-8 sm:py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-lg sm:text-2xl font-medium text-gray-900 mb-4 sm:mb-6 sm:mb-8">
          Что входит в комплект
        </h2>
        <div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          <div
            v-for="item in packageItems"
            :key="item.name"
            class="bg-gray-50 rounded-2xl p-3 sm:p-5 border border-gray-100 text-center hover:shadow-md transition-shadow"
          >
            <div class="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-2 sm:mb-3 bg-white rounded-xl flex items-center justify-center p-1.5 sm:p-2">
              <img
                v-if="item.image"
                :src="item.image"
                :alt="item.name"
                class="w-full h-full object-contain"
                loading="lazy"
              />
              <div v-else class="w-full h-full bg-gray-200 rounded-lg" />
            </div>
            <div class="font-semibold text-gray-900 text-xs sm:text-base">{{ item.name }}</div>
            <div v-if="item.note" class="text-xs text-gray-500 mt-1">{{ item.note }}</div>
          </div>
        </div>
        <p class="text-xs text-gray-500 mt-6 text-center max-w-2xl mx-auto">
          Состав комплекта может изменяться в зависимости от выбранных размеров и конфигурации.
        </p>
      </div>
    </div>

    <!-- RELATED PRODUCTS -->
    <div v-if="relatedProducts.length" class="py-8 sm:py-16 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-lg sm:text-2xl font-medium text-gray-900 mb-4 sm:mb-6 sm:mb-8">
          Похожие модели
        </h2>
        <div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 sm:gap-6">
          <router-link
            v-for="rp in relatedProducts"
            :key="rp.id"
            :to="{ name: 'ProductPage', params: { cover: rp.cover, series: rp.series, id: rp.id } }"
            class="group cursor-pointer block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
          >
            <div class="bg-gray-50 aspect-[3/4] overflow-hidden">
              <img
                :src="rp.colors[0]?.image || ''"
                :alt="rp.name"
                class="w-full h-full object-contain p-3 sm:p-4 transition-transform group-hover:scale-105"
                loading="lazy"
              />
            </div>
            <div class="p-2.5 sm:p-4">
              <div class="text-xs text-gray-500 mb-0.5 sm:mb-1">{{ rp.series.toUpperCase() }}</div>
              <div class="font-semibold text-gray-900 text-xs sm:text-sm sm:text-base group-hover:text-teal-600 transition-colors line-clamp-2 leading-snug">
                {{ rp.name }}
              </div>
            </div>
          </router-link>
        </div>
      </div>
    </div>

    <!-- FAQ -->
    <div class="py-8 sm:py-16">
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
.line-clamp-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  overflow: hidden;
}

.scroll-smooth {
  scroll-behavior: smooth;
}

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

.prose p {
  margin-bottom: 1rem;
}

button:focus-visible {
  outline: 2px solid rgb(20 184 166);
  outline-offset: 2px;
}
</style>
