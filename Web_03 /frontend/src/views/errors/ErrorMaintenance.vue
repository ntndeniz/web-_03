<template>
  <div class="error-page">
    <div class="error-content">
      <img src="@/assets/images/maintenance.svg" alt="Maintenance" class="error-image" />
      <h1 class="error-title">Bakım Çalışması</h1>
      <p class="error-message">
        Sistemimiz şu anda bakımda. Kısa süre içinde tekrar hizmetinizdeyiz.
      </p>
      <div class="maintenance-info">
        <div class="info-item">
          <i class="fas fa-clock"></i>
          <span>Tahmini Süre: {{ estimatedDuration }}</span>
        </div>
        <div class="info-item">
          <i class="fas fa-calendar"></i>
          <span>Başlangıç: {{ formatDate(startTime) }}</span>
        </div>
      </div>
      <div class="countdown" v-if="showCountdown">
        <p class="countdown-text">Kalan Süre:</p>
        <div class="countdown-timer">
          <span>{{ countdown.hours }}s</span>
          <span>{{ countdown.minutes }}d</span>
          <span>{{ countdown.seconds }}s</span>
        </div>
      </div>
      <div class="error-actions">
        <button @click="checkStatus" class="btn-primary">
          Durumu Kontrol Et
        </button>
        <a :href="contactUrl" target="_blank" class="btn-secondary">
          Destek Al
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import { formatDate } from '@/utils/formatters'

export default {
  name: 'ErrorMaintenance',

  props: {
    startTime: {
      type: Date,
      required: true
    },
    estimatedDuration: {
      type: String,
      default: '2 saat'
    },
    contactUrl: {
      type: String,
      default: '/contact'
    }
  },

  setup(props) {
    const showCountdown = ref(true)
    const countdown = ref({
      hours: '00',
      minutes: '00',
      seconds: '00'
    })

    let timer = null

    const updateCountdown = () => {
      const now = new Date().getTime()
      const endTime = props.startTime.getTime() + (2 * 60 * 60 * 1000) // 2 saat
      const distance = endTime - now

      if (distance < 0) {
        showCountdown.value = false
        clearInterval(timer)
        return
      }

      countdown.value = {
        hours: String(Math.floor(distance / (1000 * 60 * 60))).padStart(2, '0'),
        minutes: String(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0'),
        seconds: String(Math.floor((distance % (1000 * 60)) / 1000)).padStart(2, '0')
      }
    }

    const checkStatus = () => {
      window.location.reload()
    }

    onMounted(() => {
      updateCountdown()
      timer = setInterval(updateCountdown, 1000)
    })

    onUnmounted(() => {
      if (timer) clearInterval(timer)
    })

    return {
      showCountdown,
      countdown,
      checkStatus,
      formatDate
    }
  }
}
</script>

<style lang="scss" scoped>
.error-page {
  @apply min-h-screen flex items-center justify-center bg-gray-100;

  .error-content {
    @apply text-center p-8;
  }

  .error-image {
    @apply w-64 h-64 mx-auto mb-8;
  }

  .error-title {
    @apply text-4xl font-bold text-gray-900 mb-4;
  }

  .error-message {
    @apply text-lg text-gray-600 mb-8;
  }

  .maintenance-info {
    @apply flex justify-center space-x-8 mb-8;

    .info-item {
      @apply flex items-center space-x-2 text-gray-600;

      i {
        @apply text-primary-500;
      }
    }
  }

  .countdown {
    @apply mb-8;

    .countdown-text {
      @apply text-sm text-gray-600 mb-2;
    }

    .countdown-timer {
      @apply flex justify-center space-x-4;

      span {
        @apply px-4 py-2 bg-gray-800 text-white rounded-lg font-mono text-xl;
      }
    }
  }

  .error-actions {
    @apply flex justify-center space-x-4;

    .btn-primary {
      @apply px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors;
    }

    .btn-secondary {
      @apply px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors;
    }
  }
}
</style> 