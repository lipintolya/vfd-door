<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, reactive } from 'vue'
import AppSection from '@/components/layout/AppSection.vue'
import AppContainer from '@/components/layout/AppContainer.vue'
import Breadcrumbs from '@/components/ui/Breadcrumbs.vue'
import { submitContactForm, formatPhone, isValidPhone } from '@/services/formSubmit'

// Импорт данных и типов из отдельного файла
import type {
  HeroSlide,
  ProfileOption,
  SlidingTypeDetail,
  PartitionType,
  ColorOption,
  PortfolioProject,
  ProcessStep,
} from '@/data/partitions'

import {
  heroSlides,
  introText,
  descriptionBlocks,
  decorativeProfiles,
  features,
  specifications,
  slidingTypesDetails,
  mountingTypes,
  partitionTypes,
  colorOptions,
  portfolioProjects,
  processSteps,
  faqItems,
  fillingOptions,
} from '@/data/partitions'

const TELEGRAM_URL = 'https://t.me/vfddoors74'

/* ============================================
   BREADCRUMBS
   ============================================ */
const breadcrumbs = computed(() => [
  { label: 'Главная', path: '/' },
  { label: 'Алюминиевые перегородки', isActive: true }
])

const activeSlideIndex = ref<number>(0)
const activeProfileIndex = ref<number>(0)
const activePartitionTypeIndex = ref<number>(0)
const isDownloading = ref<boolean>(false)

// Modal state
const isModalOpen = ref<boolean>(false)
const activeModalSlide = ref<number>(0)
const activeSchemaSlide = ref<number>(0)

// Color zoom modal
const isColorZoomOpen = ref<boolean>(false)
const selectedColorImage = ref<string>('')
const selectedColorName = ref<string>('')

// Portfolio modal
const isPortfolioModalOpen = ref<boolean>(false)
const activePortfolioProjectIndex = ref<number>(0)
const activePortfolioImageIndex = ref<number>(0)

// FAQ state
const activeFaqIds = ref<Set<number>>(new Set([1]))

// Quick Contact Form
const quickContact = reactive({
  name: '',
  phone: '',
  isSubmitting: false,
})

const sendContactToTelegram = async (name: string, phone: string) => {
  // Используем защищённый API вместо прямой отправки
  const result = await submitContactForm({
    name,
    phone,
    source: 'AluminiumPartitionsPage - Quick Contact',
  })
  
  return result
}

const onQuickPhoneInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  quickContact.phone = formatPhone(target.value)
}

const handleContactSubmit = async () => {
  if (!quickContact.name.trim()) {
    alert('Введите ваше имя')
    return
  }
  if (!quickContact.phone.trim()) {
    alert('Введите телефон')
    return
  }
  if (!isValidPhone(quickContact.phone)) {
    alert('Введите корректный номер')
    return
  }

  quickContact.isSubmitting = true
  const result = await sendContactToTelegram(quickContact.name, quickContact.phone)

  if (result.success) {
    alert('Спасибо! Мы вскоре свяжемся с вами')
    quickContact.name = ''
    quickContact.phone = ''
  } else {
    alert(result.error || 'Ошибка при отправке')
  }

  quickContact.isSubmitting = false
}

// Animations
const visibleFeatures = ref<boolean>(false)
const activeProcessStep = ref<number>(0)

/* ============================================
   COMPUTED PROPERTIES
   ============================================ */

const currentSlide = computed<HeroSlide>(() => {
  return heroSlides[activeSlideIndex.value] || heroSlides[0]!
})

const currentProfile = computed<ProfileOption | null>(() => {
  if (decorativeProfiles.length === 0) return null
  return decorativeProfiles[Math.min(activeProfileIndex.value, decorativeProfiles.length - 1)] || null
})

const currentPartitionType = computed<PartitionType>(() => {
  if (partitionTypes.length === 0) return partitionTypes[0]!
  return partitionTypes[Math.min(activePartitionTypeIndex.value, partitionTypes.length - 1)]!
})

const currentModalType = computed<SlidingTypeDetail>(() => {
  return slidingTypesDetails[activeModalSlide.value] || slidingTypesDetails[0]!
})

const currentSchemaImages = computed(() => {
  return currentModalType.value.detailImages || []
})

const hasSchemaImages = computed(() => {
  return currentSchemaImages.value.length > 0
})

const currentPortfolioProject = computed<PortfolioProject>(() => {
  return portfolioProjects[activePortfolioProjectIndex.value] || portfolioProjects[0]!
})

const currentPortfolioImages = computed(() => {
  return currentPortfolioProject.value.images || []
})

const currentProcessStep = computed<ProcessStep>(() => {
  return processSteps[activeProcessStep.value] || processSteps[0]!
})

/* ============================================
   ANIMATION & LIFECYCLE
   ============================================ */

let autoPlayTimer: number | null = null

const nextSlide = (): void => {
  activeSlideIndex.value = (activeSlideIndex.value + 1) % heroSlides.length
}

const goToSlide = (index: number): void => {
  if (index < 0 || index >= heroSlides.length) return
  activeSlideIndex.value = index
  restartAutoPlay()
}

const goToProfile = (index: number): void => {
  if (index < 0 || decorativeProfiles.length === 0) return
  activeProfileIndex.value = Math.min(index, decorativeProfiles.length - 1)
}

const goToPartitionType = (index: number): void => {
  if (index < 0 || partitionTypes.length === 0) return
  activePartitionTypeIndex.value = Math.min(index, partitionTypes.length - 1)
}

const startAutoPlay = (): void => {
  stopAutoPlay()
  autoPlayTimer = window.setInterval(nextSlide, 7000)
}

const stopAutoPlay = (): void => {
  if (autoPlayTimer !== null) {
    clearInterval(autoPlayTimer)
    autoPlayTimer = null
  }
}

const restartAutoPlay = (): void => {
  startAutoPlay()
}

const openTelegram = (): void => {
  window.open(TELEGRAM_URL, '_blank')
}

const downloadBlank = (): void => {
  if (isDownloading.value) return
  
  isDownloading.value = true
  
  try {
    const pdfUrl = '/blank-aluminium.pdf'
    const link = document.createElement('a')
    link.href = pdfUrl
    link.download = 'Бланк-замера-алюминиевые-перегородки-VFD.pdf'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    setTimeout(() => {
      isDownloading.value = false
    }, 500)
    
  } catch (error) {
    console.error('Ошибка при скачивании PDF:', error)
    window.open('/blank-aluminium.pdf', '_blank')
    isDownloading.value = false
  }
}

/* ============================================
   MODAL FUNCTIONS
   ============================================ */

const openModal = (typeIndex: number): void => {
  activeModalSlide.value = typeIndex
  activeSchemaSlide.value = 0
  isModalOpen.value = true
  document.body.style.overflow = 'hidden'
}

const closeModal = (): void => {
  isModalOpen.value = false
  document.body.style.overflow = ''
}

