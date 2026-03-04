<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import Header from './components/layout/Header.vue'
import Footer from './components/layout/Footer.vue'
import ScrollToTop from './components/ui/ScrollToTop.vue'
import SiteNotice from './components/ui/SiteNotice.vue'

const headerRef = ref<InstanceType<typeof Header> | null>(null)
const headerHeight = ref(0)
const bannerVisible = ref(true)

const updateHeaderHeight = () => {
  const el = headerRef.value?.$el as HTMLElement | undefined
  if (!el) return

  // Получаем значение CSS переменной (1 если баннер виден, 0 если скрыт)
  const hasBanner = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--has-banner')) || 1
  
  // Добавляем высоту баннера (~40px) + отступ (1rem = 16px) только если баннер виден
  const bannerHeight = hasBanner ? (40 + 16) : 16
  headerHeight.value = el.offsetHeight + bannerHeight
  document.documentElement.style.setProperty(
    '--header-height',
    `${headerHeight.value}px`
  )
}

// Следим за изменением CSS переменной и обновляем высоту
watch(bannerVisible, () => {
  setTimeout(updateHeaderHeight, 300) // Ждём окончания анимации
})

onMounted(() => {
  updateHeaderHeight()
  window.addEventListener('resize', updateHeaderHeight)
  
  // Слушаем кастомное событие закрытия баннера
  document.addEventListener('banner-dismissed', () => {
    bannerVisible.value = false
    setTimeout(updateHeaderHeight, 300)
  })
})

onUnmounted(() => {
  window.removeEventListener('resize', updateHeaderHeight)
  document.removeEventListener('banner-dismissed', () => {})
})
</script>

<template>
  <div class="min-h-screen flex flex-col relative overflow-x-hidden">
    <SiteNotice />
    <div class="relative">
      <Header ref="headerRef" />
    </div>

    <main
      class="flex-1 relative pb-24 overflow-x-hidden"
      :style="{ paddingTop: headerHeight + 'px' }"
    >
      <router-view />
      <ScrollToTop />
    </main>

    <Footer />
  </div>
</template>

<style scoped>
/* Мобильная страховка: ограничиваем горизонтальный скролл для root-элементов без !important */
@media (max-width: 640px) {
  :deep(html), :deep(body) {
    overflow-x: hidden;
  }
}
</style>