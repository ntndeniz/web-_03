<template>
  <div class="relative">
    <button 
      @click="isOpen = !isOpen"
      class="flex items-center space-x-2 text-gray-700 hover:text-gray-900 focus:outline-none"
    >
      <img 
        :src="userAvatar" 
        alt="Kullanıcı" 
        class="w-8 h-8 rounded-full"
      >
      <span class="hidden md:block">{{ userName }}</span>
    </button>

    <div 
      v-if="isOpen"
      class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1"
    >
      <router-link 
        to="/profile"
        class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
      >
        Profilim
      </router-link>
      <router-link 
        to="/orders"
        class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
      >
        Siparişlerim
      </router-link>
      <button 
        @click="handleLogout"
        class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
      >
        Çıkış Yap
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserMenu',
  data() {
    return {
      isOpen: false
    }
  },
  computed: {
    userName() {
      return this.$store.state.user.name || 'Kullanıcı'
    },
    userAvatar() {
      return this.$store.state.user.avatar || '/default-avatar.png'
    }
  },
  methods: {
    handleLogout() {
      this.$store.dispatch('auth/logout')
      this.$router.push('/login')
    }
  }
}
</script> 