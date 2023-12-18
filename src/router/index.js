import {
  createRouter,
  createWebHashHistory
} from 'vue-router'
import login from '../views/login.vue'
import index from '../views/index.vue'
import hand from '../views/hand.vue'
const routes = [{
    path: '/login',
    name: 'login',
    component: login
  },
  {
    path: '/hand',
    name: 'hand',
    component: hand
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