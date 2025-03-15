<template>
  <div class="bg-primary-500 py-16 mb-8 rounded-lg">
    <h1 class="text-4xl font-bold text-white text-center">{{ title }}</h1>
    <p class="text-primary-100 text-center mt-4">{{ description }}</p>
  </div>
</template>

<script>
export default {
  name: 'ProductHeroSection',
  props: {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    }
  }
}
</script> 