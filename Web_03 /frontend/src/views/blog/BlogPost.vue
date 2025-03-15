<template>
  <div class="container mx-auto px-4 py-8">
    <article v-if="post" class="max-w-3xl mx-auto">
      <img 
        :src="post.image" 
        :alt="post.title"
        class="w-full h-64 object-cover rounded-lg mb-8"
      >
      
      <h1 class="text-4xl font-bold mb-4">{{ post.title }}</h1>
      
      <div class="flex items-center text-gray-600 mb-8">
        <span>{{ formatDate(post.publishedAt) }}</span>
        <span class="mx-2">•</span>
        <span>{{ post.author }}</span>
      </div>
      
      <div class="prose prose-lg max-w-none" v-html="post.content"></div>
    </article>

    <div v-else class="text-center py-12">
      <p class="text-gray-600">Yükleniyor...</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BlogPost',
  data() {
    return {
      post: null
    }
  },
  async created() {
    try {
      const slug = this.$route.params.slug
      this.post = await this.$api.getBlogPost(slug)
    } catch (error) {
      console.error('Blog yazısı yüklenirken hata:', error)
    }
  },
  methods: {
    formatDate(date) {
      return new Date(date).toLocaleDateString('tr-TR')
    }
  }
}
</script> 