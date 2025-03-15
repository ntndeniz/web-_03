import { expect } from 'chai'
import { createStore } from 'vuex'
import product from '@/store/modules/product'
import ProductService from '@/services/product.service'
import sinon from 'sinon'

describe('Product Store', () => {
  let store
  let mockProductService

  beforeEach(() => {
    mockProductService = {
      getProducts: sinon.stub(),
      getProductById: sinon.stub(),
      createProduct: sinon.stub(),
      updateProduct: sinon.stub(),
      deleteProduct: sinon.stub()
    }

    store = createStore({
      modules: {
        product: {
          ...product,
          actions: {
            ...product.actions,
            $productService: mockProductService
          }
        }
      }
    })
  })

  afterEach(() => {
    sinon.restore()
  })

  describe('mutations', () => {
    it('SET_PRODUCTS mutation ürün listesini güncellemeli', () => {
      const products = [
        { id: 1, name: 'Ürün 1', price: 100 },
        { id: 2, name: 'Ürün 2', price: 200 }
      ]
      store.commit('product/SET_PRODUCTS', products)
      expect(store.state.product.products).to.deep.equal(products)
    })

    it('SET_CURRENT_PRODUCT mutation seçili ürünü güncellemeli', () => {
      const product = { id: 1, name: 'Ürün 1', price: 100 }
      store.commit('product/SET_CURRENT_PRODUCT', product)
      expect(store.state.product.currentProduct).to.deep.equal(product)
    })

    it('SET_LOADING mutation yükleme durumunu güncellemeli', () => {
      store.commit('product/SET_LOADING', true)
      expect(store.state.product.loading).to.be.true
    })

    it('SET_ERROR mutation hata durumunu güncellemeli', () => {
      const error = 'Bir hata oluştu'
      store.commit('product/SET_ERROR', error)
      expect(store.state.product.error).to.equal(error)
    })
  })

  describe('actions', () => {
    it('fetchProducts action ürün listesini getirmeli', async () => {
      const products = [
        { id: 1, name: 'Ürün 1', price: 100 },
        { id: 2, name: 'Ürün 2', price: 200 }
      ]

      mockProductService.getProducts.resolves({ data: products })

      await store.dispatch('product/fetchProducts')
      expect(store.state.product.products).to.deep.equal(products)
      expect(store.state.product.loading).to.be.false
    })

    it('fetchProductById action ürün detayını getirmeli', async () => {
      const product = { id: 1, name: 'Ürün 1', price: 100 }

      mockProductService.getProductById.resolves({ data: product })

      await store.dispatch('product/fetchProductById', 1)
      expect(store.state.product.currentProduct).to.deep.equal(product)
    })

    it('createProduct action yeni ürün oluşturabilmeli', async () => {
      const newProduct = {
        name: 'Yeni Ürün',
        price: 150,
        description: 'Test açıklama'
      }

      const createdProduct = { id: 3, ...newProduct }
      mockProductService.createProduct.resolves({ data: createdProduct })

      await store.dispatch('product/createProduct', newProduct)
      expect(store.state.product.products).to.deep.include(createdProduct)
    })

    it('updateProduct action ürün güncelleyebilmeli', async () => {
      const productId = 1
      const updates = {
        name: 'Güncellenmiş Ürün',
        price: 200
      }

      const updatedProduct = { id: productId, ...updates }
      mockProductService.updateProduct.resolves({ data: updatedProduct })

      await store.dispatch('product/updateProduct', { id: productId, ...updates })
      expect(store.state.product.products.find(p => p.id === productId)).to.deep.equal(updatedProduct)
    })

    it('deleteProduct action ürün silebilmeli', async () => {
      const productId = 1
      store.commit('product/SET_PRODUCTS', [
        { id: 1, name: 'Ürün 1' },
        { id: 2, name: 'Ürün 2' }
      ])

      mockProductService.deleteProduct.resolves()

      await store.dispatch('product/deleteProduct', productId)
      expect(store.state.product.products.find(p => p.id === productId)).to.be.undefined
    })
  })

  describe('getters', () => {
    it('getProductById getter ürün bulabilmeli', () => {
      const products = [
        { id: 1, name: 'Ürün 1' },
        { id: 2, name: 'Ürün 2' }
      ]
      store.commit('product/SET_PRODUCTS', products)

      const product = store.getters['product/getProductById'](1)
      expect(product).to.deep.equal(products[0])
    })

    it('filteredProducts getter ürünleri filtreleyebilmeli', () => {
      const products = [
        { id: 1, name: 'Telefon', category: 'electronics', price: 1000 },
        { id: 2, name: 'Laptop', category: 'electronics', price: 2000 },
        { id: 3, name: 'Tişört', category: 'clothing', price: 50 }
      ]
      store.commit('product/SET_PRODUCTS', products)

      const filters = {
        category: 'electronics',
        minPrice: 500,
        maxPrice: 1500
      }

      const filtered = store.getters['product/filteredProducts'](filters)
      expect(filtered).to.have.lengthOf(1)
      expect(filtered[0].name).to.equal('Telefon')
    })
  })
}) 