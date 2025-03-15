import { expect } from 'chai'
import { mount } from '@vue/test-utils'
import ProductCard from '@/components/product/ProductCard.vue'
import { createStore } from 'vuex'

describe('ProductCard.vue', () => {
  let wrapper
  let store

  const mockProduct = {
    id: 1,
    name: 'Test Ürün',
    price: 99.99,
    image: '/images/test.jpg',
    discount: 10,
    rating: 4.5,
    reviewCount: 128
  }

  beforeEach(() => {
    store = createStore({
      modules: {
        cart: {
          namespaced: true,
          actions: {
            addToCart: jest.fn()
          }
        },
        wishlist: {
          namespaced: true,
          actions: {
            addToWishlist: jest.fn(),
            removeFromWishlist: jest.fn()
          },
          getters: {
            isInWishlist: () => () => false
          }
        }
      }
    })

    wrapper = mount(ProductCard, {
      props: {
        product: mockProduct
      },
      global: {
        plugins: [store],
        stubs: ['router-link']
      }
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('ürün bilgileri doğru görüntülenmeli', () => {
    expect(wrapper.find('.product-name').text()).to.equal('Test Ürün')
    expect(wrapper.find('.product-price').text()).to.include('99.99')
    expect(wrapper.find('img').attributes('src')).to.equal('/images/test.jpg')
  })

  it('indirim bilgisi doğru görüntülenmeli', () => {
    expect(wrapper.find('.discount-badge').text()).to.include('10%')
    expect(wrapper.find('.original-price').exists()).to.be.true
  })

  it('derecelendirme bilgisi doğru görüntülenmeli', () => {
    expect(wrapper.find('.rating-stars').exists()).to.be.true
    expect(wrapper.find('.review-count').text()).to.include('128')
  })

  it('sepete ekle butonu çalışmalı', async () => {
    const addToCartButton = wrapper.find('[data-test="add-to-cart"]')
    await addToCartButton.trigger('click')

    expect(store.dispatch).toHaveBeenCalledWith('cart/addToCart', mockProduct)
  })

  it('favorilere ekle butonu çalışmalı', async () => {
    const wishlistButton = wrapper.find('[data-test="toggle-wishlist"]')
    await wishlistButton.trigger('click')

    expect(store.dispatch).toHaveBeenCalledWith('wishlist/addToWishlist', mockProduct)
  })

  it('hızlı görüntüleme modalı açılmalı', async () => {
    const quickViewButton = wrapper.find('[data-test="quick-view"]')
    await quickViewButton.trigger('click')

    expect(wrapper.emitted()['quick-view']).to.exist
    expect(wrapper.emitted()['quick-view'][0]).to.deep.equal([mockProduct])
  })

  it('stok durumu görüntülenmeli', async () => {
    await wrapper.setProps({
      product: { ...mockProduct, stock: 0 }
    })

    expect(wrapper.find('.out-of-stock').exists()).to.be.true
    expect(wrapper.find('[data-test="add-to-cart"]').attributes('disabled')).to.exist
  })

  it('ürün karşılaştırma butonu çalışmalı', async () => {
    const compareButton = wrapper.find('[data-test="add-to-compare"]')
    await compareButton.trigger('click')

    expect(wrapper.emitted()['add-to-compare']).to.exist
    expect(wrapper.emitted()['add-to-compare'][0]).to.deep.equal([mockProduct])
  })

  it('ürün varyantları görüntülenmeli', async () => {
    await wrapper.setProps({
      product: {
        ...mockProduct,
        variants: ['Kırmızı', 'Mavi', 'Yeşil']
      }
    })

    const variants = wrapper.findAll('.variant-option')
    expect(variants.length).to.equal(3)
  })
}) 