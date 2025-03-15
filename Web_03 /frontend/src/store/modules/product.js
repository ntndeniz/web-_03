import ProductService from '@/services/product.service';

export default {
  namespaced: true,

  state: {
    products: [],
    featuredProducts: [],
    currentProduct: null,
    filters: {
      category: null,
      priceRange: [0, 10000],
      brands: [],
      sort: 'newest'
    },
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      perPage: 20
    },
    loading: false,
    error: null
  },

  mutations: {
    SET_PRODUCTS(state, products) {
      state.products = products;
    },
    SET_FEATURED_PRODUCTS(state, products) {
      state.featuredProducts = products;
    },
    SET_CURRENT_PRODUCT(state, product) {
      state.currentProduct = product;
    },
    SET_FILTERS(state, filters) {
      state.filters = { ...state.filters, ...filters };
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
    async fetchProducts({ commit, state }) {
      try {
        commit('SET_LOADING', true);
        const response = await ProductService.getProducts({
          ...state.filters,
          page: state.pagination.currentPage,
          limit: state.pagination.perPage
        });
        
        commit('SET_PRODUCTS', response.data.products);
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

    async fetchFeaturedProducts({ commit }) {
      try {
        commit('SET_LOADING', true);
        const response = await ProductService.getFeaturedProducts();
        commit('SET_FEATURED_PRODUCTS', response.data);
      } catch (error) {
        commit('SET_ERROR', error.message);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async fetchProductById({ commit }, productId) {
      try {
        commit('SET_LOADING', true);
        const response = await ProductService.getProductById(productId);
        commit('SET_CURRENT_PRODUCT', response.data);
      } catch (error) {
        commit('SET_ERROR', error.message);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    }
  },

  getters: {
    filteredProducts: state => {
      return state.products;
    },
    productById: state => id => {
      return state.products.find(p => p.id === id);
    },
    hasNextPage: state => {
      return state.pagination.currentPage < state.pagination.totalPages;
    },
    hasPreviousPage: state => {
      return state.pagination.currentPage > 1;
    }
  }
}; 