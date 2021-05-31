import axios from 'axios'
// 导入请求服务进度条模块
import NProgress from 'nprogress'
// 进度条样式
import 'nprogress/nprogress.css'

console.log(NProgress)
// 创建 axios 实例
const service = axios.create({
  baseURL: 'http://localhost:8888/api/private/v1',
  timeout: 2000
})

// 配置请求拦截
service.interceptors.request.use(config => {
  NProgress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

// 响应拦截器
service.interceptors.response.use(config => {
  NProgress.done()
  return config
})

export default service
