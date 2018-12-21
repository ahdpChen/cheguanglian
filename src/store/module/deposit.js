const deposit = {
  state: {
    bankInfo: {}
  },
  mutations: {
    SET_BANK_INFO: (state, bankInfo) => {
      state.bankInfo = bankInfo
    }
  },
  actions: {
    setBankIfo ({ commit }, bankInfo) {
      commit('SET_BANK_INFO', bankInfo)
    }
  }
}

export default deposit
