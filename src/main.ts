import { createPinia } from 'pinia';
import { createApp } from 'vue';

import App from './App.vue';
import { configureAxios } from './axios';
import router from './router';

const app = createApp(App);

configureAxios();

app.use(createPinia());
app.use(router);

app.mount('#app');
