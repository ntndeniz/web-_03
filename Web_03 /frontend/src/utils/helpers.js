// Genel yardımcı fonksiyonlar
export const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

// Dizi karıştırma
export const shuffleArray = array => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// Nesne sıralama
export const sortObjectsByKey = (objects, key, order = 'asc') => {
  return objects.sort((a, b) => {
    if (order === 'asc') {
      return a[key] > b[key] ? 1 : -1;
    }
    return a[key] < b[key] ? 1 : -1;
  });
};

// Benzersiz değerleri alma
export const getUniqueValues = (array, key) => {
  return [...new Set(array.map(item => item[key]))];
};

// Nesne filtreleme
export const filterObject = (obj, predicate) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([key, value]) => predicate(key, value))
  );
};

// Derin kopya oluşturma
export const deepClone = obj => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  if (obj instanceof Object) {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [key, deepClone(value)])
    );
  }
};

// Nesne birleştirme
export const mergeObjects = (target, ...sources) => {
  return sources.reduce((acc, source) => {
    Object.keys(source).forEach(key => {
      if (source[key] instanceof Object && !Array.isArray(source[key])) {
        acc[key] = mergeObjects(acc[key] || {}, source[key]);
      } else {
        acc[key] = source[key];
      }
    });
    return acc;
  }, target);
};

// Debounce fonksiyonu
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle fonksiyonu
export const throttle = (func, limit) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// URL parametrelerini objeye çevirme
export const getUrlParams = url => {
  const params = {};
  new URL(url).searchParams.forEach((value, key) => {
    params[key] = value;
  });
  return params;
};

// Objeyi URL parametrelerine çevirme
export const objectToUrlParams = obj => {
  return Object.entries(obj)
    .filter(([_, value]) => value !== undefined && value !== null)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
}; 