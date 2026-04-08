import { ref, onMounted, onBeforeUnmount, type Ref } from 'vue'

export interface UseModalOptions {
  closeOnEsc?: boolean
  closeOnOverlay?: boolean
  trapFocus?: boolean
  onOpen?: () => void
  onClose?: () => void
}

export interface UseModalReturn {
  isOpen: Ref<boolean>
  open: () => void
  close: () => void
  toggle: () => void
  handleOverlayClick: () => void
  handleKeydown: (e: KeyboardEvent) => void
}

/**
 * Composable для управления модальными окнами
 * Предоставляет: управление состоянием, закрытие по ESC, focus trap
 */
export function useModal(options: UseModalOptions = {}): UseModalReturn {
  const {
    closeOnEsc = true,
    closeOnOverlay = true,
    trapFocus = false,
    onOpen,
    onClose,
  } = options

  const isOpen = ref(false)
  const previouslyFocusedElement = ref<HTMLElement | null>(null)
  const focusableElementsSelector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'

  const open = (): void => {
    if (isOpen.value) return

    isOpen.value = true
    previouslyFocusedElement.value = document.activeElement as HTMLElement

    // Блокируем скролл фона
    document.body.style.overflow = 'hidden'

    // Focus trap
    if (trapFocus) {
      setTimeout(() => {
        const modal = document.querySelector('[role="dialog"]') as HTMLElement
        const focusableElements = modal?.querySelectorAll<HTMLElement>(focusableElementsSelector)
        focusableElements?.[0]?.focus()
      }, 0)
    }

    onOpen?.()
  }

  const close = (): void => {
    if (!isOpen.value) return

    isOpen.value = false

    // Восстанавливаем скролл
    document.body.style.overflow = ''

    // Возвращаем фокус
    if (previouslyFocusedElement.value) {
      previouslyFocusedElement.value.focus()
    }

    onClose?.()
  }

  const toggle = (): void => {
    isOpen.value ? close() : open()
  }

  const handleOverlayClick = (): void => {
    if (closeOnOverlay) {
      close()
    }
  }

  const handleKeydown = (e: KeyboardEvent): void => {
    if (!isOpen.value) return

    if (closeOnEsc && e.key === 'Escape') {
      e.preventDefault()
      close()
      return
    }

    // Focus trap logic
    if (trapFocus && e.key === 'Tab') {
      const modal = document.querySelector('[role="dialog"]') as HTMLElement
      if (!modal) return

      const focusableElements = Array.from(
        modal.querySelectorAll<HTMLElement>(focusableElementsSelector)
      )

      if (focusableElements.length === 0) return

      const firstElement = focusableElements[0]!
      const lastElement = focusableElements[focusableElements.length - 1]!

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault()
        lastElement.focus()
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault()
        firstElement.focus()
      }
    }
  }

  onMounted(() => {
    if (closeOnEsc || trapFocus) {
      document.addEventListener('keydown', handleKeydown)
    }
  })

  onBeforeUnmount(() => {
    document.removeEventListener('keydown', handleKeydown)
    document.body.style.overflow = ''
  })

  return {
    isOpen,
    open,
    close,
    toggle,
    handleOverlayClick,
    handleKeydown,
  }
}

/**
 * Упрощённая версия для базовых модалок
 */
export function useSimpleModal(
  onClose?: () => void
): UseModalReturn {
  return useModal({
    closeOnEsc: true,
    closeOnOverlay: true,
    trapFocus: false,
    onClose,
  })
}
