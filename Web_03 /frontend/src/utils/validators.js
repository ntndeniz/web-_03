// Form doğrulama kuralları
export const required = value => !!value || 'Bu alan zorunludur';

export const email = value => {
  const pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return pattern.test(value) || 'Geçerli bir e-posta adresi giriniz';
};

export const minLength = min => value => {
  return value.length >= min || `En az ${min} karakter girilmelidir`;
};

export const maxLength = max => value => {
  return value.length <= max || `En fazla ${max} karakter girilmelidir`;
};

export const numeric = value => {
  const pattern = /^[0-9]+$/;
  return pattern.test(value) || 'Sadece sayı girilmelidir';
};

export const phone = value => {
  const pattern = /^[0-9]{10}$/;
  return pattern.test(value) || 'Geçerli bir telefon numarası giriniz';
};

export const password = value => {
  const hasNumber = /\d/.test(value);
  const hasUpper = /[A-Z]/.test(value);
  const hasLower = /[a-z]/.test(value);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);
  
  if (!hasNumber) return 'En az bir sayı içermelidir';
  if (!hasUpper) return 'En az bir büyük harf içermelidir';
  if (!hasLower) return 'En az bir küçük harf içermelidir';
  if (!hasSpecial) return 'En az bir özel karakter içermelidir';
  if (value.length < 8) return 'En az 8 karakter olmalıdır';
  
  return true;
};

export const confirmPassword = password => value => {
  return value === password || 'Şifreler eşleşmiyor';
};

export const url = value => {
  const pattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
  return pattern.test(value) || 'Geçerli bir URL giriniz';
};

export const creditCard = value => {
  const pattern = /^[0-9]{16}$/;
  return pattern.test(value) || 'Geçerli bir kredi kartı numarası giriniz';
};

export const cvv = value => {
  const pattern = /^[0-9]{3,4}$/;
  return pattern.test(value) || 'Geçerli bir CVV numarası giriniz';
};

export const cardExpiry = value => {
  const pattern = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
  return pattern.test(value) || 'GG/YY formatında giriniz';
};

export const tcKimlik = value => {
  const pattern = /^[0-9]{11}$/;
  return pattern.test(value) || 'Geçerli bir T.C. Kimlik numarası giriniz';
}; 