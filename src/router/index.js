import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from 'components/login/Login'
import Home from 'components/home/Home'
import Welcome from 'components/welcome/Welcome'
import Users from 'components/user/Users'
import RightsList from 'components/rights/RightsList'
import RolesList from 'components/rights/RolesList'

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
    component: Home,
    redirect: '/welcome',
    // 嵌套子路由
    children: [
      // 欢迎页面
      { path: '/welcome', name: 'Welcome', component: Welcome },
      // 用户管理 -> 用户列表
      { path: '/users', name: 'Users', component: Users },
      // 权限管理 -> 权限列表
      { path: '/rights', name: 'RightsList', component: RightsList },
      // 权限管理 -> 角色列表
      { path: '/roles', name: 'RolesList', component: RolesList }
    ]
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
