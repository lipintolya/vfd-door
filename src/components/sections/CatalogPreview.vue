<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import AppSection from '@/components/layout/AppSection.vue'
import AppContainer from '@/components/layout/AppContainer.vue'

/* ----------------------------
   Types
----------------------------- */
interface Category {
  title: string
  subtitle?: string
  image: string
  link: string
  cta: string
}

/* ----------------------------
   State
----------------------------- */
const router = useRouter()
const visible = ref(false)
const sectionRef = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null

/* ----------------------------
   Categories
----------------------------- */
const categories: Category[] = [
  {
    title: 'Межкомнатные двери',
    subtitle: 'Официальный каталог Владимирской фабрики дверей. Покрытия: эмаль, экошпон, ПВХ, полипропилен, под покраску — широкий выбор моделей в наличии в Челябинске.',
    image: 'https://storage.yandexcloud.net/catalog-vfd/renders/cover-in.webp',
    link: '/catalog',
    cta: 'Смотреть межкомнатные двери',
  },
  {
    title: 'Входные двери',
    subtitle: 'Уличные двери с терморазрывом для частного дома и подъездные с МДФ-панелями для квартиры — надёжная защита под любые условия.',
    image: 'https://storage.yandexcloud.net/catalog-vfd/renders/cover-out.webp',
    link: '/catalog?series=innova',
    cta: 'Смотреть входные двери',
  },
  {
    title: 'Алюминиевые перегородки',
    subtitle: 'Стеклянные перегородки для офисов, квартир и коммерческих пространств. Проектирование и монтаж под ключ.',
    image: 'https://storage.yandexcloud.net/catalog-vfd/renders/cover-alum.webp',
    link: '/partitions',
    cta: 'Смотреть перегородки',
  },
]

/* ----------------------------
   Computed
----------------------------- */
const heroCategory = computed(() => categories[0])
const sideCategories = computed(() => categories.slice(1))

const delays = ['delay-[0ms]', 'delay-[120ms]', 'delay-[240ms]']

/* ----------------------------
   Navigation
----------------------------- */
const navigateTo = (link: string) => router.push(link)

/* ----------------------------
   Intersection Observer
----------------------------- */
onMounted(() => {
  observer = new IntersectionObserver(
    ([entry]) => {
      if (entry?.isIntersecting) {
        visible.value = true
        observer?.disconnect()
      }
    },
    { threshold: 0.25 }
  )

  if (sectionRef.value) observer.observe(sectionRef.value)
})

onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <div ref="sectionRef">
    <AppSection size="lg">
      <AppContainer>
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">

          <!-- Header -->
          <header
            class="lg:col-span-12 transition-all duration-700"
            :class="visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'"
          >
            <h2 class="text-3xl sm:text-4xl lg:text-5xl font-normal text-zinc-900 mb-3">
              Двери и перегородки ВФД в Челябинске
            </h2>
            <p class="text-base sm:text-lg text-zinc-600 max-w-2xl">
              Межкомнатные и входные двери, алюминиевые перегородки от официального дилера
              Владимирской фабрики дверей — в наличии и под заказ.
            </p>
          </header>

          <!-- Bento Grid -->
          <div class="lg:col-span-12">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

              <!-- Hero Category -->
              <article
                v-if="heroCategory"
                class="group relative rounded-3xl overflow-hidden
                       flex flex-col justify-end
                       min-h-100 lg:min-h-125
                       transition-all duration-500 ease-out
                       hover:-translate-y-1 hover:shadow-xl
                       cursor-pointer"
                :class="[visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8', delays[0]]"
                @click="navigateTo(heroCategory.link)"
              >
                <!-- Media -->
                <div class="absolute inset-0">
                  <div
                    class="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    :style="{ backgroundImage: `url(${heroCategory.image})` }"
                  />
                  <div class="absolute inset-0 bg-black/35" />
                </div>

                <!-- Content -->
                <div class="relative z-10 p-6 lg:p-8 text-white">
                  <h3 class="text-xl sm:text-2xl font-normal mb-2">
                    {{ heroCategory.title }}
                  </h3>

                  <p
                    v-if="heroCategory.subtitle"
                    class="text-sm sm:text-base mb-6 max-w-md text-white/90"
                  >
                    {{ heroCategory.subtitle }}
                  </p>

                  <button class="catalog-button catalog-button--primary">
                    {{ heroCategory.cta }}
                  </button>
                </div>
              </article>

              <!-- Side Categories -->
              <div class="lg:col-span-2 grid grid-rows-2 gap-6">
                <article
                  v-for="(category, index) in sideCategories"
                  :key="category.title"
                  class="group relative rounded-3xl overflow-hidden
                         flex flex-col justify-end
                         min-h-62.5 sm:min-h-75
                         transition-all duration-500 ease-out
                         hover:-translate-y-1 hover:shadow-xl
                         cursor-pointer"
                  :class="[visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8', delays[index + 1]]"
                  @click="navigateTo(category.link)"
                >
                  <!-- Media -->
                  <div class="absolute inset-0">
                    <div
                      class="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                      :style="{ backgroundImage: `url(${category.image})` }"
                    />
                    <div class="absolute inset-0 bg-black/40" />
                  </div>

                  <!-- Content -->
                  <div class="relative z-10 p-6 text-white">
                    <h3 class="text-xl sm:text-2xl font-normal mb-2">
                      {{ category.title }}
                    </h3>

                    <p
                      v-if="category.subtitle"
                      class="text-sm sm:text-base mb-6 max-w-md text-white/90"
                    >
                      {{ category.subtitle }}
                    </p>

                    <button class="catalog-button catalog-button--primary">
                      {{ category.cta }}
                    </button>
                  </div>
                </article>
              </div>

            </div>
          </div>

        </div>
      </AppContainer>
    </AppSection>
  </div>
</template>

<style scoped>
.catalog-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0 1.25rem;
  height: 2.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  border: 1px solid;
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
  user-select: none;
}

.catalog-button--primary {
  border-color: rgba(255, 255, 255, 0.3);
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  backdrop-filter: blur(4px);
}

.catalog-button--primary:hover {
  background-color: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.4);
  transform: translateY(-1px);
}
</style>