/**
 * Простой SSG Build Script для VFD Doors
 * Генерирует статические HTML файлы для всех маршрутов
 * 
 * Использование:
 *   npm run ssg:build
 */

import { build } from 'vite'
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs'
import { join, resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const DIST_DIR = resolve(__dirname, '../dist')

// Маршруты для генерации
const ROUTES = [
  { path: '/', file: 'index.html' },
  { path: '/catalog', file: 'catalog/index.html' },
  { path: '/partitions', file: 'partitions/index.html' },
  { path: '/about', file: 'about/index.html' },
  { path: '/portfolio', file: 'portfolio/index.html' },
]

/**
 * Генерируем статические HTML для каждого маршрута
 */
async function generateStaticPages() {
  console.log('🚀 Генерация статических страниц...\n')

  // Читаем основной index.html
  const indexPath = join(DIST_DIR, 'index.html')
  
  if (!existsSync(indexPath)) {
    console.error('❌ dist/index.html не найден! Сначала выполните npm run build')
    return
  }

  const baseHtml = readFileSync(indexPath, 'utf-8')

  for (const route of ROUTES) {
    const dir = join(DIST_DIR, route.path === '/' ? '' : route.path)
    const outputPath = join(DIST_DIR, route.file)

    console.log(`📄 Генерация: ${route.path}`)

    try {
      // Создаём директорию если нужно
      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true })
      }

      // Для SPA приложений просто копируем index.html
      if (route.path !== '/') {
        writeFileSync(outputPath, baseHtml, 'utf-8')
        console.log(`✓ Создано: ${outputPath}`)
      } else {
        console.log(`✓ Пропущено: ${route.path} (уже существует)`)
      }
    } catch (error) {
      console.error(`✗ Ошибка: ${route.path}`, error.message)
    }
  }

  console.log('\n✅ Генерация завершена!')
  console.log('\n📊 Итого:')
  console.log(`   Страниц: ${ROUTES.length}`)
  console.log(`   Директория: ${DIST_DIR}`)
}

/**
 * Основная функция
 */
async function main() {
  console.log('🔨 Vite SSG Build\n')
  console.log('Шаг 1: Сборка проекта...')
  
  try {
    await build({
      configFile: resolve(__dirname, '../vite.config.ts'),
      build: {
        outDir: DIST_DIR,
        minify: 'terser',
      },
    })
    console.log('✓ Сборка завершена\n')
  } catch (error) {
    console.error('❌ Ошибка сборки:', error.message)
    return
  }

  console.log('Шаг 2: Генерация статических страниц...')
  await generateStaticPages()

  console.log('\n🎉 Готово к деплою!')
  console.log('\nСледующие шаги:')
  console.log('  1. Проверьте dist/ директорию')
  console.log('  2. Запустите: npm run deploy:reg или npm run deploy:yc\n')
}

main().catch(console.error)
