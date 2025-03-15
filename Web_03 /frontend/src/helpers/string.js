/**
 * String yardımcı fonksiyonları
 */

/**
 * Metni büyük harf yap
 * @param {string} str Metin
 * @returns {string} Büyük harfli metin
 */
export const toUpperCase = (str) => {
  return str.toLocaleUpperCase('tr-TR')
}

/**
 * Metni küçük harf yap
 * @param {string} str Metin
 * @returns {string} Küçük harfli metin
 */
export const toLowerCase = (str) => {
  return str.toLocaleLowerCase('tr-TR')
}

/**
 * URL dostu metin oluştur (slug)
 * @param {string} str Metin
 * @returns {string} URL dostu metin
 */
export const slugify = (str) => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Metni kısalt
 * @param {string} str Metin
 * @param {number} length Maksimum uzunluk
 * @param {string} suffix Son ek
 * @returns {string} Kısaltılmış metin
 */
export const truncate = (str, length = 100, suffix = '...') => {
  if (str.length <= length) return str
  return str.substring(0, length).trim() + suffix
}

/**
 * Metinden HTML etiketlerini temizle
 * @param {string} str HTML içeren metin
 * @returns {string} Temizlenmiş metin
 */
export const stripHtml = (str) => {
  return str.replace(/<[^>]*>/g, '')
} 