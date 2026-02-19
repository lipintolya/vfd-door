<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import AppSection from '@/components/layout/AppSection.vue'
import AppContainer from '@/components/layout/AppContainer.vue'

/* ============================================
   ТИПЫ
============================================ */
export interface PortfolioWork {
  id: string
  title: string
  description: string
  location: string
  date: string
  images: string[]  // Массив изображений для галереи
  productType: 'door' | 'partition' | 'entrance'
  series?: string
  budget?: string
  area?: number
}

/* ============================================
   ДАННЫЕ ПОРТФОЛИО (30+ работ)
============================================ */
const portfolioWorks: PortfolioWork[] = [
  {
    id: '1',
    title: 'Раздвижные двери в ЖК "Ньютон"',
    description: 'Установка раздвижных дверей серии Uno в интерьере современной гостиной',
    location: 'Челябинск, ЖК "Ньютон"',
    date: '2025-02-10',
    images: [
      'https://storage.yandexcloud.net/catalog-vfd/portfolio/works/001.webp',
      'https://storage.yandexcloud.net/catalog-vfd/portfolio/works/001-2.webp',
      'https://storage.yandexcloud.net/catalog-vfd/portfolio/works/001-3.webp',
    ],
    productType: 'door',
    series: 'Uno',
    area: 45,
  },
  {
    id: '2',
    title: 'Алюминиевые перегородки в офисе',
    description: 'Зонирование офисного пространства с помощью перегородок ГРАФ101',
    location: 'Челябинск, БЦ "Гринвич"',
    date: '2025-02-08',
    images: [
      'https://storage.yandexcloud.net/catalog-vfd/portfolio/works/002.webp',
      'https://storage.yandexcloud.net/catalog-vfd/portfolio/works/002-2.webp',
    ],
    productType: 'partition',
    series: 'ГРАФ101',
    area: 120,
  },
  {
    id: '3',
    title: 'Двери в эмали для квартиры',
    description: 'Монтаж дверей Erica в цвете эмаль для спальной комнаты',
    location: 'Челябинск, ул. Кирова',
    date: '2025-02-05',
    images: [
      'https://storage.yandexcloud.net/catalog-vfd/portfolio/works/003.webp',
      'https://storage.yandexcloud.net/catalog-vfd/portfolio/works/003-2.webp',
      'https://storage.yandexcloud.net/catalog-vfd/portfolio/works/003-3.webp',
      'https://storage.yandexcloud.net/catalog-vfd/portfolio/works/003-4.webp',
    ],
    productType: 'door',
    series: 'Erica',
    area: 38,
  },
  {
    id: '4',
    title: 'Входная группа в ресторан',
    description: 'Установка входных дверей с терморазрывом в ресторанном комплексе',
    location: 'Челябинск, ресторан "Оливия"',
    date: '2025-02-01',
    images: [
      'https://storage.yandexcloud.net/catalog-vfd/portfolio/works/004.webp',
      'https://storage.yandexcloud.net/catalog-vfd/portfolio/works/004-2.webp',
    ],
    productType: 'entrance',
    area: 25,
  },
  {
    id: '5',
    title: 'Invisible двери в гардеробную',
    description: 'Скрытые двери под покраску в интерьере гардеробной',
    location: 'Челябинск, ЖК "Александровский"',
    date: '2025-01-28',
    images: [
      'https://storage.yandexcloud.net/catalog-vfd/portfolio/works/005.webp',
      'https://storage.yandexcloud.net/catalog-vfd/portfolio/works/005-2.webp',
      'https://storage.yandexcloud.net/catalog-vfd/portfolio/works/005-3.webp',
    ],
    productType: 'door',
    series: 'Invisible',
    area: 12,
  },
  {
    id: '6',
    title: 'Перегородки в коворкинге',
    description: 'Остекление переговорных комнат алюминиевыми перегородками',
    location: 'Челябинск, коворкинг "Точка"',
    date: '2025-01-25',
    images: [
      'https://storage.yandexcloud.net/catalog-vfd/portfolio/works/006.webp',
      'https://storage.yandexcloud.net/catalog-vfd/portfolio/works/006-2.webp',
    ],
    productType: 'partition',
    series: 'ГРАФ102',
    area: 85,
  },
  {
    id: '7',
    title: 'Двери Loft в студию',
    description: 'Установка дверей в стиле Loft с матовым стеклом',
    location: 'Челябинск, ул. Свободы',
    date: '2025-01-20',
    images: [
      'https://storage.yandexcloud.net/catalog-vfd/portfolio/works/007.webp',
      'https://storage.yandexcloud.net/catalog-vfd/portfolio/works/007-2.webp',
    ],
    productType: 'door',
    series: 'Loft',
    area: 52,
  },
  {
    id: '8',
    title: 'Emalex двери в детскую',
    description: 'Экологичные двери с покрытием Emalex для детской комнаты',
    location: 'Копейск, ул. Молодёжная',
    date: '2025-01-15',
    images: [
      'https://storage.yandexcloud.net/catalog-vfd/portfolio/works/008.webp',
      'https://storage.yandexcloud.net/catalog-vfd/portfolio/works/008-2.webp',
    ],
    productType: 'door',
    series: 'Emalex',
    area: 18,
  },
  {
    id: '9',
    title: 'Входные двери в коттедж',
    description: 'Установка двухконтурных входных дверей с терморазрывом',
    location: 'Челябинская обл., пос. Рощино',
    date: '2025-01-10',
    images: [
      'https://storage.yandexcloud.net/catalog-vfd/portfolio/works/009.webp',
      'https://storage.yandexcloud.net/catalog-vfd/portfolio/works/009-2.webp',
    ],
    productType: 'entrance',
    area: 35,
  },
  {
    id: '10',
    title: 'Раздвижная система в кухню',
    description: 'Компактная раздвижная дверь между кухней и гостиной',
    location: 'Челябинск, ЖК "Челябинск-Сити"',
    date: '2025-01-05',
    images: [
      'https://storage.yandexcloud.net/catalog-vfd/portfolio/works/010.webp',
      'https://storage.yandexcloud.net/catalog-vfd/portfolio/works/010-2.webp',
    ],
    productType: 'door',
    series: 'Uno',
    area: 28,
  },
  {
    id: '11',
    title: 'Перегородка в ванной',
    description: 'Влагостойкая перегородка для душевой зоны',
    location: 'Челябинск, ул. Труда',
    date: '2024-12-28',
    images: [
      'https://storage.yandexcloud.net/catalog-vfd/portfolio/works/011.webp',
      'https://storage.yandexcloud.net/catalog-vfd/portfolio/works/011-2.webp',
    ],
    productType: 'partition',
    series: 'ГРАФ103',
    area: 8,
  },
  {
    id: '12',
    title: 'Двери StrongFlex в прихожую',
    description: 'Износостойкие двери с покрытием StrongFlex для прихожей',
    location: 'Магнитогорск, пр. Ленина',
    date: '2024-12-22',
    images: [
      'https://storage.yandexcloud.net/catalog-vfd/portfolio/works/012.webp',
      'https://storage.yandexcloud.net/catalog-vfd/portfolio/works/012-2.webp',
    ],
    productType: 'door',
    series: 'StrongFlex',
    area: 22,
  },
  {
    id: '13',
    title: 'Офисные перегородки',
    description: 'Модульные перегородки для open-space офиса',
    location: 'Челябинск, БЦ "Александровский"',
    date: '2024-12-18',
    images: [
      'https://storage.yandexcloud.net/catalog-vfd/portfolio/works/013.webp',
      'https://storage.yandexcloud.net/catalog-vfd/portfolio/works/013-2.webp',
    ],
    productType: 'partition',
    series: 'ГРАФ101',
    area: 150,
  },
  {
    id: '14',
    title: 'Двери в классическом стиле',
    description: 'Массив дуба с патиной для классического интерьера',
    location: 'Челябинск, пос. Западный Луч',
    date: '2024-12-12',
    images: [
      'https://storage.yandexcloud.net/catalog-vfd/portfolio/works/014.webp',
      'https://storage.yandexcloud.net/catalog-vfd/portfolio/works/014-2.webp',
    ],
    productType: 'door',
    series: 'Classic',
    area: 65,
  },
  {
    id: '15',
    title: 'Входная группа в магазин',
    description: 'Алюминиевые входные группы с остеклением',
    location: 'Челябинск, ТРК "Галактика"',
    date: '2024-12-08',
    images: [
      'https://storage.yandexcloud.net/catalog-vfd/portfolio/works/015.webp',
      'https://storage.yandexcloud.net/catalog-vfd/portfolio/works/015-2.webp',
    ],
    productType: 'entrance',
    area: 42,
  },
  {
    id: '16',
    title: 'Двери-книжка в гардеробную',
    description: 'Компактная система складных дверей для гардеробной',
    location: 'Челябинск, ул. Воровского',
    date: '2024-12-01',
    images: [
      'https://storage.yandexcloud.net/catalog-vfd/portfolio/works/016.webp',
      'https://storage.yandexcloud.net/catalog-vfd/portfolio/works/016-2.webp',
    ],
    productType: 'door',
    series: 'Book',
    area: 15,
  },
  {
    id: '17',
    title: 'Перегородка в студии',
    description: 'Зонирование студии-лофта стеклянной перегородкой',
    location: 'Челябинск, ЖК "Король Плаза"',
    date: '2024-11-25',
    images: [
      'https://storage.yandexcloud.net/catalog-vfd/portfolio/works/017.webp',
      'https://storage.yandexcloud.net/catalog-vfd/portfolio/works/017-2.webp',
    ],
    productType: 'partition',
    series: 'ГРАФ102',
    area: 55,
  },
  {
    id: '18',
    title: 'Двери в современном стиле',
    description: 'Минималистичные двери без наличников для современного интерьера',
    location: 'Челябинск, ЖК "Ньютон 2.0"',
    date: '2024-11-20',
    images: [
      'https://storage.yandexcloud.net/catalog-vfd/portfolio/works/018.webp',
      'https://storage.yandexcloud.net/catalog-vfd/portfolio/works/018-2.webp',
    ],
    productType: 'door',
    series: 'Innova',
    area: 48,
  },
  {
    id: '19',
    title: 'Входные двери в подъезд',
    description: 'Антивандальные входные двери с кодовым замком',
    location: 'Челябинск, ул. Коммуны',
    date: '2024-11-15',
    images: [
      'https://storage.yandexcloud.net/catalog-vfd/portfolio/works/019.webp',
      'https://storage.yandexcloud.net/catalog-vfd/portfolio/works/019-2.webp',
    ],
    productType: 'entrance',
    area: 30,
  },
  {
    id: '20',
    title: 'Двери с остеклением',
    description: 'Двери с триплекс-стеклом для гостиной',
    location: 'Златоуст, ул. Таганайская',
    date: '2024-11-10',
    images: [
      'https://storage.yandexcloud.net/catalog-vfd/portfolio/works/020.webp',
      'https://storage.yandexcloud.net/catalog-vfd/portfolio/works/020-2.webp',
    ],
    productType: 'door',
    series: 'Vetro',
    area: 35,
  },
  {
    id: '21',
    title: 'Перегородка в спальню',
    description: 'Раздвижная перегородка для зонирования спальни',
    location: 'Челябинск, ул. Молодогвардейцев',
    date: '2024-11-05',
    images: [
      'https://storage.yandexcloud.net/catalog-vfd/portfolio/works/021.webp',
      'https://storage.yandexcloud.net/catalog-vfd/portfolio/works/021-2.webp',
    ],
    productType: 'partition',
    series: 'ГРАФ101',
    area: 32,
  },
  {
    id: '22',
    title: 'Двери в ванную',
    description: 'Влагостойкие двери с покрытием Emalex для ванной',
    location: 'Челябинск, пос. АМЗ',
    date: '2024-10-28',
    images: [
      'https://storage.yandexcloud.net/catalog-vfd/portfolio/works/022.webp',
      'https://storage.yandexcloud.net/catalog-vfd/portfolio/works/022-2.webp',
    ],
    productType: 'door',
    series: 'Emalex',
    area: 12,
  },
  {
    id: '23',
    title: 'Входная дверь в частный дом',
    description: 'Тёплая входная дверь с зеркальным покрытием',
    location: 'Челябинская обл., СНТ "Лесное"',
    date: '2024-10-22',
    images: [
      'https://storage.yandexcloud.net/catalog-vfd/portfolio/works/023.webp',
      'https://storage.yandexcloud.net/catalog-vfd/portfolio/works/023-2.webp',
    ],
    productType: 'entrance',
    area: 28,
  },
  {
    id: '24',
    title: 'Двери в кабинет',
    description: 'Солидные двери из массива для домашнего кабинета',
    location: 'Челябинск, ул. Пушкина',
    date: '2024-10-18',
    images: [
      'https://storage.yandexcloud.net/catalog-vfd/portfolio/works/024.webp',
      'https://storage.yandexcloud.net/catalog-vfd/portfolio/works/024-2.webp',
    ],
    productType: 'door',
    series: 'Classic',
    area: 20,
  },
  {
    id: '25',
    title: 'Перегородка в ресторане',
    description: 'Декоративная перегородка с тонированным стеклом',
    location: 'Челябинск, ресторан "Белая лошадь"',
    date: '2024-10-12',
    images: [
      'https://storage.yandexcloud.net/catalog-vfd/portfolio/works/025.webp',
      'https://storage.yandexcloud.net/catalog-vfd/portfolio/works/025-2.webp',
    ],
    productType: 'partition',
    series: 'ГРАФ103',
    area: 45,
  },
  {
    id: '26',
    title: 'Двери в гостиную',
    description: 'Широкие двустворчатые двери для просторной гостиной',
    location: 'Челябинск, ЖК "Парковый"',
    date: '2024-10-08',
    images: [
      'https://storage.yandexcloud.net/catalog-vfd/portfolio/works/026.webp',
      'https://storage.yandexcloud.net/catalog-vfd/portfolio/works/026-2.webp',
    ],
    productType: 'door',
    series: 'Erica',
    area: 58,
  },
  {
    id: '27',
    title: 'Входная группа в отель',
    description: 'Панорамные входные двери для гостиничного комплекса',
    location: 'Челябинск, гостиница "Южный Урал"',
    date: '2024-10-01',
    images: [
      'https://storage.yandexcloud.net/catalog-vfd/portfolio/works/027.webp',
      'https://storage.yandexcloud.net/catalog-vfd/portfolio/works/027-2.webp',
    ],
    productType: 'entrance',
    area: 65,
  },
  {
    id: '28',
    title: 'Двери-невидимки',
    description: 'Скрытые двери под покраску в коридоре',
    location: 'Челябинск, ул. Лесная',
    date: '2024-09-25',
    images: [
      'https://storage.yandexcloud.net/catalog-vfd/portfolio/works/028.webp',
      'https://storage.yandexcloud.net/catalog-vfd/portfolio/works/028-2.webp',
    ],
    productType: 'door',
    series: 'Invisible',
    area: 25,
  },
  {
    id: '29',
    title: 'Перегородка в фитнес-зал',
    description: 'Звукоизолирующая перегородка для фитнес-зоны',
    location: 'Челябинск, ФК "Атлант"',
    date: '2024-09-20',
    images: [
      'https://storage.yandexcloud.net/catalog-vfd/portfolio/works/029.webp',
      'https://storage.yandexcloud.net/catalog-vfd/portfolio/works/029-2.webp',
    ],
    productType: 'partition',
    series: 'ГРАФ102',
    area: 78,
  },
  {
    id: '30',
    title: 'Двери в кухню-гостиную',
    description: 'Раздвижная система для объединения кухни и гостиной',
    location: 'Челябинск, ЖК "Тургояк"',
    date: '2024-09-15',
    images: [
      'https://storage.yandexcloud.net/catalog-vfd/portfolio/works/030.webp',
      'https://storage.yandexcloud.net/catalog-vfd/portfolio/works/030-2.webp',
    ],
    productType: 'door',
    series: 'Uno',
    area: 42,
  },
  {
    id: '31',
    title: 'Входные двери в банк',
    description: 'Бронированные входные двери для банковского отделения',
    location: 'Челябинск, пр. Ленина',
    date: '2024-09-10',
    images: [
      'https://storage.yandexcloud.net/catalog-vfd/portfolio/works/031.webp',
      'https://storage.yandexcloud.net/catalog-vfd/portfolio/works/031-2.webp',
    ],
    productType: 'entrance',
    area: 40,
  },
  {
    id: '32',
    title: 'Двери в стиле модерн',
    description: 'Двери с витражным остеклением для стиля модерн',
    location: 'Челябинск, ул. Вайнера',
    date: '2024-09-05',
    images: [
      'https://storage.yandexcloud.net/catalog-vfd/portfolio/works/032.webp',
      'https://storage.yandexcloud.net/catalog-vfd/portfolio/works/032-2.webp',
    ],
    productType: 'door',
    series: 'Art',
    area: 33,
  },
]

