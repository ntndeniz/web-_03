<template>
  <div class="pie-chart-container">
    <!-- Yükleniyor Durumu -->
    <div v-if="loading" class="flex justify-center items-center h-64">
      <LoadingSpinner />
    </div>

    <!-- Hata Durumu -->
    <div v-else-if="error" class="text-center text-red-600 p-4">
      {{ error }}
    </div>

    <!-- Chart -->
    <div v-else ref="chartContainer" class="w-full h-64"></div>

    <!-- Açıklama -->
    <div v-if="description" class="mt-4 text-sm text-gray-600">
      {{ description }}
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue'
import Chart from 'chart.js/auto'
import LoadingSpinner from '../common/LoadingSpinner.vue'

export default {
  name: 'PieChart',

  components: {
    LoadingSpinner
  },

  props: {
    data: {
      type: Object,
      required: true,
      validator: (value) => {
        return value.labels && value.datasets
      }
    },
    options: {
      type: Object,
      default: () => ({})
    },
    description: {
      type: String,
      default: ''
    }
  },

  setup(props) {
    const chartContainer = ref(null)
    const chart = ref(null)
    const loading = ref(true)
    const error = ref(null)

    const createChart = () => {
      try {
        if (chart.value) {
          chart.value.destroy()
        }

        const ctx = chartContainer.value.getContext('2d')
        
        chart.value = new Chart(ctx, {
          type: 'pie',
          data: props.data,
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'bottom'
              }
            },
            ...props.options
          }
        })

        loading.value = false
      } catch (err) {
        error.value = 'Grafik oluşturulurken bir hata oluştu'
        console.error('Chart oluşturma hatası:', err)
      }
    }

    onMounted(() => {
      createChart()
    })

    watch(() => props.data, () => {
      createChart()
    }, { deep: true })

    return {
      chartContainer,
      loading,
      error
    }
  }
}
</script> 