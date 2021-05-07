import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { store } from './store/store'
import service from './api/http'
// 按需导入组件
import '@/plugins/elementUI'
import 'element-ui/lib/theme-chalk/index.css'
import 'assets/reset.css'
import 'assets/font-awesome.min.css'

Vue.prototype.$axios = service

Vue.config.productionTip = false

// console.log(service)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
