<template>
  <div class="table-filter bg-white p-4 rounded-lg shadow-sm">
    <!-- Filtre Başlığı -->
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold">Filtreler</h3>
      <button 
        @click="resetFilters"
        class="text-sm text-gray-600 hover:text-primary-600"
      >
        Sıfırla
      </button>
    </div>

    <!-- Filtre Formları -->
    <div class="space-y-4">
      <div v-for="filter in filters" :key="filter.key" class="filter-item">
        <label :for="filter.key" class="block text-sm font-medium text-gray-700 mb-1">
          {{ filter.label }}
        </label>

        <!-- Metin Filtresi -->
        <input
          v-if="filter.type === 'text'"
          :id="filter.key"
          v-model="activeFilters[filter.key]"
          type="text"
          class="form-input w-full"
          :placeholder="filter.placeholder"
          @input="applyFilters"
        >

        <!-- Seçim Filtresi -->
        <select
          v-else-if="filter.type === 'select'"
          :id="filter.key"
          v-model="activeFilters[filter.key]"
          class="form-select w-full"
          @change="applyFilters"
        >
          <option value="">Tümü</option>
          <option
            v-for="option in filter.options"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>

        <!-- Tarih Aralığı Filtresi -->
        <div v-else-if="filter.type === 'dateRange'" class="flex space-x-2">
          <input
            :id="`${filter.key}-start`"
            v-model="activeFilters[`${filter.key}Start`]"
            type="date"
            class="form-input flex-1"
            @input="applyFilters"
          >
          <input
            :id="`${filter.key}-end`"
            v-model="activeFilters[`${filter.key}End`]"
            type="date"
            class="form-input flex-1"
            @input="applyFilters"
          >
        </div>

        <!-- Çoklu Seçim Filtresi -->
        <div v-else-if="filter.type === 'multiSelect'" class="space-y-2">
          <label
            v-for="option in filter.options"
            :key="option.value"
            class="flex items-center"
          >
            <input
              type="checkbox"
              :value="option.value"
              v-model="activeFilters[filter.key]"
              class="form-checkbox"
              @change="applyFilters"
            >
            <span class="ml-2 text-sm">{{ option.label }}</span>
          </label>
        </div>
      </div>
    </div>

    <!-- Aktif Filtreler -->
    <div v-if="hasActiveFilters" class="mt-4 pt-4 border-t">
      <div class="text-sm font-medium text-gray-700 mb-2">Aktif Filtreler:</div>
      <div class="flex flex-wrap gap-2">
        <span
          v-for="(value, key) in displayedFilters"
          :key="key"
          class="inline-flex items-center px-2 py-1 rounded-full text-sm bg-primary-100 text-primary-800"
        >
          {{ getFilterLabel(key) }}: {{ value }}
          <button
            @click="removeFilter(key)"
            class="ml-1 text-primary-600 hover:text-primary-800"
          >
            ×
          </button>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'TableFilter',

  props: {
    filters: {
      type: Array,
      required: true,
      validator: value => value.every(filter => filter.key && filter.label && filter.type)
    }
  },

  emits: ['filter'],

  setup(props, { emit }) {
    const activeFilters = ref({})

    // Başlangıç değerlerini ayarla
    props.filters.forEach(filter => {
      if (filter.type === 'multiSelect') {
        activeFilters.value[filter.key] = []
      } else {
        activeFilters.value[filter.key] = ''
      }
    })

    const hasActiveFilters = computed(() => {
      return Object.values(activeFilters.value).some(value => {
        if (Array.isArray(value)) {
          return value.length > 0
        }
        return value !== ''
      })
    })

    const displayedFilters = computed(() => {
      const displayed = {}
      Object.entries(activeFilters.value).forEach(([key, value]) => {
        if (Array.isArray(value) && value.length > 0) {
          displayed[key] = value.join(', ')
        } else if (value !== '') {
          displayed[key] = value
        }
      })
      return displayed
    })

    const getFilterLabel = (key) => {
      const filter = props.filters.find(f => f.key === key)
      return filter ? filter.label : key
    }

    const applyFilters = () => {
      emit('filter', activeFilters.value)
    }

    const removeFilter = (key) => {
      if (Array.isArray(activeFilters.value[key])) {
        activeFilters.value[key] = []
      } else {
        activeFilters.value[key] = ''
      }
      applyFilters()
    }

    const resetFilters = () => {
      props.filters.forEach(filter => {
        if (filter.type === 'multiSelect') {
          activeFilters.value[filter.key] = []
        } else {
          activeFilters.value[filter.key] = ''
        }
      })
      applyFilters()
    }

    return {
      activeFilters,
      hasActiveFilters,
      displayedFilters,
      getFilterLabel,
      applyFilters,
      removeFilter,
      resetFilters
    }
  }
}
</script>

<style scoped>
.form-input,
.form-select {
  @apply border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 
         focus:border-primary-500 outline-none;
}

.form-checkbox {
  @apply rounded border-gray-300 text-primary-600 focus:ring-primary-500;
}
</style> 