<template>
  <article class="prose prose-lg mx-auto max-w-4xl">
    <!-- Blog Başlığı -->
    <header class="mb-8 text-center">
      <h1 class="mb-4">{{ post.title }}</h1>
      
      <!-- Meta Bilgiler -->
      <div class="flex items-center justify-center space-x-6 text-gray-600">
        <!-- Yazar -->
        <div class="flex items-center space-x-2">
          <img 
            :src="post.author.avatar" 
            :alt="post.author.name"
            class="h-8 w-8 rounded-full"
          />
          <span>{{ post.author.name }}</span>
        </div>

        <!-- Tarih -->
        <div class="flex items-center space-x-1">
          <i class="fas fa-calendar"></i>
          <span>{{ formatDate(post.publishedAt) }}</span>
        </div>

        <!-- Okuma Süresi -->
        <div class="flex items-center space-x-1">
          <i class="fas fa-clock"></i>
          <span>{{ post.readingTime }} dk okuma</span>
        </div>

        <!-- Kategori -->
        <div class="flex items-center space-x-1">
          <i class="fas fa-folder"></i>
          <router-link 
            :to="`/blog/kategori/${post.category.slug}`"
            class="hover:text-blue-600"
          >
            {{ post.category.name }}
          </router-link>
        </div>
      </div>
    </header>

    <!-- Kapak Görseli -->
    <figure class="mb-8">
      <img 
        :src="post.image" 
        :alt="post.title"
        class="w-full rounded-lg object-cover"
      />
      <figcaption v-if="post.imageCaption" class="mt-2 text-center text-sm text-gray-600">
        {{ post.imageCaption }}
      </figcaption>
    </figure>

    <!-- İçerik -->
    <div 
      class="content"
      v-html="post.content"
    ></div>

    <!-- Etiketler -->
    <div v-if="post.tags?.length" class="mt-8">
      <div class="flex flex-wrap gap-2">
        <router-link
          v-for="tag in post.tags"
          :key="tag.slug"
          :to="`/blog/etiket/${tag.slug}`"
          class="rounded-full bg-gray-100 px-3 py-1 text-sm hover:bg-blue-100"
        >
          #{{ tag.name }}
        </router-link>
      </div>
    </div>

    <!-- Paylaşım Butonları -->
    <div class="mt-8 flex items-center justify-center space-x-4">
      <button 
        v-for="(social, index) in socialShare"
        :key="index"
        @click="share(social.type)"
        class="rounded-full bg-gray-100 p-3 text-gray-600 transition hover:bg-gray-200"
        :title="`${social.name} ile paylaş`"
      >
        <i :class="social.icon"></i>
      </button>
    </div>
  </article>
</template>

<script>
export default {
  name: 'BlogPostDetail',
  props: {
    post: {
      type: Object,
      required: true,
      validator: (post) => {
        return [
          'title',
          'content',
          'image',
          'author',
          'publishedAt',
          'readingTime',
          'category'
        ].every(prop => prop in post)
      }
    }
  },
  setup(props) {
    const socialShare = [
      { type: 'twitter', name: 'Twitter', icon: 'fab fa-twitter' },
      { type: 'facebook', name: 'Facebook', icon: 'fab fa-facebook-f' },
      { type: 'linkedin', name: 'LinkedIn', icon: 'fab fa-linkedin-in' },
      { type: 'whatsapp', name: 'WhatsApp', icon: 'fab fa-whatsapp' }
    ]

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }

    const share = (type) => {
      const url = window.location.href
      const text = props.post.title

      const shareUrls = {
        twitter: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
        whatsapp: `https://wa.me/?text=${text} ${url}`
      }

      window.open(shareUrls[type], '_blank')
    }

    return {
      socialShare,
      formatDate,
      share
    }
  }
}
</script>

<style>
.content {
  @apply text-gray-800;
}

.content h2 {
  @apply mb-4 mt-8 text-2xl font-bold;
}

.content h3 {
  @apply mb-3 mt-6 text-xl font-bold;
}

.content p {
  @apply mb-4 leading-relaxed;
}

.content img {
  @apply my-6 rounded-lg;
}

.content a {
  @apply text-blue-600 hover:underline;
}

.content blockquote {
  @apply my-6 border-l-4 border-blue-500 bg-blue-50 p-4 italic;
}

.content ul {
  @apply mb-4 list-disc pl-6;
}

.content ol {
  @apply mb-4 list-decimal pl-6;
}
</style> 