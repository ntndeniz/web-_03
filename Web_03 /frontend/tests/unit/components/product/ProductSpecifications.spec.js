import { expect } from 'chai'
import { mount } from '@vue/test-utils'
import ProductSpecifications from '@/components/product/ProductSpecifications.vue'

describe('ProductSpecifications.vue', () => {
  let wrapper

  const mockSpecifications = {
    dimensions: {
      width: '10 cm',
      height: '15 cm',
      depth: '5 cm'
    },
    weight: '250g',
    material: 'Pamuk',
    color: 'Kırmızı',
    features: [
      'Su geçirmez',
      'Dayanıklı',
      'Hafif'
    ],
    warranty: '2 yıl',
    manufacturer: 'Test Marka',
    origin: 'Türkiye',
    certifications: ['ISO 9001', 'CE']
  }

  beforeEach(() => {
    wrapper = mount(ProductSpecifications, {
      props: {
        specifications: mockSpecifications
      }
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('tüm özellikler görüntülenmeli', () => {
    expect(wrapper.find('.specifications-table').exists()).to.be.true
    expect(wrapper.text()).to.include('10 cm')
    expect(wrapper.text()).to.include('250g')
    expect(wrapper.text()).to.include('Pamuk')
  })

  it('özellik grupları doğru görüntülenmeli', () => {
    const groups = wrapper.findAll('.spec-group')
    expect(groups.length).to.be.greaterThan(0)
  })

  it('özellikler açılır/kapanır olmalı', async () => {
    const groupHeader = wrapper.find('.spec-group-header')
    await groupHeader.trigger('click')

    expect(wrapper.find('.spec-group-content').classes()).to.include('expanded')
  })

  it('özellik karşılaştırma yapılabilmeli', async () => {
    const compareCheckbox = wrapper.find('.compare-checkbox')
    await compareCheckbox.setChecked()

    expect(wrapper.emitted()['update:selectedSpecs']).to.exist
  })

  it('teknik detaylar indirilebilmeli', async () => {
    const downloadButton = wrapper.find('[data-test="download-specs"]')
    await downloadButton.trigger('click')

    expect(wrapper.emitted()['download-specs']).to.exist
  })

  it('özellik arama çalışmalı', async () => {
    const searchInput = wrapper.find('.spec-search')
    await searchInput.setValue('pamuk')

    const visibleSpecs = wrapper.findAll('.spec-item:not(.hidden)')
    expect(visibleSpecs.length).to.be.greaterThan(0)
    expect(visibleSpecs[0].text()).to.include('Pamuk')
  })

  it('sertifikalar görüntülenmeli', () => {
    const certifications = wrapper.findAll('.certification-item')
    expect(certifications.length).to.equal(2)
    expect(certifications[0].text()).to.include('ISO 9001')
  })

  it('özellikler yazdırılabilmeli', async () => {
    const printButton = wrapper.find('[data-test="print-specs"]')
    await printButton.trigger('click')

    expect(wrapper.emitted()['print-specs']).to.exist
  })

  it('özellik detayları görüntülenebilmeli', async () => {
    const infoIcon = wrapper.find('.spec-info-icon')
    await infoIcon.trigger('click')

    expect(wrapper.find('.spec-detail-modal').exists()).to.be.true
  })

  it('birim dönüşümü yapılabilmeli', async () => {
    const unitToggle = wrapper.find('.unit-toggle')
    await unitToggle.trigger('click')

    expect(wrapper.text()).to.include('3.94 inch')
  })
}) 