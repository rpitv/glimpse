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
