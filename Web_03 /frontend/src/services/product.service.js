import ApiService from './api.service';

const ProductService = {
  // Ürün listeleme
  getProducts(params) {
    return ApiService.get('/products', { params });
  },

  // Öne çıkan ürünler
  getFeaturedProducts() {
    return ApiService.get('/products/featured');
  },

  // Ürün detayı
  getProductById(id) {
    return ApiService.get(`/products/${id}`);
  },

  // Ürün arama
  searchProducts(query) {
    return ApiService.get('/products/search', { params: { q: query } });
  },

  // Ürün kategorileri
  getCategories() {
    return ApiService.get('/categories');
  },

  // Kategori detayı
  getCategoryById(id) {
    return ApiService.get(`/categories/${id}`);
  },

  // Ürün değerlendirmeleri
  getProductReviews(productId, params) {
    return ApiService.get(`/products/${productId}/reviews`, { params });
  },

  // Değerlendirme ekleme
  addProductReview(productId, reviewData) {
    return ApiService.post(`/products/${productId}/reviews`, reviewData);
  },

  // Değerlendirme güncelleme
  updateProductReview(productId, reviewId, reviewData) {
    return ApiService.put(`/products/${productId}/reviews/${reviewId}`, reviewData);
  },

  // Değerlendirme silme
  deleteProductReview(productId, reviewId) {
    return ApiService.delete(`/products/${productId}/reviews/${reviewId}`);
  },

  // Ürün karşılaştırma
  compareProducts(productIds) {
    return ApiService.get('/products/compare', { params: { ids: productIds } });
  }
};

export default ProductService; 