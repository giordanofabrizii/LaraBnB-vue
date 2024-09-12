import { createRouter, createWebHistory } from 'vue-router';

import MainApp from './pages/MainApp.vue';
import ResearchApp from './pages/ResearchApp.vue';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'home',
            component: MainApp
        },
        {
            path: '/search',
            name: 'search',
            component: ResearchApp
        },
    ]
});

export { router };