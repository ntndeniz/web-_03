/**
 * Tarih yardımcı fonksiyonları
 */

/**
 * Tarihi formatla
 * @param {Date|string} date Tarih
 * @param {string} format Format
 * @returns {string} Formatlanmış tarih
 */
export const formatDate = (date, format = 'DD.MM.YYYY') => {
  const d = new Date(date)
  
  const formats = {
    DD: String(d.getDate()).padStart(2, '0'),
    MM: String(d.getMonth() + 1).padStart(2, '0'),
    YYYY: d.getFullYear(),
    HH: String(d.getHours()).padStart(2, '0'),
    mm: String(d.getMinutes()).padStart(2, '0'),
    ss: String(d.getSeconds()).padStart(2, '0')
  }

  return format.replace(/DD|MM|YYYY|HH|mm|ss/g, match => formats[match])
}

/**
 * İki tarih arasındaki farkı hesapla
 * @param {Date|string} date1 İlk tarih
 * @param {Date|string} date2 İkinci tarih
 * @returns {Object} Fark bilgisi
 */
export const dateDiff = (date1, date2) => {
  const d1 = new Date(date1)
  const d2 = new Date(date2)
  const diff = Math.abs(d2 - d1)

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60)
  }
}

/**
 * Tarihe gün ekle/çıkar
 * @param {Date|string} date Tarih
 * @param {number} days Eklenecek/çıkarılacak gün sayısı
 * @returns {Date} Yeni tarih
 */
export const addDays = (date, days) => {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

/**
 * İki tarih arasında karşılaştırma yap
 * @param {Date|string} date1 İlk tarih
 * @param {Date|string} date2 İkinci tarih
 * @returns {number} -1: date1 < date2, 0: date1 = date2, 1: date1 > date2
 */
export const compareDates = (date1, date2) => {
  const d1 = new Date(date1)
  const d2 = new Date(date2)
  
  if (d1 < d2) return -1
  if (d1 > d2) return 1
  return 0
} 