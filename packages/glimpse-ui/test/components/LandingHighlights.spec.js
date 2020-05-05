import { shallowMount, RouterLinkStub } from '@vue/test-utils'
import Vue from 'vue'
import Vuetify from 'vuetify'
import VueRouter from 'vue-router'
import VHover from 'vuetify/es5/components/VHover'
import VuetifyOptions from '../../vuetify.config'
import LandingHighlights from '~/components/LandingHighlights'

Vue.use(VueRouter)
Vue.use(Vuetify)
const vuetifyInstance = new Vuetify(VuetifyOptions)

describe('LandingHighlights', () => {
  let wrapper
  function mount (opts) {
    wrapper = shallowMount(LandingHighlights, {
      ...opts,
      vuetify: vuetifyInstance,
      router: new VueRouter(),
      stubs: {
        NuxtLink: RouterLinkStub,
        VHover
      }
    })

    wrapper.setData({
      productions: [
        {
          id: 1,
          description: 'Sample data',
          name: 'Production #1',
          thumbnail: {
            link: 'https://upload.wikimedia.org/wikipedia/en/9/95/Legendary_kiss_V%E2%80%93J_day_in_Times_Square_Alfred_Eisenstaedt.jpg',
            name: 'Image #1'
          },
          startTime: new Date('2018-07-14 15:32')
        },
        {
          id: 2,
          description: 'Sample data #2',
          name: 'Production #2',
          thumbnail: {
            link: 'https://upload.wikimedia.org/wikipedia/commons/7/76/Boris_Johnson_official_portrait_%28cropped%29.jpg',
            name: 'Image #2'
          },
          startTime: new Date('2019-02-03 03:15')
        },
        {
          id: 3,
          description: 'Sample data #3',
          name: 'Production #3',
          thumbnail: {
            link: 'https://upload.wikimedia.org/wikipedia/commons/4/43/Netflix_Germany_House_of_Cards_%2848605916667%29.jpg',
            name: 'Image #3'
          },
          startTime: new Date('2003-11-19 16:03')
        }
      ]
    })
  }

  test('Renders properly', async () => {
    mount()
    await wrapper.vm.$nextTick()
    expect(wrapper.element).toMatchSnapshot()
  })

  test('Contains three sheets', async () => {
    mount()
    await wrapper.vm.$nextTick()
    expect(wrapper.findAll('vsheet-stub').length).toEqual(3)
  })
})
