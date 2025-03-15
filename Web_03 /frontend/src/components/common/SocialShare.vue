<template>
  <div class="flex space-x-4">
    <!-- Facebook -->
    <button
      @click="share('facebook')"
      class="text-blue-600 hover:text-blue-700 transition-colors"
      :title="'Facebook\'ta paylaş'"
    >
      <i class="fab fa-facebook text-xl"></i>
    </button>

    <!-- Twitter -->
    <button
      @click="share('twitter')"
      class="text-blue-400 hover:text-blue-500 transition-colors"
      :title="'Twitter\'da paylaş'"
    >
      <i class="fab fa-twitter text-xl"></i>
    </button>

    <!-- LinkedIn -->
    <button
      @click="share('linkedin')"
      class="text-blue-700 hover:text-blue-800 transition-colors"
      :title="'LinkedIn\'de paylaş'"
    >
      <i class="fab fa-linkedin text-xl"></i>
    </button>

    <!-- WhatsApp -->
    <button
      @click="share('whatsapp')"
      class="text-green-500 hover:text-green-600 transition-colors"
      :title="'WhatsApp\'ta paylaş'"
    >
      <i class="fab fa-whatsapp text-xl"></i>
    </button>

    <!-- Kopyala -->
    <button
      @click="copyLink"
      class="text-gray-600 hover:text-gray-700 transition-colors relative"
      :title="copied ? 'Kopyalandı!' : 'Bağlantıyı kopyala'"
    >
      <i class="fas fa-link text-xl"></i>
      <span
        v-if="copied"
        class="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded"
      >
        Kopyalandı!
      </span>
    </button>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'SocialShare',

  props: {
    url: {
      type: String,
      default: () => window.location.href
    },
    title: {
      type: String,
      default: () => document.title
    },
    description: {
      type: String,
      default: ''
    }
  },

  setup(props) {
    const copied = ref(false)

    const share = (platform) => {
      const shareUrls = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(props.url)}`,
        twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(props.url)}&text=${encodeURIComponent(props.title)}`,
        linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(props.url)}&title=${encodeURIComponent(props.title)}&summary=${encodeURIComponent(props.description)}`,
        whatsapp: `https://wa.me/?text=${encodeURIComponent(`${props.title} ${props.url}`)}`
      }

      window.open(shareUrls[platform], '_blank', 'width=600,height=400')
    }

    const copyLink = async () => {
      try {
        await navigator.clipboard.writeText(props.url)
        copied.value = true
        setTimeout(() => {
          copied.value = false
        }, 2000)
      } catch (error) {
        console.error('Bağlantı kopyalanırken hata oluştu:', error)
      }
    }

    return {
      copied,
      share,
      copyLink
    }
  }
}
</script> 