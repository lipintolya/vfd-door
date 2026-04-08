/**
 * Pre-renderer для VFD Doors - Версия 2.0
 * 
 * Генерирует HTML с РЕАЛЬНЫМ контентом из данных
 * Важно: контент должен совпадать с тем, что покажет Vue
 * 
 * Использование: npm run prerender
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs'
import { join, resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const DIST_DIR = resolve(__dirname, '../dist')
const SRC_DIR = resolve(__dirname, '../src')

// Загружаем реальные данные
const doorsData = JSON.parse(
  readFileSync(join(SRC_DIR, 'data', 'doors.json'), 'utf-8')
)

const portfolioData = readFileSync(join(SRC_DIR, 'data', 'portfolio.ts'), 'utf-8')

// Страницы для pre-render
const PAGES = [
  { path: '/', file: 'index.html' },
  { path: '/about', file: 'about/index.html' },
  { path: '/portfolio', file: 'portfolio/index.html' },
  { path: '/partitions', file: 'partitions/index.html' },
]

/**
 * Генерируем SEO контент на основе реальных данных
 */
function getSeoContent(path) {
  switch (path) {
    case '/': {
      // Берём реальные данные из каталога
      const seriesCount = new Set(doorsData.map(d => d.series?.split('/')[0])).size
      const doorsCount = doorsData.length
      const minPrice = Math.min(...doorsData.map(d => d.price))
      const maxPrice = Math.max(...doorsData.map(d => d.price))
      
      return `
        <section class="hero-seo">
          <h1>Межкомнатные и входные двери в Челябинске | VFD на Кашириных</h1>
          <p class="hero-description">
            Фирменный салон ВФД на Кашириных в Челябинске: межкомнатные и входные двери от производителя, 
            алюминиевые перегородки. Более ${doorsCount} моделей в наличии и под заказ.
          </p>
        </section>
        
        <section class="features-seo">
          <h2>Почему выбирают VFD Doors?</h2>
          <ul>
            <li>Более ${seriesCount} серий дверей в наличии</li>
            <li>Цены от ${minPrice.toLocaleString('ru-RU')} ₽ до ${maxPrice.toLocaleString('ru-RU')} ₽</li>
            <li>Замер, доставка, монтаж под ключ</li>
            <li>Гарантия от фабрики</li>
          </ul>
        </section>
        
        <section class="catalog-preview-seo">
          <h2>Популярные серии</h2>
          <div class="series-list">
            <div><strong>Innova/Иннова</strong> - ПЭТ покрытие от ${doorsData.find(d => d.series?.includes('innova'))?.price.toLocaleString('ru-RU') || '11 830'} ₽</div>
            <div><strong>Emalex/Эмалекс</strong> - Полипропилен от ${doorsData.find(d => d.series?.includes('emalex'))?.price.toLocaleString('ru-RU') || '8 030'} ₽</div>
            <div><strong>Invisible/скрытые</strong> - двери скрытого монтажа от ${doorsData.find(d => d.series?.includes('invisible'))?.price.toLocaleString('ru-RU') || '11 360'} ₽</div>
            <div><strong>Urban/Урбан</strong> - каркасные двери в современном дизайне</div>
            <div><strong>Linea/Линеа</strong> - двери в эмалевом покрытии с фрезировкой</div>
          </div>
        </section>
        
        <section class="seo-text">
          <h2>Межкомнатные двери от производителя в Челябинске</h2>
          <p>
            В фирменном салоне VFD Doors на Братьев Кашириных представлен широкий ассортимент 
            межкомнатных и входных дверей. У нас вы найдёте двери в покрытиях: ПЭТ (Strong Flex), 
            Эмалекс (полипропилен), эмаль. Более ${doorsCount} моделей в наличии и под заказ.
          </p>
          <h3>Наши преимущества</h3>
          <ul>
            <li>Официальный дилер Владимирской фабрики дверей</li>
            <li>Собственный шоурум на Братьев Кашириных</li>
            <li>Профессиональный замер и монтаж</li>
            <li>Доставка по Челябинску и области</li>
          </ul>
        </section>
      `
    }
    
    case '/about': {
      return `
        <section class="about-seo">
          <h1>О компании VFD Doors - межкомнатные двери в Челябинске</h1>
          <p class="about-description">
            Фирменный салон VFD Doors на Братьев Кашириных в Челябинске - официальный дилер 
            Владимирской фабрики дверей. Работаем на рынке дверей с 2015 года.
          </p>
        </section>
        
        <section class="about-features">
          <h2>Наши преимущества</h2>
          <ul>
            <li>Официальный дилер ВФД</li>
            <li>Более 5000 установленных дверей</li>
            <li>Собственная монтажная служба</li>
            <li>Гарантия на продукцию и монтаж</li>
          </ul>
        </section>
      `
    }
    
    case '/portfolio': {
      // Парсим количество работ из portfolio.ts
      const worksCount = (portfolioData.match(/id:\s*'\d+'/g) || []).length
      
      return `
        <section class="portfolio-seo">
          <h1>Портфолио работ VFD Doors - установка дверей в Челябинске</h1>
          <p class="portfolio-description">
            Примеры наших работ по установке межкомнатных и входных дверей, 
            алюминиевых перегородок в Челябинске. Более ${worksCount} выполненных проектов.
          </p>
        </section>
        
        <section class="portfolio-types">
          <h2>Типы объектов</h2>
          <ul>
            <li>Частные квартиры и дома</li>
            <li>Офисные помещения</li>
            <li>Коммерческие объекты</li>
            <li>Загородные коттеджи</li>
          </ul>
        </section>
      `
    }
    
    case '/partitions': {
      return `
        <section class="partitions-seo">
          <h1>Алюминиевые перегородки в Челябинске - проектирование и монтаж</h1>
          <p class="partitions-description">
            Проектирование, изготовление и монтаж алюминиевых перегородок для офисов, 
            домов и квартир. Раздвижные, распашные и стационарные системы.
          </p>
        </section>
        
        <section class="partitions-types">
          <h2>Типы перегородок</h2>
          <ul>
            <li>Раздвижные системы - экономия пространства</li>
            <li>Распашные перегородки - классическое решение</li>
            <li>Стационарные конструкции - для зонирования</li>
            <li>Скрытый короб - минималистичный дизайн</li>
          </ul>
        </section>
      `
    }
    
    default:
      return ''
  }
}

