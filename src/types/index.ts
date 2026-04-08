/**
 * Центральное хранилище всех типов проекта
 * @see https://vuejs.org/guide/typescript/overview.html
 */

// ============================================
// DOMAIN: Doors & Products
// ============================================
export interface Door {
  id: number
  name: string
  series: string
  cover: string
  price: number
  image: string
  images: string[]
  colors: Color[]
  description: string
  material: string
  filling: string
  thickness: string
  sizes: Size[]
  tags: Tag[]
  isNew?: boolean
  isPopular?: boolean
  isFavorite?: boolean
}

export interface Color {
  id?: number
  name: string
  image: string
  code?: string
  type?: ColorType
  price?: number
}

export type ColorType = 
  | 'solid'        // Однотонные
  | 'wood'         // Под дерево
  | 'metal'        // Под металл
  | 'custom'       // Индивидуальные

export interface Size {
  width: number
  height: number
  price?: number
}

export type Tag = 
  | 'new'
  | 'popular'
  | 'sale'
  | 'eco'
  | 'premium'
  | 'budget'

// ============================================
// DOMAIN: Series
// ============================================
export interface Series {
  id: string
  name: string
  slug: string
  description: string
  coverImage: string
  images: string[]
  features: string[]
  priceFrom: number
  colors: Color[]
  isAvailable: boolean
  deliveryTime: string
}

export interface SeriesCollection {
  id: string
  title: string
  description: string
  image: string
  series: Series[]
}

// ============================================
// DOMAIN: Partitions (Алюминиевые перегородки)
// ============================================
export interface Partition {
  id: number
  name: string
  type: PartitionType
  profile: ProfileOption
  color: Color
  sizes: PartitionSize[]
  price: number
  images: string[]
  description: string
  features: string[]
}

export type PartitionType = 
  | 'sliding'       // Раздвижные
  | 'hinged'        // Распашные
  | 'fixed'         // Глухие
  | 'combined'      // Комбинированные

export interface ProfileOption {
  id: number
  name: string
  image: string
  description: string
  colors: Color[]
  sizes: string[]
}

export interface PartitionSize {
  width: { min: number; max: number }
  height: { min: number; max: number }
  glassThickness: number[]
}

// ============================================
// DOMAIN: Portfolio
// ============================================
export interface PortfolioProject {
  id: number
  title: string
  description: string
  category: PortfolioCategory
  images: string[]
  coverImage: string
  location?: string
  date?: string
  area?: number
  budget?: number
  products: Door[]
}

export type PortfolioCategory = 
  | 'doors'
  | 'partitions'
  | 'combined'
  | 'commercial'
  | 'residential'

// ============================================
// DOMAIN: Articles & Content
// ============================================
export interface Article {
  id: number
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage: string
  images: string[]
  author: string
  publishedAt: string
  updatedAt: string
  tags: string[]
  category: ArticleCategory
  seoTitle?: string
  seoDescription?: string
}

export type ArticleCategory = 
  | 'guide'         // Руководства
  | 'trends'        // Тренды
  | 'comparison'    // Сравнения
  | 'installation'  // Монтаж
  | 'maintenance'   // Уход

// ============================================
// DOMAIN: Common
// ============================================
export interface Image {
  url: string
  alt: string
  width?: number
  height?: number
  thumbnail?: string
}

export interface Link {
  text: string
  url: string
  external?: boolean
  icon?: string
}

export interface SocialLink {
  name: string
  url: string
  icon: string
  label: string
}

export interface ContactInfo {
  phones: string[]
  email: string
  address: string
  workTime: string
  socials: SocialLink[]
}

// ============================================
// DOMAIN: UI Components
// ============================================
export interface BreadcrumbItem {
  label: string
  path?: string
  isActive?: boolean
}

export interface TabItem {
  id: string
  label: string
  icon?: string
  disabled?: boolean
}

export interface MenuItem {
  label: string
  path: string
  icon?: string
  children?: MenuItem[]
  external?: boolean
}

// ============================================
// DOMAIN: Forms
// ============================================
export interface FormData {
  name: string
  phone: string
  email?: string
  message?: string
  source: string
}

export interface FormResult {
  success: boolean
  error?: string
  data?: unknown
}

// ============================================
// DOMAIN: API
// ============================================
export interface ApiResponse<T = unknown> {
  data: T
  error?: string
  message?: string
}

export interface PaginationParams {
  page: number
  limit: number
  total: number
}

export interface FilterParams {
  search?: string
  series?: string[]
  colors?: string[]
  tags?: Tag[]
  priceMin?: number
  priceMax?: number
  sort?: SortOption
}

export type SortOption = 
  | 'price-asc'
  | 'price-desc'
  | 'name-asc'
  | 'name-desc'
  | 'newest'
  | 'popular'

// ============================================
// DOMAIN: SEO
// ============================================
export interface SeoMeta {
  title: string
  description: string
  keywords?: string[]
  ogImage?: string
  canonical?: string
  noIndex?: boolean
}

// ============================================
// DOMAIN: Layout
// ============================================
export interface SectionProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  id?: string
}

export interface ContainerProps {
  size?: 'sm' | 'md' | 'lg' | 'full'
  className?: string
}
