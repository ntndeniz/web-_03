import store from '@/store';

export default function guest({ next }) {
  const isAuthenticated = store.getters['auth/isAuthenticated'];
  
  // Eğer kullanıcı giriş yapmışsa, ana sayfaya yönlendir
  if (isAuthenticated) {
    const redirectPath = store.state.auth.redirectPath || '/';
    store.commit('auth/SET_REDIRECT_PATH', null);
    
    return next(redirectPath);
  }

  return next();
} 