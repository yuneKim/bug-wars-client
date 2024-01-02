import '@/assets/base.css';
import { createPinia } from 'pinia';
import { createApp } from 'vue';

import App from '@/App.vue';
import { configureAxios } from '@/config/axios';
import router from '@/router';
import { configureQuill } from './config/quill';

const app = createApp(App);

configureAxios();
configureQuill();

app.use(createPinia());
app.use(router);

app.mount('#app');
