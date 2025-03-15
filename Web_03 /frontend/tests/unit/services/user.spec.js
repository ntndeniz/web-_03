import { expect } from 'chai'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import UserService from '@/services/user.service'
import store from '@/store'

describe('UserService', () => {
  let mock

  beforeEach(() => {
    mock = new MockAdapter(axios)
  })

  afterEach(() => {
    mock.restore()
  })

  describe('getUserProfile', () => {
    it('kullanıcı profilini getirmeli', async () => {
      const mockProfile = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        phone: '+905551234567'
      }

      mock.onGet('/users/profile').reply(200, mockProfile)

      const response = await UserService.getUserProfile()
      expect(response.data).to.deep.equal(mockProfile)
    })
  })

  describe('updateProfile', () => {
    it('profil bilgilerini güncelleyebilmeli', async () => {
      const updates = {
        name: 'Updated Name',
        phone: '+905559876543'
      }

      mock.onPut('/users/profile', updates).reply(200, {
        id: 1,
        email: 'test@example.com',
        ...updates
      })

      const response = await UserService.updateProfile(updates)
      expect(response.data.name).to.equal(updates.name)
    })

    it('geçersiz veri için hata dönmeli', async () => {
      const invalidUpdates = {
        phone: 'invalid-phone'
      }

      mock.onPut('/users/profile', invalidUpdates)
        .reply(400, { error: 'Invalid phone number' })

      try {
        await UserService.updateProfile(invalidUpdates)
        expect.fail('Hata fırlatılmalıydı')
      } catch (error) {
        expect(error.response.status).to.equal(400)
      }
    })
  })

  describe('changePassword', () => {
    it('şifre değişikliği yapabilmeli', async () => {
      const passwordData = {
        currentPassword: 'oldpass123',
        newPassword: 'newpass123'
      }

      mock.onPost('/users/change-password', passwordData).reply(200)

      const response = await UserService.changePassword(passwordData)
      expect(response.status).to.equal(200)
    })

    it('yanlış mevcut şifre için hata dönmeli', async () => {
      const passwordData = {
        currentPassword: 'wrongpass',
        newPassword: 'newpass123'
      }

      mock.onPost('/users/change-password', passwordData)
        .reply(400, { error: 'Current password is incorrect' })

      try {
        await UserService.changePassword(passwordData)
        expect.fail('Hata fırlatılmalıydı')
      } catch (error) {
        expect(error.response.status).to.equal(400)
      }
    })
  })

  describe('getAddresses', () => {
    it('adres listesini getirmeli', async () => {
      const mockAddresses = [
        { id: 1, title: 'Ev', address: 'Test Sokak No:1' },
        { id: 2, title: 'İş', address: 'Test Caddesi No:2' }
      ]

      mock.onGet('/users/addresses').reply(200, mockAddresses)

      const response = await UserService.getAddresses()
      expect(response.data).to.have.lengthOf(2)
    })
  })

  describe('addAddress', () => {
    it('yeni adres ekleyebilmeli', async () => {
      const newAddress = {
        title: 'Yeni Adres',
        address: 'Test Sokak No:3',
        city: 'İstanbul',
        country: 'Türkiye'
      }

      mock.onPost('/users/addresses', newAddress).reply(201, {
        id: 3,
        ...newAddress
      })

      const response = await UserService.addAddress(newAddress)
      expect(response.data.title).to.equal(newAddress.title)
      expect(response.data).to.have.property('id')
    })
  })

  describe('deleteAddress', () => {
    it('adres silebilmeli', async () => {
      const addressId = 1
      mock.onDelete(`/users/addresses/${addressId}`).reply(204)

      const response = await UserService.deleteAddress(addressId)
      expect(response.status).to.equal(204)
    })
  })

  describe('getNotificationPreferences', () => {
    it('bildirim tercihlerini getirmeli', async () => {
      const mockPreferences = {
        email: true,
        push: false,
        sms: true
      }

      mock.onGet('/users/notification-preferences').reply(200, mockPreferences)

      const response = await UserService.getNotificationPreferences()
      expect(response.data).to.deep.equal(mockPreferences)
    })
  })

  describe('updateNotificationPreferences', () => {
    it('bildirim tercihlerini güncelleyebilmeli', async () => {
      const preferences = {
        email: false,
        push: true,
        sms: false
      }

      mock.onPut('/users/notification-preferences', preferences).reply(200, preferences)

      const response = await UserService.updateNotificationPreferences(preferences)
      expect(response.data).to.deep.equal(preferences)
    })
  })
}) 