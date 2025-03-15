<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Admin Navbar -->
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <h1 class="text-xl font-bold text-gray-800">Admin Panel</h1>
            </div>
          </div>
          <div class="flex items-center">
            <span class="text-gray-600 mr-4">Admin</span>
            <button @click="logout" class="text-red-600 hover:text-red-700">
              Çıkış Yap
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Admin Content -->
    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <!-- Admin Sidebar -->
      <div class="grid grid-cols-12 gap-6">
        <div class="col-span-12 md:col-span-3">
          <div class="bg-white shadow rounded-lg p-4">
            <nav class="space-y-2">
              <router-link 
                to="/admin/dashboard" 
                class="block px-4 py-2 rounded-md hover:bg-blue-50 hover:text-blue-600"
                active-class="bg-blue-50 text-blue-600"
              >
                Dashboard
              </router-link>
              <router-link 
                to="/admin/posts" 
                class="block px-4 py-2 rounded-md hover:bg-blue-50 hover:text-blue-600"
                active-class="bg-blue-50 text-blue-600"
              >
                Blog Yazıları
              </router-link>
              <router-link 
                to="/admin/categories" 
                class="block px-4 py-2 rounded-md hover:bg-blue-50 hover:text-blue-600"
                active-class="bg-blue-50 text-blue-600"
              >
                Kategoriler
              </router-link>
              <router-link 
                to="/admin/comments" 
                class="block px-4 py-2 rounded-md hover:bg-blue-50 hover:text-blue-600"
                active-class="bg-blue-50 text-blue-600"
              >
                Yorumlar
              </router-link>
            </nav>
          </div>
        </div>

        <!-- Main Content Area -->
        <div class="col-span-12 md:col-span-9">
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

export default {
  name: 'AdminView',
  setup() {
    const router = useRouter()
    const store = useStore()

    const logout = async () => {
      await store.dispatch('auth/logout')
      router.push('/login')
    }

    return {
      logout
    }
  }
}
</script> 