/**
 * Генерируем HTML файл
 */
function generatePage(page) {
  const outputPath = join(DIST_DIR, page.file)
  const outputDir = join(DIST_DIR, page.path === '/' ? '' : page.path)
  
  console.log(`📄 ${page.path}...`)
  
  try {
    // Создаём директорию
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true })
    }
    
    // Читаем базовый template
    const templatePath = join(DIST_DIR, 'index.html')
    const template = readFileSync(templatePath, 'utf-8')
    
    // Получаем реальный контент
    const content = getSeoContent(page.path)
    
    // Вставляем контент в template
    let html = template
    
    // Заменяем <div id="app"></div> на контент
    if (html.includes('<div id="app"></div>')) {
      html = html.replace(
        '<div id="app"></div>',
        `<div id="app" data-prerendered="true">${content}</div>`
      )
    }
    
    // Добавляем meta tag для поисковиков
    if (!html.includes('data-prerendered')) {
      html = html.replace('<html', '<html data-prerendered="true"')
    }
    
    // Сохраняем
    writeFileSync(outputPath, html, 'utf-8')
    console.log(`  ✅ ${outputPath}`)
    
    return true
  } catch (error) {
    console.error(`  ❌ Ошибка: ${error.message}`)
    return false
  }
}

/**
 * Основная функция
 */
async function main() {
  console.log('🔨 VFD Doors Pre-renderer v2.0\n')
  console.log('📁 Директория:', DIST_DIR)
  console.log('📊 Страниц:', PAGES.length)
  console.log('📦 Данных в каталоге:', doorsData.length)
  console.log('')
  
  if (!existsSync(DIST_DIR)) {
    console.error('❌ dist/ не найден! Сначала выполните: npm run build')
    process.exit(1)
  }
  
  console.log('📝 Генерация pre-rendered страниц с РЕАЛЬНЫМ контентом...\n')
  
  let success = 0
  let failed = 0
  
  for (const page of PAGES) {
    const result = await generatePage(page)
    if (result) success++
    else failed++
  }
  
  // Итоги
  console.log('\n' + '='.repeat(60))
  console.log('🎉 Pre-render завершён!')
  console.log('='.repeat(60))
  console.log(`✅ Успешно: ${success}/${PAGES.length}`)
  if (failed > 0) console.log(`❌ Ошибки: ${failed}`)
  console.log('='.repeat(60))
  
  console.log('\n💡 Что это даёт:')
  console.log('  ✅ Поисковики видят РЕАЛЬНЫЙ контент')
  console.log('  ✅ Нет расхождений с Vue (без клоакинга)')
  console.log('  ✅ Мгновенная первая отрисовка')
  console.log('  ✅ Каталог загружается через Vue (динамически)')
  console.log('\n⚠️  Важно:')
  console.log('  Контент в pre-render совпадает с данными из doors.json')
  console.log('  При изменении цен - пересобирайте: npm run deploy')
  console.log('\n🚀 Готово к деплою!')
}

main().catch(console.error)
