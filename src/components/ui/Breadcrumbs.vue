<script setup lang="ts">
import { useRouter } from 'vue-router'

export interface BreadcrumbItem {
  label: string
  path?: string
  isActive?: boolean
}

defineProps<{
  items: BreadcrumbItem[]
  showHome?: boolean // Опция для скрытия элемента "Главная"
}>()

const router = useRouter()

const navigate = (path?: string) => {
  if (path) {
    router.push(path)
  }
}
</script>

<template>
  <nav class="breadcrumb-nav" aria-label="Breadcrumb">
    <ol class="breadcrumb-list">
      <!-- HOME -->
      <li v-if="showHome !== false" class="breadcrumb-item">
        <a @click.prevent="navigate('/')" class="breadcrumb-link breadcrumb-link--clickable">
          Главная
        </a>
      </li>

      <!-- ITEMS -->
      <li v-for="(item, index) in items" :key="index" class="breadcrumb-item">
        <span class="breadcrumb-separator">/</span>
        <a
          v-if="item.path"
          @click.prevent="navigate(item.path)"
          class="breadcrumb-link breadcrumb-link--clickable"
        >
          {{ item.label }}
        </a>
        <span
          v-else
          :class="['breadcrumb-link', { 'breadcrumb-link--active': item.isActive }]"
          :aria-current="item.isActive ? 'page' : undefined"
        >
          {{ item.label }}
        </span>
      </li>
    </ol>
  </nav>
</template>

<style scoped>
.breadcrumb-nav {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}

.breadcrumb-nav::-webkit-scrollbar {
  display: none;
}

.breadcrumb-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: inline-flex;
  align-items: center;
  gap: 0;
}

.breadcrumb-item {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  white-space: nowrap;
}

.breadcrumb-separator {
  color: #d1d5db;
  font-weight: 300;
  margin: 0 0.5rem;
}

.breadcrumb-link {
  color: #6b7280;
  text-decoration: none;
  font-weight: 500;
  padding: 0.375rem 0.5rem;
  border-radius: 0.375rem;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
}

.breadcrumb-link:not(.breadcrumb-link--active) {
  cursor: pointer;
}

.breadcrumb-link:not(.breadcrumb-link--active):hover {
  color: #14b8a6;
  background-color: rgba(20, 184, 166, 0.08);
}

.breadcrumb-link:not(.breadcrumb-link--active):active {
  background-color: rgba(20, 184, 166, 0.15);
}

.breadcrumb-link--active {
  color: #4b5563;
  cursor: default;
  font-weight: 600;
}

.breadcrumb-link--clickable {
  cursor: pointer;
}

.breadcrumb-link--clickable:hover {
  color: #14b8a6;
  background-color: rgba(20, 184, 166, 0.08);
}

.breadcrumb-link--clickable:active {
  background-color: rgba(20, 184, 166, 0.15);
}

@media (max-width: 640px) {
  .breadcrumb-item {
    font-size: 0.8125rem;
  }

  .breadcrumb-link {
    padding: 0.25rem 0.375rem;
    font-size: 0.7rem;
  }

  .breadcrumb-separator {
    margin: 0 0.375rem;
  }
}
</style>