/**
 * SEO Composable для управления мета-тегами
 * Оптимизировано для локального SEO (Челябинск)
 */

export interface SeoOptions {
  title: string
  description: string
  keywords?: string[]
  canonicalUrl?: string
  ogImage?: string
  type?: 'website' | 'article' | 'product'
}

const BASE_URL = 'https://vfd-door.vercel.app'
const DEFAULT_KEYWORDS = [
  'межкомнатные двери Челябинск',
  'входные двери Челябинск',
  'алюминиевые перегородки Челябинск',
  'двери от производителя',
  'VFD Doors',
  'салон дверей',
  'двери на Кашириных',
]

/**
 * Обновляет meta description
 */
export function updateMetaDescription(description: string): void {
  const meta = document.querySelector('meta[name="description"]')
  if (meta) {
    meta.setAttribute('content', description)
  } else {
    const newMeta = document.createElement('meta')
    newMeta.name = 'description'
    newMeta.content = description
    document.head.appendChild(newMeta)
  }
}

/**
 * Обновляет keywords
 */
export function updateKeywords(keywords: string[]): void {
  const meta = document.querySelector('meta[name="keywords"]')
  const keywordsString = keywords.join(', ')
  
  if (meta) {
    meta.setAttribute('content', keywordsString)
  } else {
    const newMeta = document.createElement('meta')
    newMeta.name = 'keywords'
    newMeta.content = keywordsString
    document.head.appendChild(newMeta)
  }
}

/**
 * Обновляет Open Graph мета-теги
 */
export function updateOpenGraph(options: {
  title: string
  description: string
  url?: string
  image?: string
  type?: string
}): void {
  const { title, description, url = BASE_URL, image = `${BASE_URL}/og-image.jpg`, type = 'website' } = options
  
  const ogTags = [
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:url', content: url },
    { property: 'og:image', content: image },
    { property: 'og:type', content: type },
  ]
  
  ogTags.forEach(({ property, content }) => {
    let meta = document.querySelector(`meta[property="${property}"]`)
    if (!meta) {
      meta = document.createElement('meta')
      meta.setAttribute('property', property)
      document.head.appendChild(meta)
    }
    meta.setAttribute('content', content)
  })
}

/**
 * Обновляет Twitter Card мета-теги
 */
export function updateTwitterCard(options: {
  title: string
  description: string
  image?: string
}): void {
  const { title, description, image = `${BASE_URL}/og-image.jpg` } = options
  
  const twitterTags = [
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: image },
  ]
  
  twitterTags.forEach(({ name, content }) => {
    let meta = document.querySelector(`meta[name="${name}"]`)
    if (!meta) {
      meta = document.createElement('meta')
      meta.setAttribute('name', name)
      document.head.appendChild(meta)
    }
    meta.setAttribute('content', content)
  })
}

/**
 * Основная функция для обновления SEO
 */
export function useSeo(options: SeoOptions): void {
  const {
    title,
    description,
    keywords = DEFAULT_KEYWORDS,
    canonicalUrl,
    ogImage,
    type = 'website',
  } = options
  
  // Обновляем title страницы
  document.title = title
  
  // Обновляем meta description
  updateMetaDescription(description)
  
  // Обновляем keywords
  updateKeywords([...DEFAULT_KEYWORDS, ...keywords])
  
  // Обновляем Open Graph
  updateOpenGraph({
    title,
    description,
    url: canonicalUrl,
    image: ogImage,
    type,
  })
  
  // Обновляем Twitter Card
  updateTwitterCard({
    title,
    description,
    image: ogImage,
  })
  
  // Canonical URL
  if (canonicalUrl) {
    let link = document.querySelector('link[rel="canonical"]')
    if (!link) {
      link = document.createElement('link')
      link.setAttribute('rel', 'canonical')
      document.head.appendChild(link)
    }
    link.setAttribute('href', canonicalUrl)
  }
}

/**
 * Schema.org микроразметка для локального бизнеса
 */
export interface LocalBusinessSchema {
  name: string
  description: string
  url: string
  telephone: string
  address: {
    streetAddress: string
    addressLocality: string
    addressRegion: string
    postalCode: string
    addressCountry: string
  }
  geo?: {
    latitude: number
    longitude: number
  }
  openingHours?: string[]
  priceRange?: string
  image?: string
}

/**
 * Добавляет/обновляет Schema.org разметку
 */
export function updateSchemaOrg(schema: LocalBusinessSchema): void {
  const scriptId = 'schema-org-local-business'
  let script = document.getElementById(scriptId) as HTMLScriptElement | null
  
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    ...schema,
  }
  
  if (!script) {
    script = document.createElement('script')
    script.id = scriptId
    script.type = 'application/ld+json'
    document.head.appendChild(script)
  }
  
  script.textContent = JSON.stringify(schemaData)
}

/**
 * Schema.org для продукта
 */
export interface ProductSchema {
  name: string
  description: string
  image: string[]
  brand: string
  offers: {
    price: number
    priceCurrency: string
    availability: string
    url: string
  }
}

/**
 * Добавляет Schema.org разметку для продукта
 */
export function updateProductSchema(schema: ProductSchema): void {
  const scriptId = `schema-org-product-${schema.name.replace(/\s+/g, '-').toLowerCase()}`
  
  // Проверяем, есть ли уже такая разметка
  if (document.getElementById(scriptId)) {
    return
  }
  
  const script = document.createElement('script')
  script.id = scriptId
  script.type = 'application/ld+json'
  
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    ...schema,
  }
  
  script.textContent = JSON.stringify(schemaData)
  document.head.appendChild(script)
}

/**
 * BreadcrumbList Schema.org
 */
export interface BreadcrumbSchema {
  name: string
  item: string
  position: number
}

/**
 * Добавляет Schema.org для хлебных крошек
 */
export function updateBreadcrumbSchema(breadcrumbs: BreadcrumbSchema[]): void {
  const scriptId = 'schema-org-breadcrumb'
  let script = document.getElementById(scriptId) as HTMLScriptElement | null
  
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map(({ name, item, position }) => ({
      '@type': 'ListItem',
      position,
      name,
      item,
    })),
  }
  
  if (!script) {
    script = document.createElement('script')
    script.id = scriptId
    script.type = 'application/ld+json'
    document.head.appendChild(script)
  }
  
  script.textContent = JSON.stringify(schemaData)
}
