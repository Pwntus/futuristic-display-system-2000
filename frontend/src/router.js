import Vue from 'vue'
import Router from 'vue-router'
import ViewSplash from '@/components/ViewSplash'
import ViewScreen from '@/components/ViewScreen'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    { path: '/', component: ViewSplash },
    { path: '/:cid', component: ViewScreen }
  ]
})
