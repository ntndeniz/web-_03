<template>
  <section class="bg-blue-600 py-12 text-white">
    <div class="container mx-auto px-4">
      <div class="grid gap-8 md:grid-cols-2 md:items-center">
        <!-- Sol Kısım: İçerik -->
        <div class="space-y-6">
          <h2 class="text-4xl font-bold">{{ promotion.title }}</h2>
          <p class="text-xl opacity-90">{{ promotion.description }}</p>
          
          <!-- Geri Sayım -->
          <div v-if="promotion.endDate" class="flex space-x-4">
            <div v-for="(value, unit) in timeLeft" :key="unit" class="text-center">
              <div class="rounded-lg bg-white bg-opacity-10 px-4 py-2">
                <div class="text-3xl font-bold">{{ value }}</div>
                <div class="text-sm opacity-75">{{ unit }}</div>
              </div>
            </div>
          </div>

          <!-- Kupon Kodu -->
          <div v-if="promotion.couponCode" class="space-y-2">
            <div class="text-sm opacity-75">Kupon Kodu:</div>
            <div class="flex items-center space-x-2">
              <code class="rounded bg-white bg-opacity-10 px-4 py-2 font-mono text-lg">
                {{ promotion.couponCode }}
              </code>
              <button 
                @click="copyCode"
                class="rounded bg-white px-4 py-2 text-blue-600 transition hover:bg-opacity-90"
              >
                <i class="fas fa-copy"></i>
              </button>
            </div>
          </div>

          <!-- Aksiyon Butonu -->
          <div>
            <router-link 
              :to="promotion.link"
              class="inline-block rounded-lg bg-white px-8 py-3 text-lg font-medium text-blue-600 transition hover:bg-opacity-90"
            >
              {{ promotion.buttonText }}
            </router-link>
          </div>
        </div>

        <!-- Sağ Kısım: Görsel -->
        <div class="relative aspect-[4/3] overflow-hidden rounded-lg md:aspect-square">
          <img 
            :src="promotion.image" 
            :alt="promotion.title"
            class="h-full w-full object-cover"
          />
          
          <!-- İndirim Badge -->
          <div 
            v-if="promotion.discount"
            class="absolute right-4 top-4 flex h-20 w-20 items-center justify-center rounded-full bg-red-500 text-center font-bold"
          >
            <div>
              <div class="text-2xl">%{{ promotion.discount }}</div>
              <div class="text-sm">İndirim</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'PromotionBanner',
  setup() {
    const store = useStore()
    const promotion = ref({
      title: 'Büyük Yaz İndirimi',
      description: 'Seçili ürünlerde %50\'ye varan indirimler sizi bekliyor!',
      image: '/images/promotions/summer-sale.jpg',
      endDate: '2024-06-30T23:59:59',
      couponCode: 'YAZ2024',
      discount: 50,
      link: '/kampanyalar/yaz-indirimi',
      buttonText: 'Fırsatları Keşfet'
    })

    const timeLeft = ref({})
    let timer = null

    const updateTimeLeft = () => {
      const now = new Date().getTime()
      const end = new Date(promotion.value.endDate).getTime()
      const distance = end - now

      if (distance < 0) {
        timeLeft.value = {
          Gün: '00',
          Saat: '00',
          Dakika: '00',
          Saniye: '00'
        }
        clearInterval(timer)
        return
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24))
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((distance % (1000 * 60)) / 1000)

      timeLeft.value = {
        Gün: days.toString().padStart(2, '0'),
        Saat: hours.toString().padStart(2, '0'),
        Dakika: minutes.toString().padStart(2, '0'),
        Saniye: seconds.toString().padStart(2, '0')
      }
    }

    const copyCode = () => {
      navigator.clipboard.writeText(promotion.value.couponCode)
      store.dispatch('ui/showToast', {
        type: 'success',
        message: 'Kupon kodu kopyalandı'
      })
    }

    onMounted(() => {
      updateTimeLeft()
      timer = setInterval(updateTimeLeft, 1000)
    })

    onUnmounted(() => {
      if (timer) clearInterval(timer)
    })

    return {
      promotion,
      timeLeft,
      copyCode
    }
  }
}
</script> 