import { expect } from 'chai'
import { createStore } from 'vuex'
import user from '@/store/modules/user'
import UserService from '@/services/user.service'
import sinon from 'sinon'

describe('User Store', () => {
  let store
  let mockUserService

  beforeEach(() => {
    mockUserService = {
      getUserProfile: sinon.stub(),
      updateProfile: sinon.stub(),
      changePassword: sinon.stub(),
      getAddresses: sinon.stub(),
      addAddress: sinon.stub(),
      deleteAddress: sinon.stub()
    }

    store = createStore({
      modules: {
        user: {
          ...user,
          actions: {
            ...user.actions,
            $userService: mockUserService
          }
        }
      }
    })
  })

  afterEach(() => {
    sinon.restore()
  })

  describe('mutations', () => {
    it('SET_PROFILE mutation kullanıcı profilini güncellemeli', () => {
      const profile = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com'
      }
      store.commit('user/SET_PROFILE', profile)
      expect(store.state.user.profile).to.deep.equal(profile)
    })

    it('SET_ADDRESSES mutation adres listesini güncellemeli', () => {
      const addresses = [
        { id: 1, title: 'Ev', address: 'Test Sokak' },
        { id: 2, title: 'İş', address: 'Test Caddesi' }
      ]
      store.commit('user/SET_ADDRESSES', addresses)
      expect(store.state.user.addresses).to.deep.equal(addresses)
    })

    it('SET_LOADING mutation yükleme durumunu güncellemeli', () => {
      store.commit('user/SET_LOADING', true)
      expect(store.state.user.loading).to.be.true
    })

    it('SET_ERROR mutation hata durumunu güncellemeli', () => {
      const error = 'Profil güncellenemedi'
      store.commit('user/SET_ERROR', error)
      expect(store.state.user.error).to.equal(error)
    })
  })

  describe('actions', () => {
    it('fetchProfile action kullanıcı profilini getirmeli', async () => {
      const profile = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com'
      }

      mockUserService.getUserProfile.resolves({ data: profile })

      await store.dispatch('user/fetchProfile')
      expect(store.state.user.profile).to.deep.equal(profile)
      expect(store.state.user.loading).to.be.false
    })

    it('updateProfile action profili güncelleyebilmeli', async () => {
      const updates = {
        name: 'Updated Name',
        phone: '+905551234567'
      }

      const updatedProfile = {
        id: 1,
        email: 'test@example.com',
        ...updates
      }

      mockUserService.updateProfile.resolves({ data: updatedProfile })

      await store.dispatch('user/updateProfile', updates)
      expect(store.state.user.profile).to.deep.equal(updatedProfile)
    })

    it('changePassword action şifre değişikliği yapabilmeli', async () => {
      const passwordData = {
        currentPassword: 'oldpass123',
        newPassword: 'newpass123'
      }

      mockUserService.changePassword.resolves()

      await store.dispatch('user/changePassword', passwordData)
      expect(mockUserService.changePassword.calledWith(passwordData)).to.be.true
    })

    it('fetchAddresses action adres listesini getirmeli', async () => {
      const addresses = [
        { id: 1, title: 'Ev', address: 'Test Sokak' },
        { id: 2, title: 'İş', address: 'Test Caddesi' }
      ]

      mockUserService.getAddresses.resolves({ data: addresses })

      await store.dispatch('user/fetchAddresses')
      expect(store.state.user.addresses).to.deep.equal(addresses)
    })

    it('addAddress action yeni adres ekleyebilmeli', async () => {
      const newAddress = {
        title: 'Yeni Adres',
        address: 'Test Sokak No:3'
      }

      const createdAddress = { id: 3, ...newAddress }
      mockUserService.addAddress.resolves({ data: createdAddress })

      await store.dispatch('user/addAddress', newAddress)
      expect(store.state.user.addresses).to.deep.include(createdAddress)
    })

    it('deleteAddress action adres silebilmeli', async () => {
      store.commit('user/SET_ADDRESSES', [
        { id: 1, title: 'Ev' },
        { id: 2, title: 'İş' }
      ])

      mockUserService.deleteAddress.resolves()

      await store.dispatch('user/deleteAddress', 1)
      expect(store.state.user.addresses.find(a => a.id === 1)).to.be.undefined
    })
  })

  describe('getters', () => {
    it('isProfileComplete getter profil durumunu kontrol etmeli', () => {
      expect(store.getters['user/isProfileComplete']).to.be.false

      store.commit('user/SET_PROFILE', {
        name: 'Test User',
        email: 'test@example.com',
        phone: '+905551234567'
      })
      expect(store.getters['user/isProfileComplete']).to.be.true
    })

    it('getAddressById getter adres bulabilmeli', () => {
      const addresses = [
        { id: 1, title: 'Ev' },
        { id: 2, title: 'İş' }
      ]
      store.commit('user/SET_ADDRESSES', addresses)

      const address = store.getters['user/getAddressById'](1)
      expect(address).to.deep.equal(addresses[0])
    })
  })
}) 