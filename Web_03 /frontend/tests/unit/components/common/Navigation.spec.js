import { expect } from 'chai'
import { mount } from '@vue/test-utils'
import Navigation from '@/components/common/Navigation.vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createStore } from 'vuex'

describe('Navigation.vue', () => {
  let router
  let store
  let wrapper

  beforeEach(() => {
    router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/', name: 'Home' },
        { path: '/products', name: 'Products' },
        { path: '/categories', name: 'Categories' }
      ]
    })

    store = createStore({
      modules: {
        category: {
          namespaced: true,
          state: {
            categories: [
              { id: 1, name: 'Elektronik' },
              { id: 2, name: 'Giyim' }
            ]
          },
          getters: {
            allCategories: state => state.categories
          }
        }
      }
    })

    wrapper = mount(Navigation, {
      global: {
        plugins: [router, store],
        stubs: ['router-link']
      }
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('ana menü öğeleri görüntülenmeli', () => {
    const menuItems = wrapper.findAll('.nav-item')
    expect(menuItems.length).to.be.greaterThan(0)
  })

  it('kategori menüsü görüntülenmeli', () => {
    const categoryMenu = wrapper.find('.category-menu')
    expect(categoryMenu.exists()).to.be.true
  })

  it('alt kategoriler hover durumunda görüntülenmeli', async () => {
    const categoryItem = wrapper.find('.category-item')
    await categoryItem.trigger('mouseenter')

    const subCategories = wrapper.find('.sub-categories')
    expect(subCategories.isVisible()).to.be.true
  })

  it('mobil menü açılıp kapanabilmeli', async () => {
    const menuButton = wrapper.find('[data-test="mobile-nav-button"]')
    const mobileMenu = wrapper.find('.mobile-menu')

    expect(mobileMenu.classes()).not.to.include('open')

    await menuButton.trigger('click')
    expect(mobileMenu.classes()).to.include('open')

    await menuButton.trigger('click')
    expect(mobileMenu.classes()).not.to.include('open')
  })

  it('aktif menü öğesi vurgulanmalı', async () => {
    await router.push('/products')
    const activeItem = wrapper.find('.nav-item.active')
    expect(activeItem.text()).to.include('Products')
  })

  it('kategori arama yapılabilmeli', async () => {
    const searchInput = wrapper.find('.category-search input')
    await searchInput.setValue('elek')

    const filteredCategories = wrapper.findAll('.category-item')
    expect(filteredCategories.length).to.equal(1)
    expect(filteredCategories[0].text()).to.include('Elektronik')
  })

  it('mega menü görüntülenmeli', async () => {
    const megaMenuTrigger = wrapper.find('[data-test="mega-menu-trigger"]')
    await megaMenuTrigger.trigger('mouseenter')

    const megaMenu = wrapper.find('.mega-menu')
    expect(megaMenu.isVisible()).to.be.true
  })

  it('breadcrumb navigasyonu görüntülenmeli', () => {
    const breadcrumb = wrapper.find('.breadcrumb')
    expect(breadcrumb.exists()).to.be.true
  })

  it('responsive tasarım için breakpoint kontrolü yapılmalı', async () => {
    // Mobil görünüm
    await wrapper.setProps({ isMobile: true })
    expect(wrapper.find('.mobile-menu').exists()).to.be.true

    // Desktop görünüm
    await wrapper.setProps({ isMobile: false })
    expect(wrapper.find('.desktop-menu').exists()).to.be.true
  })
})