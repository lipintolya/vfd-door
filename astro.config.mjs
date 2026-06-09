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

  integrations: [vue(), sitemap()]
});
