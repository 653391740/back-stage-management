import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/view/login.vue'),
  },
  {
    path: '/home',
    name: 'Home',
    redirect: '/home/users',
    component: () => import('@/view/home.vue'),
    children: [
      {
        path: 'users',
        name: 'Users',
        component: () => import('@/view/users/users.vue')
      },
      {
        path: 'roles',
        name: 'Roles',
        component: () => import('@/view/rights/roles.vue')
      },
      {
        path: 'rights',
        name: 'Rights',
        component: () => import('@/view/rights/rights.vue')
      },
      {
        path: 'goods',
        name: 'Goods',
        component: () => import('@/view/goods/goods.vue'),
      },
      {
        path: 'add',
        name: 'Add',
        component: () => import('@/view/goods/addgoods.vue')
      },
      {
        path: 'params',
        name: 'Params',
        component: () => import('@/view/goods/params.vue')
      },
      {
        path: 'categories',
        name: 'Categories',
        component: () => import('@/view/goods/categories.vue')
      },
      {
        path: 'orders',
        name: 'Orders',
        component: () => import('@/view/orders/orders.vue')
      },
      {
        path: 'reports',
        name: 'Reports',
        component: () => import('@/view/reports/reports.vue')
      },
    ]
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/view/404.vue'),
  },
  {
    path: '*',        // 通配符，匹配所有未定义的路径
    redirect: '/404'  // 重定向到404页面
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  if (localStorage.getItem('token')) {
    next()
  } else {
    to.path === '/login' ? next() : next('/login')
  }
})

export default router