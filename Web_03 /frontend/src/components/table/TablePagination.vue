<template>
  <div class="table-pagination flex items-center justify-between">
    <!-- Sayfa Bilgisi -->
    <div class="text-sm text-gray-700">
      Toplam {{ totalItems }} kayıttan {{ startIndex + 1 }}-{{ endIndex }} arası gösteriliyor
    </div>

    <!-- Sayfalama Kontrolleri -->
    <div class="flex items-center space-x-4">
      <!-- Sayfa Başına Gösterim -->
      <div class="flex items-center space-x-2">
        <span class="text-sm text-gray-600">Göster:</span>
        <select
          v-model="localPerPage"
          class="form-select"
          @change="handlePerPageChange"
        >
          <option v-for="size in pageSizes" :key="size" :value="size">
            {{ size }}
          </option>
        </select>
      </div>

      <!-- Sayfa Numaraları -->
      <div class="flex items-center space-x-1">
        <!-- İlk Sayfa -->
        <button
          class="pagination-button"
          :disabled="currentPage === 1"
          @click="changePage(1)"
        >
          «
        </button>

        <!-- Önceki Sayfa -->
        <button
          class="pagination-button"
          :disabled="currentPage === 1"
          @click="changePage(currentPage - 1)"
        >
          ‹
        </button>

        <!-- Sayfa Numaraları -->
        <template v-for="page in visiblePages" :key="page">
          <span
            v-if="page === '...'"
            class="px-3 py-1 text-gray-500"
          >
            ...
          </span>
          <button
            v-else
            class="pagination-button"
            :class="{ 'bg-primary-100 text-primary-700': page === currentPage }"
            @click="changePage(page)"
          >
            {{ page }}
          </button>
        </template>

        <!-- Sonraki Sayfa -->
        <button
          class="pagination-button"
          :disabled="currentPage === totalPages"
          @click="changePage(currentPage + 1)"
        >
          ›
        </button>

        <!-- Son Sayfa -->
        <button
          class="pagination-button"
          :disabled="currentPage === totalPages"
          @click="changePage(totalPages)"
        >
          »
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'

export default {
  name: 'TablePagination',

  props: {
    totalItems: {
      type: Number,
      required: true
    },
    perPage: {
      type: Number,
      default: 10
    },
    currentPage: {
      type: Number,
      default: 1
    }
  },

  emits: ['update:currentPage', 'update:perPage'],

  setup(props, { emit }) {
    const localPerPage = ref(props.perPage)
    const pageSizes = [10, 25, 50, 100]

    const totalPages = computed(() => Math.ceil(props.totalItems / props.perPage))
    const startIndex = computed(() => (props.currentPage - 1) * props.perPage)
    const endIndex = computed(() => {
      const end = startIndex.value + props.perPage
      return end > props.totalItems ? props.totalItems : end
    })

    // Görünür sayfa numaralarını hesapla
    const visiblePages = computed(() => {
      const delta = 2
      const range = []
      const rangeWithDots = []
      let l

      range.push(1)

      for (let i = props.currentPage - delta; i <= props.currentPage + delta; i++) {
        if (i < totalPages.value && i > 1) {
          range.push(i)
        }
      }

      range.push(totalPages.value)

      for (let i of range) {
        if (l) {
          if (i - l === 2) {
            rangeWithDots.push(l + 1)
          } else if (i - l !== 1) {
            rangeWithDots.push('...')
          }
        }
        rangeWithDots.push(i)
        l = i
      }

      return rangeWithDots
    })

    const changePage = (page) => {
      emit('update:currentPage', page)
    }

    const handlePerPageChange = () => {
      emit('update:perPage', localPerPage.value)
      emit('update:currentPage', 1)
    }

    watch(() => props.perPage, (newValue) => {
      localPerPage.value = newValue
    })

    return {
      localPerPage,
      pageSizes,
      totalPages,
      startIndex,
      endIndex,
      visiblePages,
      changePage,
      handlePerPageChange
    }
  }
}
</script>

<style scoped>
.pagination-button {
  @apply px-3 py-1 rounded-md text-sm text-gray-700 hover:bg-gray-100 
         disabled:opacity-50 disabled:cursor-not-allowed;
}

.form-select {
  @apply border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring-2 
         focus:ring-primary-500 focus:border-primary-500 outline-none;
}
</style>