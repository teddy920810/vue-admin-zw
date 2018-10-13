import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss' // global css

import App from './App'
import router from './router'
import store from './store'

import '@/icons' // icon
import '@/permission' // permission control

import moment from 'moment'
import Global from './utils/global.vue'

Vue.use(ElementUI)
Vue.prototype.GLOBAL = Global
Vue.config.productionTip = false

Vue.filter('timeFilter', function(value, formatString) {
  formatString = formatString || 'YYYY-MM-DD HH:mm:ss'
  return moment(value * 1000).format(formatString)
})

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
