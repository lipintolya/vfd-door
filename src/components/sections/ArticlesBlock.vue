<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import AppSection from '@/components/layout/AppSection.vue'
import AppContainer from '@/components/layout/AppContainer.vue'
import articlesData from '@/data/articles.json'

interface Article {
  id: string
  title: string
  excerpt: string
  category: 'guide' | 'news' | 'tips' | 'promo'
  image: string
  readTime: number
  date: string
  featured?: boolean
  popular?: boolean
  seoTitle?: string
  seoDescription?: string
}

const articles = ref<Article[]>(articlesData as Article[])
const selectedArticle = ref<Article | null>(null)
const imageLoaded = ref<Set<string>>(new Set())

const categoryLabels: Record<string, string> = {
  guide: 'Руководство',
  news: 'Новости',
  tips: 'Советы',
  promo: 'Акции',
}

const categoryColors: Record<string, string> = {
  guide: 'bg-teal-100 text-teal-800',
  news: 'bg-blue-100 text-blue-800',
  tips: 'bg-amber-100 text-amber-800',
  promo: 'bg-rose-100 text-rose-800',
}

const featuredArticle = computed(() => articles.value.find(a => a.featured) || articles.value[0])
const otherArticles = computed(() => articles.value.filter(a => !a.featured).slice(0, 3))

const openModal = (article: Article) => {
  selectedArticle.value = article
  document.body.style.overflow = 'hidden'
}

const closeModal = () => {
  selectedArticle.value = null
  document.body.style.overflow = ''
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && selectedArticle.value) {
    closeModal()
  }
}

const handleImageLoad = (articleId: string) => {
  imageLoaded.value.add(articleId)
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
})
</script>

<template>
  <AppSection size="lg" class="bg-white">
    <AppContainer>
      <!-- Header -->
      <div class="text-center mb-12 sm:mb-16">
        <h2 class="text-3xl sm:text-4xl lg:text-5xl font-semibold text-zinc-900 mb-4">
          Статьи и новости
        </h2>
        <p class="text-base sm:text-lg text-zinc-600 max-w-2xl mx-auto">
          Полезная информация о дверях, перегородках и интерьерных решениях
        </p>
      </div>

      <!-- Featured Article -->
      <div
        v-if="featuredArticle"
        class="mb-10 sm:mb-12 cursor-pointer group"
        @click="openModal(featuredArticle)"
      >
        <div class="relative rounded-3xl overflow-hidden bg-zinc-100 aspect-4/3 sm:aspect-16/9">
          <!-- Loading State -->
          <div
            v-if="!imageLoaded.has(featuredArticle.id)"
            class="absolute inset-0 flex items-center justify-center"
          >
            <div class="w-12 h-12 border-4 border-zinc-300 border-t-teal-500 rounded-full animate-spin" />
          </div>

          <!-- Image -->
          <img
            :src="featuredArticle.image"
            :alt="featuredArticle.title"
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="eager"
            fetchpriority="high"
            @load="handleImageLoad(featuredArticle.id)"
          />

          <!-- Overlay -->
          <div class="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />

          <!-- Content -->
          <div class="absolute bottom-0 left-0 right-0 p-6 sm:p-8 lg:p-10 text-white">
            <div class="flex items-center gap-3 mb-4">
              <span :class="['px-3 py-1 rounded-full text-xs font-semibold', categoryColors[featuredArticle.category]]">
                {{ categoryLabels[featuredArticle.category] }}
              </span>
              <span class="text-sm text-white/80">{{ featuredArticle.readTime }} мин</span>
            </div>
            <h3 class="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 leading-tight">
              {{ featuredArticle.title }}
            </h3>
            <p class="text-sm sm:text-base text-white/90 max-w-3xl line-clamp-2">
              {{ featuredArticle.excerpt }}
            </p>
          </div>
        </div>
      </div>

      <!-- Other Articles Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
        <div
          v-for="article in otherArticles"
          :key="article.id"
          class="group cursor-pointer"
          @click="openModal(article)"
        >
          <div class="relative rounded-2xl overflow-hidden bg-zinc-100 aspect-4/3 mb-4">
            <!-- Loading State -->
            <div
              v-if="!imageLoaded.has(article.id)"
              class="absolute inset-0 flex items-center justify-center"
            >
              <div class="w-8 h-8 border-2 border-zinc-300 border-t-teal-500 rounded-full animate-spin" />
            </div>

            <!-- Image -->
            <img
              :src="article.image"
              :alt="article.title"
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
              @load="handleImageLoad(article.id)"
            />

            <!-- Category Badge -->
            <div class="absolute top-3 left-3">
              <span :class="['px-2.5 py-1 rounded-full text-xs font-semibold', categoryColors[article.category]]">
                {{ categoryLabels[article.category] }}
              </span>
            </div>
          </div>

          <!-- Info -->
          <div class="space-y-2">
            <div class="flex items-center gap-2 text-xs text-zinc-500">
              <span>{{ article.date }}</span>
              <span>•</span>
              <span>{{ article.readTime }} мин</span>
            </div>
            <h3 class="text-base sm:text-lg font-semibold text-zinc-900 line-clamp-2 group-hover:text-teal-700 transition-colors">
              {{ article.title }}
            </h3>
            <p class="text-sm text-zinc-600 line-clamp-2">
              {{ article.excerpt }}
            </p>
          </div>
        </div>
      </div>

      <!-- Modal -->
      <div
        v-if="selectedArticle"
        class="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        @click="closeModal"
      >
        <div
          class="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto relative"
          @click.stop
        >
          <button
            @click="closeModal"
            class="absolute top-4 right-4 w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center transition-colors z-10"
            aria-label="Закрыть"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div class="relative aspect-16/9 bg-zinc-100">
            <img
              :src="selectedArticle.image"
              :alt="selectedArticle.title"
              class="w-full h-full object-cover"
              loading="eager"
            />
          </div>

          <div class="p-6 sm:p-8">
            <div class="flex items-center gap-3 mb-4">
              <span :class="['px-3 py-1 rounded-full text-xs font-semibold', categoryColors[selectedArticle.category]]">
                {{ categoryLabels[selectedArticle.category] }}
              </span>
              <span class="text-sm text-zinc-500">{{ selectedArticle.date }}</span>
              <span class="text-sm text-zinc-500">{{ selectedArticle.readTime }} мин</span>
            </div>

            <h2 class="text-2xl sm:text-3xl font-bold text-zinc-900 mb-4">
              {{ selectedArticle.title }}
            </h2>

            <p class="text-base text-zinc-700 leading-relaxed mb-6">
              {{ selectedArticle.excerpt }}
            </p>

            <div class="border-t border-zinc-200 pt-6">
              <p class="text-sm text-zinc-500">
                Полная версия статьи доступна в салоне VFD Кашириных или по запросу у менеджеров.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppContainer>
  </AppSection>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
</style>
