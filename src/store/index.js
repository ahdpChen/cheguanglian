import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

import advertItem from './module/advertItem'
import setUp from './module/setUp'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    loginInfo: {},
    isLogin: false
  },
  mutations: {
    SET_LOGIN_INFO: (state, loginInfo) => {
      state.loginInfo = loginInfo
    },
    SET_LOGIN_STATUS: (state, isLogin) => {
      state.isLogin = isLogin
    }
  },
  actions: {
    setLoginInfo: ({ commit }, loginInfo) => {
      commit('SET_LOGIN_INFO', loginInfo)
    },
    setLoginStatus ({ commit }, isLogin) {
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
