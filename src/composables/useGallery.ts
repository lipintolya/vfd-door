import { ref, computed, onMounted, onBeforeUnmount, type Ref } from 'vue'

export interface UseGalleryOptions {
  initialIndex?: number
  images: Ref<string[]>
  loop?: boolean
  onIndexChange?: (index: number) => void
}

export interface UseGalleryReturn {
  activeIndex: Ref<number>
  currentImage: Ref<string>
  totalImages: Ref<number>
  hasNext: Ref<boolean>
  hasPrev: Ref<boolean>
  isImageLoading: Ref<boolean>
  isLoadingFirst: Ref<boolean>
  next: () => void
  prev: () => void
  goTo: (index: number) => void
  handleImageLoad: () => void
  handleImageError: () => void
  handleTouchStart: (e: TouchEvent) => void
  handleTouchEnd: (e: TouchEvent) => void
  handleKeydown: (e: KeyboardEvent) => void
  resetLoading: () => void
}

interface TouchState {
  startX: number
  startY: number
  isPaused: boolean
}

const SWIPE_THRESHOLD = 50
const KEY_REPEAT_DELAY = 150
const KEY_REPEAT_INTERVAL = 100

/**
 * Composable для управления галереей изображений
 * Предоставляет: навигацию, swipe-жесты, keyboard navigation, preload
 */
export function useGallery(options: UseGalleryOptions): UseGalleryReturn {
  const {
    initialIndex = 0,
    images,
    loop = true,
    onIndexChange,
  } = options

  const activeIndex = ref(initialIndex)
  const isImageLoading = ref(false)
  const isLoadingFirst = ref(true)
  const touchState = ref<TouchState>({ startX: 0, startY: 0, isPaused: false })

  // Клавиатурная навигация с auto-repeat
  let keyHoldTimer: number | null = null
  let keyRepeatTimer: number | null = null

  const totalImages = computed(() => images.value.length)

  const currentImage = computed(() => {
    return images.value[activeIndex.value] ?? ''
  })

  const hasNext = computed(() => {
    return loop ? totalImages.value > 1 : activeIndex.value < totalImages.value - 1
  })

  const hasPrev = computed(() => {
    return loop ? totalImages.value > 1 : activeIndex.value > 0
  })

  const next = (): void => {
    if (!hasNext.value) return
    activeIndex.value = loop
      ? (activeIndex.value + 1) % totalImages.value
      : Math.min(activeIndex.value + 1, totalImages.value - 1)
    onIndexChange?.(activeIndex.value)
  }

  const prev = (): void => {
    if (!hasPrev.value) return
    activeIndex.value = loop
      ? (activeIndex.value - 1 + totalImages.value) % totalImages.value
      : Math.max(activeIndex.value - 1, 0)
    onIndexChange?.(activeIndex.value)
  }

  const goTo = (index: number): void => {
    if (index < 0 || index >= totalImages.value) return
    activeIndex.value = index
    onIndexChange?.(index)
  }

  const handleImageLoad = (): void => {
    isImageLoading.value = false
    isLoadingFirst.value = false
  }

  const handleImageError = (): void => {
    isImageLoading.value = false
    isLoadingFirst.value = false
  }

  const resetLoading = (): void => {
    isImageLoading.value = true
    isLoadingFirst.value = true
  }

  /* ============================================
     TOUCH HANDLERS
  ============================================ */
  const handleTouchStart = (e: TouchEvent): void => {
    if (!e.touches?.[0]) return
    touchState.value.startX = e.touches[0].clientX
    touchState.value.startY = e.touches[0].clientY
    touchState.value.isPaused = true

    // Очищаем таймеры при касании
    if (keyHoldTimer !== null) {
      clearTimeout(keyHoldTimer)
      keyHoldTimer = null
    }
    if (keyRepeatTimer !== null) {
      clearInterval(keyRepeatTimer)
      keyRepeatTimer = null
    }
  }

  const handleTouchEnd = (e: TouchEvent): void => {
    if (!e.changedTouches?.[0]) return

    const dx = touchState.value.startX - e.changedTouches[0].clientX
    const dy = touchState.value.startY - e.changedTouches[0].clientY

    // Горизонтальный свайп
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > SWIPE_THRESHOLD) {
      if (dx > 0) {
        next()
      } else {
        prev()
      }
    }

    touchState.value.isPaused = false
  }

  /* ============================================
     KEYBOARD HANDLERS
  ============================================ */
  const clearKeyTimers = (): void => {
    if (keyHoldTimer !== null) {
      clearTimeout(keyHoldTimer)
      keyHoldTimer = null
    }
    if (keyRepeatTimer !== null) {
      clearInterval(keyRepeatTimer)
      keyRepeatTimer = null
    }
  }

  const handleKeydown = (e: KeyboardEvent): void => {
    // Игнорируем повторы событий от ОС
    if (e.repeat) return

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault()
      clearKeyTimers()

      next()

      // Auto-repeat для зажатой клавиши
      keyHoldTimer = window.setTimeout(() => {
        keyRepeatTimer = window.setInterval(() => {
          if (touchState.value.isPaused) {
            clearKeyTimers()
          } else {
            next()
          }
        }, KEY_REPEAT_INTERVAL)
      }, KEY_REPEAT_DELAY)
    }

    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault()
      clearKeyTimers()

      prev()

      // Auto-repeat для зажатой клавиши
      keyHoldTimer = window.setTimeout(() => {
        keyRepeatTimer = window.setInterval(() => {
          if (touchState.value.isPaused) {
            clearKeyTimers()
          } else {
            prev()
          }
        }, KEY_REPEAT_INTERVAL)
      }, KEY_REPEAT_DELAY)
    }

    if (e.key === 'Home') {
      e.preventDefault()
      clearKeyTimers()
      goTo(0)
    }

    if (e.key === 'End') {
      e.preventDefault()
      clearKeyTimers()
      goTo(totalImages.value - 1)
    }
  }

  /* ============================================
     LIFECYCLE
  ============================================ */
  onMounted(() => {
    window.addEventListener('keydown', handleKeydown)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('keydown', handleKeydown)
    clearKeyTimers()
  })

  return {
    activeIndex,
    currentImage,
    totalImages,
    hasNext,
    hasPrev,
    isImageLoading,
    isLoadingFirst,
    next,
    prev,
    goTo,
    handleImageLoad,
    handleImageError,
    handleTouchStart,
    handleTouchEnd,
    handleKeydown,
    resetLoading,
  }
}
