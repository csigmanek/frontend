import ElementUI from 'element-plus'
import 'element-ui/lib/theme-chalk/index.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './scss/element-variables.scss'
import store from './store'

createApp(App).use(store).use(router).use(ElementUI, {}).mount('#app')
