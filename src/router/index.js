import Vue from 'vue'
import VueRouter from 'vue-router'
const Login = () => import('@/components/Login.vue')
const Home = () => import('@/components/Home.vue')


Vue.use(VueRouter)

const routes = [
{path:'/',redirect:'/login'},
{ path: '/login', component: Login },
{path:'/home',component:Home}
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
