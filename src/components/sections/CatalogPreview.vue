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
    subtitle: 'Стильные и долговечные решения',
    image: 'https://storage.yandexcloud.net/catalog-vfd/slider/slide1.webp',
    link: '/catalog',
    cta: 'Перейти в каталог',
  },
  {
    title: 'Входные двери',
    subtitle: 'Надёжность и безопасность',
    image: 'https://storage.yandexcloud.net/catalog-vfd/slider/slide2.png',
    link: '/catalog?series=innova',
    cta: 'Перейти в каталог',
  },
  {
    title: 'Алюминиевые перегородки',
    subtitle: 'Современные интерьерные решения',
    image: 'https://storage.yandexcloud.net/catalog-vfd/slider/slide3.png',
    link: '/partitions',
    cta: 'Узнать больше',
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
            <h2 class="text-3xl sm:text-4xl lg:text-5xl font-semibold text-zinc-900 mb-3">
              Категории товаров
            </h2>
            <p class="text-base sm:text-lg text-zinc-600 max-w-2xl">
              Выберите подходящее решение для вашего интерьера
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
                  <div class="absolute inset-0 bg-black/35"></div>
                </div>

                <!-- Content -->
                <div class="relative z-10 p-6 lg:p-8 text-white">
                  <h3 class="text-xl sm:text-2xl font-semibold mb-2">
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
                    <div class="absolute inset-0 bg-black/40"></div>
                  </div>

                  <!-- Content -->
                  <div class="relative z-10 p-6 text-white">
                    <h3 class="text-xl sm:text-2xl font-semibold mb-2">
                      {{ category.title }}
                    </h3>

                    <p
                      v-if="category.subtitle"
                      class="text-sm sm:text-base mb-6 max-w-md text-white/90"
                    >
                      {{ category.subtitle }}
                    </p>

                    <button class="catalog-button catalog-button--ghost">
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

.catalog-button--ghost {
  border-color: rgba(255, 255, 255, 0.2);
  background-color: transparent;
  color: rgba(255, 255, 255, 0.8);
}

.catalog-button--ghost:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
}
</style>
