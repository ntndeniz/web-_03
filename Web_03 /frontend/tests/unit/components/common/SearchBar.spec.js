import { expect } from 'chai'
import { mount } from '@vue/test-utils'
import SearchBar from '@/components/common/SearchBar.vue'

describe('SearchBar.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(SearchBar, {
      props: {
        placeholder: 'Ürün ara...',
        autofocus: false
      }
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('arama çubuğu görüntülenmeli', () => {
    const searchInput = wrapper.find('input[type="search"]')
    expect(searchInput.exists()).to.be.true
  })

  it('placeholder doğru görüntülenmeli', () => {
    const searchInput = wrapper.find('input[type="search"]')
    expect(searchInput.attributes('placeholder')).to.equal('Ürün ara...')
  })

  it('arama yapılabilmeli', async () => {
    const searchInput = wrapper.find('input[type="search"]')
    await searchInput.setValue('test ürün')
    await searchInput.trigger('keyup.enter')

    expect(wrapper.emitted().search).to.exist
    expect(wrapper.emitted().search[0]).to.deep.equal(['test ürün'])
  })

  it('arama temizlenebilmeli', async () => {
    const searchInput = wrapper.find('input[type="search"]')
    await searchInput.setValue('test ürün')
    
    const clearButton = wrapper.find('[data-test="clear-search"]')
    await clearButton.trigger('click')

    expect(searchInput.element.value).to.equal('')
    expect(wrapper.emitted().clear).to.exist
  })

  it('minimum karakter kontrolü yapılmalı', async () => {
    const searchInput = wrapper.find('input[type="search"]')
    await searchInput.setValue('te')
    await searchInput.trigger('keyup.enter')

    expect(wrapper.emitted().search).to.be.undefined
    expect(wrapper.find('.error-message').text()).to.include('En az 3 karakter')
  })

  it('otomatik tamamlama önerileri görüntülenmeli', async () => {
    await wrapper.setProps({
      suggestions: ['Telefon', 'Tablet', 'Televizyon']
    })

    const searchInput = wrapper.find('input[type="search"]')
    await searchInput.setValue('te')
    await searchInput.trigger('input')

    const suggestions = wrapper.findAll('.suggestion-item')
    expect(suggestions.length).to.equal(3)
    expect(suggestions[0].text()).to.equal('Telefon')
  })

  it('öneri seçilebilmeli', async () => {
    await wrapper.setProps({
      suggestions: ['Telefon', 'Tablet', 'Televizyon']
    })

    const searchInput = wrapper.find('input[type="search"]')
    await searchInput.setValue('te')
    
    const suggestion = wrapper.find('.suggestion-item')
    await suggestion.trigger('click')

    expect(searchInput.element.value).to.equal('Telefon')
    expect(wrapper.emitted().select).to.exist
    expect(wrapper.emitted().select[0]).to.deep.equal(['Telefon'])
  })

  it('loading durumu görüntülenmeli', async () => {
    await wrapper.setProps({ loading: true })
    expect(wrapper.find('.loading-indicator').exists()).to.be.true
  })

  it('hata durumu görüntülenmeli', async () => {
    await wrapper.setProps({ error: 'Arama yapılamadı' })
    expect(wrapper.find('.error-message').text()).to.include('Arama yapılamadı')
  })
}) 