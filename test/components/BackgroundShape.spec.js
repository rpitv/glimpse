import { shallowMount, RouterLinkStub } from '@vue/test-utils'
import Vue from 'vue'
import Vuetify from 'vuetify'
import VueRouter from 'vue-router'
import VuetifyOptions from '../../vuetify.config'
import BackgroundShape from '~/components/BackgroundShape'

Vue.use(VueRouter)
Vue.use(Vuetify)
const vuetifyInstance = new Vuetify(VuetifyOptions)

describe('TheFooter', () => {
  let wrapper
  function mount (opts) {
    wrapper = shallowMount(BackgroundShape, {
      ...opts,
      vuetify: vuetifyInstance,
      router: new VueRouter(),
      stubs: {
        NuxtLink: RouterLinkStub
      } })
  }

  test('Mounts without error', () => {
    mount()
    expect(wrapper).not.toBeNull()
  })
})
