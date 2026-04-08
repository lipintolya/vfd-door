<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'

interface Props {
  modelValue: boolean
  images: string[]
  initialIndex?: number
  alt?: string
}

const props = withDefaults(defineProps<Props>(), {
  initialIndex: 0,
  alt: 'Изображение',
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  close: []
}>()

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const currentIndex = ref(props.initialIndex)
const scale = ref(1)
const position = ref({ x: 0, y: 0 })
const isDragging = ref(false)
const dragStart = ref({ x: 0, y: 0 })
const imageLoaded = ref(false)

const currentImage = computed(() => props.images[currentIndex.value])
const hasMultiple = computed(() => props.images.length > 1)

const close = () => {
  isOpen.value = false
  resetViewState()
  emit('close')
}

const resetViewState = () => {
  scale.value = 1
  position.value = { x: 0, y: 0 }
  imageLoaded.value = false
}

const next = () => {
  if (!hasMultiple.value) return
  currentIndex.value = (currentIndex.value + 1) % props.images.length
  resetViewState()
}

const prev = () => {
  if (!hasMultiple.value) return
  currentIndex.value = (currentIndex.value - 1 + props.images.length) % props.images.length
  resetViewState()
}

const handleWheel = (e: WheelEvent) => {
  e.preventDefault()
  e.stopPropagation()
  const delta = e.deltaY < 0 ? 0.25 : -0.25
  const newScale = Math.max(1, Math.min(3, scale.value + delta))
  scale.value = newScale
  if (newScale === 1) {
    position.value = { x: 0, y: 0 }
  }
}

const handleMouseDown = (e: MouseEvent) => {
  if (scale.value <= 1) return
  isDragging.value = true
  dragStart.value = { x: e.clientX - position.value.x, y: e.clientY - position.value.y }
}

const handleMouseMove = (e: MouseEvent) => {
  if (!isDragging.value || scale.value <= 1) return
  position.value = { x: e.clientX - dragStart.value.x, y: e.clientY - dragStart.value.y }
}

const handleMouseUp = () => {
  isDragging.value = false
}

const handleTouchStart = (e: TouchEvent) => {
  if (e.touches.length === 1 && scale.value > 1) {
    isDragging.value = true
    const touch = e.touches[0]
    if (touch) {
      dragStart.value = { x: touch.clientX - position.value.x, y: touch.clientY - position.value.y }
    }
  }
}

const handleTouchMove = (e: TouchEvent) => {
  if (!isDragging.value || scale.value <= 1) return
  const touch = e.touches[0]
  if (touch) {
    position.value = { x: touch.clientX - dragStart.value.x, y: touch.clientY - dragStart.value.y }
  }
}

const handleTouchEnd = () => {
  isDragging.value = false
}

const handleBackdropClick = (e: MouseEvent) => {
  if (e.target === e.currentTarget) close()
}

const handleKeydown = (e: KeyboardEvent) => {
  if (!isOpen.value) return
  if (e.key === 'Escape') close()
  if (e.key === 'ArrowRight') next()
  if (e.key === 'ArrowLeft') prev()
}

watch(
  () => props.modelValue,
  (open) => {
    document.body.style.overflow = open ? 'hidden' : ''
  }
)

watch(() => props.initialIndex, (value) => { currentIndex.value = value })

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  document.body.style.overflow = ''
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <Teleport to="body">
    <Transition name="lightbox">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[100] flex items-center justify-center bg-black/95"
        @click="handleBackdropClick"
      >
        <!-- Close Button - всегда видима -->
        <button
          @click="close"
          class="absolute top-4 right-4 z-50 p-3 rounded-full bg-white text-zinc-900 hover:bg-zinc-100 transition-colors shadow-lg"
          aria-label="Закрыть"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- Navigation -->
        <template v-if="hasMultiple">
          <button
            @click="prev"
            class="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Предыдущее"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            @click="next"
            class="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Следующее"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </template>

        <!-- Counter -->
        <div
          v-if="hasMultiple"
          class="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-white/20 backdrop-blur text-white text-sm font-medium"
        >
          {{ currentIndex + 1 }} / {{ images.length }}
        </div>

        <!-- Image -->
        <div
          class="relative w-full h-full flex items-center justify-center p-4"
          @mousedown="handleMouseDown"
          @mousemove="handleMouseMove"
          @mouseup="handleMouseUp"
          @mouseleave="handleMouseUp"
          @touchstart.passive="handleTouchStart"
          @touchmove.passive="handleTouchMove"
          @touchend="handleTouchEnd"
        >
          <div v-if="!imageLoaded" class="absolute inset-0 flex items-center justify-center">
            <div class="w-12 h-12 border-3 border-white/20 border-t-white rounded-full animate-spin" />
          </div>
          <img
            :src="currentImage"
            :alt="alt"
            class="max-w-full max-h-full object-contain transition-transform duration-150 ease-out"
            :style="{ transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)` }"
            @load="imageLoaded = true"
            @error="imageLoaded = true"
            @wheel.prevent="handleWheel"
            draggable="false"
          />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.lightbox-enter-active,
.lightbox-leave-active {
  transition: opacity 0.2s ease;
}

.lightbox-enter-from,
.lightbox-leave-to {
  opacity: 0;
}
</style>
