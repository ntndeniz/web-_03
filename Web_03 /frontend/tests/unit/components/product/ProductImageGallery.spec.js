import { expect } from 'chai'
import { mount } from '@vue/test-utils'
import ProductImageGallery from '@/components/product/ProductImageGallery.vue'

describe('ProductImageGallery.vue', () => {
  let wrapper

  const mockImages = [
    '/images/product1.jpg',
    '/images/product2.jpg',
    '/images/product3.jpg',
    '/images/product4.jpg'
  ]

  beforeEach(() => {
    wrapper = mount(ProductImageGallery, {
      props: {
        images: mockImages,
        thumbnailPosition: 'bottom'
      }
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('ana görsel görüntülenmeli', () => {
    const mainImage = wrapper.find('.main-image img')
    expect(mainImage.exists()).to.be.true
    expect(mainImage.attributes('src')).to.equal(mockImages[0])
  })

  it('küçük resimler görüntülenmeli', () => {
    const thumbnails = wrapper.findAll('.thumbnail-image')
    expect(thumbnails.length).to.equal(mockImages.length)
  })

  it('küçük resme tıklandığında ana görsel değişmeli', async () => {
    const thumbnails = wrapper.findAll('.thumbnail-image')
    await thumbnails[1].trigger('click')

    const mainImage = wrapper.find('.main-image img')
    expect(mainImage.attributes('src')).to.equal(mockImages[1])
  })

  it('zoom özelliği çalışmalı', async () => {
    const mainImage = wrapper.find('.main-image')
    await mainImage.trigger('mousemove', {
      clientX: 100,
      clientY: 100
    })

    expect(wrapper.find('.zoomed-image').exists()).to.be.true
  })

  it('tam ekran görüntüleme çalışmalı', async () => {
    const fullscreenButton = wrapper.find('[data-test="fullscreen-button"]')
    await fullscreenButton.trigger('click')

    expect(wrapper.find('.fullscreen-gallery').exists()).to.be.true
  })

  it('önceki/sonraki butonları çalışmalı', async () => {
    const nextButton = wrapper.find('.gallery-next')
    await nextButton.trigger('click')

    const mainImage = wrapper.find('.main-image img')
    expect(mainImage.attributes('src')).to.equal(mockImages[1])

    const prevButton = wrapper.find('.gallery-prev')
    await prevButton.trigger('click')
    expect(mainImage.attributes('src')).to.equal(mockImages[0])
  })

  it('thumbnail pozisyonu değiştirilebilmeli', async () => {
    await wrapper.setProps({ thumbnailPosition: 'left' })
    expect(wrapper.find('.thumbnails-container').classes()).to.include('position-left')
  })

  it('lazy loading çalışmalı', () => {
    const lazyImages = wrapper.findAll('img[loading="lazy"]')
    expect(lazyImages.length).to.be.greaterThan(0)
  })

  it('görsel yükleme hatası yönetilmeli', async () => {
    const mainImage = wrapper.find('.main-image img')
    await mainImage.trigger('error')

    expect(wrapper.find('.error-placeholder').exists()).to.be.true
  })

  it('dokunmatik kaydırma çalışmalı', async () => {
    const gallery = wrapper.find('.gallery-container')
    
    await gallery.trigger('touchstart', {
      touches: [{ clientX: 0, clientY: 0 }]
    })
    
    await gallery.trigger('touchmove', {
      touches: [{ clientX: -100, clientY: 0 }]
    })
    
    await gallery.trigger('touchend')

    const mainImage = wrapper.find('.main-image img')
    expect(mainImage.attributes('src')).to.equal(mockImages[1])
  })
}) 