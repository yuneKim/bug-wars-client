import { createPinia } from 'pinia';
import { createApp } from 'vue';

import App from './App.vue';
import { configureAxios } from './axios';
import router from './router';

configureAxios();

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount('#app');
