import Vue from 'vue'
import Router from 'vue-router'
import ViewApp from '@/components/ViewApp'
import ViewScreen from '@/components/ViewScreen'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    { path: '/', component: ViewApp },
    { path: '/:cid', component: ViewScreen }
  ]
})
