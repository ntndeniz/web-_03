import { expect } from 'chai'
import { mount } from '@vue/test-utils'
import Modal from '@/components/common/Modal.vue'

describe('Modal.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(Modal, {
      props: {
        show: false,
        title: 'Test Modal',
        closeOnClickOutside: true
      }
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('başlık doğru görüntülenmeli', async () => {
    await wrapper.setProps({ show: true })
    expect(wrapper.find('.modal-title').text()).to.equal('Test Modal')
  })

  it('modal açılıp kapanabilmeli', async () => {
    expect(wrapper.find('.modal').exists()).to.be.false

    await wrapper.setProps({ show: true })
    expect(wrapper.find('.modal').exists()).to.be.true

    await wrapper.setProps({ show: false })
    expect(wrapper.find('.modal').exists()).to.be.false
  })

  it('dışarı tıklandığında kapanabilmeli', async () => {
    await wrapper.setProps({ show: true })
    
    const overlay = wrapper.find('.modal-overlay')
    await overlay.trigger('click')

    expect(wrapper.emitted().close).to.exist
  })

  it('closeOnClickOutside false iken dışarı tıklandığında kapanmamalı', async () => {
    await wrapper.setProps({ 
      show: true,
      closeOnClickOutside: false
    })
    
    const overlay = wrapper.find('.modal-overlay')
    await overlay.trigger('click')

    expect(wrapper.emitted().close).to.be.undefined
  })

  it('kapatma butonu çalışmalı', async () => {
    await wrapper.setProps({ show: true })
    
    const closeButton = wrapper.find('.modal-close')
    await closeButton.trigger('click')

    expect(wrapper.emitted().close).to.exist
  })

  it('içerik slot\'u çalışmalı', async () => {
    const content = '<div class="test-content">Test İçerik</div>'
    wrapper = mount(Modal, {
      props: { show: true },
      slots: {
        default: content
      }
    })

    expect(wrapper.find('.test-content').exists()).to.be.true
    expect(wrapper.find('.test-content').text()).to.equal('Test İçerik')
  })

  it('footer slot\'u çalışmalı', async () => {
    const footer = '<button class="test-button">Kaydet</button>'
    wrapper = mount(Modal, {
      props: { show: true },
      slots: {
        footer: footer
      }
    })

    expect(wrapper.find('.test-button').exists()).to.be.true
    expect(wrapper.find('.test-button').text()).to.equal('Kaydet')
  })

  it('boyut prop\'u doğru uygulanmalı', async () => {
    await wrapper.setProps({ 
      show: true,
      size: 'large'
    })
    expect(wrapper.find('.modal').classes()).to.include('modal--large')
  })

  it('animasyon sınıfları doğru uygulanmalı', async () => {
    await wrapper.setProps({ show: true })
    expect(wrapper.find('.modal').classes()).to.include('modal-enter-active')
  })

  it('ESC tuşu ile kapanabilmeli', async () => {
    await wrapper.setProps({ show: true })
    
    await wrapper.trigger('keydown.esc')
    expect(wrapper.emitted().close).to.exist
  })
}) 