const nextModalSlide = (): void => {
  activeModalSlide.value = (activeModalSlide.value + 1) % slidingTypesDetails.length
  activeSchemaSlide.value = 0
}

const prevModalSlide = (): void => {
  activeModalSlide.value = (activeModalSlide.value - 1 + slidingTypesDetails.length) % slidingTypesDetails.length
  activeSchemaSlide.value = 0
}

const goToModalSlide = (index: number): void => {
  if (index >= 0 && index < slidingTypesDetails.length) {
    activeModalSlide.value = index
    activeSchemaSlide.value = 0
  }
}

const nextSchemaSlide = (): void => {
  if (currentSchemaImages.value.length > 0) {
    activeSchemaSlide.value = (activeSchemaSlide.value + 1) % currentSchemaImages.value.length
  }
}

const prevSchemaSlide = (): void => {
  if (currentSchemaImages.value.length > 0) {
    activeSchemaSlide.value = (activeSchemaSlide.value - 1 + currentSchemaImages.value.length) % currentSchemaImages.value.length
  }
}

const goToSchemaSlide = (index: number): void => {
  if (index >= 0 && index < currentSchemaImages.value.length) {
    activeSchemaSlide.value = index
  }
}

/* ============================================
   COLOR ZOOM MODAL
   ============================================ */

const openColorZoom = (color: ColorOption): void => {
  selectedColorImage.value = color.image
  selectedColorName.value = color.name
  isColorZoomOpen.value = true
  document.body.style.overflow = 'hidden'
}

const closeColorZoom = (): void => {
  isColorZoomOpen.value = false
  selectedColorImage.value = ''
  selectedColorName.value = ''
  document.body.style.overflow = ''
}

/* ============================================
   PORTFOLIO MODAL
   ============================================ */

const openPortfolioModal = (projectIndex: number): void => {
  activePortfolioProjectIndex.value = projectIndex
  activePortfolioImageIndex.value = 0
  isPortfolioModalOpen.value = true
  document.body.style.overflow = 'hidden'
}

const closePortfolioModal = (): void => {
  isPortfolioModalOpen.value = false
  document.body.style.overflow = ''
}

const nextPortfolioImage = (): void => {
  if (currentPortfolioImages.value.length > 0) {
    activePortfolioImageIndex.value = (activePortfolioImageIndex.value + 1) % currentPortfolioImages.value.length
  }
}

const prevPortfolioImage = (): void => {
  if (currentPortfolioImages.value.length > 0) {
    activePortfolioImageIndex.value = (activePortfolioImageIndex.value - 1 + currentPortfolioImages.value.length) % currentPortfolioImages.value.length
  }
}

const goToPortfolioImage = (index: number): void => {
  if (index >= 0 && index < currentPortfolioImages.value.length) {
    activePortfolioImageIndex.value = index
  }
}

const nextPortfolioProject = (): void => {
  activePortfolioProjectIndex.value = (activePortfolioProjectIndex.value + 1) % portfolioProjects.length
  activePortfolioImageIndex.value = 0
}

const prevPortfolioProject = (): void => {
  activePortfolioProjectIndex.value = (activePortfolioProjectIndex.value - 1 + portfolioProjects.length) % portfolioProjects.length
  activePortfolioImageIndex.value = 0
}

/* ============================================
   FAQ FUNCTIONS
   ============================================ */

const toggleFaq = (id: number): void => {
  const set = activeFaqIds.value
  set.has(id) ? set.delete(id) : set.add(id)
}

/* ============================================
   KEY DOWN HANDLER
   ============================================ */

const handleKeyDown = (event: KeyboardEvent): void => {
  if (event.key === 'Escape') {
    if (isColorZoomOpen.value) {
      closeColorZoom()
    } else if (isPortfolioModalOpen.value) {
      closePortfolioModal()
    } else if (isModalOpen.value) {
      closeModal()
    }
  }
}

/* ============================================
   INTERSECTION OBSERVER
   ============================================ */

const setupIntersectionObserver = (): void => {
  const featuresElement = document.getElementById('features-section')
  if (featuresElement) {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry?.isIntersecting) {
          visibleFeatures.value = true
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(featuresElement)
  }
}

/* ============================================
   LIFECYCLE HOOKS
   ============================================ */

onMounted(() => {
  startAutoPlay()
  window.addEventListener('keydown', handleKeyDown)
  setupIntersectionObserver()
})

onBeforeUnmount(() => {
  stopAutoPlay()
  window.removeEventListener('keydown', handleKeyDown)
  document.body.style.overflow = ''
})
</script>

