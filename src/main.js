import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import '@/assets/css/common.css'
import axios from 'axios'

Vue.prototype.$http = axios
axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'

Vue.config.productionTip = false
/* 
  疑问=？ 为什么login res保存后，不能再axios外面使用，一定要请求时候使用sessionStorge.setItem


*/
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
