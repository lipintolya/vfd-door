import { ref, watch, type Ref } from 'vue'

/**
 * Debounce функция для использования вне composables
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delayMs: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  return (...args: Parameters<T>) => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId)
    }
    timeoutId = setTimeout(() => {
      fn(...args)
      timeoutId = null
    }, delayMs)
  }
}

/**
 * Composable для debounced значения
 */
export function useDebounce<T>(value: Ref<T>, delayMs: number = 300): Ref<T> {
  const debouncedValue = ref(value.value) as Ref<T>

  watch(
    value,
    () => {
      const timeoutId = setTimeout(() => {
        debouncedValue.value = value.value
      }, delayMs)

      return () => clearTimeout(timeoutId)
    },
    { immediate: true }
  )

  return debouncedValue
}

/**
 * Composable для debounced функции
 */
export function useDebounceFn<T extends (...args: any[]) => any>(
  fn: T,
  delayMs: number = 300
): (...args: Parameters<T>) => void {
  return debounce(fn, delayMs)
}

/**
 * Composable для search input с debounce
 */
export function useSearchInput(
  initialValue: string = '',
  delayMs: number = 300
): {
  query: Ref<string>
  debouncedQuery: Ref<string>
  setQuery: (value: string) => void
  clear: () => void
} {
  const query = ref(initialValue)
  const debouncedQuery = useDebounce(query, delayMs)

  const setQuery = (value: string): void => {
    query.value = value
  }

  const clear = (): void => {
    query.value = ''
  }

  return {
    query,
    debouncedQuery,
    setQuery,
    clear,
  }
}
