<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const visible = ref(false)

const onScroll = () => {
  visible.value = window.scrollY > 400
}

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<template>
  <button
    @click="scrollToTop"
    class="
      fixed z-50
      flex items-center justify-center

      h-11 w-11
      sm:h-12 sm:w-12

      rounded-full
      text-white

      transition-all duration-300 ease-out
      backdrop-blur-sm

      hover:scale-105
      active:scale-95
    "
    :class="[
      visible
        ? 'opacity-100 translate-y-0 pointer-events-auto'
        : 'opacity-0 translate-y-4 pointer-events-none',
    ]"
    style="
      right: max(1rem, env(safe-area-inset-right));
      bottom: max(1rem, env(safe-area-inset-bottom));
    "
  >
    <!-- Иконка стрелки -->
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      stroke-width="2"
    >
      <path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7" />
    </svg>
  </button>
</template>

<style scoped>
button {
  /* CSS variables для цветов — легко изменить в дизайн-системе */
  --scroll-btn-primary: #5FC2C3;
  --scroll-btn-shadow: rgba(37, 99, 235, 0);
  
  background: linear-gradient(135deg, var(--scroll-btn-primary), var(--scroll-btn-primary));
  box-shadow: 0 0 0 0 var(--scroll-btn-primary);
  animation: pulse-blue 3s ease-out infinite;
}

@keyframes pulse-blue {
  0% {
    box-shadow: 0 0 0 0 var(--scroll-btn-primary);
  }
  70% {
    box-shadow: 0 0 0 12px var(--scroll-btn-shadow);
  }
  100% {
    box-shadow: 0 0 0 0 var(--scroll-btn-shadow);
  }
}
</style>
