const transactions = {
  state: {
    transactionsData: []
  },
  mutations: {
    SET_TRANSACTIONS: (state, transactions) => {
      state.transactionsData = [].concat(transactions)
    }
  },
  actions: {
    settransactions ({ commit }, transactions) {
      commit('SET_TRANSACTIONS', transactions)
    }
  }
}

export default transactions
