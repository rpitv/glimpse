import { mount, RouterLinkStub } from '@vue/test-utils'
import Vue from 'vue'
import Vuetify from 'vuetify'
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
        name: 'Production #0',
        thumbnail: {
          link: 'https://pbs.twimg.com/media/EMnvt2bXUAAYQSL.jpg'
        }
      },
      {
        id: 23,
        name: 'Production #23',
        thumbnail: {
          link: 'https://media.gettyimages.com/photos/man-impersonating-a-crossdressing-adolf-hitler-peeling-potoatoes-picture-id527186738'
        }
      },
      {
        id: 10,
        name: 'Production #10',
        thumbnail: {
          link: 'https://media.gettyimages.com/photos/cracked-up-picture-id499219315?s=2048x2048'
        }
      },
      {
        id: 189,
        name: 'Production #189',
        thumbnail: {
          link: 'https://i.redd.it/r00aurp9sz251.jpg'
        }
      },
      {
        id: 76,
        name: 'Production #76',
        thumbnail: {
          link: 'https://i.redd.it/vmza0xc2fn631.jpg'
        }
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
})
