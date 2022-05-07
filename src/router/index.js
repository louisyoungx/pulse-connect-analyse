import { createRouter, createWebHashHistory } from 'vue-router'
import home from '@/views/home/index'

const routes = [
  {
    path: '/',
    name: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'home',
    component: home
  },
  {
    path: '/chart',
    name: 'chart',
    component: import ('@/views/chart/index')
  },
  {
    path: '/user',
    name: 'user',
    component: import ("@/views/user/index")
  },
  {
    path: '/settings',
    name: 'settings',
    component: import ("@/views/settings/index")
  },
  {
    path: '/login',
    name: 'login',
    component: import ("@/views/user/login")
  },
  {
    path: '/register',
    name: 'register',
    component: import ("@/views/user/register")
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
