<template>
  <div class="flex items-center space-x-4 rounded-lg border bg-white p-4">
    <!-- Ürün Görseli -->
    <div class="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md">
      <img 
        :src="item.image" 
        :alt="item.name"
        class="h-full w-full object-cover"
      />
    </div>

    <!-- Ürün Bilgileri -->
    <div class="flex flex-1 flex-col">
      <div class="flex justify-between">
        <div>
          <!-- Ürün Adı -->
          <h3 class="font-medium">{{ item.name }}</h3>
          
          <!-- Varyant Bilgisi -->
          <p v-if="item.variant" class="mt-1 text-sm text-gray-600">
            {{ item.variant }}
          </p>
        </div>

        <!-- Fiyat -->
        <div class="text-right">
          <div class="font-medium">{{ formatPrice(item.price * item.quantity) }}</div>
          <div v-if="item.quantity > 1" class="text-sm text-gray-600">
            {{ formatPrice(item.price) }} × {{ item.quantity }}
          </div>
        </div>
      </div>

      <!-- Alt Kısım -->
      <div class="mt-4 flex items-center justify-between">
        <!-- Miktar Kontrolü -->
        <div class="flex items-center space-x-2">
          <button 
            @click="updateItemQuantity(item.quantity - 1)"
            class="rounded border p-1 text-gray-600 transition hover:bg-gray-100"
            :disabled="item.quantity <= 1"
          >
            <i class="fas fa-minus text-xs"></i>
          </button>
          
          <input
            v-model.number="localQuantity"
            type="number"
            min="1"
            :max="item.stockQuantity || 99"
            class="w-16 rounded border px-2 py-1 text-center"
            @blur="handleQuantityBlur"
          />
          
          <button 
            @click="updateItemQuantity(item.quantity + 1)"
            class="rounded border p-1 text-gray-600 transition hover:bg-gray-100"
            :disabled="item.quantity >= (item.stockQuantity || 99)"
          >
            <i class="fas fa-plus text-xs"></i>
          </button>
        </div>

        <!-- Kaldır Butonu -->
        <button 
          @click="$emit('remove', item.id)"
          class="text-sm text-red-600 hover:text-red-700"
        >
          <i class="fas fa-trash-alt mr-1"></i>
          Kaldır
        </button>
      </div>

      <!-- Stok Uyarısı -->
      <div 
        v-if="item.stockQuantity && item.quantity > item.stockQuantity"
        class="mt-2 text-sm text-red-600"
      >
        <i class="fas fa-exclamation-circle mr-1"></i>
        Seçilen miktar stok miktarını aşıyor (Maks: {{ item.stockQuantity }})
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue'

export default {
  name: 'CartItem',
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  emits: ['update-quantity', 'remove'],
  setup(props, { emit }) {
    const localQuantity = ref(props.item.quantity)

    // Prop değiştiğinde local state'i güncelle
    watch(() => props.item.quantity, (newVal) => {
      localQuantity.value = newVal
    })

    const formatPrice = (price) => {
      return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY'
      }).format(price)
    }

    const updateItemQuantity = (quantity) => {
      if (quantity >= 1 && (!props.item.stockQuantity || quantity <= props.item.stockQuantity)) {
        emit('update-quantity', props.item.id, quantity)
      }
    }

    const handleQuantityBlur = () => {
      let quantity = localQuantity.value

      // Sayısal değer kontrolü
      if (isNaN(quantity) || quantity < 1) {
        quantity = 1
      }

      // Stok kontrolü
      if (props.item.stockQuantity && quantity > props.item.stockQuantity) {
        quantity = props.item.stockQuantity
      }

      localQuantity.value = quantity
      updateItemQuantity(quantity)
    }

    return {
      localQuantity,
      formatPrice,
      updateItemQuantity,
      handleQuantityBlur
    }
  }
}
</script> 