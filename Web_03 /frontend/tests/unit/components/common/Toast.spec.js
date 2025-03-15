import { expect } from 'chai'
import { mount } from '@vue/test-utils'
import Toast from '@/components/common/Toast.vue'

describe('Toast.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(Toast, {
      props: {
        show: false,
        message: 'Test mesajı',
        type: 'success',
        duration: 3000
      }
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('toast görüntülenmeli', async () => {
    await wrapper.setProps({ show: true })
    expect(wrapper.find('.toast').exists()).to.be.true
  })

  it('mesaj doğru görüntülenmeli', async () => {
    await wrapper.setProps({ show: true })
    expect(wrapper.find('.toast-message').text()).to.equal('Test mesajı')
  })

  it('tip sınıfı doğru uygulanmalı', async () => {
    await wrapper.setProps({ show: true })
    expect(wrapper.find('.toast').classes()).to.include('toast--success')

    await wrapper.setProps({ type: 'error' })
    expect(wrapper.find('.toast').classes()).to.include('toast--error')
  })

  it('otomatik kapanma çalışmalı', async () => {
    await wrapper.setProps({ show: true, duration: 100 })
    expect(wrapper.find('.toast').exists()).to.be.true

    await new Promise(resolve => setTimeout(resolve, 150))
    expect(wrapper.emitted().close).to.exist
  })

  it('kapatma butonu çalışmalı', async () => {
    await wrapper.setProps({ show: true })
    
    const closeButton = wrapper.find('.toast-close')
    await closeButton.trigger('click')

    expect(wrapper.emitted().close).to.exist
  })

  it('animasyon sınıfları doğru uygulanmalı', async () => {
    await wrapper.setProps({ show: true })
    expect(wrapper.find('.toast').classes()).to.include('toast-enter')

    await wrapper.setProps({ show: false })
    expect(wrapper.find('.toast').classes()).to.include('toast-leave')
  })

  it('özel ikon görüntülenebilmeli', async () => {
    await wrapper.setProps({ 
      show: true,
      icon: 'check-circle'
    })
    expect(wrapper.find('.toast-icon').exists()).to.be.true
  })

  it('pozisyon prop\'u doğru uygulanmalı', async () => {
    await wrapper.setProps({ 
      show: true,
      position: 'top-right'
    })
    expect(wrapper.find('.toast').classes()).to.include('toast--top-right')
  })

  it('birden fazla toast görüntülenebilmeli', () => {
    const wrapper = mount(Toast, {
      props: {
        show: true,
        messages: [
          { id: 1, message: 'Mesaj 1', type: 'success' },
          { id: 2, message: 'Mesaj 2', type: 'error' }
        ]
      }
    })

    const toasts = wrapper.findAll('.toast')
    expect(toasts.length).to.equal(2)
  })
}) 