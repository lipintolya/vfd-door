<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import type { InvisibleWork } from '../../data/skrytye-dveri-works'

defineProps<{ works: InvisibleWork[] }>()

const active = ref<{ images: string[]; idx: number; title: string } | null>(null)

const openModal = (images: string[], idx: number, title: string) => {
  active.value = { images, idx, title }
  document.body.style.overflow = 'hidden'
}

const close = () => {
  active.value = null
  document.body.style.overflow = ''
}

const go = (dir: -1 | 1) => {
  if (!active.value) return
  const len = active.value.images.length
  active.value = { ...active.value, idx: (active.value.idx + dir + len) % len }
}

const onKey = (e: KeyboardEvent) => {
  if (!active.value) return
  if (e.key === 'Escape')     close()
  if (e.key === 'ArrowLeft')  go(-1)
  if (e.key === 'ArrowRight') go(1)
}

onMounted(() => window.addEventListener('keydown', onKey))
onUnmounted(() => {
  window.removeEventListener('keydown', onKey)
  document.body.style.overflow = ''
})
</script>

<template>
  <div class="wg">
    <article
      v-for="work in works"
      :key="work.id"
      class="wg-card"
      itemscope
      itemtype="https://schema.org/CreativeWork"
    >
      <!-- Meta header -->
      <header class="wg-head">
        <div class="wg-head__main">
          <h3 class="wg-title" itemprop="name">{{ work.title }}</h3>
          <p v-if="work.desc" class="wg-desc" itemprop="description">{{ work.desc }}</p>
          <div class="wg-tags">
            <span v-if="work.series" class="wg-tag wg-tag--accent">Серия «{{ work.series }}»</span>
            <span v-if="work.edge"   class="wg-tag">Кромка {{ work.edge.toLowerCase() }}</span>
            <span v-if="work.location" class="wg-tag wg-tag--muted">
              <svg width="13" height="13" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M6 1a3.5 3.5 0 0 1 3.5 3.5C9.5 7.5 6 11 6 11S2.5 7.5 2.5 4.5A3.5 3.5 0 0 1 6 1z"
                  stroke="currentColor" stroke-width="1.2" fill="none"/>
                <circle cx="6" cy="4.5" r="1.25" stroke="currentColor" stroke-width="1.2"/>
              </svg>
              {{ work.location }}
            </span>
          </div>
        </div>
        <time class="wg-date" :datetime="work.date" itemprop="dateCreated">
          {{ work.label }}
        </time>
      </header>

      <!-- Photo grid -->
      <div class="wg-grid" :aria-label="`Фотографии: ${work.title}`">
        <button
          v-for="(img, i) in work.images"
          :key="img"
          type="button"
          class="wg-thumb"
          :style="`background-image: url('${img}')`"
          :aria-label="`Открыть фото ${i + 1} из ${work.images.length}`"
          itemprop="image"
          @click="openModal(work.images, i, work.title)"
        >
          <span class="wg-thumb__zoom" aria-hidden="true">
            <svg viewBox="0 0 20 20" fill="none">
              <circle cx="9" cy="9" r="5.5" stroke="currentColor" stroke-width="1.75"/>
              <path d="M13.5 13.5l3 3" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/>
              <path d="M9 6.5v5M6.5 9h5" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/>
            </svg>
          </span>
        </button>
      </div>
    </article>
  </div>

  <!-- Modal -->
  <Teleport to="body">
    <Transition name="wg-fade">
      <div
        v-if="active"
        class="wg-overlay"
        role="dialog"
        aria-modal="true"
        aria-label="Просмотр фотографии"
        @click.self="close"
      >
        <button class="wg-close" type="button" aria-label="Закрыть" @click="close">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
          </svg>
        </button>

        <figure class="wg-figure" @click.self="close">
          <img
            :src="active.images[active.idx]"
            :alt="`${active.title} — фото ${active.idx + 1}`"
            class="wg-modal-img"
            decoding="async"
          />
          <figcaption class="wg-figcap">
            {{ active.title }} · {{ active.idx + 1 }} / {{ active.images.length }}
          </figcaption>
        </figure>

        <template v-if="active.images.length > 1">
          <button class="wg-nav wg-nav--prev" type="button" aria-label="Предыдущее фото" @click.stop="go(-1)">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
            </svg>
          </button>
          <button class="wg-nav wg-nav--next" type="button" aria-label="Следующее фото" @click.stop="go(1)">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
            </svg>
          </button>
        </template>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* ── Cards ── */
