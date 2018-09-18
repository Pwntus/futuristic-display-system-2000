import '@babel/polyfill'
import Vue from 'vue'
import App from '@/components/App.vue'
import store from '@/store'
import router from '@/router'
import '@/global'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: { App }
})