<template>
  <div class="min-h-screen bg-white">
    <!-- HERO SLIDER -->
    <AppSection>
      <AppContainer>
        <!-- Breadcrumbs -->
        <div class="mb-4 sm:mb-6">
          <Breadcrumbs :items="breadcrumbs" />
        </div>

        <div class="relative w-full overflow-hidden rounded-3xl" style="height: 500px">
        <div class="absolute inset-0">
          <div
            v-for="(slide, idx) in heroSlides"
            :key="slide.id"
            class="absolute inset-0 bg-cover bg-center transition-opacity duration-700"
            :style="{ backgroundImage: `url('${slide.image}')` }"
            :class="idx === activeSlideIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'"
            aria-hidden="true"
          />
        </div>

        <div class="absolute inset-0 bg-linear-to-t from-black/70 via-black/40 to-black/16" aria-hidden="true" />

        <div class="relative z-10 h-full flex items-end">
          <div class="w-full max-w-3xl p-4 sm:p-6 lg:p-8 text-white pb-20 sm:pb-24">
            <div class="space-y-2 sm:space-y-3">
              <p class="text-xs uppercase tracking-widest text-white/70">
                {{ currentSlide.subtitle }}
              </p>
              <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">
                {{ currentSlide.title }}
              </h1>
            </div>

            <p class="text-sm sm:text-base lg:text-lg text-white/90 mt-4 sm:mt-6 max-w-2xl leading-relaxed">
              {{ currentSlide.description }}
            </p>

            <div class="flex flex-wrap gap-3 mt-6 sm:mt-8">
              <button class="ui-button ui-button--primary" type="button" @click="openTelegram">
                Консультация
              </button>
              <button 
                class="ui-button ui-button--ghost" 
                type="button" 
                @click="downloadBlank"
                :disabled="isDownloading"
                :class="{ 'opacity-50 cursor-not-allowed': isDownloading }"
              >
                <span v-if="isDownloading" class="flex items-center gap-2">
                  <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Загрузка...
                </span>
                <span v-else>Скачать бланк замера</span>
              </button>
            </div>
          </div>
        </div>

        <div class="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2 sm:gap-3" role="tablist" aria-label="Навигация слайдера">
          <button
            v-for="(_, idx) in heroSlides"
            :key="idx"
            @click="goToSlide(idx)"
            :aria-label="`Слайд ${idx + 1}`"
            :aria-selected="idx === activeSlideIndex"
            class="slider-dot"
            :class="idx === activeSlideIndex ? 'slider-dot--active' : 'slider-dot--idle'"
            type="button"
          />
        </div>
      </div>
    </AppContainer>
  </AppSection>

  <!-- INTRO -->
  <AppSection>
    <AppContainer>
      <p class="text-base sm:text-lg lg:text-xl text-zinc-900/80 leading-relaxed">
        {{ introText }}
      </p>
    </AppContainer>
  </AppSection>

 
  <!-- FEATURES WITH ENLARGED IMAGES -->
  <AppSection>
    <AppContainer>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8" id="features-section">
        <div
          v-for="(feature, idx) in features"
          :key="feature.id"
          class="group rounded-3xl overflow-hidden border-2 border-zinc-200 hover:border-teal-600 transition-all duration-300 hover:shadow-lg hover:shadow-teal-500/10"
          :class="[
            visibleFeatures 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8',
            'transition-all duration-500 ease-out'
          ]"
          :style="visibleFeatures ? { transitionDelay: `${idx * 100}ms` } : {}"
        >
          <!-- IMAGE -->
          <div class="relative h-56 overflow-hidden bg-zinc-100">
            <img
              :src="feature.icon"
              :alt="feature.title"
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          </div>

          <!-- CONTENT -->
          <div class="p-6">
            <h3 class="text-xl font-bold text-zinc-900 mb-3">
              {{ feature.title }}
            </h3>
            <p class="text-sm text-zinc-700 leading-relaxed">
              {{ feature.description }}
            </p>
          </div>
        </div>
      </div>
    </AppContainer>
  </AppSection>

  <!-- SPECIFICATIONS -->
  <AppSection>
    <AppContainer>
      <div class="space-y-10 sm:space-y-12">
        <div>
          <h2 class="text-3xl sm:text-4xl font-bold text-zinc-900 mb-2 sm:mb-3">Характеристики и преимущества</h2>
          <p class="text-zinc-700 max-w-2xl">Полная информация о свойствах наших перегородок</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          <div v-for="spec in specifications" :key="spec.id" class="space-y-6">
            <h3 class="text-2xl font-bold text-zinc-900">{{ spec.title }}</h3>
            <ul class="space-y-3">
              <li v-for="(item, idx) in spec.items" :key="idx" class="flex items-start gap-3 text-base text-zinc-700">
                <span class="text-lg leading-none mt-0.5 text-teal-600">✓</span>
                <span>{{ item }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </AppContainer>
  </AppSection>

  <!-- SLIDING TYPES -->
  <AppSection>
    <AppContainer>
      <div class="space-y-10 sm:space-y-12">
        <div class="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 class="text-3xl sm:text-4xl font-bold text-zinc-900 mb-2 sm:mb-3">Типы раздвижения</h2>
            <p class="text-zinc-700 max-w-2xl">Выберите оптимальный тип системы раздвижения для вашего помещения</p>
          </div>
          <button 
            class="ui-button ui-button--primary shrink-0"
            type="button"
            @click="openModal(0)"
          >
            Подробнее о системах
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div
            v-for="(type, idx) in slidingTypesDetails"
            :key="type.id"
            class="group rounded-3xl overflow-hidden border-2 border-zinc-200 hover:border-teal-600 transition-all duration-300 hover:shadow-lg hover:shadow-teal-500/10 cursor-pointer"
            @click="openModal(idx)"
          >
            <div class="relative h-56 overflow-hidden bg-zinc-100">
              <img :src="type.image" :alt="type.name" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
              <div class="hidden md:flex absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 items-center justify-center">
                <div class="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white text-zinc-900 px-4 py-2 rounded-full text-sm font-semibold">
                  Подробнее
                </div>
              </div>
            </div>
            <div class="p-6">
              <h3 class="text-xl font-bold text-zinc-900 mb-2">{{ type.name }}</h3>
              <p class="text-sm text-zinc-700 leading-relaxed mb-3">{{ type.description }}</p>
              <button 
                class="md:hidden w-full ui-button ui-button--ghost text-sm py-2"
                type="button"
                @click.stop="openModal(idx)"
              >
                Смотреть детали
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppContainer>
  </AppSection>

  <!-- MODAL FOR SLIDING TYPES -->
  <Transition name="modal">
    <div 
      v-if="isModalOpen" 
      class="modal-overlay"
      @click.self="closeModal"
    >
      <div class="modal-container">
        <button 
          class="modal-close"
          @click="closeModal"
          aria-label="Закрыть"
          type="button"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div class="modal-header">
          <h2 class="text-2xl sm:text-3xl font-bold text-zinc-900">
            {{ currentModalType.name }}
          </h2>
          <p class="text-zinc-700 mt-2">{{ currentModalType.description }}</p>
        </div>

        <div class="modal-content">
          <div class="space-y-6">
            <h3 class="text-xl font-bold text-zinc-900">Схемы расположения</h3>
            
            <div v-if="hasSchemaImages" class="relative">
              <div class="rounded-2xl overflow-hidden border-2 border-zinc-200 bg-white">
                <div class="relative aspect-4/3 bg-zinc-50">
                  <div
                    v-for="(image, idx) in currentSchemaImages"
                    :key="idx"
                    class="absolute inset-0 transition-opacity duration-500"
                    :class="idx === activeSchemaSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'"
                  >
                    <img 
                      :src="image" 
                      :alt="`Схема ${idx + 1}`" 
                      class="w-full h-full object-contain p-4" 
                      loading="lazy" 
                    />
                  </div>
                </div>

                <div v-if="currentSchemaImages.length > 1" class="absolute inset-0 flex items-center justify-between px-4 pointer-events-none">
                  <button
                    @click="prevSchemaSlide"
                    class="pointer-events-auto w-10 h-10 rounded-full bg-teal-600 text-white flex items-center justify-center hover:bg-teal-700 transition-all"
                    aria-label="Предыдущая схема"
                    type="button"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    @click="nextSchemaSlide"
                    class="pointer-events-auto w-10 h-10 rounded-full bg-teal-600 text-white flex items-center justify-center hover:bg-teal-700 transition-all"
                    aria-label="Следующая схема"
                    type="button"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>

              <div v-if="currentSchemaImages.length > 1" class="flex gap-2 justify-center mt-4">
                <button
                  v-for="(_, idx) in currentSchemaImages"
                  :key="idx"
                  @click="goToSchemaSlide(idx)"
                  class="schema-dot"
                  :class="idx === activeSchemaSlide ? 'schema-dot--active' : ''"
                  :aria-label="`Схема ${idx + 1}`"
                  type="button"
                />
              </div>
            </div>

            <div v-else class="rounded-2xl border-2 border-dashed border-zinc-300 bg-zinc-50 p-12 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-zinc-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p class="text-lg font-semibold text-zinc-700 mb-2">Данные обновляются</p>
              <p class="text-sm text-zinc-500">Скоро здесь появятся подробные схемы</p>
            </div>
          </div>

          <div class="space-y-4">
            <h3 class="text-xl font-bold text-zinc-900">Информация о монтаже</h3>
            <div class="space-y-3">
              <p 
                v-for="(info, idx) in currentModalType.mountingInfo" 
                :key="idx"
                class="text-sm text-zinc-700 leading-relaxed"
              >
                {{ info }}
              </p>
            </div>
          </div>

          <div class="space-y-4">
            <h3 class="text-xl font-bold text-zinc-900">Особенности системы</h3>
            <ul class="space-y-2">
              <li 
                v-for="(info, idx) in currentModalType.systemInfo" 
                :key="idx"
                class="flex items-start gap-3 text-sm text-zinc-700"
              >
                <span class="text-base leading-none mt-0.5 shrink-0">•</span>
                <span>{{ info }}</span>
              </li>
            </ul>
          </div>

          <div class="space-y-4">
            <h3 class="text-xl font-bold text-zinc-900">Преимущества</h3>
            <ul class="space-y-2">
              <li 
                v-for="(advantage, idx) in currentModalType.advantages" 
                :key="idx"
                class="flex items-start gap-3 text-sm text-zinc-700"
              >
                <span class="text-base leading-none mt-0.5 shrink-0 text-teal-600">✓</span>
                <span>{{ advantage }}</span>
              </li>
            </ul>
          </div>
        </div>

        <div class="modal-navigation">
          <button 
            class="nav-button"
            @click="prevModalSlide"
            type="button"
            aria-label="Предыдущий тип"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            <span class="hidden sm:inline">Предыдущий</span>
          </button>

          <div class="flex gap-2">
            <button
              v-for="(type, idx) in slidingTypesDetails"
              :key="type.id"
              @click="goToModalSlide(idx)"
              class="modal-dot"
              :class="idx === activeModalSlide ? 'modal-dot--active' : ''"
              :aria-label="`Тип ${idx + 1}`"
              type="button"
            />
          </div>

          <button 
            class="nav-button"
            @click="nextModalSlide"
            type="button"
            aria-label="Следующий тип"
          >
            <span class="hidden sm:inline">Следующий</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </Transition>

  <!-- MOUNTING TYPES -->
  <AppSection>
    <AppContainer>
      <div class="space-y-10 sm:space-y-12">
        <div>
          <h2 class="text-3xl sm:text-4xl font-bold text-zinc-900 mb-2 sm:mb-3">Типы крепления</h2>
          <p class="text-zinc-700 max-w-2xl">Различные варианты монтажа в зависимости от вашего помещения</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div
            v-for="mount in mountingTypes"
            :key="mount.id"
            class="rounded-3xl bg-white border-2 border-zinc-200 hover:border-teal-600 p-8 transition-all duration-300 hover:shadow-lg hover:shadow-teal-500/10 text-center"
          >
            <div class="mb-6">
              <img :src="mount.image" :alt="mount.name" class="w-60 h-80 mx-auto object-contain" loading="lazy" />
            </div>
            <h3 class="text-2xl font-bold text-zinc-900 mb-3">{{ mount.name }}</h3>
            <p class="text-base text-zinc-700 leading-relaxed">{{ mount.description }}</p>
          </div>
        </div>
      </div>
    </AppContainer>
  </AppSection>

  <!-- PARTITION TYPES -->
  <AppSection>
    <AppContainer>
      <div class="space-y-10 sm:space-y-12">
        <div>
          <h2 class="text-3xl sm:text-4xl font-bold text-zinc-900 mb-2 sm:mb-3">Модельный ряд створок</h2>
          <p class="text-zinc-700 mb-6">{{ descriptionBlocks.partitionTypes }}</p>
        </div>

        <!-- Desktop -->
        <div class="hidden lg:grid lg:grid-cols-3 gap-8">
          <div class="lg:col-span-1 relative">
            <div class="relative rounded-3xl overflow-hidden bg-zinc-200 aspect-square lg:h-96">
              <img :src="currentPartitionType.image" :alt="currentPartitionType.code" class="w-full h-full object-cover transition-opacity duration-300" loading="lazy" />
              <div class="absolute bottom-4 left-4 bg-zinc-900/70 text-white px-4 py-2 rounded-lg text-sm font-semibold">
                {{ currentPartitionType.code }}
              </div>
            </div>
            
            <!-- Arrow buttons for image switching -->
            <button
              @click="goToPartitionType(activePartitionTypeIndex - 1)"
              :disabled="activePartitionTypeIndex === 0"
              class="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 w-10 h-10 rounded-full bg-teal-600 text-white flex items-center justify-center hover:bg-teal-700 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Предыдущий тип"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button
              @click="goToPartitionType(activePartitionTypeIndex + 1)"
              :disabled="activePartitionTypeIndex === partitionTypes.length - 1"
              class="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 w-10 h-10 rounded-full bg-teal-600 text-white flex items-center justify-center hover:bg-teal-700 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Следующий тип"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div class="lg:col-span-2 flex flex-col justify-between space-y-8">
            <div class="space-y-4">
              <h3 class="text-2xl lg:text-3xl font-bold text-zinc-900">{{ currentPartitionType.name }}</h3>
              <p class="text-base lg:text-lg text-zinc-700 leading-relaxed max-w-2xl">{{ currentPartitionType.description }}</p>
              <p v-if="currentPartitionType.fullDescription" class="text-sm text-zinc-600">
                {{ currentPartitionType.fullDescription }}
              </p>
            </div>

            <!-- Type selector buttons -->
            <div class="flex gap-3 flex-wrap">
              <button
                v-for="(type, idx) in partitionTypes"
                :key="type.id"
                @click="goToPartitionType(idx)"
                class="rounded-2xl border-2 px-4 py-2 transition-all duration-300 text-sm font-semibold"
                :class="idx === activePartitionTypeIndex ? 'border-teal-600 bg-teal-50 text-zinc-900' : 'border-zinc-200 hover:border-teal-600 bg-white text-zinc-900'"
              >
                <p class="font-bold">{{ type.code }}</p>
                <p class="text-xs">{{ type.name }}</p>
              </button>
            </div>
          </div>
        </div>

        <!-- Mobile -->
        <div class="lg:hidden space-y-6">
          <div class="relative rounded-3xl overflow-hidden bg-zinc-200">
            <img :src="currentPartitionType.image" :alt="currentPartitionType.code" class="w-full h-64 object-cover transition-opacity duration-300" loading="lazy" />
            <div class="absolute bottom-4 left-4 bg-zinc-900/70 text-white px-4 py-2 rounded-lg text-sm font-semibold">
              {{ currentPartitionType.code }}
            </div>
            
            <!-- Arrow buttons for mobile -->
            <button
              @click="goToPartitionType(activePartitionTypeIndex - 1)"
              :disabled="activePartitionTypeIndex === 0"
              class="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center hover:bg-teal-700 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Предыдущий"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button
              @click="goToPartitionType(activePartitionTypeIndex + 1)"
              :disabled="activePartitionTypeIndex === partitionTypes.length - 1"
              class="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center hover:bg-teal-700 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Следующий"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div class="space-y-4">
            <h3 class="text-2xl font-bold text-zinc-900">{{ currentPartitionType.name }}</h3>
            <p class="text-base text-zinc-700 leading-relaxed">{{ currentPartitionType.description }}</p>
            <p v-if="currentPartitionType.fullDescription" class="text-sm text-zinc-600">
              {{ currentPartitionType.fullDescription }}
            </p>
          </div>

          <div class="flex gap-2 overflow-x-auto scroll-smooth pb-2">
            <button
              v-for="(type, idx) in partitionTypes"
              :key="type.id"
              @click="goToPartitionType(idx)"
              class="shrink-0 rounded-xl border-2 px-4 py-3 transition-all text-sm font-medium"
              :class="idx === activePartitionTypeIndex ? 'border-teal-600 bg-teal-600 text-white' : 'border-zinc-200 text-zinc-900 hover:border-teal-600'"
            >
              {{ type.code }}
            </button>
          </div>
        </div>
      </div>
    </AppContainer>
  </AppSection>

  <!-- DECORATIVE PROFILES SLIDER -->
  <AppSection v-if="decorativeProfiles.length > 0">
    <AppContainer>
      <div class="space-y-10 sm:space-y-12">
        <div>
          <h2 class="text-3xl sm:text-4xl font-bold text-zinc-900 mb-2 sm:mb-3">Накладной декор</h2>
          <p class="text-zinc-700 mb-6">{{ descriptionBlocks.decorativeProfiles }}</p>
        </div>

        <!-- Desktop -->
        <div v-if="currentProfile" class="hidden lg:grid lg:grid-cols-3 gap-8">
          <div class="lg:col-span-1 relative">
            <div class="relative rounded-3xl overflow-hidden bg-zinc-200 aspect-square lg:h-96">
              <img :src="currentProfile.image" :alt="currentProfile.code" class="w-full h-full object-cover transition-opacity duration-300" loading="lazy" />
              <div class="absolute bottom-4 left-4 bg-zinc-900/70 text-white px-4 py-2 rounded-lg text-sm font-semibold">
                {{ currentProfile.code }}
              </div>
            </div>
            
            <!-- Arrow buttons for image switching -->
            <button
              @click="goToProfile(activeProfileIndex - 1)"
              :disabled="activeProfileIndex === 0"
              class="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 w-10 h-10 rounded-full bg-teal-600 text-white flex items-center justify-center hover:bg-teal-700 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Предыдущий профиль"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button
              @click="goToProfile(activeProfileIndex + 1)"
              :disabled="activeProfileIndex === decorativeProfiles.length - 1"
              class="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 w-10 h-10 rounded-full bg-teal-600 text-white flex items-center justify-center hover:bg-teal-700 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Следующий профиль"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div class="lg:col-span-2 flex flex-col justify-between space-y-8">
            <div class="space-y-4">
              <h3 class="text-2xl lg:text-3xl font-bold text-zinc-900">{{ currentProfile.name }}</h3>
              <p class="text-base lg:text-lg text-zinc-700 leading-relaxed max-w-2xl">{{ currentProfile.description }}</p>
            </div>

            <!-- Profile selector buttons -->
            <div class="flex gap-3 flex-wrap">
              <button
                v-for="(profile, idx) in decorativeProfiles"
                :key="profile.id"
                @click="goToProfile(idx)"
                class="rounded-2xl border-2 px-4 py-2 transition-all duration-300 text-sm font-semibold"
                :class="idx === activeProfileIndex ? 'border-teal-600 bg-teal-50 text-zinc-900' : 'border-zinc-200 hover:border-teal-600 bg-white text-zinc-900'"
              >
                <p class="font-bold">{{ profile.code }}</p>
                <p class="text-xs">{{ profile.name }}</p>
              </button>
            </div>
          </div>
        </div>

        <!-- Mobile -->
        <div v-if="currentProfile" class="lg:hidden space-y-6">
          <div class="relative rounded-3xl overflow-hidden bg-zinc-200">
            <img :src="currentProfile.image" :alt="currentProfile.code" class="w-full h-64 object-cover transition-opacity duration-300" loading="lazy" />
            <div class="absolute bottom-4 left-4 bg-zinc-900/70 text-white px-4 py-2 rounded-lg text-sm font-semibold">
              {{ currentProfile.code }}
            </div>
            
            <!-- Arrow buttons for mobile -->
            <button
              @click="goToProfile(activeProfileIndex - 1)"
              :disabled="activeProfileIndex === 0"
              class="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center hover:bg-teal-700 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Предыдущий"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button
              @click="goToProfile(activeProfileIndex + 1)"
              :disabled="activeProfileIndex === decorativeProfiles.length - 1"
              class="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center hover:bg-teal-700 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Следующий"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div class="space-y-4">
            <h3 class="text-2xl font-bold text-zinc-900">{{ currentProfile.name }}</h3>
            <p class="text-base text-zinc-700 leading-relaxed">{{ currentProfile.description }}</p>
          </div>

          <div class="flex gap-2 overflow-x-auto scroll-smooth pb-2">
            <button
              v-for="(profile, idx) in decorativeProfiles"
              :key="profile.id"
              @click="goToProfile(idx)"
              class="shrink-0 rounded-xl border-2 px-4 py-3 transition-all text-sm font-medium"
              :class="idx === activeProfileIndex ? 'border-teal-600 bg-teal-600 text-white' : 'border-zinc-200 text-zinc-900 hover:border-teal-600'"
            >
              {{ profile.code }}
            </button>
          </div>
        </div>
      </div>
    </AppContainer>
  </AppSection>

  <!-- COLORS with Zoom -->
  <AppSection>
    <AppContainer>
      <div class="space-y-10 sm:space-y-12">
        <div>
          <h2 class="text-3xl sm:text-4xl font-bold text-zinc-900 mb-2 sm:mb-3">Цветовые решения профиля</h2>
          <p class="text-zinc-700 mb-6">{{ descriptionBlocks.colorSolutions }}</p>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div 
            v-for="color in colorOptions" 
            :key="color.id" 
            class="text-center group cursor-pointer"
            @click="openColorZoom(color)"
          >
            <div class="relative rounded-xl overflow-hidden mb-3 h-32 bg-zinc-100 border-2 border-zinc-200 group-hover:border-teal-600 transition-all">
              <img :src="color.image" :alt="color.name" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" loading="lazy" />
              <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
              </div>
            </div>
            <p class="text-sm font-medium text-zinc-900">{{ color.name }}</p>
          </div>
        </div>
      </div>
    </AppContainer>
  </AppSection>

  <!-- COLOR ZOOM MODAL - OPTIMIZED -->
  <Transition name="modal">
    <div 
      v-if="isColorZoomOpen" 
      class="modal-overlay"
      @click.self="closeColorZoom"
    >
      <div class="color-zoom-container">
        <button 
          class="modal-close"
          @click="closeColorZoom"
          aria-label="Закрыть"
          type="button"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div class="absolute top-6 left-6 bg-zinc-900/80 text-white px-6 py-3 rounded-xl z-10">
          <p class="text-lg font-bold">{{ selectedColorName }}</p>
        </div>

        <div class="flex items-center justify-center w-full h-full p-4 sm:p-8">
          <img 
            :src="selectedColorImage" 
            :alt="selectedColorName" 
            class="max-w-full max-h-full w-auto h-auto object-contain"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  </Transition>

  <!-- FILLING OPTIONS -->
  <AppSection>
    <AppContainer>
      <div class="space-y-10 sm:space-y-12">
        <div>
          <h2 class="text-3xl sm:text-4xl font-bold text-zinc-900 mb-2 sm:mb-3">Заполнение перегородок</h2>
          <p class="text-zinc-700 mb-6">{{ descriptionBlocks.fillingOptions }}</p>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div v-for="filling in fillingOptions" :key="filling.id" class="text-center group cursor-pointer">
            <div class="relative rounded-xl overflow-hidden mb-3 h-48 bg-zinc-100 border-2 border-zinc-200 group-hover:border-teal-600 transition-all">
              <img :src="filling.image" :alt="filling.name" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" loading="lazy" />
            </div>
            <p class="text-sm font-medium text-zinc-900">{{ filling.name }}</p>
          </div>
        </div>
      </div>
    </AppContainer>
  </AppSection>

  <!-- PORTFOLIO PROJECTS -->
  <AppSection>
    <AppContainer>
      <div class="space-y-10 sm:space-y-12">
        <div>
          <h2 class="text-3xl sm:text-4xl font-bold text-zinc-900 mb-2 sm:mb-3">Реализованные проекты</h2>
          <p class="text-zinc-700 max-w-2xl">Портфолио успешно выполненных проектов. Нажмите на проект для подробной информации</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div 
            v-for="(project, idx) in portfolioProjects" 
            :key="project.id" 
            class="group rounded-3xl overflow-hidden border-2 border-zinc-200 hover:border-teal-600 transition-all duration-300 hover:shadow-lg hover:shadow-teal-500/10 cursor-pointer"
            @click="openPortfolioModal(idx)"
          >
            <div class="relative h-64 overflow-hidden bg-zinc-100">
              <img :src="project.images[0]" :alt="project.title" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
              <div class="absolute top-4 right-4 bg-zinc-900 text-white px-4 py-2 rounded-full text-xs font-semibold">
                {{ project.category }}
              </div>
              <div class="absolute top-4 left-4 bg-white/90 text-zinc-900 px-3 py-1 rounded-full text-xs font-semibold">
                {{ project.date }}
              </div>
            </div>

            <div class="p-6 space-y-4">
              <h3 class="text-xl font-bold text-zinc-900 leading-tight">{{ project.title }}</h3>
              <p class="text-sm text-zinc-700 leading-relaxed">{{ project.description }}</p>
              
              <button 
                class="w-full mt-4 ui-button ui-button--ghost text-sm"
                type="button"
                @click.stop="openPortfolioModal(idx)"
              >
                Подробнее
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppContainer>
  </AppSection>

  <!-- PORTFOLIO MODAL -->
  <Transition name="modal">
    <div 
      v-if="isPortfolioModalOpen" 
      class="modal-overlay"
      @click.self="closePortfolioModal"
    >
      <div class="modal-container">
        <button 
          class="modal-close"
          @click="closePortfolioModal"
          aria-label="Закрыть"
          type="button"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div class="modal-header">
          <div class="flex items-center gap-4 mb-4">
            <span class="text-sm font-semibold text-white bg-zinc-900 px-3 py-1 rounded-full">
              {{ currentPortfolioProject.category }}
            </span>
            <span class="text-sm text-zinc-600">{{ currentPortfolioProject.date }}</span>
          </div>
          <h2 class="text-2xl sm:text-3xl font-bold text-zinc-900">
            {{ currentPortfolioProject.title }}
          </h2>
          <p class="text-zinc-700 mt-3">{{ currentPortfolioProject.fullDescription }}</p>
        </div>

        <div class="modal-content">
          <!-- Gallery -->
          <div class="space-y-6">
            <h3 class="text-xl font-bold text-zinc-900">Галерея проекта</h3>
            
            <div class="relative">
              <div class="rounded-2xl overflow-hidden border-2 border-zinc-200 bg-white">
                <div class="relative aspect-4/3 bg-zinc-50">
                  <div
                    v-for="(image, idx) in currentPortfolioImages"
                    :key="idx"
                    class="absolute inset-0 transition-opacity duration-500"
                    :class="idx === activePortfolioImageIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'"
                  >
                    <img 
                      :src="image" 
                      :alt="`Фото ${idx + 1}`" 
                      class="w-full h-full object-cover" 
                      loading="lazy" 
                    />
                  </div>
                </div>

                <div v-if="currentPortfolioImages.length > 1" class="absolute inset-0 flex items-center justify-between px-4 pointer-events-none">
                  <button
                    @click="prevPortfolioImage"
                    class="pointer-events-auto w-10 h-10 rounded-full bg-teal-600 text-white flex items-center justify-center hover:bg-teal-700 transition-all"
                    aria-label="Предыдущее фото"
                    type="button"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    @click="nextPortfolioImage"
                    class="pointer-events-auto w-10 h-10 rounded-full bg-teal-600 text-white flex items-center justify-center hover:bg-teal-700 transition-all"
                    aria-label="Следующее фото"
                    type="button"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>

              <div v-if="currentPortfolioImages.length > 1" class="flex gap-2 justify-center mt-4">
                <button
                  v-for="(_, idx) in currentPortfolioImages"
                  :key="idx"
                  @click="goToPortfolioImage(idx)"
                  class="schema-dot"
                  :class="idx === activePortfolioImageIndex ? 'schema-dot--active' : ''"
                  :aria-label="`Фото ${idx + 1}`"
                  type="button"
                />
              </div>
            </div>
          </div>

          <!-- Project Details -->
          <div v-if="currentPortfolioProject.clientName" class="space-y-3">
            <h3 class="text-lg font-bold text-zinc-900">Клиент</h3>
            <p class="text-sm text-zinc-800">{{ currentPortfolioProject.clientName }}</p>
          </div>

          <div class="space-y-3">
            <h3 class="text-lg font-bold text-zinc-900">Характеристики</h3>
            <p class="text-sm text-zinc-800 leading-relaxed">{{ currentPortfolioProject.specifications }}</p>
          </div>

          <div v-if="currentPortfolioProject.challenge" class="space-y-3">
            <h3 class="text-lg font-bold text-zinc-900">Задача</h3>
            <p class="text-sm text-zinc-800 leading-relaxed">{{ currentPortfolioProject.challenge }}</p>
          </div>

          <div v-if="currentPortfolioProject.solution" class="space-y-3">
            <h3 class="text-lg font-bold text-zinc-900">Решение</h3>
            <p class="text-sm text-zinc-800 leading-relaxed">{{ currentPortfolioProject.solution }}</p>
          </div>

          <div v-if="currentPortfolioProject.results && currentPortfolioProject.results.length > 0" class="space-y-3">
            <h3 class="text-lg font-bold text-zinc-900">Результаты</h3>
            <ul class="space-y-2">
              <li 
                v-for="(result, idx) in currentPortfolioProject.results" 
                :key="idx"
                class="flex items-start gap-3 text-sm text-zinc-800"
              >
                <span class="text-base leading-none mt-0.5 shrink-0 text-teal-600">✓</span>
                <span>{{ result }}</span>
              </li>
            </ul>
          </div>
        </div>

        <div class="modal-navigation">
          <button 
            class="nav-button"
            @click="prevPortfolioProject"
            type="button"
            aria-label="Предыдущий проект"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            <span class="hidden sm:inline">Предыдущий</span>
          </button>

          <div class="flex gap-2">
            <button
              v-for="(project, idx) in portfolioProjects"
              :key="project.id"
              @click="activePortfolioProjectIndex = idx; activePortfolioImageIndex = 0"
              class="modal-dot"
              :class="idx === activePortfolioProjectIndex ? 'modal-dot--active' : ''"
              :aria-label="`Проект ${idx + 1}`"
              type="button"
            />
          </div>

          <button 
            class="nav-button"
            @click="nextPortfolioProject"
            type="button"
            aria-label="Следующий проект"
          >
            <span class="hidden sm:inline">Следующий</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </Transition>

  <!-- INTERACTIVE PROCESS SECTION -->
  <AppSection>
    <AppContainer>
      <div class="space-y-10 sm:space-y-12">
        <div>
          <h2 class="text-3xl sm:text-4xl font-bold text-zinc-900 mb-2 sm:mb-3">Процесс заказа</h2>
          <p class="text-zinc-700">Выберите этап для просмотра подробной информации</p>
        </div>

        <!-- Interactive Layout -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <!-- Left side: Step numbers -->
          <div class="space-y-4 order-2 lg:order-1">
            <button
              v-for="step in processSteps"
              :key="step.number"
              @click="activeProcessStep = step.number - 1"
              type="button"
              class="w-full group rounded-2xl border-2 border-zinc-200 hover:border-teal-600 p-6 text-left transition-all duration-300 hover:shadow-lg hover:shadow-teal-500/10"
              :class="activeProcessStep === step.number - 1 ? 'border-teal-600 bg-zinc-900 text-white' : 'bg-white text-zinc-900'"
            >
              <div class="flex items-start gap-4">
                <div class="shrink-0">
                  <div 
                    class="flex items-center justify-center h-12 w-12 rounded-full font-bold text-lg transition-all"
                    :class="activeProcessStep === step.number - 1 ? 'bg-teal-600 text-white' : 'bg-zinc-900 text-white'"
                  >
                    {{ step.number }}
                  </div>
                </div>
                <div class="flex-1">
                  <h3 
                    class="text-lg font-bold transition-all"
                    :class="activeProcessStep === step.number - 1 ? 'text-white' : 'text-zinc-900'"
                  >
                    {{ step.title }}
                  </h3>
                  <p 
                    class="text-sm mt-1 transition-all"
                    :class="activeProcessStep === step.number - 1 ? 'text-white/80' : 'text-zinc-700'"
                  >
                    Нажмите для подробнее
                  </p>
                </div>
              </div>
            </button>
          </div>

          <!-- Right side: Image & Description -->
          <div class="order-1 lg:order-2 space-y-6">
            <!-- Image slider -->
            <div class="relative rounded-3xl overflow-hidden bg-zinc-100 h-80">
              <img 
                :src="currentProcessStep.image" 
                :alt="currentProcessStep.title"
                class="w-full h-full object-cover transition-opacity duration-500"
                loading="lazy"
              />
              <!-- Step counter -->
              <div class="absolute top-6 right-6 bg-teal-600 text-white px-4 py-2 rounded-full text-sm font-bold">
                {{ activeProcessStep + 1 }}/{{ processSteps.length }}
              </div>
            </div>

            <!-- Description -->
            <div class="space-y-4">
              <h3 class="text-2xl font-bold text-zinc-900">{{ currentProcessStep.title }}</h3>
              <p class="text-base text-zinc-800 leading-relaxed">{{ currentProcessStep.description }}</p>
            </div>

            <!-- Navigation buttons for mobile -->
            <div class="flex gap-3 lg:hidden">
              <button
                @click="activeProcessStep = Math.max(0, activeProcessStep - 1)"
                :disabled="activeProcessStep === 0"
                class="flex-1 ui-button ui-button--ghost"
                type="button"
              >
                ← Назад
              </button>
              <button
                @click="activeProcessStep = Math.min(processSteps.length - 1, activeProcessStep + 1)"
                :disabled="activeProcessStep === processSteps.length - 1"
                class="flex-1 ui-button ui-button--primary"
                type="button"
              >
                Далее →
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppContainer>
  </AppSection>

  <!-- FAQ SECTION -->
  <AppSection>
    <AppContainer>
      <div class="mb-16 text-center">
        <h2 class="text-3xl sm:text-4xl lg:text-5xl font-semibold text-zinc-900 mb-4">
          Ответы на вопросы
        </h2>
        <p class="text-base sm:text-lg text-zinc-700 max-w-2xl mx-auto">
          Найдите ответ на ваш вопрос или оставьте заявку прямо сейчас
        </p>
      </div>

      <div class="space-y-4 max-w-3xl mx-auto">
        <div
          v-for="item in faqItems"
          :key="item.id"
          class="group rounded-2xl border-2 border-zinc-300 bg-white hover:border-teal-600 hover:shadow-lg hover:shadow-teal-500/10 overflow-hidden transition-all duration-300"
        >
          <button
            class="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-zinc-50 transition-colors"
            @click="toggleFaq(item.id)"
          >
            <span class="text-base sm:text-lg font-semibold text-zinc-900 pr-4">
              {{ item.question }}
            </span>
            <span
              class="shrink-0 flex items-center justify-center w-6 h-6 rounded-full border-2 border-zinc-400 text-zinc-600 transition-all duration-300 group-hover:border-teal-600 group-hover:text-teal-600"
              :class="activeFaqIds.has(item.id) ? 'rotate-45 border-teal-600 text-teal-600 bg-teal-50' : ''"
            >
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                viewBox="0 0 24 24"
              >
                <path
                  v-if="activeFaqIds.has(item.id)"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
                <path
                  v-else
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </span>
          </button>

          <transition
            enter-active-class="transition-all duration-300 ease-out"
            leave-active-class="transition-all duration-300 ease-in"
            enter-from-class="opacity-0 -translate-y-2"
            enter-to-class="opacity-100 translate-y-0"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 -translate-y-2"
          >
            <div v-if="activeFaqIds.has(item.id)" class="px-6 pb-4">
              <div class="pt-3 border-t border-zinc-200">
                <p class="text-sm sm:text-base text-zinc-700 leading-relaxed">
                  {{ item.answer }}
                </p>
              </div>
            </div>
          </transition>
        </div>

        <!-- Contact Block with links -->
        <div class="mt-8 p-8 rounded-3xl border-2 border-teal-600 bg-teal-50">
          <h3 class="text-2xl font-semibold text-zinc-900 mb-2">
            Не нашли ответ?
          </h3>
          <p class="text-zinc-700 mb-6">
            Свяжитесь с нашей командой прямо сейчас — мы ответим на все вопросы!
          </p>
          
          <div class="space-y-4">
  <!-- Quick Contact Links -->
        <div class="flex flex-wrap gap-3 mb-6">
          <a
            href="https://t.me/vfddoors74"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-sm sm:text-base transition-all font-semibold"
          >
            <img
              src="@/assets/icons/tg-icon.svg"
              alt="Telegram"
              class="h-5 w-5"
            />
            Telegram
          </a>
        </div>
      </div>


            <!-- Divider -->
            <div class="relative mb-6">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-teal-200"></div>
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="px-2 bg-teal-50 text-zinc-600 font-medium">или заполните форму</span>
              </div>
            </div>

            <!-- Quick Contact Form -->
            <form @submit.prevent="handleContactSubmit" class="space-y-3">
              <input
                v-model="quickContact.name"
                type="text"
                placeholder="Ваше имя"
                required
                class="w-full rounded-lg px-3 py-2 text-sm bg-white border-2 border-teal-200 text-zinc-900 placeholder:text-zinc-500 focus:outline-none focus:border-teal-600 transition-all"
                :disabled="quickContact.isSubmitting"
              />

              <input
                :value="quickContact.phone"
                @input="onQuickPhoneInput"
                type="tel"
                placeholder="+7 (___) ___-__-__"
                required
                class="w-full rounded-lg px-3 py-2 text-sm bg-white border-2 border-teal-200 text-zinc-900 placeholder:text-zinc-500 focus:outline-none focus:border-teal-600 transition-all"
                :disabled="quickContact.isSubmitting"
              />

              <button
                type="submit"
                class="w-full py-2 rounded-lg px-4 font-semibold text-white bg-teal-600 border-2 border-teal-600 transition-all duration-300 hover:bg-teal-700 hover:border-teal-700 active:bg-teal-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                :disabled="quickContact.isSubmitting"
              >
                <span v-if="quickContact.isSubmitting" class="flex items-center justify-center gap-2">
                  <svg class="w-3 h-3 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Отправка...
                </span>
                <span v-else>Отправить контакты</span>
              </button>
            </form>
          </div>
        </div>
    </AppContainer>
  </AppSection>
  </div>
</template>

<style scoped>
.slider-dot {
  appearance: none;
  border: none;
  padding: 0;
  background: transparent;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition: all 180ms cubic-bezier(0.4, 0, 0.2, 1);
  display: inline-block;
  width: clamp(0.375rem, 1.5vw, 0.5rem);
  height: clamp(0.375rem, 1.5vw, 0.5rem);
  border-radius: 9999px;
  background-color: rgba(255, 255, 255, 0.5);
}

.slider-dot--active {
  background-color: white;
  width: clamp(1.5rem, 5vw, 2rem);
  height: clamp(0.375rem, 1.5vw, 0.5rem);
}

.slider-dot:hover:not(.slider-dot--active) {
  background-color: rgba(255, 255, 255, 0.7);
}

.slider-dot:focus {
  outline: none;
  box-shadow: 0 0 0 0.1875rem rgba(255, 255, 255, 0.2);
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background-color: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  overflow-y: auto;
  backdrop-filter: blur(4px);
}

.modal-container {
  position: relative;
  background: white;
  border-radius: 1.5rem;
  max-width: 56rem;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.color-zoom-container {
  position: relative;
  background: white;
  border-radius: 1.5rem;
  max-width: 90vw;
  max-height: 90vh;
  width: auto;
  height: auto;
  overflow: hidden;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 9999px;
  background-color: white;
  border: 2px solid #e5e7eb;
  cursor: pointer;
  transition: all 0.2s;
  color: #1f2937;
}

.modal-close:hover {
  background-color: #1f2937;
  border-color: #1f2937;
  color: white;
}

.modal-header {
  padding: 2rem;
  border-bottom: 2px solid #f3f4f6;
}

.modal-content {
  padding: 2rem;
  display: grid;
  gap: 2rem;
}

.modal-navigation {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 2rem;
  border-top: 2px solid #f3f4f6;
  background-color: #fafafa;
  border-radius: 0 0 1.5rem 1.5rem;
}

.nav-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: white;
  background-color: #14b8a6;
  border: 2px solid #14b8a6;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
}

.nav-button:hover {
  background-color: #0d9488;
  border-color: #0d9488;
}

.modal-dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 9999px;
  background-color: #d1d5db;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  padding: 0;
}

