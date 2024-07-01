import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/home', // 默认重定向到 /home
  },
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
  },
  {
    path: '/nvda-stock',
    name: 'NvdaStock',
    component: () => import('../views/NvdaStock.vue')
  },
  {
    path: '/sgdcnyc',
    name: 'SgdcnycData',
    component: () => import('../views/SgdcnycData.vue')
  },
]

const router = new VueRouter({
  routes
})

export default router
