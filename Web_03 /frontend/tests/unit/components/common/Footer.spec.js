import { expect } from 'chai'
import { mount } from '@vue/test-utils'
import Footer from '@/components/common/Footer.vue'
import { createRouter, createWebHistory } from 'vue-router'

describe('Footer.vue', () => {
  let router
  let wrapper

  beforeEach(() => {
    router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/about', name: 'About' },
        { path: '/contact', name: 'Contact' },
        { path: '/privacy', name: 'Privacy' }
      ]
    })

    wrapper = mount(Footer, {
      global: {
        plugins: [router],
        stubs: ['router-link']
      }
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('logo görüntülenmeli', () => {
    expect(wrapper.find('.footer-logo').exists()).to.be.true
  })

  it('sosyal medya linkleri görüntülenmeli', () => {
    const socialLinks = wrapper.findAll('.social-links a')
    expect(socialLinks.length).to.be.greaterThan(0)
  })

  it('iletişim bilgileri görüntülenmeli', () => {
    const contactInfo = wrapper.find('.contact-info')
    expect(contactInfo.exists()).to.be.true
    expect(contactInfo.text()).to.include('info@example.com')
  })

  it('hızlı linkler görüntülenmeli', () => {
    const quickLinks = wrapper.findAll('.quick-links a')
    expect(quickLinks.length).to.be.greaterThan(0)
  })

  it('newsletter formu görüntülenmeli', () => {
    const newsletterForm = wrapper.find('form.newsletter-form')
    expect(newsletterForm.exists()).to.be.true
  })

  it('newsletter aboneliği yapılabilmeli', async () => {
    const emailInput = wrapper.find('input[type="email"]')
    const form = wrapper.find('form.newsletter-form')

    await emailInput.setValue('test@example.com')
    await form.trigger('submit.prevent')

    expect(wrapper.emitted()['newsletter-subscribe']).to.exist
    expect(wrapper.emitted()['newsletter-subscribe'][0]).to.deep.equal(['test@example.com'])
  })

  it('telif hakkı metni görüntülenmeli', () => {
    const copyright = wrapper.find('.copyright')
    expect(copyright.exists()).to.be.true
    expect(copyright.text()).to.include(new Date().getFullYear().toString())
  })

  it('mobil görünümde menü açılabilmeli', async () => {
    const mobileMenuButton = wrapper.find('[data-test="mobile-footer-menu"]')
    const menuContent = wrapper.find('.footer-links')

    expect(menuContent.classes()).not.to.include('show')
    
    await mobileMenuButton.trigger('click')
    expect(menuContent.classes()).to.include('show')
  })

  it('dil seçimi yapılabilmeli', async () => {
    const languageSelector = wrapper.find('select.language-selector')
    await languageSelector.trigger('change')

    expect(wrapper.emitted()['update-language']).to.exist
  })
}) 