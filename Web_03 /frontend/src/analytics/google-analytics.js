/**
 * Google Analytics entegrasyonu
 */

import { event } from 'vue-gtag'

class GoogleAnalytics {
  /**
   * Sayfa görüntüleme olayını gönder
   * @param {string} path Sayfa yolu
   * @param {string} title Sayfa başlığı
   */
  trackPageView(path, title) {
    event('page_view', {
      page_path: path,
      page_title: title
    })
  }

  /**
   * Olay gönder
   * @param {string} category Olay kategorisi
   * @param {string} action Olay aksiyonu
   * @param {string} label Olay etiketi
   * @param {number} value Olay değeri
   */
  trackEvent(category, action, label = null, value = null) {
    event('custom_event', {
      event_category: category,
      event_action: action,
      event_label: label,
      value: value
    })
  }

  /**
   * E-ticaret olayı gönder
   * @param {Object} data E-ticaret verisi
   */
  trackEcommerce(data) {
    event('purchase', {
      transaction_id: data.orderId,
      value: data.total,
      currency: 'TRY',
      items: data.items.map(item => ({
        item_id: item.id,
        item_name: item.name,
        price: item.price,
        quantity: item.quantity
      }))
    })
  }

  /**
   * Kullanıcı kimliğini ayarla
   * @param {string} userId Kullanıcı ID
   */
  setUserId(userId) {
    event('set', { user_id: userId })
  }
}

export default new GoogleAnalytics() 