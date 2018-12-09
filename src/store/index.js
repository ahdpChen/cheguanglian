import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

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
    setLoginStatus ({ commit, state }) {
      const isLogin = !state.isLogin
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
  ]

// ---------------------
// 作者：卫夫子
// 来源：CSDN
// 原文：https://blog.csdn.net/qq_31393401/article/details/80728523
// 版权声明：本文为博主原创文章，转载请附上博文链接！
})

export default store
