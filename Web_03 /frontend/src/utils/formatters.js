// Para birimi formatı
export const formatCurrency = (value, currency = 'TRY') => {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: currency
  }).format(value);
};

// Tarih formatı
export const formatDate = (value, format = 'long') => {
  const date = new Date(value);
  const options = {
    short: { day: 'numeric', month: 'numeric', year: 'numeric' },
    medium: { day: 'numeric', month: 'long', year: 'numeric' },
    long: { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }
  };

  return new Intl.DateTimeFormat('tr-TR', options[format]).format(date);
};

// Telefon numarası formatı
export const formatPhoneNumber = value => {
  if (!value) return '';
  const number = value.replace(/[^\d]/g, '');
  if (number.length < 4) return number;
  if (number.length < 7) return `(${number.slice(0, 3)}) ${number.slice(3)}`;
  return `(${number.slice(0, 3)}) ${number.slice(3, 6)} ${number.slice(6, 10)}`;
};

// Dosya boyutu formatı
export const formatFileSize = bytes => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Kredi kartı numarası formatı
export const formatCreditCard = value => {
  if (!value) return '';
  const number = value.replace(/[^\d]/g, '');
  const parts = number.match(/.{1,4}/g);
  return parts ? parts.join(' ') : number;
};

// Kart son kullanma tarihi formatı
export const formatCardExpiry = value => {
  if (!value) return '';
  const expiry = value.replace(/[^\d]/g, '');
  if (expiry.length <= 2) return expiry;
  return `${expiry.slice(0, 2)}/${expiry.slice(2, 4)}`;
};

// Yüzde formatı
export const formatPercentage = value => {
  return `%${value}`;
};

// Stok durumu formatı
export const formatStock = value => {
  if (value <= 0) return 'Stokta Yok';
  if (value <= 5) return 'Son Birkaç Ürün';
  return 'Stokta';
}; 