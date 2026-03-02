#!/usr/bin/env node

/**
 * Скрипт деплоя на Yandex Cloud + CDN
 * Использование: npm run deploy:yc
 */

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { readdirSync, readFileSync, statSync } from 'fs'
import { join, extname } from 'path'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const DIST_DIR = join(__dirname, '../dist')

// Конфигурация Yandex Cloud
const config = {
  endpoint: 'https://storage.yandexcloud.net',
  region: 'ru-central1',
  bucket: 'vfd74-site',
  accessKeyId: process.env.YC_ACCESS_KEY,
  secretAccessKey: process.env.YC_SECRET_KEY,
  cdnId: process.env.YC_CDN_ID,
}

// Проверка переменных окружения
if (!config.accessKeyId || !config.secretAccessKey) {
  console.error('❌ Ошибка: Не настроены переменные окружения')
  console.error('Создайте .env.local и добавьте:')
  console.error('  YC_ACCESS_KEY=ваш_ключ')
  console.error('  YC_SECRET_KEY=ваш_секретный_ключ')
  console.error('  YC_CDN_ID=id_cdn_ресурса')
  process.exit(1)
}

// Инициализация S3 клиента
const s3Client = new S3Client({
  endpoint: config.endpoint,
  region: config.region,
  credentials: {
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey,
  },
})

/**
 * Получить Content-Type по расширению файла
 */
function getContentType(filePath) {
  const ext = extname(filePath).slice(1).toLowerCase()
  const types = {
    'html': 'text/html; charset=utf-8',
    'css': 'text/css; charset=utf-8',
    'js': 'application/javascript; charset=utf-8',
    'json': 'application/json; charset=utf-8',
    'webp': 'image/webp',
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'gif': 'image/gif',
    'svg': 'image/svg+xml',
    'ico': 'image/x-icon',
    'woff': 'font/woff',
    'woff2': 'font/woff2',
    'ttf': 'font/ttf',
    'xml': 'application/xml; charset=utf-8',
    'txt': 'text/plain; charset=utf-8',
    'pdf': 'application/pdf',
  }
  return types[ext] || 'application/octet-stream'
}

/**
 * Рекурсивно загрузить файлы в бакет
 */
async function uploadDirectory(localDir, bucketPath = '') {
  const files = readdirSync(localDir)
  let uploaded = 0
  let failed = 0

  console.log(`\n📦 Загрузка файлов из ${localDir}...`)

  for (const file of files) {
    const localPath = join(localDir, file)
    const stat = statSync(localPath)
    
    if (stat.isDirectory()) {
      // Рекурсивно загрузить директорию
      const result = await uploadDirectory(localPath, join(bucketPath, file))
      uploaded += result.uploaded
      failed += result.failed
    } else {
      // Загрузить файл
      const key = bucketPath ? `${bucketPath}/${file}` : file
      const fileBuffer = readFileSync(localPath)
      const contentType = getContentType(file)

      try {
        await s3Client.send(new PutObjectCommand({
          Bucket: config.bucket,
          Key: key,
          Body: fileBuffer,
          ContentType: contentType,
          ACL: 'public-read',
          CacheControl: 'public, max-age=31536000, immutable',
        }))

        console.log(`  ✅ ${key} (${formatBytes(fileBuffer.length)})`)
        uploaded++
      } catch (error) {
        console.error(`  ❌ ${key}: ${error.message}`)
        failed++
      }
    }
  }

  return { uploaded, failed }
}

/**
 * Форматировать размер файла
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

/**
 * Очистить кэш CDN
 */
async function invalidateCDN() {
  if (!config.cdnId) {
    console.log('\n⚠️  YC_CDN_ID не настроен, пропускаем очистку CDN')
    return
  }

  console.log('\n🔄 Очистка кэша CDN...')
  
  try {
    execSync(`yc cdn resource invalidate --id ${config.cdnId} --paths "/*"`, {
      stdio: 'inherit',
    })
    console.log('✅ Кэш CDN очищен')
  } catch (error) {
    console.error('❌ Ошибка очистки CDN:', error.message)
  }
}

/**
 * Основная функция
 */
async function main() {
  console.log('🚀 Деплой на Yandex Cloud + CDN\n')
  console.log('='.repeat(50))

  // Проверка сборки
  console.log('\n📋 Проверка dist/ директории...')
  if (!readdirSync(DIST_DIR).length) {
    console.error('❌ Директория dist/ пуста! Сначала выполните: npm run build')
    process.exit(1)
  }
  console.log('✅ Директория dist/ найдена')

  // Загрузка файлов
  const result = await uploadDirectory(DIST_DIR)

  console.log('\n' + '='.repeat(50))
  console.log('📊 ИТОГИ:')
  console.log(`  ✅ Загружено: ${result.uploaded} файлов`)
  if (result.failed > 0) {
    console.log(`  ❌ Ошибок: ${result.failed}`)
  }
  console.log(`  📍 Бакет: ${config.bucket}`)
  console.log(`  🌐 CDN: https://${config.bucket}.cdn.yandexcloud.net`)
  console.log('='.repeat(50))

  // Очистка CDN
  await invalidateCDN()

  console.log('\n✅ ДЕПЛОЙ ЗАВЕРШЁН!\n')
  console.log('Сайт доступен:')
  console.log(`  🌐 https://${config.bucket}.cdn.yandexcloud.net`)
  console.log('\nСледующие шаги:')
  console.log('  1. Настройте домен vfd74.ru на CDN ресурс')
  console.log('  2. Проверьте доступность сайта')
  console.log('  3. Обновите DNS записи у регистратора домена\n')
}

// Запуск
main().catch(error => {
  console.error('❌ Критическая ошибка:', error)
  process.exit(1)
})
