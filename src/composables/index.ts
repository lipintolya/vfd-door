/**
 * Composables — переиспользуемая логика Vue 3
 * @see https://vuejs.org/guide/reusability/composables.html
 */

export { useGallery } from './useGallery'
export type { UseGalleryOptions, UseGalleryReturn } from './useGallery'

export { useSwipe, useHorizontalSwipe, useVerticalSwipe } from './useSwipe'
export type { UseSwipeOptions, UseSwipeReturn } from './useSwipe'

export { useModal, useSimpleModal } from './useModal'
export type { UseModalOptions, UseModalReturn } from './useModal'

export { useDebounce, useDebounceFn, useSearchInput, debounce } from './useDebounce'

export { useScrollLock } from './useScrollLock'
export type { UseScrollLockOptions } from './useScrollLock'

// Existing composables
export { useSeo } from './useSeo'
export type { SeoOptions } from './useSeo'
