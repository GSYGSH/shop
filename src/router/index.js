import Vue from 'vue'
import VueRouter from 'vue-router'
const Login = () => import('@/components/Login.vue')
const Home = () => import('@/components/Home.vue')
const WelCome = () => import('@/components/WelCome.vue')
const Categories = () => import('@/components/users/Categories.vue')
const Goods = () => import('@/components/users/Goods.vue')
const Orders = () => import('@/components/users/Orders.vue')
const Params = () => import('@/components/users/Params.vue')
const Reports = () => import('@/components/users/Reports.vue')
const Rights = () => import('@/components/users/Rights.vue')
const Roles = () => import('@/components/users/Roles.vue')
const Users = () => import('@/components/users/Users.vue')



Vue.use(VueRouter)

const routes = [
{path:'/',redirect:'/login'},
{path: '/login', component:Login},
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: WelCome },
      { path: '/users', component: Users },
      { path: '/roles', component:Roles },
      { path: '/rights', component:Rights },
      { path: '/goods', component:Goods },
      { path: '/params', component: Params },
      { path: '/categories', component: Categories },
      { path: '/orders', component: Orders },
      { path: '/reports', component:Reports }
    ]
  }
]

const router = new VueRouter({
  routes
})

/* 通过导航守卫给 home设置权限页面 */
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  let token = window.sessionStorage.getItem('token')
  if (!token) next('/login')
  next()
})

export default router
