import { expect } from 'chai'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import api from '@/services/api'
import store from '@/store'
import ApiService from '@/services/api.service'

describe('API Servisleri', () => {
  let mock

  beforeEach(() => {
    mock = new MockAdapter(axios)
  })

  afterEach(() => {
    mock.restore()
  })

  describe('Kategori Servisi', () => {
    it('kategorileri başarıyla getirmeli', async () => {
      const mockData = [
        { id: 1, name: 'Elektronik', order: 1 },
        { id: 2, name: 'Giyim', order: 2 }
      ]

      mock.onGet('/categories').reply(200, mockData)

      const response = await api.get('/categories')
      expect(response).to.deep.equal(mockData)
    })

    it('kategori oluşturma başarılı olmalı', async () => {
      const category = {
        name: 'Yeni Kategori',
        description: 'Test kategori'
      }

      mock.onPost('/admin/categories').reply(201, {
        id: 3,
        ...category,
        order: 3
      })

      const response = await api.post('/admin/categories', category)
      expect(response.name).to.equal(category.name)
      expect(response).to.have.property('id')
    })

    it('yetki hatası durumunda 401 dönmeli', async () => {
      mock.onGet('/admin/categories').reply(401)

      try {
        await api.get('/admin/categories')
      } catch (error) {
        expect(error.response.status).to.equal(401)
      }
    })
  })

  describe('Kampanya Servisi', () => {
    it('aktif kampanyaları getirmeli', async () => {
      const mockData = [
        { id: 1, title: 'Yaz İndirimi', active: true },
        { id: 2, title: 'Kış Fırsatı', active: true }
      ]

      mock.onGet('/campaigns/active').reply(200, mockData)

      const response = await api.get('/campaigns/active')
      expect(response).to.have.lengthOf(2)
      expect(response[0]).to.have.property('active', true)
    })

    it('kampanya görsel yüklemesi yapmalı', async () => {
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
      const campaignId = 1

      mock.onPost(`/admin/campaigns/${campaignId}/image`).reply(200, {
        url: 'https://example.com/image.jpg'
      })

      const formData = new FormData()
      formData.append('image', file)

      const response = await api.post(`/admin/campaigns/${campaignId}/image`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      expect(response).to.have.property('url')
    })
  })

  describe('Bildirim Servisi', () => {
    it('okunmamış bildirim sayısını getirmeli', async () => {
      mock.onGet('/notifications/unread/count').reply(200, { count: 5 })

      const response = await api.get('/notifications/unread/count')
      expect(response).to.have.property('count', 5)
    })

    it('bildirimleri okundu olarak işaretlemeli', async () => {
      mock.onPut('/notifications/read-all').reply(200, { success: true })

      const response = await api.put('/notifications/read-all')
      expect(response).to.have.property('success', true)
    })
  })

  describe('Loading Durumu', () => {
    it('istek başladığında loading true olmalı', () => {
      mock.onGet('/test').reply(200)
      api.get('/test')
      expect(store.state.ui.loading.isActive).to.be.true
    })

    it('istek bittiğinde loading false olmalı', async () => {
      mock.onGet('/test').reply(200)
      await api.get('/test')
      expect(store.state.ui.loading.isActive).to.be.false
    })
  })

  describe('Hata Yönetimi', () => {
    it('404 hatası için doğru mesaj göstermeli', async () => {
      mock.onGet('/not-found').reply(404)

      try {
        await api.get('/not-found')
      } catch (error) {
        expect(store.state.ui.toast.messages[0].message)
          .to.equal('İstenilen kaynak bulunamadı')
      }
    })

    it('ağ hatası için doğru mesaj göstermeli', async () => {
      mock.onGet('/test').networkError()

      try {
        await api.get('/test')
      } catch (error) {
        expect(store.state.ui.toast.messages[0].message)
          .to.equal('Sunucuya ulaşılamıyor')
      }
    })
  })
})

describe('ApiService', () => {
  let mock

  beforeEach(() => {
    mock = new MockAdapter(axios)
  })

  afterEach(() => {
    mock.restore()
  })

  describe('get', () => {
    it('başarılı GET isteği yapabilmeli', async () => {
      const mockData = { id: 1, name: 'Test' }
      mock.onGet('/test').reply(200, mockData)

      const response = await ApiService.get('/test')
      expect(response.data).to.deep.equal(mockData)
    })

    it('hata durumunda reject edilmeli', async () => {
      mock.onGet('/test').reply(500)

      try {
        await ApiService.get('/test')
        expect.fail('Hata fırlatılmalıydı')
      } catch (error) {
        expect(error.response.status).to.equal(500)
      }
    })
  })

  describe('post', () => {
    it('başarılı POST isteği yapabilmeli', async () => {
      const requestData = { name: 'Test' }
      const responseData = { id: 1, ...requestData }
      mock.onPost('/test', requestData).reply(201, responseData)

      const response = await ApiService.post('/test', requestData)
      expect(response.data).to.deep.equal(responseData)
    })
  })

  describe('put', () => {
    it('başarılı PUT isteği yapabilmeli', async () => {
      const requestData = { id: 1, name: 'Updated' }
      mock.onPut('/test/1', requestData).reply(200, requestData)

      const response = await ApiService.put('/test/1', requestData)
      expect(response.data).to.deep.equal(requestData)
    })
  })

  describe('delete', () => {
    it('başarılı DELETE isteği yapabilmeli', async () => {
      mock.onDelete('/test/1').reply(204)

      const response = await ApiService.delete('/test/1')
      expect(response.status).to.equal(204)
    })
  })

  describe('interceptors', () => {
    it('request header\'a token ekleyebilmeli', () => {
      const token = 'test-token'
      localStorage.setItem('token', token)

      const request = ApiService.axios.interceptors.request.handlers[0]
      const config = { headers: {} }
      
      request.fulfilled(config)
      expect(config.headers.Authorization).to.equal(`Bearer ${token}`)
    })

    it('401 hatası aldığında kullanıcıyı logout yapabilmeli', async () => {
      mock.onGet('/test').reply(401)

      try {
        await ApiService.get('/test')
      } catch (error) {
        expect(localStorage.getItem('token')).to.be.null
        // Router kontrolü burada yapılabilir
      }
    })
  })
}) 