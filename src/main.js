import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import Antd from 'ant-design-vue';
import axios from 'axios';
axios.defaults.baseURL = 'http://118.25.147.189:34568'
import 'ant-design-vue/dist/reset.css';
const app=createApp(App)
app.use(router).use(Antd).mount('#app')
