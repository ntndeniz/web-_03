/**
 * Özel analitik olayları
 */

import googleAnalytics from './google-analytics'
import facebookPixel from './facebook-pixel'
import store from '@/store'

class CustomEvents {
  /**
   * Kullanıcı oturumu başlatma olayı
   * @param {Object} user Kullanıcı bilgisi
   */
  trackUserLogin(user) {
    googleAnalytics.trackEvent('User', 'Login', user.email)
    facebookPixel.trackCustomEvent('UserLogin', {
      user_id: user.id
    })
  }

  /**
   * Ürün arama olayı
   * @param {string} query Arama sorgusu
   * @param {number} resultCount Sonuç sayısı
   */
  trackProductSearch(query, resultCount) {
    googleAnalytics.trackEvent('Product', 'Search', query, resultCount)
    facebookPixel.trackCustomEvent('ProductSearch', {
      search_string: query,
      result_count: resultCount
    })
  }

  /**
   * Favori ürün olayı
   * @param {Object} product Ürün bilgisi
   */
  trackFavoriteProduct(product) {
    googleAnalytics.trackEvent('Product', 'Favorite', product.name)
    facebookPixel.trackCustomEvent('FavoriteProduct', {
      product_id: product.id,
      product_name: product.name
    })
  }

  /**
   * Ürün inceleme olayı
   * @param {Object} review İnceleme bilgisi
   */
  trackProductReview(review) {
    googleAnalytics.trackEvent('Product', 'Review', review.productName, review.rating)
    facebookPixel.trackCustomEvent('ProductReview', {
      product_id: review.productId,
      rating: review.rating
    })
  }

  /**
   * Kampanya tıklama olayı
   * @param {Object} campaign Kampanya bilgisi
   */
  trackCampaignClick(campaign) {
    googleAnalytics.trackEvent('Campaign', 'Click', campaign.name)
    facebookPixel.trackCustomEvent('CampaignClick', {
      campaign_id: campaign.id,
      campaign_name: campaign.name
    })
  }
}

export default new CustomEvents() 