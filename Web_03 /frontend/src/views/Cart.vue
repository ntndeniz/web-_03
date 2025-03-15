<template>
  <div class="container py-8">
    <h1 class="text-3xl font-bold mb-8">Alışveriş Sepeti</h1>

    <div v-if="cartItems.length > 0" class="flex flex-col lg:flex-row gap-8">
      <!-- Sepet Listesi -->
      <div class="flex-1">
        <CartList 
          :items="cartItems"
          @update-quantity="updateQuantity"
          @remove-item="removeFromCart"
        />
      </div>

      <!-- Sepet Özeti -->
      <div class="lg:w-80">
        <CartSummary 
          :subtotal="subtotal"
          :shipping="shipping"
          :tax="tax"
          :total="total"
          :discount="discount"
        >
          <!-- Kupon Kodu -->
          <div class="mb-4">
            <div class="flex space-x-2">
              <input
                v-model="couponCode"
                type="text"
                placeholder="Kupon Kodu"
                class="flex-1 form-input"
              >
              <button 
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                @click="applyCoupon"
              >
                Uygula
              </button>
            </div>
            <p v-if="couponError" class="mt-2 text-sm text-red-600">
              {{ couponError }}
            </p>
          </div>

          <!-- Ödemeye Geç -->
          <button 
            class="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700"
            @click="proceedToCheckout"
          >
            Ödemeye Geç
          </button>
        </CartSummary>
      </div>
    </div>

    <!-- Boş Sepet -->
    <div 
      v-else 
      class="text-center py-12"
    >
      <span class="material-icons text-6xl text-gray-400 mb-4">
        shopping_cart
      </span>
      <h2 class="text-2xl font-medium text-gray-900 mb-4">
        Sepetiniz Boş
      </h2>
      <p class="text-gray-500 mb-8">
        Sepetinizde henüz ürün bulunmuyor.
      </p>
      <router-link 
        to="/products" 
        class="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
      >
        Alışverişe Başla
      </router-link>
    </div>

    <!-- Önerilen Ürünler -->
    <div v-if="cartItems.length > 0" class="mt-16">
      <h2 class="text-2xl font-bold mb-8">Bunlar da İlginizi Çekebilir</h2>
      <ProductRecommendations :exclude="cartItemIds" />
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import CartList from '@/components/cart/CartList.vue';
import CartSummary from '@/components/cart/CartSummary.vue';
import ProductRecommendations from '@/components/product/ProductRecommendations.vue';

export default {
  name: 'Cart',
  
  components: {
    CartList,
    CartSummary,
    ProductRecommendations
  },

  setup() {
    const store = useStore();
    const router = useRouter();
    const couponCode = ref('');
    const couponError = ref('');

    // Sepet ürünleri
    const cartItems = computed(() => store.getters['cart/items']);
    const cartItemIds = computed(() => cartItems.value.map(item => item.id));

    // Fiyat hesaplamaları
    const subtotal = computed(() => store.getters['cart/subtotal']);
    const shipping = computed(() => store.getters['cart/shipping']);
    const tax = computed(() => store.getters['cart/tax']);
    const discount = computed(() => store.getters['cart/discount']);
    const total = computed(() => store.getters['cart/total']);

    // Ürün miktarını güncelle
    const updateQuantity = async (itemId, quantity) => {
      try {
        await store.dispatch('cart/updateQuantity', { itemId, quantity });
      } catch (error) {
        store.dispatch('notification/show', {
          type: 'error',
          message: 'Miktar güncellenirken hata oluştu'
        });
      }
    };

    // Ürünü sepetten kaldır
    const removeFromCart = async (itemId) => {
      try {
        await store.dispatch('cart/removeItem', itemId);
        store.dispatch('notification/show', {
          type: 'success',
          message: 'Ürün sepetten kaldırıldı'
        });
      } catch (error) {
        store.dispatch('notification/show', {
          type: 'error',
          message: 'Ürün kaldırılırken hata oluştu'
        });
      }
    };

    // Kupon kodu uygula
    const applyCoupon = async () => {
      if (!couponCode.value) {
        couponError.value = 'Lütfen bir kupon kodu girin';
        return;
      }

      try {
        await store.dispatch('cart/applyCoupon', couponCode.value);
        couponError.value = '';
        store.dispatch('notification/show', {
          type: 'success',
          message: 'Kupon kodu başarıyla uygulandı'
        });
      } catch (error) {
        couponError.value = error.message || 'Geçersiz kupon kodu';
      }
    };

    // Ödemeye geç
    const proceedToCheckout = () => {
      router.push('/checkout');
    };

    return {
      cartItems,
      cartItemIds,
      subtotal,
      shipping,
      tax,
      discount,
      total,
      couponCode,
      couponError,
      updateQuantity,
      removeFromCart,
      applyCoupon,
      proceedToCheckout
    };
  },

  metaInfo: {
    title: 'Sepet',
    meta: [
      { 
        name: 'description', 
        content: 'Alışveriş sepetinizi görüntüleyin ve düzenleyin.' 
      }
    ]
  }
};
</script> 