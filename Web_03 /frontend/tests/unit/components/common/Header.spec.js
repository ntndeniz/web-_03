import { expect } from 'chai'
import { mount } from '@vue/test-utils'
import Header from '@/components/common/Header.vue'
import { createStore } from 'vuex'
import { createRouter, createWebHistory } from 'vue-router'

describe('Header.vue', () => {
  let store
  let router
  let wrapper

  beforeEach(() => {
    store = createStore({
      modules: {
        auth: {
          namespaced: true,
          state: {
            user: null,
            isAuthenticated: false
          },
          getters: {
            isAuthenticated: state => state.isAuthenticated,
            currentUser: state => state.user
          }
        },
        cart: {
          namespaced: true,
          state: {
            items: []
          },
          getters: {
            cartItemCount: state => state.items.length
          }
        }
      }
    })

    router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/', name: 'Home' },
        { path: '/login', name: 'Login' },
        { path: '/cart', name: 'Cart' }
      ]
    })

    wrapper = mount(Header, {
      global: {
        plugins: [store, router],
        stubs: ['router-link']
      }
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('logo görüntülenmeli', () => {
    expect(wrapper.find('.logo').exists()).to.be.true
  })

  it('arama çubuğu görüntülenmeli', () => {
    const searchBar = wrapper.find('input[type="search"]')
    expect(searchBar.exists()).to.be.true
  })

  it('arama yapılabilmeli', async () => {
    const searchInput = wrapper.find('input[type="search"]')
    await searchInput.setValue('test ürün')
    await searchInput.trigger('keyup.enter')

    // Search event'inin emit edildiğini kontrol et
    expect(wrapper.emitted().search).to.exist
    expect(wrapper.emitted().search[0]).to.deep.equal(['test ürün'])
  })

  it('giriş yapmamış kullanıcı için login butonu görüntülenmeli', () => {
    const loginButton = wrapper.find('[data-test="login-button"]')
    expect(loginButton.exists()).to.be.true
  })
  it('giriş yapmış kullanıcı için profil menüsü görüntülenmeli', async () => {
    store.state.auth.isAuthenticated = true;
    store.state.auth.user = { name: 'Test User' };

    const profileMenu = wrapper.find('[data-test="profile-menu"]');
    expect(profileMenu.exists()).to.be.true;
  })
  it('sepet sayacı doğru görüntülenmeli', async () => {
    store.state.cart.items = [
      { id: 1, quantity: 2 },
      { id: 2, quantity: 1 }
    ]

    const cartBadge = wrapper.find('[data-test="cart-badge"]')
    expect(cartBadge.text()).to.equal('2')
  })

  it('mobil menü açılıp kapanabilmeli', async () => {
    const menuButton = wrapper.find('[data-test="mobile-menu-button"]')
    expect(wrapper.find('[data-test="mobile-menu"]').classes()).not.to.include('open')

    await menuButton.trigger('click')
    expect(wrapper.find('[data-test="mobile-menu"]').classes()).to.include('open')

    await menuButton.trigger('click')
    expect(wrapper.find('[data-test="mobile-menu"]').classes()).not.to.include('open')
  })

  it('dil seçimi yapılabilmeli', async () => {
    const languageSelector = wrapper.find('[data-test="language-selector"]')
    await languageSelector.trigger('change')

    expect(wrapper.emitted()['update-language']).to.exist
  })
})