.modal-dot--active {
  background-color: #14b8a6;
  width: 1.5rem;
}

.modal-dot:hover:not(.modal-dot--active) {
  background-color: #9ca3af;
}

.schema-dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 9999px;
  background-color: #d1d5db;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  padding: 0;
}

.schema-dot--active {
  background-color: #14b8a6;
  width: 1.5rem;
}

.schema-dot:hover:not(.schema-dot--active) {
  background-color: #9ca3af;
}

/* Modal Transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container,
.modal-enter-active .color-zoom-container,
.modal-leave-active .color-zoom-container {
  transition: transform 0.3s ease;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container,
.modal-enter-from .color-zoom-container,
.modal-leave-to .color-zoom-container {
  transform: scale(0.95);
}

/* Smooth scroll behavior */
.scroll-smooth {
  scroll-behavior: smooth;
}

/* Hide scrollbar but keep functionality */
.overflow-x-auto::-webkit-scrollbar {
  height: 4px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 2px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.4);
}

/* Custom scrollbar for modal */
.modal-container::-webkit-scrollbar {
  width: 8px;
}

.modal-container::-webkit-scrollbar-track {
  background: #f3f4f6;
}

.modal-container::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 4px;
}

.modal-container::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .modal-container {
    margin: 0.5rem;
    max-height: 95vh;
    border-radius: 1rem;
  }

  .color-zoom-container {
    max-width: 95vw;
    max-height: 95vh;
    border-radius: 1rem;
  }

  .modal-header,
  .modal-content {
    padding: 1.5rem;
  }

  .modal-navigation {
    padding: 1rem 1.5rem;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .nav-button span {
    display: none;
  }

  .modal-close {
    top: 0.5rem;
    right: 0.5rem;
    width: 2rem;
    height: 2rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms;
    animation-iteration-count: 1;
    transition-duration: 0.01ms; 
  }
}
</style>