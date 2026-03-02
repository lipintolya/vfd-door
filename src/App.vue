<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import Header from './components/layout/Header.vue'
import Footer from './components/layout/Footer.vue'
import ScrollToTop from './components/ui/ScrollToTop.vue'

const headerRef = ref<InstanceType<typeof Header> | null>(null)
const headerHeight = ref(0)

const updateHeaderHeight = () => {
  const el = headerRef.value?.$el as HTMLElement | undefined
  if (!el) return

  headerHeight.value = el.offsetHeight
  document.documentElement.style.setProperty(
    '--header-height',
    `${headerHeight.value}px`
  )
}

onMounted(() => {
  updateHeaderHeight()
  window.addEventListener('resize', updateHeaderHeight)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateHeaderHeight)
})
</script>

<template>
  <div class="min-h-screen flex flex-col relative overflow-x-hidden">
    <Header ref="headerRef" />

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