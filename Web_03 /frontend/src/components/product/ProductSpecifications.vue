<template>
  <div class="border rounded-lg">
    <h2 class="font-semibold p-4 border-b">Ürün Özellikleri</h2>
    <div class="divide-y">
      <div 
        v-for="(spec, index) in specifications" 
        :key="index"
        class="grid grid-cols-2 p-4"
      >
        <span class="text-gray-600">{{ spec.name }}</span>
        <span>{{ spec.value }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProductSpecifications',
  props: {
    specifications: {
      type: Array,
      required: true
    }
  }
}
</script> 