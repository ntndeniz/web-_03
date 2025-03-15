import { expect } from 'chai'
import { createStore } from 'vuex'
import cart from '@/store/modules/cart'
import CartService from '@/services/cart.service'
import sinon from 'sinon'

describe('Cart Store', () => {
  let store
  let mockCartService

  beforeEach(() => {
    mockCartService = {
      getCart: sinon.stub(),
      addToCart: sinon.stub(),
      updateQuantity: sinon.stub(),
      removeFromCart: sinon.stub(),
      clearCart: sinon.stub()
    }

    store = createStore({
      modules: {
        cart: {
          ...cart,
          actions: {
            ...cart.actions,
            $cartService: mockCartService
          }
        }
      }
    })
  })

  afterEach(() => {
    sinon.restore()
  })

  describe('mutations', () => {
    it('SET_CART_ITEMS mutation sepet öğelerini güncellemeli', () => {
      const items = [
        { id: 1, quantity: 2, price: 100 },
        { id: 2, quantity: 1, price: 200 }
      ]
      store.commit('cart/SET_CART_ITEMS', items)
      expect(store.state.cart.items).to.deep.equal(items)
    })

    it('ADD_TO_CART mutation yeni ürün ekleyebilmeli', () => {
      const item = { id: 1, quantity: 1, price: 100 }
      store.commit('cart/ADD_TO_CART', item)
      expect(store.state.cart.items).to.deep.include(item)
    })

    it('UPDATE_QUANTITY mutation ürün miktarını güncelleyebilmeli', () => {
      const item = { id: 1, quantity: 1, price: 100 }
      store.commit('cart/ADD_TO_CART', item)
      
      store.commit('cart/UPDATE_QUANTITY', { id: 1, quantity: 2 })
      expect(store.state.cart.items[0].quantity).to.equal(2)
    })

    it('REMOVE_FROM_CART mutation ürünü sepetten silebilmeli', () => {
      const item = { id: 1, quantity: 1, price: 100 }
      store.commit('cart/ADD_TO_CART', item)
      
      store.commit('cart/REMOVE_FROM_CART', 1)
      expect(store.state.cart.items).to.have.lengthOf(0)
    })

    it('CLEAR_CART mutation sepeti temizleyebilmeli', () => {
      store.commit('cart/ADD_TO_CART', { id: 1, quantity: 1 })
      store.commit('cart/CLEAR_CART')
      expect(store.state.cart.items).to.have.lengthOf(0)
    })
  })

  describe('actions', () => {
    it('fetchCart action sepet verilerini getirmeli', async () => {
      const cartItems = [
        { id: 1, quantity: 2, price: 100 },
        { id: 2, quantity: 1, price: 200 }
      ]

      mockCartService.getCart.resolves({ data: cartItems })

      await store.dispatch('cart/fetchCart')
      expect(store.state.cart.items).to.deep.equal(cartItems)
    })

    it('addToCart action yeni ürün ekleyebilmeli', async () => {
      const product = { id: 1, price: 100 }
      const quantity = 2

      mockCartService.addToCart.resolves({
        data: { ...product, quantity }
      })

      await store.dispatch('cart/addToCart', { product, quantity })
      expect(store.state.cart.items[0]).to.include({ id: 1, quantity: 2 })
    })

    it('updateQuantity action ürün miktarını güncelleyebilmeli', async () => {
      store.commit('cart/ADD_TO_CART', { id: 1, quantity: 1, price: 100 })

      mockCartService.updateQuantity.resolves({
        data: { id: 1, quantity: 3, price: 100 }
      })

      await store.dispatch('cart/updateQuantity', { id: 1, quantity: 3 })
      expect(store.state.cart.items[0].quantity).to.equal(3)
    })

    it('removeFromCart action ürünü sepetten silebilmeli', async () => {
      store.commit('cart/ADD_TO_CART', { id: 1, quantity: 1 })

      mockCartService.removeFromCart.resolves()

      await store.dispatch('cart/removeFromCart', 1)
      expect(store.state.cart.items).to.have.lengthOf(0)
    })
  })

  describe('getters', () => {
    it('cartItemCount getter toplam ürün sayısını hesaplamalı', () => {
      store.commit('cart/SET_CART_ITEMS', [
        { id: 1, quantity: 2 },
        { id: 2, quantity: 3 }
      ])
      expect(store.getters['cart/cartItemCount']).to.equal(5)
    })

    it('cartTotal getter toplam tutarı hesaplamalı', () => {
      store.commit('cart/SET_CART_ITEMS', [
        { id: 1, quantity: 2, price: 100 },
        { id: 2, quantity: 1, price: 200 }
      ])
      expect(store.getters['cart/cartTotal']).to.equal(400)
    })

    it('isCartEmpty getter sepet durumunu kontrol etmeli', () => {
      expect(store.getters['cart/isCartEmpty']).to.be.true

      store.commit('cart/ADD_TO_CART', { id: 1, quantity: 1 })
      expect(store.getters['cart/isCartEmpty']).to.be.false
    })
  })
}) 