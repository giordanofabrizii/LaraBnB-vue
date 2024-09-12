import { createRouter, createWebHistory } from 'vue-router';

import C2 from './pages/C2.vue';
import C1 from './pages/C1.vue';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'home',
            component: C2
        },
        {
            path: '/apartments',
            name: 'bnb',
            component: C1
        },
    ]
});

export { router };