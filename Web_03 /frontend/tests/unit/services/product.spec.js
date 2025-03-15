import { expect } from 'chai'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import ProductService from '@/services/product.service'
import store from '@/store'

describe('ProductService', () => {
  let mock

  beforeEach(() => {
    mock = new MockAdapter(axios)
  })

  afterEach(() => {
    mock.restore()
  })

  describe('getProducts', () => {
    it('ürün listesini başarıyla getirmeli', async () => {
      const mockProducts = [
        { id: 1, name: 'Ürün 1', price: 100 },
        { id: 2, name: 'Ürün 2', price: 200 }
      ]

      mock.onGet('/products').reply(200, mockProducts)

      const response = await ProductService.getProducts()
      expect(response.data).to.deep.equal(mockProducts)
    })

    it('filtreleme parametreleriyle çalışabilmeli', async () => {
      const filters = {
        category: 'electronics',
        minPrice: 100,
        maxPrice: 1000,
        sort: 'price_asc'
      }

      mock.onGet('/products', { params: filters }).reply(200, [])
      await ProductService.getProducts(filters)
      
      expect(mock.history.get[0].params).to.deep.equal(filters)
    })
  })

  describe('getProductById', () => {
    it('ürün detayını başarıyla getirmeli', async () => {
      const mockProduct = {
        id: 1,
        name: 'Test Ürün',
        price: 100,
        description: 'Test açıklama'
      }

      mock.onGet('/products/1').reply(200, mockProduct)

      const response = await ProductService.getProductById(1)
      expect(response.data).to.deep.equal(mockProduct)
    })

    it('olmayan ürün için 404 dönmeli', async () => {
      mock.onGet('/products/999').reply(404)

      try {
        await ProductService.getProductById(999)
        expect.fail('Hata fırlatılmalıydı')
      } catch (error) {
        expect(error.response.status).to.equal(404)
      }
    })
  })

  describe('createProduct', () => {
    it('yeni ürün oluşturabilmeli', async () => {
      const newProduct = {
        name: 'Yeni Ürün',
        price: 150,
        description: 'Yeni ürün açıklaması'
      }

      mock.onPost('/products', newProduct).reply(201, {
        id: 3,
        ...newProduct
      })

      const response = await ProductService.createProduct(newProduct)
      expect(response.data.name).to.equal(newProduct.name)
      expect(response.data).to.have.property('id')
    })
  })

  describe('updateProduct', () => {
    it('ürün güncelleyebilmeli', async () => {
      const productId = 1
      const updates = {
        name: 'Güncellenmiş Ürün',
        price: 200
      }

      mock.onPut(`/products/${productId}`, updates).reply(200, {
        id: productId,
        ...updates
      })

      const response = await ProductService.updateProduct(productId, updates)
      expect(response.data.name).to.equal(updates.name)
    })
  })

  describe('deleteProduct', () => {
    it('ürün silebilmeli', async () => {
      const productId = 1
      mock.onDelete(`/products/${productId}`).reply(204)

      const response = await ProductService.deleteProduct(productId)
      expect(response.status).to.equal(204)
    })
  })

  describe('uploadProductImage', () => {
    it('ürün görseli yükleyebilmeli', async () => {
      const productId = 1
      const imageFile = new File([''], 'test.jpg', { type: 'image/jpeg' })
      const formData = new FormData()
      formData.append('image', imageFile)

      mock.onPost(`/products/${productId}/image`, formData).reply(200, {
        imageUrl: 'https://example.com/images/test.jpg'
      })

      const response = await ProductService.uploadProductImage(productId, imageFile)
      expect(response.data).to.have.property('imageUrl')
    })
  })
}) 