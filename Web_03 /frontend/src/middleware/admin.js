import store from '@/store'
import router from '@/router'

export default async function admin({ to, next }) {
  const isAuthenticated = store.getters['auth/isAuthenticated']
  const isAdmin = store.getters['auth/isAdmin']
  
  // Kullanıcı giriş yapmamışsa login sayfasına yönlendir
  if (!isAuthenticated) {
    store.commit('auth/SET_REDIRECT_PATH', to.fullPath)
    return next({ 
      name: 'login',
      query: { redirect: to.fullPath }
    })
  }

  // Admin değilse yetkisiz sayfasına yönlendir
  if (!isAdmin) {
    return next({ name: 'unauthorized' })
  }

  // Admin ise devam et
  return next()
} 