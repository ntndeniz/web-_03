export default {
  data() {
    return {
      filters: {
        search: '',
        category: '',
        minPrice: null,
        maxPrice: null,
        brand: [],
        rating: null,
        inStock: null
      },
      sortBy: 'newest',
      sortOptions: [
        { value: 'newest', label: 'En Yeniler' },
        { value: 'price_asc', label: 'Fiyat (Düşükten Yükseğe)' },
        { value: 'price_desc', label: 'Fiyat (Yüksekten Düşüğe)' },
        { value: 'name_asc', label: 'İsim (A-Z)' },
        { value: 'name_desc', label: 'İsim (Z-A)' },
        { value: 'rating', label: 'En Çok Değerlendirilenler' },
        { value: 'popularity', label: 'En Popülerler' }
      ]
    }
  },

  computed: {
    /**
     * Aktif filtre sayısı
     */
    activeFilterCount() {
      return Object.values(this.filters).filter(value => {
        if (Array.isArray(value)) return value.length > 0
        if (typeof value === 'string') return value.trim() !== ''
        return value !== null
      }).length
    }
  },

  methods: {
    /**
     * Filtreleri uygula
     */
    applyFilters() {
      this.$emit('filters-changed', this.filters)
    },

    /**
     * Sıralamayı değiştir
     * @param {string} value - Sıralama değeri
     */
    updateSort(value) {
      this.sortBy = value
      this.$emit('sort-changed', value)
    },

    /**
     * Tüm filtreleri temizle
     */
    clearFilters() {
      this.filters = {
        search: '',
        category: '',
        minPrice: null,
        maxPrice: null,
        brand: [],
        rating: null,
        inStock: null
      }
      this.applyFilters()
    },

    /**
     * Belirli bir filtreyi temizle
     * @param {string} key - Filtre anahtarı
     */
    clearFilter(key) {
      if (Array.isArray(this.filters[key])) {
        this.filters[key] = []
      } else {
        this.filters[key] = null
      }
      this.applyFilters()
    },

    /**
     * Fiyat aralığını güncelle
     * @param {number} min - Minimum fiyat
     * @param {number} max - Maksimum fiyat
     */
    updatePriceRange(min, max) {
      this.filters.minPrice = min
      this.filters.maxPrice = max
      this.applyFilters()
    },

    /**
     * Arama sorgusunu güncelle
     * @param {string} query - Arama sorgusu
     */
    updateSearch(query) {
      this.filters.search = query
      this.applyFilters()
    }
  },

  watch: {
    // Filtreler değiştiğinde otomatik uygula
    filters: {
      deep: true,
      handler() {
        this.applyFilters()
      }
    }
  }
} 