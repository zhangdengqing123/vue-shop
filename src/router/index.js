import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from 'components/login/Login'
import Home from 'components/home/Home'
import Welcome from 'components/welcome/Welcome'
import Users from 'components/user/Users'
import RightsList from 'components/rights/RightsList'
import RolesList from 'components/rights/RolesList'
import Cate from 'components/goods/Cate'
import CateParmas from 'components/goods/Params'
import GoodsList from 'components/goods/GoodsList'
import GoodsAdd from 'components/goods/Add'
import GoodsEdit from 'components/goods/Edit'
import Orders from 'components/order/Order'
import Reports from 'components/reports/Reports'

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
      { path: '/roles', name: 'RolesList', component: RolesList },
      // 商品管理 -> 商品分类
      { path: '/categories', name: 'Cate', component: Cate },
      // 商品管理 -> 分类参数
      { path: '/params', name: 'CateParmas', component: CateParmas },
      // 商品管理 -> 商品列表
      { path: '/goods', name: 'GoodsList', component: GoodsList },
      // 商品管理 -> 商品列表 -> 添加商品
      { path: '/goods/add', name: 'GoodsAdd', component: GoodsAdd },
      // 商品管理 -> 商品列表 -> 添加商品
      { path: '/goods/edit/:id', name: 'GoodsEdit', component: GoodsEdit },
      // 订单管理 -> 订单列表
      { path: '/orders', name: 'Orders', component: Orders },
      // 数据统计 -> 数据报表
      { path: '/reports', name: 'Reports', component: Reports }
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
