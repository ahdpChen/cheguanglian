import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

import advertItem from './module/advertItem'
import setUp from './module/setUp'
import transactions from './module/transactions'
import deposit from './module/deposit'
import share from './data/share'
import bankCard from './data/bankCard'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    loginInfo: {},
    userInfo: {},
    share,
    bankCard,
    isLogin: false
  },
  mutations: {
    SET_LOGIN_INFO: (state, loginInfo) => {
      state.loginInfo = loginInfo
    },
    SET_LOGIN_STATUS: (state, isLogin) => {
      state.isLogin = isLogin
    },
    SET_USER_INFO: (state, userInfo) => {
      state.userInfo = userInfo
    }
  },
  actions: {
    setLoginInfo: ({ commit }, loginInfo) => {
      commit('SET_LOGIN_INFO', loginInfo)
    },
    setLoginStatus ({ commit }, isLogin) {
      commit('SET_LOGIN_STATUS', isLogin)
    },
    setUserInfo: ({ commit }, userInfo) => {
      commit('SET_USER_INFO', userInfo)
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
    setUp,
    transactions,
    deposit
  }
})

export default store
