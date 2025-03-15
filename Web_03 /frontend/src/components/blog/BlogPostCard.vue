<template>
  <article class="group overflow-hidden rounded-lg border bg-white shadow-sm transition hover:shadow-md">
    <!-- Blog Görseli -->
    <div class="relative aspect-video overflow-hidden">
      <img 
        :src="post.image" 
        :alt="post.title"
        class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      
      <!-- Kategori Etiketi -->
      <div 
        class="absolute left-4 top-4 rounded bg-blue-600 px-3 py-1 text-sm text-white"
      >
        {{ post.category }}
      </div>
    </div>

    <!-- İçerik -->
    <div class="p-6">
      <!-- Başlık -->
      <h3 class="mb-2 text-xl font-bold">
        <router-link 
          :to="`/blog/${post.slug}`"
          class="hover:text-blue-600"
        >
          {{ post.title }}
        </router-link>
      </h3>

      <!-- Özet -->
      <p class="mb-4 text-gray-600">
        {{ post.excerpt }}
      </p>

      <!-- Alt Bilgiler -->
      <div class="flex items-center justify-between border-t pt-4 text-sm text-gray-500">
        <!-- Yazar ve Tarih -->
        <div class="flex items-center space-x-4">
          <div class="flex items-center space-x-2">
            <img 
              :src="post.author.avatar" 
              :alt="post.author.name"
              class="h-6 w-6 rounded-full"
            />
            <span>{{ post.author.name }}</span>
          </div>
          <span>{{ formatDate(post.publishedAt) }}</span>
        </div>

        <!-- Okuma Süresi -->
        <div class="flex items-center space-x-1">
          <i class="fas fa-clock"></i>
          <span>{{ post.readingTime }} dk</span>
        </div>
      </div>
    </div>
  </article>
</template>

<script>
export default {
  name: 'BlogPostCard',
  props: {
    post: {
      type: Object,
      required: true,
      validator: (post) => {
        return [
          'title',
          'slug',
          'excerpt',
          'image',
          'category',
          'author',
          'publishedAt',
          'readingTime'
        ].every(prop => prop in post)
      }
    }
  },
  setup() {
    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }

    return {
      formatDate
    }
  }
}
</script> 