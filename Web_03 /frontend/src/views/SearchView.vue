<template>
    <div class="container py-8">
      <div class="mb-8">
        <!-- Arama Başlığı -->
        <h1 class="text-2xl font-bold mb-2">
          "{{ searchQuery }}" için arama sonuçları
        </h1>
        <p class="text-gray-500">
          {{ totalResults }} sonuç bulundu
        </p>
      </div>
  
      <!-- Filtreler ve Sonuçlar -->
      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Filtreler -->
        <aside class="w-full lg:w-64 space-y-6">
          <ProductFilter
            v-model:categories="filters.categories"
            v-model:priceRange="filters.priceRange"
            v-model:brands="filters.brands"
            v-model:attributes="filters.attributes"
            @filter="applyFilters"
          />
        </aside>
  
        <!-- Sonuçlar -->
        <main class="flex-1">
          <!-- Sıralama -->
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center space-x-4">
              <!-- Görünüm Seçenekleri -->
              <div class="flex items-center space-x-2">
                <button 
                  class="p-2 rounded-md"
                  :class="{ 'bg-blue-100': viewMode === 'grid' }"
                  @click="viewMode = 'grid'"
                >
                  <span class="material-icons">grid_view</span>
                </button>
                <button 
                  class="p-2 rounded-md"
                  :class="{ 'bg-blue-100': viewMode === 'list' }"
                  @click="viewMode = 'list'"
                >
                  <span class="material-icons">view_list</span>
                </button>
              </div>
  
              <!-- Sıralama -->
              <select 
                v-model="sortBy"
                class="form-select"
                @change="sortResults"
              >
                <option value="relevance">İlgiye Göre</option>
                <option value="price_asc">Fiyat (Düşükten Yükseğe)</option>
                <option value="price_desc">Fiyat (Yüksekten Düşüğe)</option>
                <option value="name_asc">İsim (A-Z)</option>
                <option value="name_desc">İsim (Z-A)</option>
              </select>
            </div>
  
            <!-- Sayfa Başına Sonuç -->
            <select 
              v-model="perPage"
              class="form-select"
              @change="updatePerPage"
            >
              <option :value="12">12 Sonuç</option>
              <option :value="24">24 Sonuç</option>
              <option :value="48">48 Sonuç</option>
            </select>
          </div>
  
          <!-- Sonuç Listesi -->
          <div v-if="searchResults.length > 0">
            <div 
              :class="[
                viewMode === 'grid' 
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                  : 'space-y-4'
              ]"
            >
              <template v-if="viewMode === 'grid'">
                <ProductCard
                  v-for="product in searchResults"
                  :key="product.id"
                  :product="product"
                />
              </template>
              <template v-else>
                <ProductListItem
                  v-for="product in searchResults"
                  :key="product.id"
                  :product="product"
                />
              </template>
            </div>
  
            <!-- Sayfalama -->
            <Pagination
              v-if="totalPages > 1"
              :current-page="currentPage"
              :total-pages="totalPages"
              @page-change="changePage"
              class="mt-8"
            />
          </div>
  
          <!-- Sonuç Bulunamadı -->
          <div 
            v-else 
            class="bg-white rounded-lg shadow p-8 text-center"
          >
            <span class="material-icons text-6xl text-gray-400 mb-4">
              search_off
            </span>
            <h2 class="text-xl font-medium mb-2">
              Sonuç Bulunamadı
            </h2>
            <p class="text-gray-500 mb-4">
              Aramanızla eşleşen ürün bulunamadı. Lütfen farklı anahtar kelimeler deneyin.
            </p>
            <router-link 
              to="/products" 
              class="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Tüm Ürünleri Görüntüle
            </router-link>
          </div>
        </main>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed, watch } from 'vue';
  import { useStore } from 'vuex';
  import { useRoute, useRouter } from 'vue-router';
  import ProductFilter from '@/components/product/ProductFilter.vue';
  import ProductCard from '@/components/product/ProductCard.vue';
  import ProductListItem from '@/components/product/ProductListItem.vue';
  import Pagination from '@/components/common/Pagination.vue';
  
  export default {
    name: 'SearchView',
  
    components: {
      ProductFilter,
      ProductCard,
      ProductListItem,
      Pagination
    },
  
    setup() {
      const store = useStore();
      const route = useRoute();
      const router = useRouter();
  
      // Durum değişkenleri
      const viewMode = ref('grid');
      const sortBy = ref('relevance');
      const perPage = ref(12);
      const currentPage = ref(1);
      const searchResults = ref([]);
      const totalResults = ref(0);
      const totalPages = ref(1);
      const filters = ref({
        categories: [],
        priceRange: [0, 10000],
        brands: [],
        attributes: {}
      });
  
      // Arama sorgusu
      const searchQuery = computed(() => route.query.q || '');
  
      // Arama yap
      const performSearch = async () => {
        try {
          const response = await store.dispatch('product/search', {
            query: searchQuery.value,
            page: currentPage.value,
            perPage: perPage.value,
            sortBy: sortBy.value,
            filters: filters.value
          });
  
          searchResults.value = response.results;
          totalResults.value = response.total;
          totalPages.value = response.totalPages;
        } catch (error) {
          store.dispatch('notification/show', {
            type: 'error',
            message: 'Arama yapılırken bir hata oluştu'
          });
        }
      };
  
      // URL'i güncelle
      const updateQueryParams = () => {
        router.push({
          query: {
            ...route.query,
            page: currentPage.value,
            sort: sortBy.value,
            per_page: perPage.value
          }
        });
      };
  
      // Sayfa değişikliği
      const changePage = (page) => {
        currentPage.value = page;
        updateQueryParams();
      };
  
      // Sıralama değişikliği
      const sortResults = () => {
        currentPage.value = 1;
        updateQueryParams();
      };
  
      // Sayfa başına sonuç değişikliği
      const updatePerPage = () => {
        currentPage.value = 1;
        updateQueryParams();
      };
  
      // Filtreleri uygula
      const applyFilters = () => {
        currentPage.value = 1;
        performSearch();
      };
  
      // URL değişikliklerini izle
      watch(
        () => route.query,
        () => {
          currentPage.value = Number(route.query.page) || 1;
          sortBy.value = route.query.sort || 'relevance';
          perPage.value = Number(route.query.per_page) || 12;
          performSearch();
        },
        { immediate: true }
      );
  
      return {
        viewMode,
        sortBy,
        perPage,
        currentPage,
        searchResults,
        totalResults,
        totalPages,
        filters,
        searchQuery,
        changePage,
        sortResults,
        updatePerPage,
        applyFilters
      };
    },
  
    metaInfo() {
      return {
        title: `"${this.searchQuery}" için arama sonuçları`,
        meta: [
          {
            name: 'description',
            content: `"${this.searchQuery}" araması için ${this.totalResults} sonuç bulundu.`
          }
        ]
      };
    }
  };
  </script>