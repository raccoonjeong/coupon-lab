import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CouponSimulation from '../views/CouponSimulation.vue'
import LogicSimulation from '../views/LogicSimulation.vue'
import DiscountSimulation from '../views/DiscountSimulation.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/coupon-simulation',
    name: 'couponSimulation',
    component: CouponSimulation
  },
  {
    path: '/logic-simulation',
    name: 'logicSimulation',
    component: LogicSimulation
  },
  {
    path: '/discount-simulation',
    name: 'discountSimulation',
    component: DiscountSimulation
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
