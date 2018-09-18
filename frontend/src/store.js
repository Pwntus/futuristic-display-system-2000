import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    mapbox: false
  },
  mutations: {
    setMapbox (state, value) {
      state.mapbox = value
    }
  }
})
