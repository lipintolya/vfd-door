<script setup lang="ts">
import { ref, computed } from 'vue'
import type { CoatingFeature } from '../../data/coating-features'

const props = defineProps<{
  features: CoatingFeature[]
}>()

const activeIdx = ref(0)

const active = computed(() => props.features[activeIdx.value] ?? props.features[0])
</script>

<template>
  <div class="coating-features">
    <ul class="coating-features__list" role="tablist">
      <li v-for="(feature, i) in features" :key="feature.title">
        <button
          type="button"
          role="tab"
          class="coating-features__item"
          :class="{ 'is-active': i === activeIdx }"
          :aria-selected="String(i === activeIdx)"
          @click="activeIdx = i"
        >
          <span class="coating-features__num">{{ i + 1 }}</span>
          <span class="coating-features__item-body">
            <span class="coating-features__item-title">{{ feature.title }}</span>
            <span v-if="i === activeIdx" class="coating-features__item-desc">{{ feature.description }}</span>
          </span>
        </button>
      </li>
    </ul>

    <div class="coating-features__media">
      <div class="coating-features__photos">
        <div v-for="(photo, i) in active.images" :key="i" class="coating-features__photo-wrap">
          <img
            v-if="photo"
            :src="photo"
            :alt="active.title"
            class="coating-features__photo"
            loading="lazy"
            decoding="async"
          />
          <div v-else class="coating-features__placeholder" aria-hidden="true">
            <svg fill="none" stroke="currentColor" stroke-width="1.2" viewBox="0 0 24 24" width="40" height="40">
              <rect x="5" y="3" width="14" height="18" rx="1.5" />
              <path d="M15 12h.01" stroke-linecap="round" />
            </svg>
          </div>
        </div>
      </div>
      <p class="coating-features__caption">{{ active.title }}</p>
    </div>
  </div>
</template>

<style scoped>
.coating-features {
  display: grid;
  grid-template-columns: 360px 1fr;
  gap: 2rem;
  align-items: start;
}

@media (max-width: 900px) {
  .coating-features {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}

.coating-features__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.coating-features__item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  width: 100%;
  text-align: left;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 1rem;
  padding: 0.875rem 1.125rem;
  cursor: pointer;
  font-family: inherit;
  transition: background-color 150ms ease, border-color 150ms ease;
}

.coating-features__item:hover {
  border-color: #99f6e4;
}

.coating-features__item.is-active {
  background: #f0fdfa;
  border-color: #14b8a6;
}

.coating-features__item:focus-visible {
  outline: 2px solid #14b8a6;
  outline-offset: 2px;
}

.coating-features__num {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  background: #e2e8f0;
  color: #64748b;
  font-size: 0.75rem;
  font-weight: 700;
}

.coating-features__item.is-active .coating-features__num {
  background: #14b8a6;
  color: #fff;
}

.coating-features__item-body {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  min-width: 0;
}

.coating-features__item-title {
  font-size: 0.9375rem;
  font-weight: 700;
  color: #0f172a;
  line-height: 1.4;
}

.coating-features__item-desc {
  font-size: 0.8125rem;
  color: #64748b;
  line-height: 1.5;
}

.coating-features__media {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.coating-features__photos {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
}

.coating-features__photo-wrap {
  aspect-ratio: 4 / 3;
  border-radius: 1.25rem;
  overflow: hidden;
  background: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
}

.coating-features__photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.coating-features__placeholder {
  color: #d1d5db;
}

.coating-features__caption {
  margin: 0;
  font-size: 1rem;
  font-weight: 800;
  color: #0f172a;
}
</style>
