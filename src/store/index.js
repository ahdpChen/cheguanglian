import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

import advertItem from './module/advertItem'
import setUp from './module/setUp'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    openId: '',
    isLogin: false
  },
  mutations: {
    SET_OPEN_ID: (state, openId) => {
      state.openId = openId
    },
    SET_LOGIN_STATUS: (state, isLogin) => {
      state.isLogin = isLogin
    }
  },
  actions: {
    setLoginStatus ({ commit, state }, isLogin) {
      commit('SET_LOGIN_STATUS', isLogin)
    }
  },
  plugins: [
    createPersistedState({
      storage: {
        getItem: key => wx.getStorageSync(key),
        setItem: (key, value) => wx.setStorageSync(key, value),
        removeItem: key => {}
      }
    })
  ],
  modules: {
    advertItem,
    setUp

  }
})

export default store
