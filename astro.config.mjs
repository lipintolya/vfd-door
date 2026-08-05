// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import vue from '@astrojs/vue';
import markdoc from '@astrojs/markdoc';

// https://astro.build/config
export default defineConfig({
  site: 'https://vfd74.ru',

  vite: {
    plugins: [tailwindcss()]
  },

  // /catalog/series/[slug] убран — дублировал /catalog (та же сетка моделей,
  // просто под покрытием маркетингового текста). Редиректим уже
  // проиндексированные ссылки на отфильтрованный /catalog, а не 404'им.
  redirects: {
    '/catalog/series/antique-luxe': '/catalog?series=antique-luxe#catalog-title',
    '/catalog/series/basic':        '/catalog?series=basic#catalog-title',
    '/catalog/series/elegant':      '/catalog?series=elegant#catalog-title',
    '/catalog/series/emalex':       '/catalog?series=emalex#catalog-title',
    '/catalog/series/emalex-modern':'/catalog?series=emalex-modern#catalog-title',
    '/catalog/series/innova':       '/catalog?series=innova#catalog-title',
    '/catalog/series/linea':        '/catalog?series=linea#catalog-title',
    '/catalog/series/premium':      '/catalog?series=premium#catalog-title',
    '/catalog/series/sektor':       '/catalog?series=sektor#catalog-title',
    '/catalog/series/skinel':       '/catalog?series=skinel#catalog-title',
    '/catalog/series/smart':        '/catalog?series=smart#catalog-title',
    '/catalog/series/stockholm':    '/catalog?series=stockholm#catalog-title',
    '/catalog/series/urban':        '/catalog?series=urban#catalog-title',
    '/catalog/series/urban-pet':    '/catalog?series=urban-pet#catalog-title',
    '/catalog/series/winter':       '/catalog?series=winter#catalog-title',
  },

  integrations: [
    vue(),
    markdoc(),
    sitemap({
      filter: (page) =>
        page !== 'https://vfd74.ru/privacy/' && page !== 'https://vfd74.ru/privacy' &&
        // Старые UUID-маршруты моделей остаются доступными (чтобы не 404'ить уже
        // проиндексированные ссылки), но в сайтмап должен попадать только
        // канонический слаг-адрес — иначе сайтмап задвоит каждую модель.
        !/\/models\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\/?$/.test(page) &&
        // /catalog/series/[slug] убран, редиректы (см. redirects выше) — не
        // реальный контент, в сайтмап не кладём.
        !/\/catalog\/series\//.test(page),
      serialize(item) {
        const u = item.url
        if (u === 'https://vfd74.ru/' || u === 'https://vfd74.ru') {
          return { ...item, changefreq: 'weekly', priority: 1.0 }
        }
        if (/\/(catalog|about|contacts|partitions|vhodnye-dveri)\/?$/.test(u)) {
          return { ...item, changefreq: 'weekly', priority: 0.8 }
        }
        if (/\/articles\/?$/.test(u)) {
          return { ...item, changefreq: 'weekly', priority: 0.7 }
        }
        if (/\/portfolio\/?$/.test(u)) {
          return { ...item, changefreq: 'weekly', priority: 0.8 }
        }
        if (/\/portfolio\/.+/.test(u)) {
          return { ...item, changefreq: 'monthly', priority: 0.65 }
        }
        return { ...item, changefreq: 'monthly', priority: 0.6 }
      },
    }),
  ]
});
