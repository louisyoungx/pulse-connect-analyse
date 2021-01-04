import { createRouter, createWebHistory } from 'vue-router'
// 打包APP
// import { createRouter, createWebHashHistory } from 'vue-router'
import home from '../views/home/index'
const chart = () => import ('../views/chart/index');
const user = () => import ("../views/user/index");
const settings = () => import ("../views/settings/index");
const login = () => import ("../views/user/login");
const register = () => import ("../views/user/register");

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
    component: chart
  },
  {
    path: '/user',
    name: 'user',
    component: user
  },
  {
    path: '/settings',
    name: 'settings',
    component: settings
  },
  {
    path: '/login',
    name: 'login',
    component: login
  },
  {
    path: '/register',
    name: 'register',
    component: register
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  // 打包APP
  // history: createWebHashHistory(),
  routes
})

export default router
