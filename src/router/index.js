import { createRouter, createWebHashHistory } from 'vue-router'
import login from '../views/login.vue'
import index from'../views/index.vue'
const routes = [
  {
    path: '/index',
    name: 'home',
    component: login
  },
  {
    path: '/',
    name: 'index',
    component: index
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
