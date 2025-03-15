<template>
  <div class="bg-white rounded-lg shadow-md p-6 mb-8">
    <div class="flex flex-wrap gap-4 items-center">
      <div class="flex-1">
        <input 
          type="text"
          :value="search"
          @input="$emit('update:search', $event.target.value)"
          placeholder="Ürün ara..."
          class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-200 focus:border-primary-300"
        >
      </div>
      <div class="flex gap-4">
        <select 
          :value="category"
          @change="$emit('update:category', $event.target.value)"
          class="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-200 focus:border-primary-300"
        >
          <option value="">Tüm Kategoriler</option>
          <option v-for="category in categories" :key="category.id" :value="category.id">
            {{ category.name }}
          </option>
        </select>
        <select 
          :value="sort"
          @change="$emit('update:sort', $event.target.value)"
          class="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-200 focus:border-primary-300"
        >
          <option value="newest">En Yeni</option>
          <option value="price_asc">Fiyat (Düşükten Yükseğe)</option>
          <option value="price_desc">Fiyat (Yüksekten Düşüğe)</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProductFilter',
  props: {
    search: String,
    category: String,
    sort: String,
    categories: {
      type: Array,
      default: () => []
    }
  },
  emits: ['update:search', 'update:category', 'update:sort']
}
</script> 