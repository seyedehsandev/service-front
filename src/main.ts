import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import { createPinia } from 'pinia';
import piniaPersist from 'pinia-plugin-persistedstate';
import router from './router/index';
import '@fortawesome/fontawesome-free/css/all.css';
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query';
import { useAuthStore } from './store/auth';

const pinia = createPinia();
pinia.use(piniaPersist);

const queryClient = new QueryClient();

const app = createApp(App);

app.use(pinia);
app.use(router);
app.use(VueQueryPlugin, { queryClient });

const authStore = useAuthStore(pinia);
try {
  authStore.checkAuth();
  console.log('Initial auth check completed.');
} catch (error) {
  console.error('Error during initial auth check:', error);
}

app.mount('#app');
console.log('App mounted.');
