<template>
  <div class="data-table">
    <!-- Üst Araç Çubuğu -->
    <div class="mb-4 flex justify-between items-center">
      <!-- Arama -->
      <div class="flex-1 max-w-sm">
        <input
          v-model="searchQuery"
          type="text"
          class="w-full px-4 py-2 border rounded-lg"
          placeholder="Ara..."
          @input="handleSearch"
        >
      </div>

      <!-- Sayfa Başına Gösterim -->
      <div class="flex items-center space-x-2 ml-4">
        <span class="text-sm text-gray-600">Göster:</span>
        <select
          v-model="perPage"
          class="border rounded-lg px-2 py-1"
          @change="handlePerPageChange"
        >
          <option v-for="n in [10, 25, 50, 100]" :key="n" :value="n">
            {{ n }}
          </option>
        </select>
      </div>
    </div>

    <!-- Tablo -->
    <div class="overflow-x-auto bg-white rounded-lg shadow">
      <table class="min-w-full divide-y divide-gray-200">
        <!-- Başlıklar -->
        <thead class="bg-gray-50">
          <tr>
            <th
              v-for="column in columns"
              :key="column.key"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              @click="sortBy(column.key)"
            >
              <div class="flex items-center space-x-1">
                <span>{{ column.label }}</span>
                <span v-if="sortColumn === column.key" class="text-gray-900">
                  {{ sortDirection === 'asc' ? '↑' : '↓' }}
                </span>
              </div>
            </th>
            <th v-if="actions" class="px-6 py-3 text-right">
              İşlemler
            </th>
          </tr>
        </thead>

        <!-- Veriler -->
        <tbody class="bg-white divide-y divide-gray-200">
          <tr
            v-for="item in paginatedData"
            :key="item.id"
            class="hover:bg-gray-50"
          >
            <td
              v-for="column in columns"
              :key="column.key"
              class="px-6 py-4 whitespace-nowrap"
            >
              <slot :name="column.key" :item="item">
                {{ item[column.key] }}
              </slot>
            </td>
            <td v-if="actions" class="px-6 py-4 text-right">
              <slot name="actions" :item="item"></slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="mt-4 flex justify-between items-center">
      <div class="text-sm text-gray-700">
        Toplam {{ totalItems }} kayıttan {{ startIndex + 1 }}-{{ endIndex }} arası gösteriliyor
      </div>
      <div class="flex space-x-2">
        <button
          class="px-3 py-1 border rounded-lg disabled:opacity-50"
          :disabled="currentPage === 1"
          @click="prevPage"
        >
          Önceki
        </button>
        <button
          class="px-3 py-1 border rounded-lg disabled:opacity-50"
          :disabled="currentPage === totalPages"
          @click="nextPage"
        >
          Sonraki
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'

export default {
  name: 'DataTable',

  props: {
    data: {
      type: Array,
      required: true
    },
    columns: {
      type: Array,
      required: true,
      validator: value => value.every(column => column.key && column.label)
    },
    actions: {
      type: Boolean,
      default: false
    },
    initialPerPage: {
      type: Number,
      default: 10
    }
  },

  setup(props) {
    const searchQuery = ref('')
    const sortColumn = ref('')
    const sortDirection = ref('asc')
    const currentPage = ref(1)
    const perPage = ref(props.initialPerPage)

    // Filtreleme
    const filteredData = computed(() => {
      if (!searchQuery.value) return props.data

      return props.data.filter(item => {
        return props.columns.some(column => {
          const value = item[column.key]
          if (value == null) return false
          return String(value)
            .toLowerCase()
            .includes(searchQuery.value.toLowerCase())
        })
      })
    })

    // Sıralama
    const sortedData = computed(() => {
      if (!sortColumn.value) return filteredData.value

      return [...filteredData.value].sort((a, b) => {
        const aVal = a[sortColumn.value]
        const bVal = b[sortColumn.value]

        if (sortDirection.value === 'asc') {
          return aVal > bVal ? 1 : -1
        }
        return aVal < bVal ? 1 : -1
      })
    })

    // Sayfalama
    const totalItems = computed(() => sortedData.value.length)
    const totalPages = computed(() => Math.ceil(totalItems.value / perPage.value))
    const startIndex = computed(() => (currentPage.value - 1) * perPage.value)
    const endIndex = computed(() => {
      const end = startIndex.value + perPage.value
      return end > totalItems.value ? totalItems.value : end
    })

    const paginatedData = computed(() => {
      return sortedData.value.slice(startIndex.value, endIndex.value)
    })

    // Metodlar
    const handleSearch = () => {
      currentPage.value = 1
    }

    const handlePerPageChange = () => {
      currentPage.value = 1
    }

    const sortBy = (column) => {
      if (sortColumn.value === column) {
        sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
      } else {
        sortColumn.value = column
        sortDirection.value = 'asc'
      }
      currentPage.value = 1
    }

    const prevPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--
      }
    }

    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++
      }
    }

    // Veri değişikliklerini izle
    watch(() => props.data, () => {
      currentPage.value = 1
    })

    return {
      searchQuery,
      sortColumn,
      sortDirection,
      currentPage,
      perPage,
      paginatedData,
      totalItems,
      totalPages,
      startIndex,
      endIndex,
      handleSearch,
      handlePerPageChange,
      sortBy,
      prevPage,
      nextPage
    }
  }
}
</script>