<template>
  <nav class="container mx-auto px-4 py-3">
    <ol class="flex flex-wrap items-center text-sm">
      <!-- Ana Sayfa -->
      <li>
        <router-link 
          to="/"
          class="text-gray-500 hover:text-blue-600"
        >
          <i class="fas fa-home"></i>
        </router-link>
      </li>

      <!-- Ara Elemanlar -->
      <template v-for="(item, index) in items" :key="index">
        <li class="mx-2 text-gray-400">
          <i class="fas fa-chevron-right text-xs"></i>
        </li>
        <li>
          <router-link 
            v-if="item.to && index < items.length - 1"
            :to="item.to"
            class="text-gray-500 hover:text-blue-600"
          >
            {{ item.text }}
          </router-link>
          <span 
            v-else
            class="font-medium text-gray-900"
          >
            {{ item.text }}
          </span>
        </li>
      </template>
    </ol>
  </nav>
</template>

<script>
export default {
  name: 'Breadcrumb',
  props: {
    items: {
      type: Array,
      required: true,
      validator: (items) => {
        return items.every(item => 
          typeof item.text === 'string' && 
          (!item.to || typeof item.to === 'string' || typeof item.to === 'object')
        )
      }
    }
  }
}
</script> 