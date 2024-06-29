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
    path: '/UsdChnChart',
    name: 'UsdChnChart',
    component: () => import('../views/UsdChnChart.vue')
  },
  {
    path: '/GoldChart',
    name: 'GoldChart',
    component: () => import('../views/GoldChart.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
