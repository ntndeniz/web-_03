<template>
  <div class="author-bio bg-white p-6 rounded-lg shadow-sm">
    <div class="flex items-center space-x-4">
      <!-- Yazar Avatarı -->
      <img 
        :src="author.avatar" 
        :alt="author.name"
        class="w-16 h-16 rounded-full object-cover"
      />
      
      <!-- Yazar Bilgileri -->
      <div>
        <h3 class="text-xl font-semibold">{{ author.name }}</h3>
        <p class="text-gray-600">{{ author.title }}</p>
        
        <!-- Sosyal Medya Linkleri -->
        <div class="flex space-x-3 mt-2">
          <a 
            v-for="(link, platform) in author.socialLinks" 
            :key="platform"
            :href="link"
            target="_blank"
            rel="noopener noreferrer"
            class="text-gray-500 hover:text-primary-600"
          >
            <i :class="getSocialIcon(platform)"></i>
          </a>
        </div>
      </div>
    </div>

    <!-- Yazar Hakkında -->
    <p class="mt-4 text-gray-700">{{ author.bio }}</p>

    <!-- Yazarın Diğer Yazıları -->
    <div v-if="author.posts && author.posts.length" class="mt-6">
      <h4 class="font-semibold mb-3">Diğer Yazıları</h4>
      <ul class="space-y-2">
        <li 
          v-for="post in author.posts.slice(0, 3)" 
          :key="post.id"
          class="text-gray-600 hover:text-primary-600"
        >
          <router-link :to="{ name: 'blog-post', params: { slug: post.slug }}">
            {{ post.title }}
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'AuthorBio',
  
  props: {
    authorId: {
      type: String,
      required: true
    }
  },

  setup(props) {
    const store = useStore()

    const author = computed(() => store.getters['blog/getAuthorById'](props.authorId))

    const getSocialIcon = (platform) => {
      const icons = {
        twitter: 'fab fa-twitter',
        linkedin: 'fab fa-linkedin',
        github: 'fab fa-github',
        website: 'fas fa-globe'
      }
      return icons[platform] || 'fas fa-link'
    }

    return {
      author,
      getSocialIcon
    }
  }
}
</script> 