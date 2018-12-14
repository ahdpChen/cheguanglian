const advertItem = {
  state: {
    advertItem: []
  },
  mutations: {
    SET_ADVERT_DETAIL: (state, advertItem) => {
      state.advertItem = advertItem
    }
  },
  actions: {
    setLoginStatus ({ commit, state }, isLogin) {
      commit('SET_LOGIN_STATUS', isLogin)
    },
    setAdvertItem ({ commit, state }, advertItem) {
      console.log('setAdvertItem', advertItem)
      commit('SET_ADVERT_DETAIL', advertItem)
    }
  }
}

export default advertItem
