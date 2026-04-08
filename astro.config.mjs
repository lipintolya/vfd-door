import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://vfd74.ru',
  integrations: [vue()],
  output: 'static',
  vite: {
    plugins: [tailwindcss()],
  },
});
