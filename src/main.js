import Vue from 'vue'
import App from './App'
import store from './store/index'
import mpvueToastRegistry from 'mptoast/src/registry'
mpvueToastRegistry(Vue)

Vue.config.productionTip = false
Vue.prototype.$store = store
App.mpType = 'app'

const app = new Vue(App)
app.$mount()
