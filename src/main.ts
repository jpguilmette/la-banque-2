import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import router from './router';
import firebasePlugin from './firebasePlugin';
import { createPinia } from 'pinia';

const app = createApp(App);
const pinia = createPinia();

app.use(router);
app.use(firebasePlugin);
app.use(pinia);
app.mount('#app');
