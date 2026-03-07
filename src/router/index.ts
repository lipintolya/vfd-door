import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

/**
 * Lazy loading для views — код сплиттинг по страницам
 * @see https://router.vuejs.org/guide/advanced/lazy-loading.html
 */
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
  },
  {
    path: '/catalog',
    name: 'Catalog',
    component: () => import('../views/Catalog.vue'),
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/views/About.vue'),
  },
  {
    path: '/portfolio',
    name: 'Portfolio',
    component: () => import('@/views/Portfolio.vue'),
  },
  {
    path: '/catalog/:cover/:series/:id',
    name: 'ProductPage',
    component: () => import('../views/ProductPage.vue'),
    props: route => ({
      cover: route.params.cover,
      series: route.params.series,
      id: route.params.id,
    }),
  },
  {
    path: '/partitions',
    name: 'AluminiumPartitions',
    component: () => import('../views/AluminiumPartitionsPage.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, _from, savedPosition) {
    // Поведение при навигации
    if (savedPosition) {
      return savedPosition
    }

    // Если переход по якорю
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
      }
    }

    // Скролл вверх для новых страниц
    return { top: 0, behavior: 'smooth' }
  },
})

/**
 * Глобальный guard для аналитики и управления состоянием
 */
router.beforeEach((to, from) => {
  // Закрываем мобильное меню при переходе
  const mobileMenu = document.querySelector('[data-mobile-menu-open]')
  if (mobileMenu) {
    mobileMenu.setAttribute('data-mobile-menu-open', 'false')
  }

  // Скролл вверх для переходов между разными страницами
  if (to.path !== from.path && !to.hash) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
})

export default router