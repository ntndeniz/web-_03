import { expect } from 'chai'
import { mount } from '@vue/test-utils'
import LoginForm from '@/components/auth/LoginForm.vue'
import { createStore } from 'vuex'

describe('LoginForm.vue', () => {
  let wrapper
  let store

  beforeEach(() => {
    store = createStore({
      modules: {
        auth: {
          namespaced: true,
          actions: {
            login: jest.fn()
          }
        }
      }
    })

    wrapper = mount(LoginForm, {
      global: {
        plugins: [store],
        stubs: ['router-link']
      }
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('form alanları görüntülenmeli', () => {
    expect(wrapper.find('input[type="email"]').exists()).to.be.true
    expect(wrapper.find('input[type="password"]').exists()).to.be.true
    expect(wrapper.find('button[type="submit"]').exists()).to.be.true
  })

  it('form validasyonu çalışmalı', async () => {
    const submitButton = wrapper.find('button[type="submit"]')
    await submitButton.trigger('click')

    expect(wrapper.findAll('.error-message')).to.have.length.greaterThan(0)
  })

  it('başarılı giriş yapılabilmeli', async () => {
    const emailInput = wrapper.find('input[type="email"]')
    const passwordInput = wrapper.find('input[type="password"]')
    const form = wrapper.find('form')

    await emailInput.setValue('test@example.com')
    await passwordInput.setValue('password123')
    await form.trigger('submit.prevent')

    expect(store.dispatch).toHaveBeenCalledWith('auth/login', {
      email: 'test@example.com',
      password: 'password123'
    })
  })

  it('şifremi unuttum linki görüntülenmeli', () => {
    const forgotPasswordLink = wrapper.find('[data-test="forgot-password-link"]')
    expect(forgotPasswordLink.exists()).to.be.true
  })

  it('kayıt ol linki görüntülenmeli', () => {
    const registerLink = wrapper.find('[data-test="register-link"]')
    expect(registerLink.exists()).to.be.true
  })

  it('sosyal medya butonları görüntülenmeli', () => {
    const socialButtons = wrapper.findAll('.social-login-button')
    expect(socialButtons.length).to.be.greaterThan(0)
  })

  it('loading durumu görüntülenmeli', async () => {
    await wrapper.setData({ loading: true })
    expect(wrapper.find('.loading-spinner').exists()).to.be.true
  })

  it('hata mesajı görüntülenmeli', async () => {
    await wrapper.setData({ error: 'Giriş başarısız' })
    expect(wrapper.find('.error-alert').text()).to.include('Giriş başarısız')
  })

  it('beni hatırla seçeneği çalışmalı', async () => {
    const rememberMe = wrapper.find('input[type="checkbox"]')
    await rememberMe.setChecked()

    expect(wrapper.vm.rememberMe).to.be.true
  })

  it('form temizlenebilmeli', () => {
    wrapper.vm.resetForm()
    expect(wrapper.vm.email).to.equal('')
    expect(wrapper.vm.password).to.equal('')
  })
}) 