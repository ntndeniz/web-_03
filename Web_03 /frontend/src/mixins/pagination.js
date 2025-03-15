export default {
  data() {
    return {
      currentPage: 1,
      totalPages: 1,
      perPage: 10,
      totalItems: 0
    }
  },

  computed: {
    /**
     * Sayfa numaralarını hesapla
     */
    pages() {
      const pages = []
      let startPage = Math.max(1, this.currentPage - 2)
      let endPage = Math.min(this.totalPages, this.currentPage + 2)

      // Başlangıç sayfasını ayarla
      if (endPage - startPage < 4) {
        if (this.currentPage <= 3) {
          endPage = Math.min(5, this.totalPages)
        } else {
          startPage = Math.max(1, this.totalPages - 4)
        }
      }

      // Sayfa numaralarını oluştur
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i)
      }

      return pages
    },

    /**
     * Önceki sayfa var mı?
     */
    hasPrevPage() {
      return this.currentPage > 1
    },

    /**
     * Sonraki sayfa var mı?
     */
    hasNextPage() {
      return this.currentPage < this.totalPages
    },

    /**
     * Sayfalama bilgisi
     */
    paginationInfo() {
      const start = (this.currentPage - 1) * this.perPage + 1
      const end = Math.min(start + this.perPage - 1, this.totalItems)
      return `${start}-${end} / ${this.totalItems}`
    }
  },

  methods: {
    /**
     * Sayfa değiştir
     * @param {number} page - Sayfa numarası
     */
    changePage(page) {
      if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
        this.currentPage = page
        this.$emit('page-changed', page)
      }
    },

    /**
     * Önceki sayfaya git
     */
    prevPage() {
      if (this.hasPrevPage) {
        this.changePage(this.currentPage - 1)
      }
    },

    /**
     * Sonraki sayfaya git
     */
    nextPage() {
      if (this.hasNextPage) {
        this.changePage(this.currentPage + 1)
      }
    },

    /**
     * Sayfa başına gösterilecek öğe sayısını güncelle
     * @param {number} value - Öğe sayısı
     */
    updatePerPage(value) {
      this.perPage = value
      this.currentPage = 1
      this.$emit('per-page-changed', value)
    },

    /**
     * Toplam sayfa sayısını hesapla
     * @param {number} totalItems - Toplam öğe sayısı
     */
    calculateTotalPages(totalItems) {
      this.totalItems = totalItems
      this.totalPages = Math.ceil(totalItems / this.perPage)
      if (this.currentPage > this.totalPages) {
        this.currentPage = this.totalPages
      }
    }
  }
} 