import store from '@/store';
import router from '@/router';

export default async function auth({ to, next }) {
  const isAuthenticated = store.getters['auth/isAuthenticated'];
  
  if (!isAuthenticated) {
    // Kullanıcı giriş yapmamışsa, gitmek istediği sayfayı kaydet
    store.commit('auth/SET_REDIRECT_PATH', to.fullPath);
    
    // Login sayfasına yönlendir
    return next({
      name: 'login',
      query: { redirect: to.fullPath }
    });
  }

  // Kullanıcı doğrulanmamışsa ve doğrulama gerektiren bir sayfaya erişmeye çalışıyorsa
  const requiresVerification = to.matched.some(record => record.meta.requiresVerification);
  const isVerified = store.getters['auth/isVerified'];

  if (requiresVerification && !isVerified) {
    return next({ name: 'verify-email' });
  }

  // Kullanıcının rolünü kontrol et
  const userRole = store.getters['auth/userRole'];
  const requiredRole = to.meta.role;

  if (requiredRole && userRole !== requiredRole) {
    return next({ name: 'unauthorized' });
  }

  return next();
} 