/* ============================================
   STATE
============================================ */
const router = useRouter()
const currentIndex = ref(0)
const isAnimating = ref(false)
const touchStartX = ref(0)
const touchStartY = ref(0)
const autoplayTimer = ref<number | null>(null)
const imageLoaded = ref<Set<string>>(new Set())
const imageError = ref<Set<string>>(new Set())
// Состояние мини-слайдера для каждой карточки
const cardImageIndex = ref<Record<string, number>>({})

/* ============================================
   COMPUTED
============================================ */
const totalWorks = computed(() => portfolioWorks.length)

const visibleWorks = computed(() => {
  const len = portfolioWorks.length
  if (!len) return []

  const result: PortfolioWork[] = []
  for (let i = 0; i < 3; i++) {
    const idx = ((currentIndex.value + i) % len + len) % len
    const work = portfolioWorks[idx]
    if (work) result.push(work)
  }
  return result
})

const productTypeLabels: Record<PortfolioWork['productType'], string> = {
  door: 'Двери',
  partition: 'Перегородки',
  entrance: 'Входные группы',
}

const productTypeIcons: Record<PortfolioWork['productType'], string> = {
  door: '🚪',
  partition: '🪟',
  entrance: '🏢',
}

/* ============================================
   НАВИГАЦИЯ
============================================ */
const goTo = (index: number) => {
  if (isAnimating.value || !portfolioWorks.length) return
  isAnimating.value = true

  const len = portfolioWorks.length
  const newIndex = ((index % len) + len) % len
  currentIndex.value = newIndex

  setTimeout(() => (isAnimating.value = false), 400)
}

