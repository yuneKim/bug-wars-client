import 'primevue/resources/themes/lara-light-green/theme.css';
import 'primeicons/primeicons.css'
import '@/assets/base.css';
import { createPinia } from 'pinia';
import { createApp } from 'vue';
import App from '@/App.vue';
import { configureAxios } from '@/config/axios';
import router from '@/router';
import { configureQuill } from './config/quill';
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';

const app = createApp(App);
app.use(ToastService);

configureAxios();
configureQuill();

app.use(createPinia());
app.use(router);
app.use(PrimeVue);
app.mount('#app');
