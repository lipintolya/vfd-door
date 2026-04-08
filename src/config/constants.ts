/**
 * Глобальные константы приложения
 * Центральное хранилище всех магических значений
 */

// ============================================
// API & External Services
// ============================================
export const TELEGRAM_URL = 'https://t.me/vfddoors74'
export const TELEGRAM_SUPPORT_URL = 'https://t.me/vfddoors174'
export const VK_URL = 'https://vk.com/vfddoors174'

export const YANDEX_METRICA_ID = import.meta.env.YANDEX_METRICA_ID || '00000000'
export const FORM_SECRET_TOKEN = import.meta.env.VITE_FORM_SECRET_TOKEN || ''

// Supabase
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || ''
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Yandex Cloud Storage
export const STORAGE_BASE_URL = 'https://storage.yandexcloud.net/catalog-vfd'

// ============================================
// Company Info
// ============================================
export const COMPANY = {
  name: 'VFD Doors',
  fullName: 'ВФД на Кашириных',
  address: 'Челябинск, улица Братьев Кашириных, 131Б',
  addressShort: 'ул. Братьев Кашириных, 131Б',
  phones: ['+7 (900) 029-78-88', '+7 (963) 080-78-88'],
  phoneRaw: ['+79000297888', '+79630807888'],
  email: 'vfddoors74@mail.ru',
  workTime: {
    weekday: { open: 10, close: 20, label: 'Пн–Пт: 10:00 – 20:00' },
    weekend: { open: 10, close: 18, label: 'Сб-Вс: 10:00 – 18:00' },
  },
  since: 2014,
} as const

// ============================================
// Navigation
// ============================================
export const MAIN_NAVIGATION = [
  { label: 'Главная', path: '/' },
  { label: 'Каталог', path: '/catalog' },
  { label: 'Перегородки', path: '/partitions' },
  { label: 'Портфолио', path: '/portfolio' },
  { label: 'О компании', path: '/about' },
] as const

export const CATALOG_NAVIGATION = [
  { label: 'Все двери', path: '/catalog' },
  { label: 'Innova', path: '/catalog?series=innova' },
  { label: 'Linea', path: '/catalog?series=linea' },
  { label: 'Classic', path: '/catalog?series=classic' },
  { label: 'Modern', path: '/catalog?series=modern' },
] as const

// ============================================
// UI Constants
// ============================================
export const UI = {
  // Breakpoints (Tailwind default)
  BREAKPOINTS: {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
  },

  // Spacing
  HEADER_HEIGHT: 72,
  HEADER_GAP: 16,
  FOOTER_HEIGHT: 320,

  // Animations
  ANIMATION_DURATION: {
    fast: 150,
    normal: 300,
    slow: 500,
  },

  // Swipe
  SWIPE_THRESHOLD: 50,

  // Carousel
  AUTOPLAY_DELAY: 7000,

  // Debounce
  DEBOUNCE: {
    search: 300,
    resize: 200,
    scroll: 100,
  },
} as const

// ============================================
// Product Constants
// ============================================
export const PRODUCTS = {
  DEFAULT_COVER: 'interior/Интерьер_1.webp',
  DEFAULT_SERIES: 'innova/Иннова',
  ITEMS_PER_PAGE: 12,
  MAX_FAVORITES: 50,
} as const

// ============================================
// SEO Defaults
// ============================================
export const SEO_DEFAULTS = {
  title: 'VFD Doors — Двери и перегородки в Челябинске',
  description:
    'Фирменный салон интерьерных решений VFD на Кашириных. Межкомнатные двери, алюминиевые перегородки от официального дилера. Изготовление, монтаж, гарантия.',
  keywords: [
    'двери Челябинск',
    'межкомнатные двери',
    'алюминиевые перегородки',
    'VFD Doors',
    'двери на Кашириных',
  ],
  ogImage: '/og-image.jpg',
  twitterHandle: '@vfddoors',
} as const

// ============================================
// Local Storage Keys
// ============================================
export const STORAGE_KEYS = {
  FAVORITES: 'vfd_favorites',
  CART: 'vfd_cart',
  FILTERS: 'vfd_filters',
  NOTICE_DISMISSED: 'site-notice-dismissed',
} as const

// ============================================
// Events
// ============================================
export const EVENTS = {
  BANNER_DISMISSED: 'banner-dismissed',
  MODAL_OPEN: 'modal-open',
  MODAL_CLOSE: 'modal-close',
} as const

// ============================================
// CSS Custom Properties
// ============================================
export const CSS_VARS = {
  HEADER_HEIGHT: '--header-height',
  HAS_BANNER: '--has-banner',
} as const
