/**
 * Nesne yardımcı fonksiyonları
 */

/**
 * Nesneyi düzleştir
 * @param {Object} obj Nesne
 * @param {string} prefix Önek
 * @returns {Object} Düzleştirilmiş nesne
 */
export const flattenObject = (obj, prefix = '') => {
  return Object.keys(obj).reduce((acc, key) => {
    const pre = prefix.length ? `${prefix}.` : ''
    
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      Object.assign(acc, flattenObject(obj[key], pre + key))
    } else {
      acc[pre + key] = obj[key]
    }
    
    return acc
  }, {})
}

/**
 * Nesneden belirtilen alanları seç
 * @param {Object} obj Nesne
 * @param {Array} keys Seçilecek alanlar
 * @returns {Object} Seçilmiş alanları içeren yeni nesne
 */
export const pick = (obj, keys) => {
  return keys.reduce((acc, key) => {
    if (key in obj) {
      acc[key] = obj[key]
    }
    return acc
  }, {})
}

/**
 * Nesneden belirtilen alanları çıkar
 * @param {Object} obj Nesne
 * @param {Array} keys Çıkarılacak alanlar
 * @returns {Object} Belirtilen alanları çıkarılmış yeni nesne
 */
export const omit = (obj, keys) => {
  const newObj = { ...obj }
  keys.forEach(key => delete newObj[key])
  return newObj
}

/**
 * İki nesneyi derin birleştir
 * @param {Object} target Hedef nesne
 * @param {Object} source Kaynak nesne
 * @returns {Object} Birleştirilmiş nesne
 */
export const deepMerge = (target, source) => {
  const result = { ...target }
  
  Object.keys(source).forEach(key => {
    if (source[key] instanceof Object && key in target) {
      result[key] = deepMerge(target[key], source[key])
    } else {
      result[key] = source[key]
    }
  })
  
  return result
} 