<template>
  <div class="social-media-container">
    <div class="share-section">
      <h3 class="section-title">Sosyal Medyada Paylaş</h3>
      
      <div class="share-buttons">
        <button 
          v-for="platform in sharePlatforms"
          :key="platform.id"
          class="share-button"
          :class="platform.class"
          @click="share(platform)"
        >
          <i :class="platform.icon"></i>
          {{ platform.name }}
        </button>
      </div>
    </div>

    <div class="feed-section" v-if="showFeed">
      <h3 class="section-title">Sosyal Medya Akışı</h3>
      
      <div class="platform-tabs">
        <button
          v-for="platform in feedPlatforms"
          :key="platform.id"
          class="tab-button"
          :class="{ active: selectedPlatform === platform.id }"
          @click="selectedPlatform = platform.id"
        >
          <i :class="platform.icon"></i>
          {{ platform.name }}
        </button>
      </div>

      <div v-if="loading" class="loading-state">
        <LoadingSpinner />
      </div>

      <div v-else-if="error" class="error-state">
        <ErrorMessage :message="error" />
      </div>

      <div v-else class="feed-grid">
        <div
          v-for="post in filteredPosts"
          :key="post.id"
          class="feed-item"
        >
          <div class="post-header">
            <img :src="post.author.avatar" :alt="post.author.name" class="author-avatar" />
            <div class="author-info">
              <span class="author-name">{{ post.author.name }}</span>
              <span class="post-date">{{ formatDate(post.date) }}</span>
            </div>
          </div>

          <div class="post-content">
            <p class="post-text">{{ post.text }}</p>
            <img v-if="post.image" :src="post.image" :alt="post.text" class="post-image" />
          </div>

          <div class="post-stats">
            <span class="stat-item">
              <i class="fas fa-heart"></i>
              {{ post.likes }}
            </span>
            <span class="stat-item">
              <i class="fas fa-comment"></i>
              {{ post.comments }}
            </span>
            <span class="stat-item">
              <i class="fas fa-share"></i>
              {{ post.shares }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { formatDate } from '@/helpers/date'
import { notify } from '@/utils/notification'
import LoadingSpinner from '@/components/shared/LoadingSpinner.vue'
import ErrorMessage from '@/components/shared/ErrorMessage.vue'

export default {
  name: 'SocialMedia',

  components: {
    LoadingSpinner,
    ErrorMessage
  },

  props: {
    showFeed: {
      type: Boolean,
      default: true
    },
    url: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: ''
    },
    image: {
      type: String,
      default: ''
    }
  },

  setup(props) {
    const store = useStore()
    const loading = ref(false)
    const error = ref(null)
    const selectedPlatform = ref('instagram')

    const sharePlatforms = [
      {
        id: 'facebook',
        name: 'Facebook',
        icon: 'fab fa-facebook',
        class: 'facebook',
        shareUrl: `https://www.facebook.com/sharer/sharer.php?u=${props.url}`
      },
      {
        id: 'twitter',
        name: 'Twitter',
        icon: 'fab fa-twitter',
        class: 'twitter',
        shareUrl: `https://twitter.com/intent/tweet?url=${props.url}&text=${props.title}`
      },
      {
        id: 'linkedin',
        name: 'LinkedIn',
        icon: 'fab fa-linkedin',
        class: 'linkedin',
        shareUrl: `https://www.linkedin.com/shareArticle?mini=true&url=${props.url}&title=${props.title}`
      },
      {
        id: 'whatsapp',
        name: 'WhatsApp',
        icon: 'fab fa-whatsapp',
        class: 'whatsapp',
        shareUrl: `https://api.whatsapp.com/send?text=${props.title} ${props.url}`
      }
    ]

    const feedPlatforms = [
      {
        id: 'instagram',
        name: 'Instagram',
        icon: 'fab fa-instagram'
      },
      {
        id: 'facebook',
        name: 'Facebook',
        icon: 'fab fa-facebook'
      },
      {
        id: 'twitter',
        name: 'Twitter',
        icon: 'fab fa-twitter'
      }
    ]

    // Sosyal medya paylaşımı
    const share = (platform) => {
      window.open(platform.shareUrl, '_blank', 'width=600,height=400')
      
      // Analitiğe kaydet
      store.dispatch('analytics/trackSocialShare', {
        platform: platform.id,
        url: props.url
      })
    }

    // Feed verilerini getir
    const fetchFeed = async () => {
      try {
        loading.value = true
        await store.dispatch('social/fetchFeed', selectedPlatform.value)
      } catch (err) {
        error.value = 'Feed yüklenemedi'
        notify.error(error.value)
      } finally {
        loading.value = false
      }
    }

    // Filtrelenmiş gönderiler
    const filteredPosts = computed(() => {
      return store.state.social.posts.filter(
        post => post.platform === selectedPlatform.value
      )
    })

    return {
      loading,
      error,
      selectedPlatform,
      sharePlatforms,
      feedPlatforms,
      filteredPosts,
      share,
      formatDate
    }
  }
}
</script>

<style scoped>
.social-media-container {
  @apply space-y-8;
}

.section-title {
  @apply text-xl font-semibold text-gray-800 mb-4;
}

.share-buttons {
  @apply grid grid-cols-2 md:grid-cols-4 gap-4;
}

.share-button {
  @apply flex items-center justify-center gap-2 px-4 py-2 rounded-md text-white transition-colors;
}

.share-button.facebook {
  @apply bg-[#1877F2] hover:bg-[#0d65d9];
}

.share-button.twitter {
  @apply bg-[#1DA1F2] hover:bg-[#0c8de0];
}

.share-button.linkedin {
  @apply bg-[#0A66C2] hover:bg-[#084e95];
}

.share-button.whatsapp {
  @apply bg-[#25D366] hover:bg-[#1da84d];
}

.platform-tabs {
  @apply flex gap-4 mb-6;
}

.tab-button {
  @apply flex items-center gap-2 px-4 py-2 rounded-md text-gray-600 hover:text-gray-800 transition-colors;
}

.tab-button.active {
  @apply bg-gray-100 text-gray-800;
}

.feed-grid {
  @apply grid gap-6;
}

.feed-item {
  @apply bg-white rounded-lg shadow-md overflow-hidden;
}

.post-header {
  @apply flex items-center gap-3 p-4;
}

.author-avatar {
  @apply w-10 h-10 rounded-full;
}

.author-info {
  @apply flex flex-col;
}

.author-name {
  @apply font-medium;
}

.post-date {
  @apply text-sm text-gray-500;
}

.post-content {
  @apply p-4;
}

.post-text {
  @apply text-gray-800 mb-4;
}

.post-image {
  @apply w-full rounded-md;
}

.post-stats {
  @apply flex justify-around p-4 border-t border-gray-100;
}

.stat-item {
  @apply flex items-center gap-2 text-gray-600;
}

.loading-state,
.error-state {
  @apply flex justify-center items-center min-h-[200px];
}
</style> 