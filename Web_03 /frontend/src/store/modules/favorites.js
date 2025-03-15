export default {
  namespaced: true,
  
  state: {
    items: []
  },
  
  mutations: {
    TOGGLE_FAVORITE(state, product) {
      const index = state.items.findIndex(item => item.id === product.id)
      if (index > -1) {
        state.items.splice(index, 1)
      } else {
        state.items.push(product)
      }
    }
  },
  
  actions: {
    toggle({ commit }, product) {
      commit('TOGGLE_FAVORITE', product)
    }
  }
} 