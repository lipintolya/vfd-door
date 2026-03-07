import { ref, onMounted, onBeforeUnmount, type Ref } from 'vue'

export interface UseSwipeOptions {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  threshold?: number
  enabled?: Ref<boolean>
}

export interface UseSwipeReturn {
  touchStartX: Ref<number>
  touchStartY: Ref<number>
  isTouching: Ref<boolean>
  handleTouchStart: (e: TouchEvent) => void
  handleTouchEnd: (e: TouchEvent) => void
}

const DEFAULT_THRESHOLD = 50

/**
 * Composable для обработки swipe-жестов
 * Поддерживает 4 направления с настраиваемым порогом
 */
export function useSwipe(options: UseSwipeOptions = {}): UseSwipeReturn {
  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    threshold = DEFAULT_THRESHOLD,
    enabled,
  } = options

  const touchStartX = ref(0)
  const touchStartY = ref(0)
  const isTouching = ref(false)

  const handleTouchStart = (e: TouchEvent): void => {
    if (!enabled?.value && enabled !== undefined) return
    if (!e.touches?.[0]) return

    touchStartX.value = e.touches[0].clientX
    touchStartY.value = e.touches[0].clientY
    isTouching.value = true
  }

  const handleTouchEnd = (e: TouchEvent): void => {
    if (!enabled?.value && enabled !== undefined) return
    if (!e.changedTouches?.[0]) return

    const dx = touchStartX.value - e.changedTouches[0].clientX
    const dy = touchStartY.value - e.changedTouches[0].clientY
    const absDx = Math.abs(dx)
    const absDy = Math.abs(dy)

    isTouching.value = false

    // Определяем доминирующее направление
    const isHorizontal = absDx > absDy
    const exceedsThreshold = isHorizontal ? absDx > threshold : absDy > threshold

    if (!exceedsThreshold) return

    if (isHorizontal) {
      if (dx > 0 && onSwipeLeft) {
        onSwipeLeft()
      } else if (dx < 0 && onSwipeRight) {
        onSwipeRight()
      }
    } else {
      if (dy > 0 && onSwipeUp) {
        onSwipeUp()
      } else if (dy < 0 && onSwipeDown) {
        onSwipeDown()
      }
    }
  }

  onMounted(() => {
    // Passive listener для лучшей производительности
    document.addEventListener('touchstart', handleTouchStart, { passive: true })
    document.addEventListener('touchend', handleTouchEnd, { passive: true })
  })

  onBeforeUnmount(() => {
    document.removeEventListener('touchstart', handleTouchStart)
    document.removeEventListener('touchend', handleTouchEnd)
  })

  return {
    touchStartX,
    touchStartY,
    isTouching,
    handleTouchStart,
    handleTouchEnd,
  }
}

/**
 * Упрощённая версия для горизонтальных свайпов
 */
export function useHorizontalSwipe(options: {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  threshold?: number
  enabled?: Ref<boolean>
}): UseSwipeReturn {
  return useSwipe({
    onSwipeLeft: options.onSwipeLeft,
    onSwipeRight: options.onSwipeRight,
    threshold: options.threshold,
    enabled: options.enabled,
  })
}

/**
 * Упрощённая версия для вертикальных свайпов
 */
export function useVerticalSwipe(options: {
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  threshold?: number
  enabled?: Ref<boolean>
}): UseSwipeReturn {
  return useSwipe({
    onSwipeUp: options.onSwipeUp,
    onSwipeDown: options.onSwipeDown,
    threshold: options.threshold,
    enabled: options.enabled,
  })
}
