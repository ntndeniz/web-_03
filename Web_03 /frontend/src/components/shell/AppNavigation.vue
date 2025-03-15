<template>
  <nav class="app-navigation">
    <div class="nav-container">
      <div class="categories-menu">
        <button 
          @click="toggleCategories"
          class="categories-button"
          :class="{ active: showCategories }"
        >
          <i class="fas fa-bars"></i>
          <span>Kategoriler</span>
          <i class="fas fa-chevron-down"></i>
        </button>

        <div 
          v-show="showCategories"
          class="categories-dropdown"
          ref="categoriesDropdown"
        >
          <div
            v-for="category in categories"
            :key="category.id"
            class="category-item"
            @mouseenter="handleCategoryHover(category)"
          >
            <router-link 
              :to="{ name: 'category', params: { slug: category.slug }}"
              class="category-link"
            >
              <i :class="category.icon"></i>
              <span>{{ category.name }}</span>
              <i v-if="category.children?.length" class="fas fa-chevron-right"></i>
            </router-link>

            <div 
              v-if="category.children?.length"
              class="subcategories-panel"
              :class="{ active: hoveredCategory === category.id }"
            >
              <div class="subcategories-grid">
                <div
                  v-for="subcategory in category.children"
                  :key="subcategory.id"
                  class="subcategory-group"
                >
                  <h4>{{ subcategory.name }}</h4>
                  <ul>
                    <li v-for="item in subcategory.children" :key="item.id">
                      <router-link :to="{ name: 'category', params: { slug: item.slug }}">
                        {{ item.name }}
                      </router-link>
                    </li>
                  </ul>
                </div>
              </div>

              <div v-if="category.featured" class="featured-section">
                <img :src="category.featured.image" :alt="category.featured.title" />
                <h5>{{ category.featured.title }}</h5>
                <p>{{ category.featured.description }}</p>
                <router-link 
                  :to="category.featured.link"
                  class="featured-link"
                >
                  Daha Fazla
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="main-menu">
        <router-link
          v-for="item in menuItems"
          :key="item.path"
          :to="item.path"
          class="menu-item"
          :class="{ active: isActive(item.path) }"
        >
          {{ item.name }}
          <span v-if="item.badge" class="menu-badge" :class="item.badge.type">
            {{ item.badge.text }}
          </span>
        </router-link>
      </div>

      <div class="nav-actions">
        <button 
          v-for="action in actions"
          :key="action.name"
          @click="action.handler"
          class="action-button"
          :title="action.name"
        >
          <i :class="action.icon"></i>
          <span class="action-label">{{ action.name }}</span>
        </button>
      </div>
    </div>
  </nav>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'

export default {
  name: 'AppNavigation',

  setup() {
    const store = useStore()
    const route = useRoute()
    
    const showCategories = ref(false)
    const hoveredCategory = ref(null)
    const categoriesDropdown = ref(null)

    const categories = computed(() => store.state.categories.items)
    
    const menuItems = [
      { name: 'Yeni Gelenler', path: '/new-arrivals' },
      { 
        name: 'Kampanyalar', 
        path: '/campaigns',
        badge: { type: 'hot', text: 'Yeni' }
      },
      { name: 'Çok Satanlar', path: '/best-sellers' },
      { name: 'İndirimler', path: '/discounts' }
    ]

    const actions = [
      { 
        name: 'Karşılaştır',
        icon: 'fas fa-exchange-alt',
        handler: () => store.commit('ui/toggleCompare')
      },
      {
        name: 'Favoriler',
        icon: 'fas fa-heart',
        handler: () => store.commit('ui/toggleWishlist')
      }
    ]

    const toggleCategories = () => {
      showCategories.value = !showCategories.value
    }

    const handleCategoryHover = (category) => {
      hoveredCategory.value = category.id
    }

    const isActive = (path) => {
      return route.path === path
    }

    const handleClickOutside = (event) => {
      if (
        categoriesDropdown.value &&
        !categoriesDropdown.value.contains(event.target)
      ) {
        showCategories.value = false
      }
    }

    onMounted(() => {
      document.addEventListener('click', handleClickOutside)
    })

    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside)
    })

    return {
      showCategories,
      hoveredCategory,
      categoriesDropdown,
      categories,
      menuItems,
      actions,
      toggleCategories,
      handleCategoryHover,
      isActive
    }
  }
}
</script>

<style scoped>
.app-navigation {
  @apply bg-white border-b border-gray-200;
}

.nav-container {
  @apply max-w-7xl mx-auto px-4 h-14 flex items-center justify-between;
}

.categories-menu {
  @apply relative;
}

.categories-button {
  @apply flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors;
}

.categories-button.active {
  @apply bg-gray-200;
}

.categories-dropdown {
  @apply absolute top-full left-0 w-64 bg-white border border-gray-200 rounded-md shadow-lg mt-1;
}

.category-item {
  @apply relative;
}

.category-link {
  @apply flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors;
}

.subcategories-panel {
  @apply invisible opacity-0 absolute top-0 left-full w-[800px] bg-white border border-gray-200 rounded-md shadow-lg ml-1 p-6 grid grid-cols-4 gap-6 transition-all;
}

.subcategories-panel.active {
  @apply visible opacity-100;
}

.subcategory-group h4 {
  @apply font-medium text-gray-900 mb-2;
}

.subcategory-group ul {
  @apply space-y-1;
}

.subcategory-group a {
  @apply text-gray-600 hover:text-gray-900 transition-colors;
}

.featured-section {
  @apply col-span-4 mt-6 pt-6 border-t border-gray-200;
}

.featured-section img {
  @apply w-full h-32 object-cover rounded-md mb-2;
}

.featured-section h5 {
  @apply font-medium text-gray-900 mb-1;
}

.featured-section p {
  @apply text-sm text-gray-600 mb-2;
}

.featured-link {
  @apply text-sm text-blue-600 hover:text-blue-700;
}

.main-menu {
  @apply flex items-center gap-6;
}

.menu-item {
  @apply relative flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors;
}

.menu-item.active {
  @apply text-blue-600 font-medium;
}

.menu-badge {
  @apply px-2 py-0.5 text-xs rounded-full;
}

.menu-badge.hot {
  @apply bg-red-100 text-red-800;
}

.nav-actions {
  @apply flex items-center gap-4;
}

.action-button {
  @apply flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors;
}

.action-label {
  @apply text-sm;
}
</style> 