import { onMounted, onBeforeUnmount } from 'vue'

export interface UseScrollLockOptions {
  immediate?: boolean
}

/**
 * Composable для блокировки скролла страницы
 * Автоматически управляет overflow и padding-right для компенсации scrollbar
 */
export function useScrollLock(options: UseScrollLockOptions = {}) {
  const { immediate = false } = options

  let scrollbarWidth = 0
  let previousOverflow: string

  const getScrollbarWidth = (): number => {
    // Кэш ширины скроллбара
    if (scrollbarWidth !== 0) return scrollbarWidth

    const outer = document.createElement('div')
    outer.style.visibility = 'hidden'
    outer.style.overflow = 'scroll'
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const outerStyle = outer.style as any
    outerStyle.msOverflowStyle = 'scrollbar'
    document.body.appendChild(outer)

    const inner = document.createElement('div')
    inner.style.width = '100%'
    outer.appendChild(inner)

    const widthWithScroll = inner.offsetWidth
    outer.style.overflow = 'hidden'
    const widthWithoutScroll = inner.offsetWidth

    document.body.removeChild(outer)

    scrollbarWidth = widthWithScroll - widthWithoutScroll
    return scrollbarWidth
  }

  const lock = (): void => {
    previousOverflow = document.body.style.overflow
    const width = getScrollbarWidth()

    document.body.style.overflow = 'hidden'
    document.body.style.paddingRight = `${width}px`

    // Блокируем скролл для фиксированных элементов
    const fixedElements = document.querySelectorAll('body > [style*="position: fixed"]')
    fixedElements.forEach((el) => {
      const element = el as HTMLElement
      element.dataset.scrollLockPadding = element.style.paddingRight
      element.style.paddingRight = `${width + parseFloat(element.dataset.scrollLockPadding || '0')}px`
    })
  }

  const unlock = (): void => {
    document.body.style.overflow = previousOverflow
    document.body.style.paddingRight = ''

    // Восстанавливаем padding для фиксированных элементов
    const fixedElements = document.querySelectorAll('body > [style*="position: fixed"]')
    fixedElements.forEach((el) => {
      const element = el as HTMLElement
      if (element.dataset.scrollLockPadding !== undefined) {
        element.style.paddingRight = element.dataset.scrollLockPadding
        delete element.dataset.scrollLockPadding
      }
    })
  }

  onMounted(() => {
    if (immediate) {
      lock()
    }
  })

  onBeforeUnmount(() => {
    unlock()
  })

  return {
    lock,
    unlock,
  }
}
