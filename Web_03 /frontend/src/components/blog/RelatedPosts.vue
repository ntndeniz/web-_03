<template>
  <section class="space-y-6">
    <h2 class="text-2xl font-bold">İlgili Yazılar</h2>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <article 
        v-for="post in relatedPosts" 
        :key="post.id"
        class="bg-white rounded-lg shadow-md overflow-hidden"
      >
        <router-link :to="`/blog/${post.slug}`">
          <img 
            :src="post.image" 
            :alt="post.title"
            class="w-full h-48 object-cover"
          >
        </router-link>
        
        <div class="p-4">
          <div class="text-sm text-gray-500 mb-2">
            {{ formatDate(post.date) }}
          </div>
          
          <h3 class="font-bold mb-2">
            <router-link 
              :to="`/blog/${post.slug}`"
              class="hover:text-blue-600"
            >
              {{ post.title }}
            </router-link>
          </h3>
          
          <p class="text-gray-600 text-sm line-clamp-2">
            {{ post.excerpt }}
          </p>
        </div>
      </article>
    </div>
  </section>
</template>

<script>
export default {
  name: 'RelatedPosts',
  props: {
    currentPostId: {
      type: String,
      required: true
    },
    tags: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      relatedPosts: []
    }
  },
  methods: {
    formatDate(date) {
      return new Date(date).toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    },
    async fetchRelatedPosts() {
      try {
        const response = await this.$store.dispatch('blog/fetchRelatedPosts', {
          postId: this.currentPostId,
          tags: this.tags
        })
        this.relatedPosts = response
      } catch (error) {
        console.error('İlgili yazılar yüklenirken hata:', error)
      }
    }
  },
  created() {
    this.fetchRelatedPosts()
  },
  watch: {
    currentPostId() {
      this.fetchRelatedPosts()
    }
  }
}
</script> 