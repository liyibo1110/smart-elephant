import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'

Vue.config.productionTip = false

// 引入全局配置文件
import $conf from "./common/config/config.js"
Vue.prototype.$conf = $conf

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
