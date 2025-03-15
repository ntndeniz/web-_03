import store from '@/store';

export default function verified({ next }) {
  const isAuthenticated = store.getters['auth/isAuthenticated'];
  const isVerified = store.getters['auth/isVerified'];

  // Kullanıcı giriş yapmamışsa login sayfasına yönlendir
  if (!isAuthenticated) {
    return next({
      name: 'login',
      query: { redirect: to.fullPath }
    });
  }

  // Kullanıcı doğrulanmamışsa doğrulama sayfasına yönlendir
  if (!isVerified) {
    return next({ name: 'verify-email' });
  }

  // Doğrulanmış kullanıcı ise devam et
  return next();
} 