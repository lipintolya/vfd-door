<script setup lang="ts">
import { ref, watch } from 'vue'

const isVisible = ref(false)
const isDismissed = ref(false)

const dismiss = () => {
  isDismissed.value = true
  // Удаляем CSS переменную, чтобы хедер поднялся вверх
  document.documentElement.style.setProperty('--has-banner', '0')
  // Отправляем событие для App.vue
  document.dispatchEvent(new CustomEvent('banner-dismissed'))
  try {
    localStorage.setItem('site-notice-dismissed', 'true')
  } catch (e) {}
}

// Устанавливаем CSS переменную при показе баннера
if (isVisible.value && !isDismissed.value) {
  document.documentElement.style.setProperty('--has-banner', '1')
}

// Следим за изменениями и обновляем CSS переменную
watch(isDismissed, (newVal) => {
  document.documentElement.style.setProperty('--has-banner', newVal ? '0' : '1')
})
</script>

<template>
  <Transition name="slide-down">
    <div
      v-if="isVisible && !isDismissed"
      class="fixed top-0 left-0 right-0 bg-gradient-to-r from-amber-50 via-amber-50 to-amber-50 border-b border-amber-200 px-4 py-2 sm:px-6 sm:py-2.5"
      style="z-index: 9999;"
    >
      <div class="flex items-center justify-center gap-2 sm:gap-3 text-center max-w-7xl mx-auto">
        <!-- Icon -->
        <svg
          class="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>

        <!-- Text -->
        <p class="text-[10px] sm:text-xs text-amber-900 font-medium leading-tight sm:leading-normal">
          <span class="sm:hidden">Сайт обновляется. Извините за неудобства!</span>
          <span class="hidden sm:inline">Сайт находится в стадии наполнения каталогом и контентом. Приносим извинения за возможные неудобства!</span>
        </p>

        <!-- Dismiss Button -->
        <button
          @click="dismiss"
          class="ml-2 p-1 sm:p-1.5 rounded-full hover:bg-amber-100 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 shrink-0"
          aria-label="Закрыть уведомление"
        >
          <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
/* Slide Down Animation */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  transform: translateY(-100%);
  opacity: 0;
  max-height: 0;
  padding-top: 0;
  padding-bottom: 0;
  margin: 0;
}

.slide-down-enter-to,
.slide-down-leave-from {
  transform: translateY(0);
  opacity: 1;
}
</style>
