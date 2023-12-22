import { createPinia } from 'pinia';
import { createApp } from 'vue';

import axios from 'axios';
import App from './App.vue';
import router from './router';

axios.defaults.baseURL = import.meta.env.VITE_REMOTE_API + '/api';

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount('#app');
