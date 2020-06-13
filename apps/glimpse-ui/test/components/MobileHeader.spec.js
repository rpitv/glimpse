import { shallowMount, RouterLinkStub } from '@vue/test-utils'
import Vue from 'vue'
import Vuetify from 'vuetify'
import VueRouter from 'vue-router'
import VuetifyOptions from '../../vuetify.config'
import MobileHeader from '~/components/header/MobileHeader'

Vue.use(VueRouter)
Vue.use(Vuetify)
const vuetifyInstance = new Vuetify(VuetifyOptions)

describe('MobileHeader', () => {
  let wrapper
  let conditionalA
  let conditionalSubB
  let layoutDesc

  beforeEach(() => {
    conditionalA = jest.fn()
    conditionalSubB = jest.fn()
    layoutDesc = {
      LEFT: [
        {
          'title': 'ElemA',
          'path': '/a',
          'icon': ['fal', 'a'],
          'sublist': [],
          'customClass': 'a-class',
          'conditional': conditionalA
        },
        {
          'title': 'ElemB',
          'path': '/b',
          'icon': ['fal', 'b'],
          'sublist': [
            {
              'title': 'BSubElem',
              'path': '/b/sub',
              'icon': ['fal', 'b-sub'],
              'sublist': [],
              'customClass': '',
              'conditional': conditionalSubB
            }
          ],
          'customClass': 'b-class',
          'conditional': null
        }
      ],
      RIGHT: [
        {
          'title': 'ElemC',
          'path': '/c',
          'icon': ['fal', 'c-sub'],
          'sublist': [],
          'customClass': '',
          'conditional': null
        }
      ]
    }
  })

  function mount (opts) {
    wrapper = shallowMount(MobileHeader, {
      ...opts,
      vuetify: vuetifyInstance,
      router: new VueRouter(),
      stubs: {
        NuxtLink: RouterLinkStub
      } })
  }

  test('Properly renders', () => {
    mount({
      propsData: {
        items: layoutDesc,
        value: true
      }
    })
    expect(wrapper.element).toMatchSnapshot()
    expect(conditionalA).toBeCalled()
    expect(wrapper.findAll('headerdropdown-stub').length).toEqual(1)
  })
})
