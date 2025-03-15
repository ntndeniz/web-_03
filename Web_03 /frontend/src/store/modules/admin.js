import { db } from '@/firebase'

export default {
  namespaced: true,

  state: {
    orders: [],
    products: [],
    customers: [],
    campaigns: [],
    coupons: [],
    settings: null,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
    loading: false,
    error: null
  },

  mutations: {
    SET_ORDERS(state, orders) {
      state.orders = orders
    },
    SET_PRODUCTS(state, products) {
      state.products = products
    },
    SET_CUSTOMERS(state, customers) {
      state.customers = customers
    },
    SET_CAMPAIGNS(state, campaigns) {
      state.campaigns = campaigns
    },
    SET_COUPONS(state, coupons) {
      state.coupons = coupons
    },
    SET_SETTINGS(state, settings) {
      state.settings = settings
    },
    SET_TOTAL_ORDERS(state, total) {
      state.totalOrders = total
    },
    SET_TOTAL_PRODUCTS(state, total) {
      state.totalProducts = total
    },
    SET_TOTAL_CUSTOMERS(state, total) {
      state.totalCustomers = total
    },
    SET_LOADING(state, loading) {
      state.loading = loading
    },
    SET_ERROR(state, error) {
      state.error = error
    }
  },

  actions: {
    // Siparişler
    async fetchOrders({ commit }, { page = 1, ...filters } = {}) {
      commit('SET_LOADING', true)
      
      try {
        const ordersRef = db.collection('orders')
        let query = ordersRef.orderBy('createdAt', 'desc')

        // Filtreleri uygula
        if (filters.status) {
          query = query.where('status', '==', filters.status)
        }
        if (filters.search) {
          query = query.where('orderNumber', '==', filters.search)
        }

        // Sayfalama
        const limit = 10
        const snapshot = await query
          .limit(limit)
          .offset((page - 1) * limit)
          .get()

        const orders = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))

        // Toplam sipariş sayısını al
        const totalSnapshot = await query.count().get()
        commit('SET_TOTAL_ORDERS', totalSnapshot.data().count)
        
        commit('SET_ORDERS', orders)
      } catch (error) {
        commit('SET_ERROR', error.message)
      } finally {
        commit('SET_LOADING', false)
      }
    },

    // Ürünler
    async fetchProducts({ commit }, { page = 1, ...filters } = {}) {
      commit('SET_LOADING', true)
      
      try {
        const productsRef = db.collection('products')
        let query = productsRef.orderBy('createdAt', 'desc')

        // Filtreleri uygula
        if (filters.category) {
          query = query.where('categoryId', '==', filters.category)
        }
        if (filters.stock) {
          switch (filters.stock) {
            case 'in_stock':
              query = query.where('stock', '>', 0)
              break
            case 'low_stock':
              query = query.where('stock', '<', 10)
              break
            case 'out_of_stock':
              query = query.where('stock', '==', 0)
              break
          }
        }

        // Sayfalama
        const limit = 12
        const snapshot = await query
          .limit(limit)
          .offset((page - 1) * limit)
          .get()

        const products = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))

        // Toplam ürün sayısını al
        const totalSnapshot = await query.count().get()
        commit('SET_TOTAL_PRODUCTS', totalSnapshot.data().count)
        
        commit('SET_PRODUCTS', products)
      } catch (error) {
        commit('SET_ERROR', error.message)
      } finally {
        commit('SET_LOADING', false)
      }
    },

    // Ayarlar
    async fetchSettings({ commit }) {
      commit('SET_LOADING', true)
      
      try {
        const doc = await db.collection('settings').doc('general').get()
        const settings = doc.data()
        commit('SET_SETTINGS', settings)
        return settings
      } catch (error) {
        commit('SET_ERROR', error.message)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async updateSettings({ commit }, settings) {
      commit('SET_LOADING', true)
      
      try {
        await db.collection('settings').doc('general').update(settings)
        commit('SET_SETTINGS', settings)
      } catch (error) {
        commit('SET_ERROR', error.message)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    }
  }
} 