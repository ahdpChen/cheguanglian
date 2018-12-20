const setUp = {
  state: {
    employees: []
  },
  mutations: {
    SET_ADVERT_DETAIL: (state, employees) => {
      state.employees = employees
    }
  },
  actions: {
    setemployees ({ commit }, employees) {
      commit('SET_ADVERT_DETAIL', employees)
    }
  }
}

export default setUp
