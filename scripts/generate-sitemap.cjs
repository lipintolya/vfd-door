/**
 * Генерация актуального sitemap.xml для всех страниц и товаров
 */

const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://vfd74.ru';

// Получаем сегодня дату
const today = new Date().toISOString().split('T')[0];

// Статические страницы
const staticPages = [
  { path: '/', priority: '1.0', changefreq: 'weekly', lastmod: today },
  { path: '/catalog', priority: '0.9', changefreq: 'weekly', lastmod: today },
  { path: '/partitions', priority: '0.9', changefreq: 'weekly', lastmod: today },
  { path: '/portfolio', priority: '0.8', changefreq: 'monthly', lastmod: today },
  { path: '/about', priority: '0.7', changefreq: 'monthly', lastmod: today },
];

// Загружаем данные дверей
const doorsPath = path.join(__dirname, '..', 'src', 'data', 'doors.json');
const doors = JSON.parse(fs.readFileSync(doorsPath, 'utf8'));

// Загружаем портфолио
const portfolioPath = path.join(__dirname, '..', 'src', 'data', 'portfolio.ts');
const portfolioContent = fs.readFileSync(portfolioPath, 'utf8');

// Генерируем URL для товаров
const productUrls = doors.map(door => {
  // Извлекаем данные из doors.json
  const series = door.series?.split('/')[0] || 'innova';
  const cover = door.cover === 'ПЭТ' ? 'strong-flex' : door.cover;
  
  // Экранируем пробелы в ID
  const safeId = encodeURIComponent(door.id);
  
  return {
    path: `/catalog/${cover}/${series}/${safeId}`,
    priority: '0.8',
    changefreq: 'weekly',
    lastmod: today
  };
});

// Генерируем URL для портфолио
const portfolioUrls = [];
const portfolioMatches = portfolioContent.matchAll(/id:\s*'(\d+)'/g);
for (const match of portfolioMatches) {
  portfolioUrls.push({
    path: `/portfolio#${match[1]}`,
    priority: '0.6',
    changefreq: 'monthly',
    lastmod: today
  });
}

// Собираем все URL
const allUrls = [...staticPages, ...productUrls, ...portfolioUrls];

// Генерируем XML
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:yandex="http://www.yandex.ru">
${allUrls.map(url => `  <url>
    <loc>${BASE_URL}${url.path}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>
`;

// Сохраняем
const outputPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
fs.writeFileSync(outputPath, xml, 'utf8');

console.log(`✅ Sitemap сгенерирован!`);
console.log(`📊 Всего URL: ${allUrls.length}`);
console.log(`   - Статические страницы: ${staticPages.length}`);
console.log(`   - Товары: ${productUrls.length}`);
console.log(`   - Портфолио: ${portfolioUrls.length}`);
console.log(`📁 Файл: ${outputPath}`);
