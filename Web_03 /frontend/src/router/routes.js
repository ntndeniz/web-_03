// Sayfa bileşenleri
import Home from '@/views/Home.vue';
import Shop from '@/views/Shop.vue';
import Product from '@/views/Product.vue';
import Cart from '@/views/Cart.vue';
import Checkout from '@/views/Checkout.vue';
import Account from '@/views/Account.vue';
import Orders from '@/views/Orders.vue';
import Wishlist from '@/views/Wishlist.vue';
import Compare from '@/views/Compare.vue';
import Search from '@/views/Search.vue';

// Auth bileşenleri
import Login from '@/views/auth/Login.vue';
import Register from '@/views/auth/Register.vue';
import ForgotPassword from '@/views/auth/ForgotPassword.vue';
import ResetPassword from '@/views/auth/ResetPassword.vue';
import VerifyEmail from '@/views/auth/VerifyEmail.vue';

// Layout bileşenleri
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import AuthLayout from '@/layouts/AuthLayout.vue';
import AdminLayout from '@/layouts/AdminLayout.vue';
import CheckoutLayout from '@/layouts/CheckoutLayout.vue';

export default [
  {
    path: '/',
    component: DefaultLayout,
    children: [
      {
        path: '',
        name: 'home',
        component: Home
      },
      {
        path: 'shop',
        name: 'shop',
        component: Shop
      },
      {
        path: 'product/:id',
        name: 'product',
        component: Product
      },
      {
        path: 'cart',
        name: 'cart',
        component: Cart
      },
      {
        path: 'search',
        name: 'search',
        component: Search
      },
      {
        path: 'compare',
        name: 'compare',
        component: Compare
      }
    ]
  },
  {
    path: '/auth',
    component: AuthLayout,
    meta: { requiresGuest: true },
    children: [
      {
        path: 'login',
        name: 'login',
        component: Login
      },
      {
        path: 'register',
        name: 'register',
        component: Register
      },
      {
        path: 'forgot-password',
        name: 'forgot-password',
        component: ForgotPassword
      },
      {
        path: 'reset-password/:token',
        name: 'reset-password',
        component: ResetPassword
      },
      {
        path: 'verify-email',
        name: 'verify-email',
        component: VerifyEmail,
        meta: { requiresAuth: true }
      }
    ]
  },
  {
    path: '/account',
    component: DefaultLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'account',
        component: Account
      },
      {
        path: 'orders',
        name: 'orders',
        component: Orders
      },
      {
        path: 'wishlist',
        name: 'wishlist',
        component: Wishlist
      }
    ]
  },
  {
    path: '/checkout',
    component: CheckoutLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'checkout',
        component: Checkout
      }
    ]
  },
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      // Admin rotaları burada tanımlanacak
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/errors/NotFound.vue')
  }
]; 