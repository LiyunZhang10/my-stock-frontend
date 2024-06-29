import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/home',
    name: 'home',
    component: () => import('../views/HomeView.vue')
  },
  {
    path: '/chart',
    name: 'chart',
    component: () => import('../views/ChartView.vue')
  },
]

const router = new VueRouter({
  routes
})

export default router
