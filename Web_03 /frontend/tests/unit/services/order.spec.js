import { expect } from 'chai'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import OrderService from '@/services/order.service'
import store from '@/store'

describe('OrderService', () => {
  let mock

  beforeEach(() => {
    mock = new MockAdapter(axios)
  })

  afterEach(() => {
    mock.restore()
  })

  describe('createOrder', () => {
    it('yeni sipariş oluşturabilmeli', async () => {
      const orderData = {
        items: [
          { productId: 1, quantity: 2 },
          { productId: 2, quantity: 1 }
        ],
        shippingAddress: {
          address: 'Test Sokak',
          city: 'İstanbul',
          country: 'Türkiye'
        },
        paymentMethod: 'credit_card'
      }

      const mockResponse = {
        id: 'ORDER123',
        status: 'pending',
        totalAmount: 299.99,
        ...orderData
      }

      mock.onPost('/orders', orderData).reply(201, mockResponse)

      const response = await OrderService.createOrder(orderData)
      expect(response.data.id).to.equal('ORDER123')
      expect(response.data.status).to.equal('pending')
    })
  })

  describe('getOrders', () => {
    it('sipariş listesini getirmeli', async () => {
      const mockOrders = [
        { id: 'ORDER1', status: 'completed', totalAmount: 199.99 },
        { id: 'ORDER2', status: 'pending', totalAmount: 299.99 }
      ]

      mock.onGet('/orders').reply(200, mockOrders)

      const response = await OrderService.getOrders()
      expect(response.data).to.have.lengthOf(2)
      expect(response.data[0]).to.have.property('id')
    })

    it('filtreleme ve sayfalama yapabilmeli', async () => {
      const params = {
        status: 'completed',
        page: 1,
        limit: 10
      }

      mock.onGet('/orders', { params }).reply(200, {
        orders: [],
        total: 0,
        page: 1,
        limit: 10
      })

      await OrderService.getOrders(params)
      expect(mock.history.get[0].params).to.deep.equal(params)
    })
  })

  describe('getOrderById', () => {
    it('sipariş detayını getirmeli', async () => {
      const orderId = 'ORDER123'
      const mockOrder = {
        id: orderId,
        status: 'completed',
        items: [
          { productId: 1, quantity: 2, price: 99.99 }
        ],
        totalAmount: 199.98
      }

      mock.onGet(`/orders/${orderId}`).reply(200, mockOrder)

      const response = await OrderService.getOrderById(orderId)
      expect(response.data.id).to.equal(orderId)
      expect(response.data).to.have.property('items')
    })
  })

  describe('updateOrderStatus', () => {
    it('sipariş durumunu güncelleyebilmeli', async () => {
      const orderId = 'ORDER123'
      const newStatus = 'shipped'

      mock.onPut(`/orders/${orderId}/status`, { status: newStatus })
        .reply(200, { id: orderId, status: newStatus })

      const response = await OrderService.updateOrderStatus(orderId, newStatus)
      expect(response.data.status).to.equal(newStatus)
    })
  })

  describe('cancelOrder', () => {
    it('siparişi iptal edebilmeli', async () => {
      const orderId = 'ORDER123'
      const reason = 'customer_request'

      mock.onPost(`/orders/${orderId}/cancel`, { reason })
        .reply(200, { id: orderId, status: 'cancelled', cancelReason: reason })

      const response = await OrderService.cancelOrder(orderId, reason)
      expect(response.data.status).to.equal('cancelled')
    })

    it('teslim edilmiş siparişi iptal edememeli', async () => {
      const orderId = 'ORDER123'
      
      mock.onPost(`/orders/${orderId}/cancel`)
        .reply(400, { error: 'Cannot cancel delivered order' })

      try {
        await OrderService.cancelOrder(orderId)
        expect.fail('Hata fırlatılmalıydı')
      } catch (error) {
        expect(error.response.status).to.equal(400)
      }
    })
  })

  describe('getOrderTracking', () => {
    it('sipariş takip bilgilerini getirmeli', async () => {
      const orderId = 'ORDER123'
      const mockTracking = {
        orderId,
        status: 'in_transit',
        trackingNumber: 'TRACK123',
        events: [
          { date: '2024-01-01', status: 'order_placed' },
          { date: '2024-01-02', status: 'in_transit' }
        ]
      }

      mock.onGet(`/orders/${orderId}/tracking`).reply(200, mockTracking)

      const response = await OrderService.getOrderTracking(orderId)
      expect(response.data.trackingNumber).to.equal('TRACK123')
      expect(response.data.events).to.have.lengthOf(2)
    })
  })
}) 