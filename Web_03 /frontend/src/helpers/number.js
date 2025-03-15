/**
 * Sayı yardımcı fonksiyonları
 */

/**
 * Para birimini formatla
 * @param {number} amount Miktar
 * @param {string} currency Para birimi
 * @returns {string} Formatlanmış para birimi
 */
export const formatCurrency = (amount, currency = 'TRY') => {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: currency
  }).format(amount)
}

/**
 * Sayıyı yüzde formatına çevir
 * @param {number} value Değer
 * @param {number} decimals Ondalık basamak sayısı
 * @returns {string} Yüzde formatında sayı
 */
export const formatPercentage = (value, decimals = 2) => {
  return `%${(value * 100).toFixed(decimals)}`
}

/**
 * Sayıyı binlik ayraçlarla formatla
 * @param {number} number Sayı
 * @returns {string} Formatlanmış sayı
 */
export const formatNumber = (number) => {
  return new Intl.NumberFormat('tr-TR').format(number)
}

/**
 * İki sayı arasında rastgele sayı üret
 * @param {number} min Minimum değer
 * @param {number} max Maksimum değer
 * @returns {number} Rastgele sayı
 */
export const random = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * Sayıyı belirtilen aralıkta tut
 * @param {number} number Sayı
 * @param {number} min Minimum değer
 * @param {number} max Maksimum değer
 * @returns {number} Sınırlandırılmış sayı
 */
export const clamp = (number, min, max) => {
  return Math.min(Math.max(number, min), max)
} 