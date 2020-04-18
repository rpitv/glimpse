import { shallowMount, RouterLinkStub } from '@vue/test-utils'
import Vue from 'vue'
import Vuetify from 'vuetify'
import VueRouter from 'vue-router'
import VuetifyOptions from '../../vuetify.config'
import HeaderDropdown from '~/components/header/HeaderDropdown'

Vue.use(VueRouter)
Vue.use(Vuetify)
const vuetifyInstance = new Vuetify(VuetifyOptions)

describe('HeaderDropdown', () => {
  let wrapper
  let conditionalA
  let conditionalSubB
  let layoutDesc

  beforeEach(() => {
    conditionalA = jest.fn()
    conditionalSubB = jest.fn()
    layoutDesc = [
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
    ]
  })

  function mount (opts) {
    wrapper = shallowMount(HeaderDropdown, {
      ...opts,
      vuetify: vuetifyInstance,
      router: new VueRouter(),
      stubs: {
        NuxtLink: RouterLinkStub
      } })
  }

  test('Properly renders w/ depth 0', () => {
    mount({
      propsData: {
        items: layoutDesc,
        depth: 0,
        title: 'A Dropdown!'
      }
    })
    expect(wrapper.element).toMatchSnapshot()
    expect(conditionalA).toBeCalled()
    expect(wrapper.findAll('headerdropdown-stub').length).toEqual(1)
    expect(wrapper.findAll('vmenu-stub').length).toEqual(1)
    expect(wrapper.findAll('vlistgroup-stub').length).toEqual(0)
  })

  test('Properly renders w/ depth >= 1', () => {
    mount({
      propsData: {
        items: layoutDesc,
        depth: 1,
        title: 'A Dropdown!'
      }
    })
    expect(wrapper.element).toMatchSnapshot()
    expect(conditionalA).toBeCalled()
    expect(wrapper.findAll('headerdropdown-stub').length).toEqual(1)
    expect(wrapper.findAll('vmenu-stub').length).toEqual(0)
    expect(wrapper.findAll('vlistgroup-stub').length).toEqual(1)
  })

  test('Fills default value for empty items prop', () => {
    mount({
      propsData: {
        depth: 0,
        title: 'A Dropdown!'
      }
    })
  })
})
