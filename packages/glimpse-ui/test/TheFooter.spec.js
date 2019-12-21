import { shallowMount, RouterLinkStub } from '@vue/test-utils'
import Vue from 'vue'
import Vuetify from 'vuetify'
import VueRouter from 'vue-router'
import VuetifyOptions from '../vuetify.config'
import TheFooter from '~/components/TheFooter'

Vue.use(VueRouter)
Vue.use(Vuetify)
const vuetifyInstance = new Vuetify(VuetifyOptions)

describe('TheFooter', () => {
  let wrapper
  function mount (opts) {
    wrapper = shallowMount(TheFooter, {
      ...opts,
      vuetify: vuetifyInstance,
      router: new VueRouter(),
      stubs: {
        NuxtLink: RouterLinkStub
      } })
  }

  test('Contains the proper year', () => {
    mount()
    const thisYear = new Date().getFullYear()
    expect(wrapper.text()).toContain('2003–' + thisYear)
  })
})