const next = () => goTo(currentIndex.value + 1)
const prev = () => goTo(currentIndex.value - 1)

/* ============================================
   АВТОПЛЕЙ
============================================ */
const startAutoplay = () => {
  if (autoplayTimer.value) return
  autoplayTimer.value = window.setInterval(next, 4000)
}

const stopAutoplay = () => {
  if (autoplayTimer.value) {
    clearInterval(autoplayTimer.value)
    autoplayTimer.value = null
  }
}

const pauseAutoplay = () => stopAutoplay()
const resumeAutoplay = () => startAutoplay()

/* ============================================
   СВАЙП
============================================ */
const handleTouchStart = (e: TouchEvent) => {
  if (!e.touches?.[0]) return
  touchStartX.value = e.touches[0].clientX
  touchStartY.value = e.touches[0].clientY
}

const handleTouchEnd = (e: TouchEvent) => {
  if (!e.changedTouches?.[0]) return
  const dx = touchStartX.value - e.changedTouches[0].clientX
  const dy = touchStartY.value - e.changedTouches[0].clientY
  if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
    dx > 0 ? next() : prev()
  }
}

/* ============================================
   IMAGE HANDLERS
============================================ */
const handleImageLoad = (workId: string) => {
  imageLoaded.value.add(workId)
}

