<template>
  <div class="space-y-4">
    <h3 class="font-semibold">Bu Ürünü Paylaş</h3>
    <div class="flex space-x-4">
      <button 
        @click="share('facebook')"
        class="text-blue-600 hover:text-blue-700"
        aria-label="Facebook'ta paylaş"
      >
        <i class="fab fa-facebook text-2xl"></i>
      </button>
      
      <button 
        @click="share('twitter')"
        class="text-blue-400 hover:text-blue-500"
        aria-label="Twitter'da paylaş"
      >
        <i class="fab fa-twitter text-2xl"></i>
      </button>
      
      <button 
        @click="share('whatsapp')"
        class="text-green-500 hover:text-green-600"
        aria-label="WhatsApp'ta paylaş"
      >
        <i class="fab fa-whatsapp text-2xl"></i>
      </button>
      
      <button 
        @click="copyLink"
        class="text-gray-600 hover:text-gray-700"
        aria-label="Bağlantıyı kopyala"
      >
        <i class="fas fa-link text-2xl"></i>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProductShare',
  props: {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: ''
    }
  },
  methods: {
    share(platform) {
      const url = encodeURIComponent(window.location.href)
      const text = encodeURIComponent(this.title)
      
      const shareUrls = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
        twitter: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
        whatsapp: `https://wa.me/?text=${text}%20${url}`
      }
      
      window.open(shareUrls[platform], '_blank')
    },
    async copyLink() {
      try {
        await navigator.clipboard.writeText(window.location.href)
        this.$toast.success('Bağlantı kopyalandı')
      } catch (error) {
        this.$toast.error('Bağlantı kopyalanırken bir hata oluştu')
      }
    }
  }
}
</script> 