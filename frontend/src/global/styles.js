import Vue from 'vue'
import Vuetify from 'vuetify'

import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/dist/vuetify.min.css'
import '@/assets/styles/global.styl'

Vue.use(Vuetify, {
  theme: {
    primary: '#00a0e5',
    secondary: '#424242',
    accent: '#82B1FF',
    error: '#FF5252',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FFC107'
  },
  iconfont: 'mdi'
})
