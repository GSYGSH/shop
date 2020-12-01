import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import '@/assets/css/common.css'
import axios from 'axios'
import TreeTable from 'vue-table-with-tree-grid'

import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

Vue.prototype.$http = axios
axios.defaults.baseURL ='http://120.53.120.229:8888/api/private/v1/'
/* 'https://www.liulongbin.top:8888/api/private/v1/' */
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

/* 富文本编辑 */
Vue.use(VueQuillEditor, /* { default global options } */)


Vue.config.productionTip = false

Vue.component('tree-table', TreeTable)

Vue.filter('dataFormat', function (timeVal) {
  let timer = new Date(timeVal)
  
  let y = timer.getFullYear()
  let m = String(timer.getMonth() + 1).padStart(2,'0')
  let d = String(timer.getDate()).padStart(2,'0')

  let hh = String(timer.getHours()).padStart(2,'0')
  let mm = String(timer.getMinutes()).padStart(2,'0')
  let ss =String( timer.getSeconds()).padStart(2,'0')
  
  return `${y}-${m}-${d} ${hh}:${mm}${ss}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
