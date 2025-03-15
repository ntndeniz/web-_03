import { expect } from 'chai'
import { mount } from '@vue/test-utils'
import Pagination from '@/components/common/Pagination.vue'

describe('Pagination.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(Pagination, {
      props: {
        currentPage: 1,
        totalPages: 10,
        perPage: 10,
        totalItems: 100
      }
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('sayfa numaraları görüntülenmeli', () => {
    const pageNumbers = wrapper.findAll('.page-number')
    expect(pageNumbers.length).to.be.greaterThan(0)
  })

  it('aktif sayfa vurgulanmalı', () => {
    const activePage = wrapper.find('.page-number.active')
    expect(activePage.text()).to.equal('1')
  })

  it('sayfa değiştirilebilmeli', async () => {
    const pageNumber = wrapper.find('.page-number:nth-child(2)')
    await pageNumber.trigger('click')

    expect(wrapper.emitted()['page-change']).to.exist
    expect(wrapper.emitted()['page-change'][0]).to.deep.equal([2])
  })

  it('önceki/sonraki butonları çalışmalı', async () => {
    const nextButton = wrapper.find('.pagination-next')
    await nextButton.trigger('click')
    expect(wrapper.emitted()['page-change'][0]).to.deep.equal([2])

    await wrapper.setProps({ currentPage: 2 })
    const prevButton = wrapper.find('.pagination-prev')
    await prevButton.trigger('click')
    expect(wrapper.emitted()['page-change'][1]).to.deep.equal([1])
  })

  it('ilk/son sayfa butonları çalışmalı', async () => {
    const lastButton = wrapper.find('.pagination-last')
    await lastButton.trigger('click')
    expect(wrapper.emitted()['page-change'][0]).to.deep.equal([10])

    await wrapper.setProps({ currentPage: 10 })
    const firstButton = wrapper.find('.pagination-first')
    await firstButton.trigger('click')
    expect(wrapper.emitted()['page-change'][1]).to.deep.equal([1])
  })

  it('sayfa boyutu değiştirilebilmeli', async () => {
    const pageSizeSelect = wrapper.find('.page-size-select')
    await pageSizeSelect.setValue(20)

    expect(wrapper.emitted()['per-page-change']).to.exist
    expect(wrapper.emitted()['per-page-change'][0]).to.deep.equal([20])
  })

  it('sayfa bilgisi görüntülenmeli', () => {
    const pageInfo = wrapper.find('.page-info')
    expect(pageInfo.text()).to.include('1-10')
    expect(pageInfo.text()).to.include('100')
  })

  it('sınır durumları kontrol edilmeli', async () => {
    // İlk sayfa
    await wrapper.setProps({ currentPage: 1 })
    expect(wrapper.find('.pagination-prev').attributes('disabled')).to.exist
    expect(wrapper.find('.pagination-first').attributes('disabled')).to.exist

    // Son sayfa
    await wrapper.setProps({ currentPage: 10 })
    expect(wrapper.find('.pagination-next').attributes('disabled')).to.exist
    expect(wrapper.find('.pagination-last').attributes('disabled')).to.exist
  })

  it('özel sayfa aralığı görüntülenebilmeli', async () => {
    await wrapper.setProps({ 
      currentPage: 5,
      pageRange: 2
    })

    const pageNumbers = wrapper.findAll('.page-number')
    expect(pageNumbers.length).to.equal(5) // 3,4,5,6,7
  })

  it('responsive tasarım için sayfa numaraları gizlenebilmeli', async () => {
    await wrapper.setProps({ responsive: true, isMobile: true })
    const pageNumbers = wrapper.findAll('.page-number')
    expect(pageNumbers.length).to.be.lessThan(10)
  })
}) 