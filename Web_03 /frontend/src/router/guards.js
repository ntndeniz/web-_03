import store from '@/store';

export const authGuard = (to, from, next) => {
  const isAuthenticated = store.getters['auth/isAuthenticated'];
  
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      });
    } else {
      next();
    }
  } else {
    next();
  }
};

export const guestGuard = (to, from, next) => {
  const isAuthenticated = store.getters['auth/isAuthenticated'];
  
  if (to.matched.some(record => record.meta.requiresGuest)) {
    if (isAuthenticated) {
      next('/');
    } else {
      next();
    }
  } else {
    next();
  }
};

export const adminGuard = (to, from, next) => {
  const isAdmin = store.getters['auth/isAdmin'];
  
  if (to.matched.some(record => record.meta.requiresAdmin)) {
    if (!isAdmin) {
      next('/403');
    } else {
      next();
    }
  } else {
    next();
  }
};

export const verifiedGuard = (to, from, next) => {
  const isVerified = store.getters['auth/isVerified'];
  
  if (to.matched.some(record => record.meta.requiresVerified)) {
    if (!isVerified) {
      next({
        path: '/verify-email',
        query: { redirect: to.fullPath }
      });
    } else {
      next();
    }
  } else {
    next();
  }
};

export const subscriptionGuard = (to, from, next) => {
  const hasActiveSubscription = store.getters['auth/hasActiveSubscription'];
  
  if (to.matched.some(record => record.meta.requiresSubscription)) {
    if (!hasActiveSubscription) {
      next({
        path: '/subscription',
        query: { redirect: to.fullPath }
      });
    } else {
      next();
    }
  } else {
    next();
  }
};

export const progressGuard = (to, from, next) => {
  store.dispatch('ui/startLoading');
  next();
};

export const progressComplete = () => {
  store.dispatch('ui/stopLoading');
}; 