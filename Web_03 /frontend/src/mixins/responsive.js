export default {
  data() {
    return {
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
      breakpoints: {
        xs: 0,
        sm: 640,
        md: 768,
        lg: 1024,
        xl: 1280,
        '2xl': 1536
      }
    }
  },

  computed: {
    /**
     * Ekran boyutu kontrolleri
     */
    isXs() {
      return this.windowWidth < this.breakpoints.sm
    },
    isSm() {
      return this.windowWidth >= this.breakpoints.sm && this.windowWidth < this.breakpoints.md
    },
    isMd() {
      return this.windowWidth >= this.breakpoints.md && this.windowWidth < this.breakpoints.lg
    },
    isLg() {
      return this.windowWidth >= this.breakpoints.lg && this.windowWidth < this.breakpoints.xl
    },
    isXl() {
      return this.windowWidth >= this.breakpoints.xl && this.windowWidth < this.breakpoints['2xl']
    },
    is2Xl() {
      return this.windowWidth >= this.breakpoints['2xl']
    },

    /**
     * Genel ekran boyutu kontrolleri
     */
    isMobile() {
      return this.windowWidth < this.breakpoints.md
    },
    isTablet() {
      return this.windowWidth >= this.breakpoints.md && this.windowWidth < this.breakpoints.lg
    },
    isDesktop() {
      return this.windowWidth >= this.breakpoints.lg
    },

    /**
     * Ekran yönü
     */
    isPortrait() {
      return this.windowHeight > this.windowWidth
    },
    isLandscape() {
      return this.windowWidth > this.windowHeight
    }
  },

  methods: {
    /**
     * Pencere boyutunu güncelle
     */
    updateWindowSize() {
      this.windowWidth = window.innerWidth
      this.windowHeight = window.innerHeight
    },

    /**
     * Belirli bir breakpoint'ten büyük mü?
     * @param {string} breakpoint - Breakpoint adı
     */
    isGreaterThan(breakpoint) {
      return this.windowWidth >= this.breakpoints[breakpoint]
    },

    /**
     * Belirli bir breakpoint'ten küçük mü?
     * @param {string} breakpoint - Breakpoint adı
     */
    isLessThan(breakpoint) {
      return this.windowWidth < this.breakpoints[breakpoint]
    }
  },

  mounted() {
    window.addEventListener('resize', this.updateWindowSize)
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.updateWindowSize)
  }
} 