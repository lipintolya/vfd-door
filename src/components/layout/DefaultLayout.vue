<template>
  <div class="layout-root">
    <!-- Header -->
    <header ref="headerRef" class="layout-header">
      <AppContainer>
        <slot name="header" />
      </AppContainer>
    </header>

    <!-- Main -->
    <main class="layout-main">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="layout-footer">
      <AppContainer>
        <slot name="footer" />
      </AppContainer>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import AppContainer from '@/components/layout/AppContainer.vue'

const headerRef = ref<HTMLElement | null>(null)
let ro: ResizeObserver | null = null

const updateHeaderHeight = () => {
  if (!headerRef.value) return
  const height = headerRef.value.offsetHeight
  document.documentElement.style.setProperty('--header-height', `${height}px`)
}

onMounted(async () => {
  // wait DOM to stabilize
  await nextTick()
  updateHeaderHeight()

  // observe changes to header size (fonts, content, layout shifts)
  try {
    ro = new ResizeObserver(() => {
      updateHeaderHeight()
    })
    if (headerRef.value) ro.observe(headerRef.value)
  } catch (err) {
    // ResizeObserver может не поддерживаться в старых браузерах — fallback: resize event
    window.addEventListener('resize', updateHeaderHeight)
  }

  // also keep resize as fallback
  window.addEventListener('resize', updateHeaderHeight)
})

onBeforeUnmount(() => {
  if (ro && headerRef.value) ro.disconnect()
  window.removeEventListener('resize', updateHeaderHeight)
})
</script>

<style scoped>
.layout-root {
  min-height: 100svh;
  display: flex;
  flex-direction: column;
}

/* ===== Header ===== */
.layout-header {
  position: sticky;
  top: 0;
  z-index: 50;

  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: saturate(180%) blur(12px);
  -webkit-backdrop-filter: saturate(180%) blur(12px);

  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

/* ===== Main ===== */
/*важно: отступ сверху равен высоте header (переменная синхронизируется скриптом)*/
.layout-main {
  flex: 1;
  width: 100%;
  padding-top: var(--header-height, 72px);
  /* небольшая дополнительная страховка на очень маленьких viewport */
  box-sizing: border-box;
}

/* ===== Footer ===== */
.layout-footer {
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}
</style>
