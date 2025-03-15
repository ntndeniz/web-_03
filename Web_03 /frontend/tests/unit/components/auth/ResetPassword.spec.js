import { expect } from 'chai'
import { mount } from '@vue/test-utils'
import ResetPassword from '@/components/auth/ResetPassword.vue'
import { createStore } from 'vuex'

describe('ResetPassword.vue', () => {
  let wrapper
  let store

  beforeEach(() => {
    store = createStore({
      modules: {
        auth: {
          namespaced: true,
          actions: {
            resetPassword: jest.fn()
          }
        }
      }
    })

    wrapper = mount(ResetPassword, {
      global: {
        plugins: [store],
        stubs: ['router-link']
      },
      props: {
        token: 'reset-token'
      }
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('form alanları görüntülenmeli', () => {
    expect(wrapper.find('input[type="password"]').exists()).to.be.true
    expect(wrapper.find('input[name="passwordConfirm"]').exists()).to.be.true
  })

  it('şifre validasyonu çalışmalı', async () => {
    const passwordInput = wrapper.find('input[type="password"]')
    const form = wrapper.find('form')

    await passwordInput.setValue('weak')
    await form.trigger('submit.prevent')

    expect(wrapper.find('.password-error').exists()).to.be.true
  })

  it('şifre eşleşme kontrolü yapılmalı', async () => {
    const passwordInput = wrapper.find('input[type="password"]')
    const confirmInput = wrapper.find('input[name="passwordConfirm"]')

    await passwordInput.setValue('password123')
    await confirmInput.setValue('password124')

    expect(wrapper.find('.password-mismatch-error').exists()).to.be.true
  })

  it('başarılı şifre sıfırlama yapılabilmeli', async () => {
    const passwordInput = wrapper.find('input[type="password"]')
    const confirmInput = wrapper.find('input[name="passwordConfirm"]')
    const form = wrapper.find('form')

    await passwordInput.setValue('newPassword123')
    await confirmInput.setValue('newPassword123')
    await form.trigger('submit.prevent')

    expect(store.dispatch).toHaveBeenCalledWith('auth/resetPassword', {
      token: 'reset-token',
      password: 'newPassword123'
    })
  })

  it('şifre güçlülük göstergesi çalışmalı', async () => {
    const passwordInput = wrapper.find('input[type="password"]')
    
    await passwordInput.setValue('weak')
    expect(wrapper.find('.password-strength').classes()).to.include('weak')

    await passwordInput.setValue('strongPassword123!')
    expect(wrapper.find('.password-strength').classes()).to.include('strong')
  })

  it('loading durumu görüntülenmeli', async () => {
    await wrapper.setData({ loading: true })
    expect(wrapper.find('.loading-spinner').exists()).to.be.true
  })

  it('hata mesajı görüntülenmeli', async () => {
    await wrapper.setData({ error: 'Geçersiz token' })
    expect(wrapper.find('.error-alert').text()).to.include('Geçersiz token')
  })

  it('başarılı sıfırlama sonrası mesaj görüntülenmeli', async () => {
    await wrapper.setData({ success: true })
    expect(wrapper.find('.success-message').exists()).to.be.true
  })

  it('giriş sayfasına yönlendirme linki görüntülenmeli', () => {
    const loginLink = wrapper.find('[data-test="login-link"]')
    expect(loginLink.exists()).to.be.true
  })

  it('form temizlenebilmeli', () => {
    wrapper.vm.resetForm()
    expect(wrapper.vm.password).to.equal('')
    expect(wrapper.vm.passwordConfirm).to.equal('')
  })
}) 