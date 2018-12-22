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
    setAdvertItem ({ commit }, advertItem) {
      commit('SET_ADVERT_DETAIL', advertItem)
    }
  }
}

export default advertItem
