import { expect } from 'chai'
import { mount } from '@vue/test-utils'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

describe('LoadingSpinner.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(LoadingSpinner, {
      props: {
        size: 'medium',
        color: '#000000',
        loading: true
      }
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('spinner görüntülenmeli', () => {
    expect(wrapper.find('.spinner').exists()).to.be.true
  })

  it('boyut prop\'u doğru uygulanmalı', async () => {
    expect(wrapper.find('.spinner').classes()).to.include('spinner--medium')

    await wrapper.setProps({ size: 'small' })
    expect(wrapper.find('.spinner').classes()).to.include('spinner--small')

    await wrapper.setProps({ size: 'large' })
    expect(wrapper.find('.spinner').classes()).to.include('spinner--large')
  })

  it('renk prop\'u doğru uygulanmalı', () => {
    const spinner = wrapper.find('.spinner')
    expect(spinner.attributes('style')).to.include('border-color: #000000')
  })

  it('loading prop\'u false olduğunda görüntülenmemeli', async () => {
    await wrapper.setProps({ loading: false })
    expect(wrapper.find('.spinner').exists()).to.be.false
  })

  it('overlay özelliği aktif olduğunda arka plan görüntülenmeli', async () => {
    await wrapper.setProps({ overlay: true })
    expect(wrapper.find('.spinner-overlay').exists()).to.be.true
  })

  it('özel metin görüntülenebilmeli', async () => {
    await wrapper.setProps({ text: 'Yükleniyor...' })
    expect(wrapper.find('.spinner-text').text()).to.equal('Yükleniyor...')
  })

  it('animasyon tipi değiştirilebilmeli', async () => {
    await wrapper.setProps({ type: 'pulse' })
    expect(wrapper.find('.spinner').classes()).to.include('spinner--pulse')
  })

  it('özel sınıf eklenebilmeli', () => {
    const customClass = 'custom-spinner'
    wrapper = mount(LoadingSpinner, {
      props: {
        loading: true,
        class: customClass
      }
    })
    expect(wrapper.find('.spinner').classes()).to.include(customClass)
  })

  it('inline özelliği doğru uygulanmalı', async () => {
    await wrapper.setProps({ inline: true })
    expect(wrapper.find('.spinner').classes()).to.include('spinner--inline')
  })
}) 