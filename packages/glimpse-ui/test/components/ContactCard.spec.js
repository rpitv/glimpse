/* eslint-disable jest-dom/prefer-enabled-disabled */
import { shallowMount, RouterLinkStub } from '@vue/test-utils'
import Vue from 'vue'
import Vuetify from 'vuetify'
import VueRouter from 'vue-router'
import VuetifyOptions from '../../vuetify.config'
import ContactCard from '~/components/ContactCard'

Vue.use(VueRouter)
Vue.use(Vuetify)
const vuetifyInstance = new Vuetify(VuetifyOptions)

describe('ContactCard', () => {
  let wrapper
  function mount (opts) {
    wrapper = shallowMount(ContactCard, {
      ...opts,
      vuetify: vuetifyInstance,
      router: new VueRouter(),
      stubs: {
        NuxtLink: RouterLinkStub
      } })
  }

  test('Initially renders', () => {
    mount()
    expect(wrapper.find('VStepper-stub').attributes().value).toEqual('1')
  })

  test('Next/back buttons change pages', async () => {
    mount()
    const backBtn = wrapper.find('VBtn-stub.back-btn')
    const nextBtn = wrapper.find('VBtn-stub.next-btn')
    nextBtn.vm.$emit('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.find('VStepper-stub').attributes().value).toEqual('2')
    backBtn.vm.$emit('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.find('VStepper-stub').attributes().value).toEqual('1')
  })

  test('Back button is disabled when on first page', async () => {
    mount()
    const backBtn = wrapper.find('VBtn-stub.back-btn')
    const nextBtn = wrapper.find('VBtn-stub.next-btn')
    expect(backBtn.element).toHaveAttribute('disabled')
    nextBtn.vm.$emit('click')
    await wrapper.vm.$nextTick()
    expect(backBtn.element).not.toHaveAttribute('disabled')
  })

  test('Next button is called \'Submit\' when on last page', async () => {
    mount()
    const nextBtn = wrapper.find('VBtn-stub.next-btn')
    const pageCount = wrapper.findAll('VStepperStep-stub').length

    for (let i = 0; i < pageCount - 1; i++) {
      expect(nextBtn.text()).toEqual('Next')
      nextBtn.vm.$emit('click')
      await wrapper.vm.$nextTick()
    }

    expect(nextBtn.text()).toEqual('Submit')
  })
  // TODO spy for outgoing network request
})
