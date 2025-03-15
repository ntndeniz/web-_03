import axios from 'axios'

export default {
  namespaced: true,

  state: {
    posts: [],
    post: null,
    categories: [],
    loading: false,
    error: null
  },

  mutations: {
    SET_POSTS(state, posts) {
      state.posts = posts
    },
    SET_POST(state, post) {
      state.post = post
    },
    SET_CATEGORIES(state, categories) {
      state.categories = categories
    },
    SET_LOADING(state, status) {
      state.loading = status
    },
    SET_ERROR(state, error) {
      state.error = error
    }
  },

  actions: {
    // Blog yazılarını getir
    async fetchPosts({ commit }, { page = 1, category = null } = {}) {
      commit('SET_LOADING', true)
      try {
        console.log('API isteği yapılıyor...') // Debug için log
        const response = await axios.get(`${process.env.VUE_APP_API_URL}/api/blog/posts`, {
          params: {
            page,
            category
          }
        })
        console.log('API yanıtı:', response.data) // Debug için log
        commit('SET_POSTS', response.data.posts)
        return response.data
      } catch (error) {
        console.error('Blog yazıları yüklenirken hata:', error)
        commit('SET_ERROR', error.message)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    // Tekil blog yazısını getir
    async fetchPost({ commit }, slug) {
      commit('SET_LOADING', true)
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_URL}/api/blog/posts/${slug}`)
        commit('SET_POST', response.data)
        return response.data
      } catch (error) {
        commit('SET_ERROR', error.message)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    // Blog kategorilerini getir
    async fetchCategories({ commit }) {
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_URL}/api/blog/categories`)
        commit('SET_CATEGORIES', response.data)
        return response.data
      } catch (error) {
        commit('SET_ERROR', error.message)
        throw error
      }
    }
  },

  getters: {
    allPosts: state => state.posts,
    currentPost: state => state.post,
    allCategories: state => state.categories,
    isLoading: state => state.loading,
    error: state => state.error,
    hasError: state => state.error
  }
} 