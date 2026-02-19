import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'
import Catalog from '../views/Catalog.vue'
import ProductPage from '../views/ProductPage.vue'
import AluminiumPartitionsPage from '../views/AluminiumPartitionsPage.vue'
import About from '@/views/About.vue'
import Portfolio from '@/views/Portfolio.vue'

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'Home', component: Home },
  { path: '/catalog', name: 'Catalog', component: Catalog },
  { path: '/about', name: 'About', component: About },
  { path: '/portfolio', name: 'Portfolio', component: Portfolio },
  {
    path: '/catalog/:cover/:series/:id',
    name: 'ProductPage',
    component: ProductPage,
    props: route => ({
      cover: route.params.cover,
      series: route.params.series,
      id: route.params.id,
    }),
  },
  { path: '/partitions', name: 'AluminiumPartitions', component: AluminiumPartitionsPage },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router