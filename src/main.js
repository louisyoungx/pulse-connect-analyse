import { createApp } from 'vue'
import App from './App.vue';
import router from './router'
import store from './store'
import './registerServiceWorker'
import vant from 'vant'

const PCA = createApp(App);
PCA.use(store).use(router).use(vant).mount('#app')

/* Element-Plus Component */
import 'element-plus/lib/theme-chalk/index.css';
import {
    ElCard,
    ElButton,
    ElRow,
    ElCarousel,
    ElCarouselItem,
    ElImage,
    ElPageHeader,
    ElDatePicker
} from 'element-plus';
PCA.use(ElCard).use(ElButton).use(ElRow).use(ElCarousel).use(ElCarouselItem).use(ElImage).use(ElPageHeader).use(ElDatePicker)
