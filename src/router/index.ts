import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/SecretView.vue')
    },
    {
      path: '/secret',
      name: 'secret-view',
      component: () => import('../views/SecretView.vue')
    },
    {
      path: '/server',
      name: 'server-view',
      component: () => import('../views/ServerView.vue')
    },
  ]
})

export default router
