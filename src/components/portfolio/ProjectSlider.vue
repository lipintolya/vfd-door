<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps<{ images: string[] }>()

const current = ref(0)

const prev = () => {
  current.value = (current.value - 1 + props.images.length) % props.images.length
}
const next = () => {
  current.value = (current.value + 1) % props.images.length
}

const onKey = (e: KeyboardEvent) => {
  if (e.key === 'ArrowLeft')  prev()
  if (e.key === 'ArrowRight') next()
}

onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <div>
    <!-- Main photo -->
    <div class="relative overflow-hidden rounded-2xl bg-slate-100 aspect-[4/3]">
      <img
        :src="images[current]"
        :alt="`Фото ${current + 1} из ${images.length}`"
        loading="eager"
        decoding="async"
        class="w-full h-full object-cover"
      />

      <!-- Prev arrow -->
      <button
        v-if="images.length > 1"
        @click="prev"
        aria-label="Предыдущее фото"
        class="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/40 text-white flex items-center justify-center text-xl hover:bg-black/60 transition-colors"
      >‹</button>

      <!-- Next arrow -->
      <button
        v-if="images.length > 1"
        @click="next"
        aria-label="Следующее фото"
        class="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/40 text-white flex items-center justify-center text-xl hover:bg-black/60 transition-colors"
      >›</button>

      <!-- Counter -->
      <div
        v-if="images.length > 1"
        class="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2.5 py-1 rounded-full"
      >
        {{ current + 1 }} / {{ images.length }}
      </div>
    </div>

    <!-- Thumbnails -->
    <div v-if="images.length > 1" class="flex gap-2 mt-3 overflow-x-auto pb-1">
      <button
        v-for="(img, i) in images"
        :key="i"
        @click="current = i"
        :aria-label="`Фото ${i + 1}`"
        :class="[
          'flex-none w-16 h-16 overflow-hidden rounded-lg border-2 transition-colors',
          i === current ? 'border-teal-500' : 'border-transparent hover:border-slate-300'
        ]"
      >
        <img
          :src="img"
          :alt="`Миниатюра ${i + 1}`"
          loading="lazy"
          decoding="async"
          class="w-full h-full object-cover"
        />
      </button>
    </div>
  </div>
</template>
