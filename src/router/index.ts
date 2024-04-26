import {createRouter, createWebHashHistory} from 'vue-router'

const router = createRouter({
    history: createWebHashHistory(),
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
