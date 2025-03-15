import { createStore } from 'vuex'
import products from './modules/products'
import categories from './modules/categories'
import cart from './modules/cart'
import favorites from './modules/favorites'
import blog from './modules/blog'

export default createStore({
  modules: {
    products,
    categories,
    cart,
    favorites,
    blog
  }
})