const handleImageError = (workId: string) => {
  imageError.value.add(workId)
}

/* ============================================
   MINI SLIDER ДЛЯ КАРТОЧКИ
============================================ */
const getCardImageIndex = (workId: string): number => {
  return cardImageIndex.value[workId] ?? 0
}

const nextCardImage = (workId: string, imagesCount: number, event: Event) => {
  event.stopPropagation()
  const currentIdx = cardImageIndex.value[workId] ?? 0
  cardImageIndex.value[workId] = (currentIdx + 1) % imagesCount
}

const prevCardImage = (workId: string, imagesCount: number, event: Event) => {
  event.stopPropagation()
  const currentIdx = cardImageIndex.value[workId] ?? 0
  cardImageIndex.value[workId] = (currentIdx - 1 + imagesCount) % imagesCount
}

const handleCardTouchStart = (e: TouchEvent, _workId: string) => {
  if (!e.touches?.[0]) return
  touchStartX.value = e.touches[0].clientX
}

const handleCardTouchEnd = (e: TouchEvent, workId: string, imagesCount: number) => {
  if (!e.changedTouches?.[0]) return
  const dx = touchStartX.value - e.changedTouches[0].clientX
  if (Math.abs(dx) > 50) {
    dx > 0 ? nextCardImage(workId, imagesCount, e) : prevCardImage(workId, imagesCount, e)
  }
}

