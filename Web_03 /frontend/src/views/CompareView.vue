<template>
  <div class="container py-8">
    <h1 class="text-2xl font-bold mb-6">Ürün Karşılaştırma</h1>

    <!-- Karşılaştırma Tablosu -->
    <div v-if="compareItems.length > 0" class="bg-white rounded-lg shadow overflow-x-auto">
      <table class="w-full">
        <!-- Ürün Görselleri -->
        <tr>
          <th class="p-4 text-left w-40">Ürün</th>
          <td 
            v-for="item in compareItems" 
            :key="item.id"
            class="p-4 text-center min-w-[250px]"
          >
            <div class="relative">
              <img 
                :src="item.image" 
                :alt="item.name"
                class="w-full h-48 object-cover rounded"
              >
              <button
                class="absolute top-2 right-2 p-2 bg-white rounded-full shadow hover:bg-gray-50"
                @click="removeFromCompare(item.id)"
              >
                <span class="material-icons text-gray-500">
                  close
                </span>
              </button>
            </div>
            <h3 class="font-medium mt-2">{{ item.name }}</h3>
          </td>
        </tr>

        <!-- Fiyat -->
        <tr class="bg-gray-50">
          <th class="p-4 text-left">Fiyat</th>
          <td 
            v-for="item in compareItems" 
            :key="item.id"
            class="p-4 text-center"
          >
            <div class="flex flex-col items-center">
              <span class="text-lg font-bold">
                {{ formatPrice(item.price) }}
              </span>
              <span 
                v-if="item.oldPrice" 
                class="text-sm text-gray-500 line-through"
              >
                {{ formatPrice(item.oldPrice) }}
              </span>
            </div>
          </td>
        </tr>

        <!-- Stok Durumu -->
        <tr>
          <th class="p-4 text-left">Stok Durumu</th>
          <td 
            v-for="item in compareItems" 
            :key="item.id"
            class="p-4 text-center"
          >
            <span 
              :class="item.inStock ? 'text-green-600' : 'text-red-600'"
            >
              {{ item.inStock ? 'Stokta Var' : 'Stokta Yok' }}
            </span>
          </td>
        </tr>

        <!-- Özellikler -->
        <template v-for="(feature, index) in allFeatures" :key="feature">
          <tr :class="{ 'bg-gray-50': index % 2 === 0 }">
            <th class="p-4 text-left">{{ feature }}</th>
            <td 
              v-for="item in compareItems" 
              :key="item.id"
              class="p-4 text-center"
            >
              {{ item.features[feature] || '-' }}
            </td>
          </tr>
        </template>

        <!-- Butonlar -->
        <tr>
          <th class="p-4 text-left">İşlemler</th>
          <td 
            v-for="item in compareItems" 
            :key="item.id"
            class="p-4 text-center"
          >
            <div class="flex flex-col space-y-2">
              <button
                class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                :disabled="!item.inStock"
                @click="addToCart(item)"
              >
                Sepete Ekle
              </button>
              <button
                class="px-4 py-2 border rounded hover:bg-gray-50"
                @click="addToWishlist(item)"
              >
                Favorilere Ekle
              </button>
            </div>
          </td>
        </tr>
      </table>
    </div>

    <!-- Boş Durum -->
    <div 
      v-else 
      class="bg-white rounded-lg shadow p-8 text-center"
    >
      <span class="material-icons text-6xl text-gray-400 mb-4">
        compare
      </span>
      <h2 class="text-xl font-medium mb-2">
        Karşılaştırma Listeniz Boş
      </h2>
      <p class="text-gray-500 mb-4">
        Ürünleri karşılaştırmak için önce karşılaştırma listesine eklemelisiniz.
      </p>
      <router-link 
        to="/products" 
        class="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Ürünleri Keşfet
      </router-link>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';
import { formatPrice } from '@/utils/formatters';

export default {
  name: 'CompareView',

  setup() {
    const store = useStore();

    const compareItems = computed(() => store.getters['compare/items']);

    // Tüm özellikleri birleştir
    const allFeatures = computed(() => {
      const features = new Set();
      compareItems.value.forEach(item => {
        Object.keys(item.features || {}).forEach(feature => {
          features.add(feature);
        });
      });
      return Array.from(features).sort();
    });

    const removeFromCompare = (itemId) => {
      store.dispatch('compare/removeItem', itemId);
      store.dispatch('notification/show', {
        type: 'success',
        message: 'Ürün karşılaştırma listesinden kaldırıldı'
      });
    };

    const addToCart = async (product) => {
      try {
        await store.dispatch('cart/addItem', {
          productId: product.id,
          quantity: 1
        });
        store.dispatch('notification/show', {
          type: 'success',
          message: 'Ürün sepete eklendi'
        });
      } catch (error) {
        store.dispatch('notification/show', {
          type: 'error',
          message: 'Ürün sepete eklenirken hata oluştu'
        });
      }
    };

    const addToWishlist = async (product) => {
      try {
        await store.dispatch('favorites/addToFavorites', product.id);
        store.dispatch('notification/show', {
          type: 'success',
          message: 'Ürün favorilere eklendi'
        });
      } catch (error) {
        store.dispatch('notification/show', {
          type: 'error',
          message: 'Ürün favorilere eklenirken hata oluştu'
        });
      }
    };

    return {
      compareItems,
      allFeatures,
      formatPrice,
      removeFromCompare,
      addToCart,
      addToWishlist
    };
  },

  metaInfo: {
    title: 'Ürün Karşılaştırma',
    meta: [
      {
        name: 'description',
        content: 'Ürünleri özelliklerine göre karşılaştırın ve en uygun ürünü seçin.'
      }
    ]
  }
};
</script> 