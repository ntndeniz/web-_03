/**
 * Dizi yardımcı fonksiyonları
 */

/**
 * Diziyi karıştır
 * @param {Array} array Karıştırılacak dizi
 * @returns {Array} Karıştırılmış dizi
 */
export const shuffleArray = (array) => {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}

/**
 * Diziden tekrar eden elemanları kaldır
 * @param {Array} array Dizi
 * @param {string} key Obje dizileri için unique key
 * @returns {Array} Tekrarsız dizi
 */
export const uniqueArray = (array, key = null) => {
  if (key) {
    return Array.from(new Map(array.map(item => [item[key], item])).values())
  }
  return [...new Set(array)]
}

/**
 * Diziyi grupla
 * @param {Array} array Gruplanacak dizi
 * @param {string} key Gruplama anahtarı
 * @returns {Object} Gruplanmış dizi
 */
export const groupBy = (array, key) => {
  return array.reduce((acc, item) => {
    const groupKey = item[key]
    if (!acc[groupKey]) {
      acc[groupKey] = []
    }
    acc[groupKey].push(item)
    return acc
  }, {})
}

/**
 * Dizileri birleştir ve tekrar edenleri kaldır
 * @param {Array} arrays Birleştirilecek diziler
 * @returns {Array} Birleştirilmiş ve tekrarsız dizi
 */
export const mergeArrays = (...arrays) => {
  return uniqueArray(arrays.flat())
} 