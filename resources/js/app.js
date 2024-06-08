import './bootstrap';
import './bootstrap';
import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import store from '@/store/store';

import App from './App.vue';
import Create from './components/Create.vue';
import Index from './components/Index.vue';
import Edit from './components/Edit.vue';

// Define your routes
const routes = [
    {
        name: 'Create',
        path: '/create',
        component: Create
    },
    {
        name: 'Index',
        path: '/',
        component: Index
    },
    {
        name: 'Edit',
        path: '/edit/:id',
        component: Edit
    }
];

// Create the router instance
const router = createRouter({
    history: createWebHistory(),
    routes,
});

// Create and mount the root instance
createApp(App)
    .use(router)
    .use(store)
    .mount('#app');
