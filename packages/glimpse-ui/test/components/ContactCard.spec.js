/* eslint-disable jest-dom/prefer-enabled-disabled */
import { mount, RouterLinkStub } from '@vue/test-utils'
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
  function mountFn (opts) {
    wrapper = mount(ContactCard, {
      ...opts,
      vuetify: vuetifyInstance,
      router: new VueRouter(),
      stubs: {
        NuxtLink: RouterLinkStub
      } })
  }

  test('Initially renders', async () => {
    mountFn()
    const vStepper = wrapper.find('.v-stepper')
    expect(vStepper).not.toBeNull()
    const vStepperContent = vStepper.findAll('.v-stepper__items .v-stepper__content')
    expect(vStepperContent).not.toBeNull()
    expect(vStepperContent.length).toEqual(3)
    await wrapper.vm.$nextTick()
    expect(vStepperContent.at(0).element).toBeVisible()
    expect(vStepperContent.at(1).element).not.toBeVisible()
    expect(vStepperContent.at(2).element).not.toBeVisible()
  })

  test('Next/back buttons change pages', async () => {
    mountFn()
    await wrapper.vm.$nextTick()
    const backBtn = wrapper.find('.v-btn.back-btn')
    const nextBtn = wrapper.find('.v-btn.next-btn')
    const vStepperContent = wrapper.findAll('.v-stepper .v-stepper__items .v-stepper__content')
    nextBtn.vm.$emit('click')
    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 1000)) // Wait for animation
    expect(vStepperContent.at(0).element).not.toBeVisible()
    expect(vStepperContent.at(1).element).toBeVisible()
    backBtn.vm.$emit('click')
    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 1000)) // Wait for animation
    expect(vStepperContent.at(0).element).toBeVisible()
    expect(vStepperContent.at(1).element).not.toBeVisible()
  })

  test('Back button is disabled when on first page', async () => {
    mountFn()
    const backBtn = wrapper.find('.v-btn.back-btn')
    const nextBtn = wrapper.find('.v-btn.next-btn')
    await wrapper.vm.$nextTick()
    expect(backBtn.element).toHaveAttribute('disabled')
    nextBtn.vm.$emit('click')
    await wrapper.vm.$nextTick()
    expect(backBtn.element).not.toHaveAttribute('disabled')
  })

  test('Fields are required to advance passed second step', async () => {
    mountFn()
    const nextBtn = wrapper.find('.v-btn.next-btn')
    const vStepperContent = wrapper.findAll('.v-stepper .v-stepper__items .v-stepper__content')
    nextBtn.vm.$emit('click')
    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 1000)) // Wait for animation
    expect(vStepperContent.at(1).element).toBeVisible()
    nextBtn.vm.$emit('click')
    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 1000)) // Wait for animation
    expect(vStepperContent.at(1).element).toBeVisible()
    expect(nextBtn.element).toBeDisabled()

    // Fill out form
    wrapper.find('.contact-sr-email input').element.value = 'joe@example.com'
    wrapper.find('.contact-sr-email input').trigger('input')
    wrapper.find('.contact-sr-name input').element.value = 'Joe Smith'
    wrapper.find('.contact-sr-name input').trigger('input')
    wrapper.find('.contact-sr-phone input').element.value = '5715556969'
    wrapper.find('.contact-sr-phone input').trigger('input')
    await wrapper.vm.$nextTick()
    nextBtn.vm.$emit('click')
    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 1000)) // Wait for animation
    expect(vStepperContent.at(2).element).toBeVisible()
  })

  test('Next button is called \'Submit\' when on last page', async () => {
    mountFn()
    const nextBtn = wrapper.find('.v-btn.next-btn')

    nextBtn.vm.$emit('click')
    await wrapper.vm.$nextTick()

    // Fill out form
    wrapper.find('.contact-sr-email input').element.value = 'joe@example.com'
    wrapper.find('.contact-sr-email input').trigger('input')
    wrapper.find('.contact-sr-name input').element.value = 'Joe Smith'
    wrapper.find('.contact-sr-name input').trigger('input')
    wrapper.find('.contact-sr-phone input').element.value = '5715556969'
    wrapper.find('.contact-sr-phone input').trigger('input')

    await wrapper.vm.$nextTick()
    nextBtn.vm.$emit('click')
    await wrapper.vm.$nextTick()

    expect(nextBtn.text()).toEqual('Submit')
  })
  // TODO spy for outgoing network request
})