/* ============================================
   ФОРМАТТЕРЫ
============================================ */
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

/* ============================================
   НАВИГАЦИЯ К ПОЛНОМУ ПОРТФОЛИО
============================================ */
const navigateToPortfolio = () => {
  router.push('/portfolio')
}

/* ============================================
   LIFECYCLE
============================================ */
onMounted(() => {
  startAutoplay()
})

onBeforeUnmount(() => {
  stopAutoplay()
  imageLoaded.value.clear()
  imageError.value.clear()
})
</script>

<template>
  <AppSection size="lg" class="bg-zinc-50">
    <AppContainer>
      <!-- HEADER -->
      <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10 sm:mb-12">
        <div>
          <h2 class="text-3xl sm:text-4xl lg:text-5xl font-semibold text-zinc-900 mb-3">
            Наши работы
          </h2>
          <p class="text-base sm:text-lg text-zinc-600 max-w-2xl">
            Реализованные проекты: от уютных квартир до крупных коммерческих объектов
          </p>
        </div>
        <button
          @click="navigateToPortfolio"
          class="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-teal-600 text-white text-sm font-semibold hover:bg-teal-700 transition-all hover:shadow-lg hover:shadow-teal-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 self-start sm:self-auto"
        >
          <span>Все работы</span>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <!-- EMPTY STATE -->
      <div
        v-if="!totalWorks"
        class="py-16 text-center text-zinc-500 bg-white rounded-2xl border border-zinc-200"
      >
        <svg class="w-16 h-16 mx-auto mb-4 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p class="text-lg font-medium">Портфолио в разработке</p>
        <p class="text-sm mt-1">Скоро здесь появятся наши работы</p>
      </div>

      <!-- SLIDER -->
      <div
        v-else
        class="relative max-w-6xl mx-auto group"
        @mouseenter="pauseAutoplay"
        @mouseleave="resumeAutoplay"
      >
        <div
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 transition-all duration-400"
          :class="isAnimating ? 'opacity-90 scale-[0.99]' : ''"
          @touchstart.passive="handleTouchStart"
          @touchend="handleTouchEnd"
        >
          <div
            v-for="work in visibleWorks"
            :key="work.id"
            class="group/card relative bg-white rounded-2xl overflow-hidden border border-zinc-200 hover:border-teal-300 transition-all duration-300 hover:shadow-xl hover:shadow-teal-100/50 hover:-translate-y-1 cursor-pointer"
            @touchstart.passive="(e) => handleCardTouchStart(e, work.id)"
            @touchend="(e) => handleCardTouchEnd(e, work.id, work.images.length)"
          >
            <!-- IMAGE GALLERY -->
            <div class="relative aspect-[4/3] overflow-hidden bg-zinc-100">
              <!-- Loading State -->
              <div
                v-if="!imageLoaded.has(work.id) && !imageError.has(work.id)"
                class="absolute inset-0 flex items-center justify-center"
              >
                <div class="w-10 h-10 border-2 border-zinc-300 border-t-teal-500 rounded-full animate-spin" />
              </div>

              <!-- Error State -->
              <div
                v-if="imageError.has(work.id)"
                class="absolute inset-0 flex items-center justify-center bg-zinc-100"
              >
                <svg class="w-12 h-12 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>

              <!-- Images Slider -->
              <div
                class="w-full h-full flex transition-transform duration-300 ease-out"
                :style="{ transform: `translateX(-${getCardImageIndex(work.id) * 100}%)` }"
              >
                <img
                  v-for="(img, idx) in work.images"
                  :key="idx"
                  :src="img"
                  :alt="`${work.title} - фото ${idx + 1}`"
                  class="w-full h-full object-cover flex-shrink-0 transition-transform duration-500 group-hover/card:scale-110"
                  loading="lazy"
                  decoding="async"
                  @load="handleImageLoad(work.id)"
                  @error="handleImageError(work.id)"
                />
              </div>

              <!-- Navigation Arrows (show on hover) -->
              <template v-if="work.images.length > 1">
                <!-- Prev Button -->
                <button
                  @click="(e) => prevCardImage(work.id, work.images.length, e)"
                  class="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/90 backdrop-blur-sm border border-zinc-200 shadow-md text-zinc-700 opacity-0 group-hover/card:opacity-100 hover:bg-white hover:text-teal-600 transition-all disabled:opacity-0"
                  :disabled="work.images.length <= 1"
                  aria-label="Предыдущее фото"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <!-- Next Button -->
                <button
                  @click="(e) => nextCardImage(work.id, work.images.length, e)"
                  class="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/90 backdrop-blur-sm border border-zinc-200 shadow-md text-zinc-700 opacity-0 group-hover/card:opacity-100 hover:bg-white hover:text-teal-600 transition-all disabled:opacity-0"
                  :disabled="work.images.length <= 1"
                  aria-label="Следующее фото"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                <!-- Dots Indicator -->
                <div class="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                  <span
                    v-for="(_, idx) in work.images"
                    :key="idx"
                    class="w-1.5 h-1.5 rounded-full transition-all duration-300"
                    :class="getCardImageIndex(work.id) === idx ? 'bg-white w-4' : 'bg-white/50'"
                  />
                </div>

                <!-- Image Counter -->
                <div class="absolute top-3 right-3 flex items-center gap-2">
                  <span
                    v-if="work.series"
                    class="px-3 py-1.5 rounded-full bg-teal-600/95 backdrop-blur-sm text-xs font-semibold text-white shadow-sm"
                  >
                    {{ work.series }}
                  </span>
                  <span class="px-2 py-1 rounded-md bg-black/50 backdrop-blur-sm text-xs font-medium text-white">
                    {{ getCardImageIndex(work.id) + 1 }} / {{ work.images.length }}
                  </span>
                </div>
              </template>

              <!-- Type Badge -->
              <div class="absolute top-3 left-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-sm text-xs font-semibold text-zinc-700 shadow-sm" :class="work.images.length > 1 ? 'mt-0' : ''">
                <span>{{ productTypeIcons[work.productType] }}</span>
                <span>{{ productTypeLabels[work.productType] }}</span>
              </div>
            </div>

            <!-- CONTENT -->
            <div class="p-4 sm:p-5">
              <h3 class="text-base sm:text-lg font-semibold text-zinc-900 mb-2 line-clamp-2 group-hover/card:text-teal-700 transition-colors">
                {{ work.title }}
              </h3>
              <p class="text-sm text-zinc-600 mb-4 line-clamp-2">
                {{ work.description }}
              </p>

              <!-- META -->
              <div class="flex items-center justify-between text-xs text-zinc-500">
                <div class="flex items-center gap-1.5">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span class="truncate">{{ work.location.replace(/,.*$/, '') }}</span>
                </div>
                <div class="flex items-center gap-1.5 shrink-0">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{{ formatDate(work.date) }}</span>
                </div>
              </div>

              <!-- AREA (if available) -->
              <div
                v-if="work.area"
                class="mt-3 pt-3 border-t border-zinc-100 flex items-center gap-1.5 text-xs text-zinc-500"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
                <span>Площадь: {{ work.area }} м²</span>
              </div>
            </div>
          </div>
        </div>

        <!-- NAVIGATION ARROWS -->
        <button
          @click="prev"
          class="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 lg:-translate-x-4 p-2.5 sm:p-3 rounded-full bg-white border border-zinc-200 shadow-lg text-zinc-700 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all hover:bg-teal-50 hover:border-teal-500 hover:text-teal-600 disabled:opacity-30 disabled:cursor-not-allowed z-10"
          :disabled="isAnimating"
          aria-label="Предыдущие работы"
        >
          <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          @click="next"
          class="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 lg:translate-x-4 p-2.5 sm:p-3 rounded-full bg-white border border-zinc-200 shadow-lg text-zinc-700 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all hover:bg-teal-50 hover:border-teal-500 hover:text-teal-600 disabled:opacity-30 disabled:cursor-not-allowed z-10"
          :disabled="isAnimating"
          aria-label="Следующие работы"
        >
          <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <!-- PAGINATION DOTS -->
        <div class="flex justify-center gap-2 mt-8">
          <button
            v-for="(_, idx) in Math.ceil(totalWorks / 3)"
            :key="idx"
            @click="goTo(idx * 3)"
            class="w-2.5 h-2.5 rounded-full transition-all duration-300"
            :class="Math.floor(currentIndex / 3) === idx ? 'bg-teal-600 w-8' : 'bg-zinc-300 hover:bg-zinc-400'"
            :aria-label="`Перейти к странице ${idx + 1}`"
          />
        </div>

        <!-- WORKS COUNTER -->
        <div class="text-center mt-6 text-sm text-zinc-500">
          Показано {{ Math.min(3, totalWorks) }} из {{ totalWorks }} работ
        </div>
      </div>
    </AppContainer>
  </AppSection>
</template>

<style scoped>
/* Line clamp utilities */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  overflow: hidden;
}

/* Hide scrollbar for clean look */
.no-scrollbar {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>
