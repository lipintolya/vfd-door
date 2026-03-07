/**
 * Типы для алюминиевых перегородок
 */

export interface HeroSlide {
  id: number
  image: string
  title: string
  subtitle: string
  description: string
}

export interface Feature {
  id: string
  icon: string
  title: string
  description: string
}

export interface Specification {
  id: string
  title: string
  items: string[]
}

export interface SlidingTypeDetail {
  id: string
  name: string
  description: string
  image: string
  detailImages: string[]
  mountingInfo: string[]
  systemInfo: string[]
  advantages: string[]
}

export interface MountingType {
  id: string
  name: string
  image: string
  description: string
}

export interface ProfileOption {
  id: number | string
  code?: string
  name: string
  description: string
  image: string
  colors?: string[]
  sizes?: string[]
}

export interface ColorOption {
  id: number | string
  name: string
  image: string
  description?: string
  type?: 'anodized' | 'painted' | 'wood' | 'metal'
}

export interface PartitionType {
  id: string
  name: string
  description: string
  fullDescription?: string
  image: string
  features?: string[]
  code?: string
  sizes?: {
    width: { min: number; max: number }
    height: { min: number; max: number }
  }
}

export interface PortfolioProject {
  id: number | string
  title: string
  description: string
  fullDescription?: string
  images: string[]
  coverImage?: string
  location?: string
  date?: string
  area?: number
  category?: string
  clientName?: string
  specifications?: string | string[]
  challenge?: string
  solution?: string
  results?: string[]
}

export interface ProcessStep {
  id?: number | string
  title: string
  description: string
  image: string
  duration?: string
}

export interface FaqItem {
  id: number
  question: string
  answer: string
}

export interface FillingOption {
  id: string
  name: string
  description: string
  image: string
  thickness: number[]
  features: string[]
}
