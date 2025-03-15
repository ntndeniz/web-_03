const auth = (req, res, next) => {
  // Şimdilik auth kontrolünü devre dışı bırakıyoruz
  // Gerçek auth kontrolü daha sonra eklenebilir
  next();
};

module.exports = auth; 