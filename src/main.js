import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { store } from './store/store'
import service from './api/http'
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 按需导入组件
import '@/plugins/elementUI'
// table 树形网格的插件
import ZkTable from 'vue-table-with-tree-grid'
import 'element-ui/lib/theme-chalk/index.css'
import 'assets/reset.css'
import 'assets/font-awesome.min.css'
// 富文本样式文件
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.prototype.$axios = service

Vue.config.productionTip = false

Vue.component(ZkTable.name, ZkTable)// 全局注册table树组件

// 注册富文本编辑器组件到全局
Vue.use(VueQuillEditor)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
