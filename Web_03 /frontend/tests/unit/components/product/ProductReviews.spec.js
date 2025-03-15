import { expect } from 'chai'
import { mount } from '@vue/test-utils'
import ProductReviews from '@/components/product/ProductReviews.vue'
import { createStore } from 'vuex'

describe('ProductReviews.vue', () => {
  let wrapper
  let store

  const mockReviews = [
    {
      id: 1,
      user: 'Test Kullanıcı',
      rating: 5,
      comment: 'Harika bir ürün!',
      date: '2024-01-15',
      helpful: 10,
      images: ['/images/review1.jpg']
    },
    {
      id: 2,
      user: 'Başka Kullanıcı',
      rating: 3,
      comment: 'Fiyatına göre iyi.',
      date: '2024-01-14'
    }
  ]

  beforeEach(() => {
    store = createStore({
      modules: {
        reviews: {
          namespaced: true,
          actions: {
            addReview: jest.fn(),
            updateReview: jest.fn(),
            deleteReview: jest.fn(),
            markHelpful: jest.fn()
          }
        }
      }
    })

    wrapper = mount(ProductReviews, {
      props: {
        productId: 1,
        reviews: mockReviews,
        averageRating: 4,
        totalReviews: 2
      },
      global: {
        plugins: [store]
      }
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('yorumlar listesi görüntülenmeli', () => {
    const reviewItems = wrapper.findAll('.review-item')
    expect(reviewItems.length).to.equal(2)
  })

  it('ortalama puan görüntülenmeli', () => {
    const averageRating = wrapper.find('.average-rating')
    expect(averageRating.text()).to.include('4.0')
  })

  it('yeni yorum eklenebilmeli', async () => {
    const newReview = {
      rating: 4,
      comment: 'Test yorum',
      images: []
    }

    const ratingInput = wrapper.find('.rating-input')
    const commentInput = wrapper.find('.comment-input')
    const form = wrapper.find('form')

    await ratingInput.setValue(4)
    await commentInput.setValue('Test yorum')
    await form.trigger('submit.prevent')

    expect(store.dispatch).toHaveBeenCalledWith('reviews/addReview', {
      productId: 1,
      ...newReview
    })
  })

  it('yorum filtreleme çalışmalı', async () => {
    const filterSelect = wrapper.find('.review-filter')
    await filterSelect.setValue('highest')

    expect(wrapper.emitted()['update:reviews']).to.exist
  })

  it('sayfalama çalışmalı', async () => {
    const nextPageButton = wrapper.find('.pagination-next')
    await nextPageButton.trigger('click')

    expect(wrapper.emitted()['page-change']).to.exist
  })

  it('faydalı bulma özelliği çalışmalı', async () => {
    const helpfulButton = wrapper.find('.helpful-button')
    await helpfulButton.trigger('click')

    expect(store.dispatch).toHaveBeenCalledWith('reviews/markHelpful', {
      reviewId: 1,
      productId: 1
    })
  })

  it('yorum düzenleme yapılabilmeli', async () => {
    const editButton = wrapper.find('[data-test="edit-review"]')
    await editButton.trigger('click')

    const editForm = wrapper.find('.edit-form')
    const commentInput = editForm.find('.comment-input')
    await commentInput.setValue('Düzenlenmiş yorum')
    await editForm.trigger('submit.prevent')

    expect(store.dispatch).toHaveBeenCalledWith('reviews/updateReview', {
      reviewId: 1,
      productId: 1,
      comment: 'Düzenlenmiş yorum'
    })
  })

  it('yorum silinebilmeli', async () => {
    const deleteButton = wrapper.find('[data-test="delete-review"]')
    await deleteButton.trigger('click')

    expect(store.dispatch).toHaveBeenCalledWith('reviews/deleteReview', {
      reviewId: 1,
      productId: 1
    })
  })

  it('resim yüklenebilmeli', async () => {
    const file = new File([''], 'test.jpg', { type: 'image/jpeg' })
    const input = wrapper.find('input[type="file"]')
    
    Object.defineProperty(input.element, 'files', {
      value: [file]
    })
    await input.trigger('change')

    expect(wrapper.emitted()['image-upload']).to.exist
  })

  it('puan dağılımı görüntülenmeli', () => {
    const ratingDistribution = wrapper.find('.rating-distribution')
    expect(ratingDistribution.exists()).to.be.true
  })
}) 