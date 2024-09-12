import { createRouter, createWebHistory } from 'vue-router';

import C2 from './pages/C2.vue';
import ResearchApp from './pages/ResearchApp.vue';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'home',
            component: C2
        },
        {
            path: '/search',
            name: 'search',
            component: ResearchApp
        },
    ]
});

export { router };