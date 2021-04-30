import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from 'components/login/Login'
import Home from 'components/home/Home'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: { name: 'Login' } // 路由重定向
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  }, {
    path: '/home',
    name: 'Home',
    component: Home
  }
]

const router = new VueRouter({
  routes
})

// 使用路由全局前置守卫
router.beforeEach((to, from, next) => {
  if (to.name === 'Login') return next()
  if (!window.sessionStorage.getItem('token')) {
    next({ path: '/' })
  } else {
    next()
  }
})

export default router
