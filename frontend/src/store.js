import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    cid: null,
    subjects: [],
  },
  mutations: {
    setCid (state, cid) {
      state.cid = cid
    },
    setSubjects (state, subjects) {
      state.subjects = subjects
    }
  },
  actions: {
    async getSubjects ({ state, commit }) {
      try {
        let res = await axios.get(`http://localhost:3002/${state.cid}`)
        commit('setSubjects', res.data)
      } catch (err) {
        console.error(err)
      }
    }
  },
  getters: {
    cid: (state) => {
      return state.cid
    },
    subjects: (state) => {
      return state.subjects
    }
  }
})
