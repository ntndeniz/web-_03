<template>
  <div class="min-h-screen flex flex-col">
    <TheNavbar />
    <main class="flex-grow">
      <router-view></router-view>
    </main>
    <TheFooter />
  </div>
</template>

<script>
import TheNavbar from '@/components/layout/TheNavbar.vue'
import TheFooter from '@/components/layout/TheFooter.vue'

export default {
  name: 'App',
  components: {
    TheNavbar,
    TheFooter
  }
}
</script>

<style>
/* Eski nav stillerini de kaldırdık */
</style>
