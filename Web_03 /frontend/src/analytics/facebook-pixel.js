/**
 * Facebook Pixel entegrasyonu
 */

class FacebookPixel {
  /**
   * Sayfa görüntüleme olayını gönder
   */
  trackPageView() {
    if (window.fbq) {
      window.fbq('track', 'PageView')
    }
  }

  /**
   * Ürün görüntüleme olayını gönder
   * @param {Object} product Ürün bilgisi
   */
  trackViewProduct(product) {
    if (window.fbq) {
      window.fbq('track', 'ViewContent', {
        content_type: 'product',
        content_ids: [product.id],
        content_name: product.name,
        content_category: product.category,
        value: product.price,
        currency: 'TRY'
      })
    }
  }

  /**
   * Sepete ekleme olayını gönder
   * @param {Object} product Ürün bilgisi
   */
  trackAddToCart(product) {
    if (window.fbq) {
      window.fbq('track', 'AddToCart', {
        content_type: 'product',
        content_ids: [product.id],
        content_name: product.name,
        value: product.price,
        currency: 'TRY'
      })
    }
  }

  /**
   * Satın alma olayını gönder
   * @param {Object} order Sipariş bilgisi
   */
  trackPurchase(order) {
    if (window.fbq) {
      window.fbq('track', 'Purchase', {
        content_type: 'product',
        content_ids: order.items.map(item => item.id),
        value: order.total,
        currency: 'TRY',
        num_items: order.items.length
      })
    }
  }

  /**
   * Özel olay gönder
   * @param {string} eventName Olay adı
   * @param {Object} params Olay parametreleri
   */
  trackCustomEvent(eventName, params = {}) {
    if (window.fbq) {
      window.fbq('trackCustom', eventName, params)
    }
  }
}

export default new FacebookPixel() 