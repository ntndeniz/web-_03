import { expect } from 'chai'
import { mount } from '@vue/test-utils'
import ProductFilter from '@/components/product/ProductFilter.vue'

describe('ProductFilter.vue', () => {
  let wrapper

  const mockFilters = {
    categories: ['Elektronik', 'Giyim', 'Aksesuar'],
    brands: ['Apple', 'Samsung', 'Nike'],
    colors: ['Kırmızı', 'Mavi', 'Siyah'],
    sizes: ['S', 'M', 'L', 'XL'],
    priceRange: {
      min: 0,
      max: 1000
    }
  }

  beforeEach(() => {
    wrapper = mount(ProductFilter, {
      props: {
        filters: mockFilters,
        selectedFilters: {}
      }
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('tüm filtre grupları görüntülenmeli', () => {
    expect(wrapper.find('.category-filters').exists()).to.be.true
    expect(wrapper.find('.brand-filters').exists()).to.be.true
    expect(wrapper.find('.color-filters').exists()).to.be.true
    expect(wrapper.find('.size-filters').exists()).to.be.true
    expect(wrapper.find('.price-filter').exists()).to.be.true
  })

  it('kategori filtresi seçilebilmeli', async () => {
    const categoryCheckbox = wrapper.find('input[value="Elektronik"]')
    await categoryCheckbox.setChecked()

    expect(wrapper.emitted()['update:filters']).to.exist
    expect(wrapper.emitted()['update:filters'][0][0].categories).to.include('Elektronik')
  })

  it('marka filtresi seçilebilmeli', async () => {
    const brandCheckbox = wrapper.find('input[value="Apple"]')
    await brandCheckbox.setChecked()

    expect(wrapper.emitted()['update:filters']).to.exist
    expect(wrapper.emitted()['update:filters'][0][0].brands).to.include('Apple')
  })

  it('renk filtresi seçilebilmeli', async () => {
    const colorRadio = wrapper.find('input[value="Kırmızı"]')
    await colorRadio.setChecked()

    expect(wrapper.emitted()['update:filters']).to.exist
    expect(wrapper.emitted()['update:filters'][0][0].colors).to.include('Kırmızı')
  })

  it('beden filtresi seçilebilmeli', async () => {
    const sizeButton = wrapper.find('.size-button[data-size="M"]')
    await sizeButton.trigger('click')

    expect(wrapper.emitted()['update:filters']).to.exist
    expect(wrapper.emitted()['update:filters'][0][0].sizes).to.include('M')
  })

  it('fiyat aralığı ayarlanabilmeli', async () => {
    const minInput = wrapper.find('.price-range-min')
    const maxInput = wrapper.find('.price-range-max')

    await minInput.setValue(100)
    await maxInput.setValue(500)

    expect(wrapper.emitted()['update:filters']).to.exist
    expect(wrapper.emitted()['update:filters'][0][0].priceRange).to.deep.equal({
      min: 100,
      max: 500
    })
  })

  it('filtreler temizlenebilmeli', async () => {
    const clearButton = wrapper.find('[data-test="clear-filters"]')
    await clearButton.trigger('click')

    expect(wrapper.emitted()['reset-filters']).to.exist
  })

  it('mobil görünümde filtre menüsü açılıp kapanabilmeli', async () => {
    const filterButton = wrapper.find('[data-test="toggle-filters"]')
    await filterButton.trigger('click')

    expect(wrapper.find('.filter-menu').classes()).to.include('show')

    await filterButton.trigger('click')
    expect(wrapper.find('.filter-menu').classes()).not.to.include('show')
  })

  it('seçili filtreler görüntülenmeli', async () => {
    await wrapper.setProps({
      selectedFilters: {
        categories: ['Elektronik'],
        brands: ['Apple'],
        colors: ['Kırmızı']
      }
    })

    const selectedTags = wrapper.findAll('.selected-filter')
    expect(selectedTags.length).to.equal(3)
  })

  it('seçili filtreler kaldırılabilmeli', async () => {
    await wrapper.setProps({
      selectedFilters: {
        categories: ['Elektronik']
      }
    })

    const removeButton = wrapper.find('.remove-filter')
    await removeButton.trigger('click')

    expect(wrapper.emitted()['remove-filter']).to.exist
    expect(wrapper.emitted()['remove-filter'][0]).to.deep.equal(['categories', 'Elektronik'])
  })
}) 