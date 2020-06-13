import { shallowMount, RouterLinkStub } from '@vue/test-utils'
import Vue from 'vue'
import Vuex from 'vuex'
import Vuetify from 'vuetify'
import VueRouter from 'vue-router'
import Sinon from 'sinon'
import VuetifyOptions from '../../vuetify.config'
import TheHeader from '~/components/header/TheHeader.vue'

Vue.use(VueRouter)
Vue.use(Vuex)
Vue.use(Vuetify)
const vuetifyInstance = new Vuetify(VuetifyOptions)

describe('TheHeader (Custom)', () => {
  let wrapper
  const data = {
    menuItems: {
      'LEFT': [
        {
          'title': 'Sample Left #1',
          'path': '/samplel1',
          'icon': ['fal', 'sample-l1'],
          'sublist': [],
          'customClass': 'sample-class-left1',
          'conditional': () => true
        },
        {
          'title': 'Sample Left #2',
          'path': '/samplel2',
          'icon': ['fal', 'sample-l2'],
          'sublist': [],
          'customClass': 'sample-class-left2',
          'conditional': null
        }
      ],
      'RIGHT': [
        {
          'title': 'SampleRight #1',
          'path': '/sampler1',
          'icon': ['fal', 'sample-r1'],
          'sublist': [],
          'customClass': 'sample-r1',
          'conditional': () => true
        },
        {
          'title': 'SampleRight #2',
          'path': '/sampler2',
          'icon': ['fal', 'sample-r2'],
          'sublist': [],
          'customClass': 'sample-r2',
          'conditional': () => true
        },
        {
          'title': 'SampleRight #3',
          'path': '/sampler3',
          'icon': ['fal', 'sample-r3'],
          'sublist': [],
          'customClass': 'sample-r3',
          'conditional': () => false
        }
      ]
    }
  }

  function mount (opts) {
    wrapper = shallowMount(TheHeader, {
      ...opts,
      vuetify: vuetifyInstance,
      router: new VueRouter(),
      stubs: {
        NuxtLink: RouterLinkStub
      }
    })
    wrapper.setData(data)
  }
  let store
  beforeEach(() => {
    store = new Vuex.Store({
      getters: {
        isAuthenticated: () => false
      }
    })
  })

  test('Properly renders', async () => {
    mount({ store })
    await wrapper.vm.$nextTick()
    expect(wrapper.element).toMatchSnapshot()
    expect(wrapper.findAll('headerbutton-stub').length).toEqual(4)
  })

  test('Items contain correct attributes', async (done) => {
    mount({ store })
    await wrapper.vm.$nextTick()
    const leftButtons = wrapper.findAll('vappbar-stub > vtoolbaritems-stub .item-wrapper')
    const rightButtons = wrapper.findAll('.app-nav-right-items .item-wrapper')
    for (let i = 0; i < leftButtons.length; i++) {
      const buttonWrapper = leftButtons.at(i)
      const button = buttonWrapper.find('headerbutton-stub')
      let found = false

      if (!button.exists()) {
        continue
      }

      for (let j = 0; j < data.menuItems.LEFT.length; j++) {
        if (data.menuItems.LEFT[j].customClass &&
          buttonWrapper.classes().includes(data.menuItems.LEFT[j].customClass) &&
          button.attributes('path') === data.menuItems.LEFT[j].path &&
          button.attributes('title') === data.menuItems.LEFT[j].title &&
          (!data.menuItems.LEFT[j].conditional || data.menuItems.LEFT[j].conditional())
        ) {
          found = true
          break
        }
      }

      if (!found) {
        done.fail('Left button exists even though no valid match was found in the menuItems. Button: ' +
          buttonWrapper.element.outerHTML)
      }
    }

    for (let i = 0; i < rightButtons.length; i++) {
      const buttonWrapper = rightButtons.at(i)
      const button = buttonWrapper.find('headerbutton-stub')
      let found = false

      if (!button.exists()) {
        continue
      }

      for (let j = 0; j < data.menuItems.RIGHT.length; j++) {
        if (data.menuItems.RIGHT[j].customClass &&
            buttonWrapper.classes().includes(data.menuItems.RIGHT[j].customClass) &&
            button.attributes('path') === data.menuItems.RIGHT[j].path &&
            button.attributes('title') === data.menuItems.RIGHT[j].title &&
            (!data.menuItems.RIGHT[j].conditional || data.menuItems.RIGHT[j].conditional())
        ) {
          found = true
          break
        }
      }

      if (!found) {
        done.fail('Right button exists even though no valid match was found in the menuItems. Button: ' +
          buttonWrapper.element.outerHTML)
      }
    }

    done()
  })
})

describe('TheHeader (Unauthenticated)', () => {
  let wrapper

  function mount (opts) {
    wrapper = shallowMount(TheHeader, {
      ...opts,
      vuetify: vuetifyInstance,
      router: new VueRouter(),
      stubs: {
        NuxtLink: RouterLinkStub
      } })
  }

  let store
  beforeEach(() => {
    store = new Vuex.Store({
      getters: {
        isAuthenticated: () => false
      }
    })
  })

  test('Properly renders', () => {
    mount({ store })
    expect(wrapper.element).toMatchSnapshot()
    expect(wrapper.find('headerbutton-stub[path=\'/login\']').attributes().title).toBe('Login')
  })

  test('Handles opaque top correctly', () => {
    mount({ store })
    expect(wrapper.find('vappbar-stub').element).toHaveAttribute('color', '#b05454')
  })

  test('Handles transparent top correctly', () => {
    mount({
      store,
      propsData: {
        transparentAtTop: true,
        attachToDocument: true
      }
    })
    expect(wrapper.find('vappbar-stub').element).toHaveAttribute('color', '#00000000')
  })

  test('Destroy unregisters event listener', () => {
    const spy = Sinon.stub()
    mount({
      store,
      attachToDocument: true,
      destroyed () {
        spy()
      }
    })
    wrapper.destroy()

    expect(spy.calledOnce).toBe(true)
  })
})

describe('TheHeader (Authenticated User)', () => {
  let wrapper

  function mount (opts) {
    wrapper = shallowMount(TheHeader, {
      ...opts,
      vuetify: vuetifyInstance,
      router: new VueRouter(),
      stubs: {
        NuxtLink: RouterLinkStub
      } })
  }

  let store
  beforeEach(() => {
    store = new Vuex.Store({
      getters: {
        isAuthenticated: () => true
      }
    })
  })

  test('Properly renders', () => {
    mount({ store })
    expect(wrapper.element).toMatchSnapshot()
    expect(wrapper.find('headerbutton-stub[path=\'/logout\']').attributes().title).toBe('Logout')
  })
})

describe('TheHeader (Authenticated Admin)', () => {
  let wrapper

  function mount (opts) {
    wrapper = shallowMount(TheHeader, {
      ...opts,
      vuetify: vuetifyInstance,
      router: new VueRouter(),
      stubs: {
        NuxtLink: RouterLinkStub
      } })
  }

  let store
  beforeEach(() => {
    store = new Vuex.Store({
      getters: {
        isAuthenticated: () => true
      },
      state: {
        admin: true
      }
    })
  })

  test('Properly renders', () => {
    mount({ store })
    expect(wrapper.element).toMatchSnapshot()
  })
})
