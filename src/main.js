import { createApp } from 'vue'
// import './style.css'
import App from './App.vue'

import ElementPlus from 'element-plus'; //为vue3项目特别更新的版本
import 'element-plus/dist/index.css';

import 'element-plus/theme-chalk/dark/css-vars.css'
import 'vue-json-pretty/lib/styles.css';
import JsonViewer from "vue3-json-viewer"
import dayjs from 'dayjs'
import { ElMessage } from 'element-plus'
import store from './store/index.js'

import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App).use(store)
const myStore = store

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.use(ElementPlus)
app.use(JsonViewer)
app.mixin({
    methods: {
        dataFilter(val, format = "YYYY-MM-DD hh:mm:ss") {
            val = parseInt(val);
            return dayjs(val).format(format);
        }
    }
})

import axios from 'axios'

// axios.defaults.baseURL = '/api'
const axiosInstance = axios.create()
axiosInstance.interceptors.request.use(
    config => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    error => {
      return Promise.reject(error);
    }
  );
  
axiosInstance.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        if (error.response && error.response.status === 401) {
            // 处理 Token 过期，跳转到登录页面
            myStore.commit('setTokenExpired', true); // 触发事件
        }
        if (error.response && error.response.data && error.response.data.detail){
            console.log(error.response)
            ElMessage.error(error.response.data.detail)
        }
        return Promise.reject(error);
    }
);

app.config.globalProperties.$http = axiosInstance
app.config.warnHandler = () => null;
app.mount('#app')