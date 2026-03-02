import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  build: {
    // Копируем public файлы без обработки
    assetsDir: 'assets',
    // Оптимизация для CDN
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['vue', 'vue-router'],
          'swiper': ['swiper'],
        },
      },
    },
    // Настройки для CDN
    cssCodeSplit: true,
    assetsInlineLimit: 4096, // 4kb
    // Копировать .htaccess для Reg.ru
    copyPublicDir: true,
  },
  // Исключаем XML и TXT из обработки
  publicDir: 'public',
  // Оптимизация preload/prefetch
  ssr: {
    noExternal: ['swiper'],
  },
  // Base URL для CDN (в продакшене)
  base: process.env.NODE_ENV === 'production' ? '/' : '/',
})
