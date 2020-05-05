import { mount, RouterLinkStub } from '@vue/test-utils'
import Vue from 'vue'
import Vuetify from 'vuetify'
import moment from 'moment'
import VueRouter from 'vue-router'
import VuetifyOptions from '../../vuetify.config'
import RecentProductionsList from '~/components/RecentProductionsList'

Vue.use(Vuetify)
const vuetifyInstance = new Vuetify(VuetifyOptions)

describe('RecentProductionsList', () => {
  let wrapper
  const data = {
    productions: [
      {
        id: 0,
        description: 'Sample Description #0',
        name: 'Production #0',
        thumbnail: {
          name: 'Image for Production #0',
          link: 'https://pbs.twimg.com/media/EMnvt2bXUAAYQSL.jpg'
        },
        startTime: new Date('2013-02-03 01:20')
      },
      {
        id: 23,
        description: 'Sample Description #23',
        name: 'Production #23',
        thumbnail: {
          name: 'Image for Production #23',
          link: 'https://media.gettyimages.com/photos/man-impersonating-a-crossdressing-adolf-hitler-peeling-potoatoes-picture-id527186738'
        },
        startTime: new Date('2015-02-03 01:20')
      },
      {
        id: 10,
        description: 'Sample Description #10',
        name: 'Production #10',
        thumbnail: {
          name: '',
          link: 'https://media.gettyimages.com/photos/cracked-up-picture-id499219315?s=2048x2048'
        },
        startTime: new Date('2014-02-03 01:20')
      }
    ]
  }

  function mountFn (opts) {
    wrapper = mount(RecentProductionsList, {
      ...opts,
      vuetify: vuetifyInstance,
      router: new VueRouter(),
      stubs: {
        NuxtLink: RouterLinkStub
      }
    })
    wrapper.setData(data)
  }

  test('Properly renders', async () => {
    mountFn()
    await wrapper.vm.$nextTick()
    expect(wrapper.element).toMatchSnapshot()
  })

  test('Contains correct data', async () => {
    mountFn()
    await wrapper.vm.$nextTick()
    const cards = wrapper.findAll('.past-prod-card')

    for (let i = 0; i < cards.length; i++) {
      const card = cards.at(i)
      expect(card.find('.past-prod-card').attributes('href'))
        .toEqual('/productions/' + data.productions[i].id)
      expect(card.find('.v-card__title').text()).toEqual(data.productions[i].name)
      expect(card.find('.v-card__subtitle').text()).toEqual(data.productions[i].description)
      expect(card.find('.v-card__text.v-card__subtitle').text())
        .toEqual(moment(data.productions[i].startTime).format('MMM Do YYYY'))
    }
  })

  test('Scroll hides move button', async () => {
    mountFn()
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.scroll-btn').exists()).toBe(true)
    wrapper.find('.simplebar-content-wrapper').element.scrollLeft = 100
    wrapper.find('.simplebar-content-wrapper').trigger('scroll')
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.scroll-btn').exists()).toBe(false)
  })

  // JSDOM doesn't like scrolling. This test doesn't appear to be working, should probably
  // be an end-to-end test.
  // test('Clicking scroll btn scrolls', async () => {
  //   mountFn()
  //   await wrapper.vm.$nextTick()
  //   expect(wrapper.find('.simplebar-content-wrapper').element.scrollLeft).toEqual(0)
  //   await wrapper.find('.scroll-btn').trigger('click')
  //   await new Promise((resolve) => {
  //     setTimeout(() => {
  //       resolve()
  //     }, 1000)
  //   })
  //   await wrapper.find('.simplebar-content-wrapper').trigger('scroll')
  //   expect(wrapper.find('.simplebar-content-wrapper').element.scrollLeft).toBeGreaterThan(0)
  // })
})
