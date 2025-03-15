import OrderService from '@/services/order.service';

export default {
  namespaced: true,

  state: {
    orders: [],
    currentOrder: null,
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      perPage: 10
    },
    loading: false,
    error: null
  },

  mutations: {
    SET_ORDERS(state, orders) {
      state.orders = orders;
    },
    SET_CURRENT_ORDER(state, order) {
      state.currentOrder = order;
    },
    SET_PAGINATION(state, pagination) {
      state.pagination = { ...state.pagination, ...pagination };
    },
    SET_LOADING(state, status) {
      state.loading = status;
    },
    SET_ERROR(state, error) {
      state.error = error;
    }
  },

  actions: {
    async fetchOrders({ commit, state }) {
      try {
        commit('SET_LOADING', true);
        const response = await OrderService.getOrders({
          page: state.pagination.currentPage,
          limit: state.pagination.perPage
        });
        
        commit('SET_ORDERS', response.data.orders);
        commit('SET_PAGINATION', {
          totalPages: response.data.totalPages,
          totalItems: response.data.totalItems
        });
      } catch (error) {
        commit('SET_ERROR', error.message);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async fetchOrderById({ commit }, orderId) {
      try {
        commit('SET_LOADING', true);
        const response = await OrderService.getOrderById(orderId);
        commit('SET_CURRENT_ORDER', response.data);
      } catch (error) {
        commit('SET_ERROR', error.message);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async createOrder({ commit }, orderData) {
      try {
        commit('SET_LOADING', true);
        const response = await OrderService.createOrder(orderData);
        commit('SET_CURRENT_ORDER', response.data);
        return response.data;
      } catch (error) {
        commit('SET_ERROR', error.message);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async cancelOrder({ commit }, orderId) {
      try {
        commit('SET_LOADING', true);
        await OrderService.cancelOrder(orderId);
        const response = await OrderService.getOrderById(orderId);
        commit('SET_CURRENT_ORDER', response.data);
      } catch (error) {
        commit('SET_ERROR', error.message);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    setPage({ commit, dispatch }, page) {
      commit('SET_PAGINATION', { currentPage: page });
      return dispatch('fetchOrders');
    }
  },

  getters: {
    orderById: state => id => {
      return state.orders.find(order => order.id === id);
    },
    hasOrders: state => state.orders.length > 0,
    pendingOrders: state => {
      return state.orders.filter(order => order.status === 'pending');
    },
    completedOrders: state => {
      return state.orders.filter(order => order.status === 'completed');
    }
  }
}; 