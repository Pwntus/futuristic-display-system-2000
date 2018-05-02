import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

let api = axios.create({
  baseURL: 'http://localhost:3002/',
  responseType: 'json'
})

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
    },
    removeSubject (state, id) {
      state.subjects = state.subjects.filter(s => {
        return s.id !== id
      })
    }
  },
  actions: {
    async getSubjects ({ state, commit }) {
      try {
        let res = await api.get(state.cid)
        commit('setSubjects', res.data)
      } catch (err) {
        console.error(err)
      }
    },
    async addSubject ({ state, dispatch }, label) {
      try {
        let res = await api.post(state.cid, { label })
        if (res.status == 200)
          dispatch('getSubjects')

        return res.status

      } catch (err) {
        console.error(err)
        return err
      }
    },
    async removeSubject ({ state, commit }, id) {
      commit('removeSubject', id)

      try {
        let res = await api.delete(`${state.cid}/${id}`)
        if (res.status !== 200)
          dispatch('getSubjects')

        return res.status

      } catch (err) {
        console.error(err)
        return err
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
