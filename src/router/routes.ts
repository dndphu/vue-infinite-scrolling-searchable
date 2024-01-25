import type { RouteRecordRaw } from 'vue-router'
const Home = () => import('@/views/HomeView.vue')
const About =() => import('@/views/AboutView.vue')
const routes: Readonly<RouteRecordRaw[]> = [
  {
    name: 'Home',
    path: '/',
    component: Home,
    meta: {
      title: 'Dashboard',
      requiresAuth: false
    }
  },
  {
    name: 'About',
    path: '/about',
    component: About,
    meta: {
      title: 'About',
      requiresAuth: false
    }
  },
]

export default routes