.wg { display: flex; flex-direction: column; gap: clamp(1.5rem, 4vw, 2.5rem); }

.wg-card {
  padding: clamp(1.5rem, 3vw, 2.25rem);
  border: 1px solid #e5e7eb;
  border-radius: 1.25rem;
  background: #fff;
}

/* ── Meta header ── */
.wg-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}
.wg-head__main { min-width: 0; }

.wg-title {
  margin: 0 0 0.625rem;
  font-size: clamp(1.25rem, 2.6vw, 1.625rem);
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.02em;
  line-height: 1.2;
}
.wg-desc {
  margin: 0 0 1rem;
  max-width: 54rem;
  font-size: clamp(0.9375rem, 1.4vw, 1rem);
  color: #64748b;
  line-height: 1.7;
}
.wg-tags { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.wg-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.35rem 0.8rem;
  border-radius: 9999px;
  font-size: 0.8125rem;
  font-weight: 700;
  background: #f1f5f9;
  color: #475569;
}
.wg-tag--accent { background: #0f172a; color: #fff; }
.wg-tag--muted  { background: transparent; border: 1px solid #e2e8f0; color: #64748b; font-weight: 600; }
.wg-tag--muted svg { color: #94a3b8; flex-shrink: 0; }

.wg-date {
  flex-shrink: 0;
  padding: 0.4rem 0.85rem;
  border-radius: 9999px;
  background: #f1f5f9;
  font-size: 0.8125rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  color: #334155;
  white-space: nowrap;
}

/* ── Photo grid ── */
.wg-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(220px, 100%), 1fr));
  gap: 0.75rem;
}
.wg-thumb {
  position: relative;
  display: block;
  aspect-ratio: 3 / 4;
  border-radius: 0.875rem;
  overflow: hidden;
  background-color: #f1f5f9;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  border: none;
  padding: 0;
  cursor: zoom-in;
  transition: transform 300ms ease;
}
.wg-thumb::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(15, 23, 42, 0.28) 0%, rgba(15, 23, 42, 0) 40%);
  opacity: 0;
  transition: opacity 250ms ease;
}
.wg-thumb:hover { transform: scale(1.02); }
.wg-thumb:hover::after { opacity: 1; }

.wg-thumb__zoom {
  position: absolute;
  right: 0.625rem;
  bottom: 0.625rem;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.92);
  color: #0f172a;
  opacity: 0;
  transform: translateY(4px);
  transition: opacity 250ms ease, transform 250ms ease;
}
.wg-thumb__zoom svg { width: 1.05rem; height: 1.05rem; }
.wg-thumb:hover .wg-thumb__zoom { opacity: 1; transform: translateY(0); }

/* ── Overlay ── */
.wg-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.92);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
}
.wg-figure {
  margin: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.875rem;
}
.wg-modal-img {
  max-width: min(92vw, 1000px);
  max-height: 82vh;
  object-fit: contain;
  border-radius: 0.5rem;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.5);
}
.wg-figcap {
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: 0.03em;
  color: rgba(255, 255, 255, 0.72);
}

.wg-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 2.75rem;
  height: 2.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.10);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 50%;
  color: #fff;
  cursor: pointer;
  transition: background 150ms ease;
}
.wg-close:hover { background: rgba(255, 255, 255, 0.22); }
.wg-close svg { width: 1.375rem; height: 1.375rem; }

.wg-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 50%;
  color: #fff;
  cursor: pointer;
  transition: background 150ms ease;
}
.wg-nav:hover { background: rgba(255, 255, 255, 0.24); }
.wg-nav svg   { width: 1.5rem; height: 1.5rem; }
.wg-nav--prev { left: 1rem; }
.wg-nav--next { right: 1rem; }

/* ── Transition ── */
.wg-fade-enter-active,
.wg-fade-leave-active { transition: opacity 180ms ease; }
.wg-fade-enter-from,
.wg-fade-leave-to     { opacity: 0; }

/* ── Responsive ── */
@media (max-width: 600px) {
  .wg-head { flex-direction: column-reverse; align-items: flex-start; gap: 0.875rem; }
  .wg-grid { grid-template-columns: repeat(2, 1fr); }
  .wg-nav--prev { left: 0.5rem; }
  .wg-nav--next { right: 0.5rem; }
}
@media (prefers-reduced-motion: reduce) {
  .wg-thumb,
  .wg-thumb::after,
  .wg-thumb__zoom,
  .wg-fade-enter-active,
  .wg-fade-leave-active { transition: none; }
}
</style>
