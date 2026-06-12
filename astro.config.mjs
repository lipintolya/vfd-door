// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

import tailwindcss from '@tailwindcss/vite';

import vue from '@astrojs/vue';

// https://astro.build/config
export default defineConfig({
  site: 'https://vfd74.ru',

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [
    vue(),
    sitemap({
      filter: (page) =>
        page !== 'https://vfd74.ru/privacy/' && page !== 'https://vfd74.ru/privacy',
      serialize(item) {
        const u = item.url
        if (u === 'https://vfd74.ru/' || u === 'https://vfd74.ru') {
          return { ...item, changefreq: 'weekly', priority: 1.0 }
        }
        if (/\/(catalog|about|contacts|partitions)\/?$/.test(u)) {
          return { ...item, changefreq: 'weekly', priority: 0.8 }
        }
        return { ...item, changefreq: 'monthly', priority: 0.6 }
      },
    }),
  ]
});
