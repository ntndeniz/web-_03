export default {
  namespaced: true,
  state: {
    items: []
  },
  mutations: {
    ADD_TO_CART(state, product) {
      const existingItem = state.items.find(item => item.id === product.id)
      
      if (existingItem) {
        existingItem.quantity++
      } else {
        state.items.push({
          ...product,
          quantity: 1
        })
      }
    },
    REMOVE_FROM_CART(state, productId) {
      const index = state.items.findIndex(item => item.id === productId)
      if (index > -1) {
        state.items.splice(index, 1)
      }
    },
    UPDATE_QUANTITY(state, { productId, quantity }) {
      const item = state.items.find(item => item.id === productId)
      if (item) {
        item.quantity = quantity
      }
    },
    CLEAR_CART(state) {
      state.items = []
    }
  },
  actions: {
    addToCart({ commit }, product) {
      commit('ADD_TO_CART', product)
    },
    removeFromCart({ commit }, productId) {
      commit('REMOVE_FROM_CART', productId)
    },
    updateQuantity({ commit }, payload) {
      commit('UPDATE_QUANTITY', payload)
    },
    clearCart({ commit }) {
      commit('CLEAR_CART')
    }
  },
  getters: {
    cartItems: state => state.items,
    cartTotal: state => state.items.reduce((total, item) => total + (item.price * item.quantity), 0),
    cartCount: state => state.items.reduce((count, item) => count + item.quantity, 0)
  }
} 