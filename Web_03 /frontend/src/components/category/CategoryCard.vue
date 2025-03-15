<template>
  <router-link 
    :to="`/kategori/${category.slug}`"
    class="block group"
  >
    <div class="relative pb-[100%] rounded-lg overflow-hidden">
      <img 
        :src="category.image" 
        :alt="category.name"
        class="absolute top-0 left-0 w-full h-full object-cover transition group-hover:scale-105"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      <h3 class="absolute bottom-4 left-4 text-white font-semibold text-lg">
        {{ category.name }}
      </h3>
    </div>
  </router-link>
</template>

<script>
export default {
  name: 'CategoryCard',
  props: {
    category: {
      type: Object,
      required: true
    }
  }
}
</script> 