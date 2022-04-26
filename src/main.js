import { createApp } from 'vue'
import App from './App.vue';
import router from './router'
import store from './store'
import './registerServiceWorker'
import vant from 'vant'
import 'vant/lib/index.css';

// Create App
const PCA = createApp(App);
PCA.use(store).use(router).use(vant).mount('#app')
