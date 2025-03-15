export default {
  namespaced: true,
  
  state: {
    items: [
      {
        id: 1,
        name: 'Premium Kulaklık',
        description: 'Yüksek kaliteli ses deneyimi sunan kablosuz kulaklık',
        price: 1299.99,
        oldPrice: 1499.99,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
        rating: 4,
        reviewCount: 128,
        categoryId: 1,
        isFavorite: false
      },
      {
        id: 2,
        name: 'Akıllı Saat',
        description: 'Şık tasarım ve gelişmiş özelliklere sahip akıllı saat',
        price: 2499.99,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
        rating: 5,
        reviewCount: 89,
        categoryId: 1,
        isFavorite: true
      },
      {
        id: 3,
        name: 'Güneş Gözlüğü',
        description: 'Modern ve zarif tasarım',
        price: 799.99,
        image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f',
        rating: 4,
        reviewCount: 45,
        categoryId: 3,
        isFavorite: false
      },
      {
        id: 4,
        name: 'Kablosuz Hoparlör',
        description: 'Güçlü ses performansı',
        price: 999.99,
        image: 'https://images.unsplash.com/photo-1484704849700-f032a6c91816',
        rating: 4,
        reviewCount: 67,
        categoryId: 1,
        isFavorite: false
      }
    ]
  },

  getters: {
    getFilteredProducts: (state) => (filters) => {
      let result = [...state.items]
      
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        result = result.filter(product => 
          product.name.toLowerCase().includes(searchLower) ||
          product.description.toLowerCase().includes(searchLower)
        )
      }
      
      if (filters.category) {
        result = result.filter(product => 
          product.categoryId === parseInt(filters.category)
        )
      }
      
      switch (filters.sort) {
        case 'price_asc':
          result.sort((a, b) => a.price - b.price)
          break
        case 'price_desc':
          result.sort((a, b) => b.price - a.price)
          break
        case 'newest':
          result.sort((a, b) => b.id - a.id)
          break
      }
      
      return result
    },

    getTotalCount: (state) => state.items.length
  },

  actions: {
    async fetchProducts({ commit }) {
      // API çağrısı burada yapılacak
      // Şimdilik mevcut state'i kullanıyoruz
    }
  }
} 