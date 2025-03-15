<template>
  <div class="rounded-lg bg-red-50 p-4">
    <div class="mb-2 flex items-center space-x-2">
      <i class="fas fa-clock text-red-500"></i>
      <h3 class="font-medium text-red-700">{{ title }}</h3>
    </div>

    <!-- Geri Sayım -->
    <div 
      v-if="timeLeft"
      class="grid grid-cols-4 gap-2 text-center"
    >
      <div class="rounded bg-white p-2">
        <div class="text-lg font-bold text-red-600">{{ timeLeft.days }}</div>
        <div class="text-xs text-gray-600">Gün</div>
      </div>
      <div class="rounded bg-white p-2">
        <div class="text-lg font-bold text-red-600">{{ timeLeft.hours }}</div>
        <div class="text-xs text-gray-600">Saat</div>
      </div>
      <div class="rounded bg-white p-2">
        <div class="text-lg font-bold text-red-600">{{ timeLeft.minutes }}</div>
        <div class="text-xs text-gray-600">Dakika</div>
      </div>
      <div class="rounded bg-white p-2">
        <div class="text-lg font-bold text-red-600">{{ timeLeft.seconds }}</div>
        <div class="text-xs text-gray-600">Saniye</div>
      </div>
    </div>

    <!-- Kampanya Bitti -->
    <div 
      v-else
      class="text-center text-red-600"
    >
      Kampanya sona erdi!
    </div>

    <!-- İlerleme Çubuğu -->
    <div 
      v-if="showProgress && timeLeft"
      class="mt-4"
    >
      <div class="mb-1 flex justify-between text-xs text-gray-600">
        <span>Satılan: {{ soldCount }}</span>
        <span>Kalan: {{ stockLeft }}</span>
      </div>
      <div class="h-2 overflow-hidden rounded-full bg-red-100">
        <div 
          class="h-full bg-red-500 transition-all"
          :style="{ width: `${progressPercentage}%` }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'

export default {
  name: 'DiscountCountdown',
  props: {
    title: {
      type: String,
      default: 'Kampanya Bitimine Kalan Süre'
    },
    endDate: {
      type: [Date, String],
      required: true
    },
    showProgress: {
      type: Boolean,
      default: false
    },
    totalStock: {
      type: Number,
      default: 0
    },
    soldCount: {
      type: Number,
      default: 0
    }
  },
  setup(props) {
    const timeLeft = ref(null)
    let timer = null

    const calculateTimeLeft = () => {
      const endTime = new Date(props.endDate).getTime()
      const now = new Date().getTime()
      const difference = endTime - now

      if (difference <= 0) {
        timeLeft.value = null
        return
      }

      timeLeft.value = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000)
      }
    }

    const stockLeft = computed(() => {
      return props.totalStock - props.soldCount
    })

    const progressPercentage = computed(() => {
      if (!props.totalStock) return 0
      return Math.min(100, (props.soldCount / props.totalStock) * 100)
    })

    onMounted(() => {
      calculateTimeLeft()
      timer = setInterval(calculateTimeLeft, 1000)
    })

    onUnmounted(() => {
      if (timer) clearInterval(timer)
    })

    return {
      timeLeft,
      stockLeft,
      progressPercentage
    }
  }
}
</script> 