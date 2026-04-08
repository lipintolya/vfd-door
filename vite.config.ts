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
      '@components': path.resolve(__dirname, 'src/components'),
      '@composables': path.resolve(__dirname, 'src/composables'),
      '@config': path.resolve(__dirname, 'src/config'),
      '@data': path.resolve(__dirname, 'src/data'),
      '@types': path.resolve(__dirname, 'src/types'),
      '@views': path.resolve(__dirname, 'src/views'),
      '@services': path.resolve(__dirname, 'src/services'),
      '@assets': path.resolve(__dirname, 'src/assets'),
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
        },
      },
    },
    // Настройки для CDN
    cssCodeSplit: true,
    assetsInlineLimit: 4096, // 4kb
    // Копировать .htaccess для Reg.ru
    copyPublicDir: true,
  },
  // Base URL для CDN (в продакшене)
  base: process.env.NODE_ENV === 'production' ? '/' : '/',
})
