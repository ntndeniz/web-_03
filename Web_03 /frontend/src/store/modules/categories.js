import { db } from '@/firebase'

export default {
  namespaced: true,

  state: {
    items: [
      {
        id: 1,
        name: 'Elektronik',
        description: 'Telefon, bilgisayar, tablet ve diğer elektronik ürünler',
        image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661',
        productCount: 150
      },
      {
        id: 2,
        name: 'Giyim',
        description: 'Erkek, kadın ve çocuk giyim ürünleri',
        image: 'https://images.unsplash.com/photo-1445205170230-053b83016050',
        productCount: 320
      },
      {
        id: 3,
        name: 'Ev & Yaşam',
        description: 'Ev dekorasyon ve yaşam ürünleri',
        image: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a',
        productCount: 180
      },
      {
        id: 4,
        name: 'Spor & Outdoor',
        description: 'Spor ekipmanları ve outdoor ürünleri',
        image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438',
        productCount: 90
      },
      {
        id: 5,
        name: 'Kozmetik',
        description: 'Kişisel bakım ve kozmetik ürünleri',
        image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796',
        productCount: 210
      },
      {
        id: 6,
        name: 'Kitap & Hobi',
        description: 'Kitaplar, müzik aletleri ve hobi ürünleri',
        image: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66',
        productCount: 140
      }
    ],
    loading: false,
    error: null
  },

  mutations: {
    SET_CATEGORIES(state, categories) {
      state.items = categories
    },
    ADD_CATEGORY(state, category) {
      state.items.push(category)
    },
    UPDATE_CATEGORY(state, { id, data }) {
      const index = state.items.findIndex(item => item.id === id)
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...data }
      }
    },
    DELETE_CATEGORY(state, id) {
      state.items = state.items.filter(item => item.id !== id)
    },
    SET_LOADING(state, loading) {
      state.loading = loading
    },
    SET_ERROR(state, error) {
      state.error = error
    }
  },

  actions: {
    // Kategorileri getir
    async fetchCategories({ commit }) {
      // API çağrısı burada yapılacak
      // Şimdilik mevcut state'i kullanıyoruz
    },

    // Yeni kategori ekle
    async createCategory({ commit }, categoryData) {
      commit('SET_LOADING', true)
      
      try {
        // Sıralama için son kategoriyi bul
        const lastCategory = await db.collection('categories')
          .orderBy('order', 'desc')
          .limit(1)
          .get()

        const order = lastCategory.empty ? 0 : lastCategory.docs[0].data().order + 1

        const docRef = await db.collection('categories').add({
          ...categoryData,
          order,
          active: true,
          createdAt: new Date()
        })

        const newCategory = {
          id: docRef.id,
          ...categoryData,
          order,
          active: true,
          createdAt: new Date()
        }

        commit('ADD_CATEGORY', newCategory)
      } catch (error) {
        commit('SET_ERROR', error.message)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    // Kategori güncelle
    async updateCategory({ commit }, { id, data }) {
      commit('SET_LOADING', true)
      
      try {
        await db.collection('categories').doc(id).update({
          ...data,
          updatedAt: new Date()
        })

        commit('UPDATE_CATEGORY', { id, data })
      } catch (error) {
        commit('SET_ERROR', error.message)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    // Kategori sil
    async deleteCategory({ commit }, id) {
      commit('SET_LOADING', true)
      
      try {
        // Önce kategoriye ait ürün var mı kontrol et
        const products = await db.collection('products')
          .where('categoryId', '==', id)
          .limit(1)
          .get()

        if (!products.empty) {
          throw new Error('Bu kategoriye ait ürünler var. Önce ürünleri silmelisiniz.')
        }

        await db.collection('categories').doc(id).delete()
        commit('DELETE_CATEGORY', id)
      } catch (error) {
        commit('SET_ERROR', error.message)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    // Kategori sırasını güncelle
    async updateCategoryOrder({ commit }, { id, newOrder }) {
      commit('SET_LOADING', true)
      
      try {
        await db.collection('categories').doc(id).update({
          order: newOrder,
          updatedAt: new Date()
        })

        commit('UPDATE_CATEGORY', { 
          id, 
          data: { order: newOrder, updatedAt: new Date() }
        })
      } catch (error) {
        commit('SET_ERROR', error.message)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    // Kategori durumunu değiştir (aktif/pasif)
    async toggleCategoryStatus({ commit }, id) {
      commit('SET_LOADING', true)
      
      try {
        const doc = await db.collection('categories').doc(id).get()
        const currentStatus = doc.data().active

        await db.collection('categories').doc(id).update({
          active: !currentStatus,
          updatedAt: new Date()
        })

        commit('UPDATE_CATEGORY', { 
          id, 
          data: { active: !currentStatus, updatedAt: new Date() }
        })
      } catch (error) {
        commit('SET_ERROR', error.message)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    }
  },

  getters: {
    activeCategories: state => state.items.filter(cat => cat.active),
    categoryById: state => id => state.items.find(cat => cat.id === id),
    categoriesCount: state => state.items.length,
    getAllCategories: (state) => state.items,
    getCategoryById: (state) => (id) => {
      return state.items.find(category => category.id === parseInt(id))
    }
  }
} 