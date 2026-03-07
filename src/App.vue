<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import Header from './components/layout/Header.vue'
import Footer from './components/layout/Footer.vue'
import ScrollToTop from './components/ui/ScrollToTop.vue'
import SiteNotice from './components/ui/SiteNotice.vue'

const headerRef = ref<InstanceType<typeof Header> | null>(null)
const headerHeight = ref(88) // 72px высота + 16px (1rem отступ сверху)

const updateHeaderHeight = () => {
  const el = headerRef.value?.$el as HTMLElement | undefined
  if (!el) return

  // Высота хедера + 16px отступ сверху (1rem)
  const newHeight = el.offsetHeight + 16
  headerHeight.value = newHeight
  document.documentElement.style.setProperty('--header-height', `${newHeight}px`)
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
    <SiteNotice />
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
@media (max-width: 640px) {
  :deep(html), :deep(body) {
    overflow-x: hidden;
  }
}
</style>