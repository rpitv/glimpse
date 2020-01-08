<template>
  <VCard class="contact-card">
    <VCardTitle class="title">
      Contact Us
    </VCardTitle>
    <VCardText>
      <VForm ref="form" v-model="formValid">
        <VStepper v-model="step">
          <VStepperHeader>
            <VStepperStep :complete="step > 1" step="1">
              Step 1
            </VStepperStep>
            <VStepperStep :complete="step > 2" step="2">
              {{ stepTwoName }}
            </VStepperStep>
            <VStepperStep :complete="step > 3" step="3">
              {{ stepThreeName }}
            </VStepperStep>
          </VStepperHeader>
          <VSubheader>* = required</VSubheader>
          <VStepperItems>
            <!-- Step one -->
            <VStepperContent step="1">
              <VSelect
                :items="contactTypes"
                v-model="input.selectedContactType"
                menu-props="auto"
                label="What are you contacting us about? *"
                aria-required="true"
                required
              />
            </VStepperContent>

            <!-- Step two -->
            <VStepperContent step="2">
              <!-- Service Request -->
              <div v-if="input.selectedContactType === 'Service Request'" class="sr-content">
                <h2 class="contact-form-section-header">
                  Contact Information
                </h2>
                <VTextField
                  :rules="rules.srContactEmail"
                  v-model="input.serviceRequest.contact.email"
                  class="contact-sr-email"
                  required
                  autocomplete="email"
                  aria-required="true"
                  label="Email *"
                  maxlength="320"
                  hint="We will contact this email to confirm whether we are available or not."
                />
                <VTextField
                  v-model="input.serviceRequest.contact.name"
                  :rules="rules.srContactName"
                  class="contact-sr-name"
                  required
                  label="Name *"
                  autocomplete="name"
                />
                <VRow>
                  <VCol cols="12" sm="4" md="3">
                    <VTextField
                      :rules="rules.srContactPhoneCC"
                      v-model="input.serviceRequest.contact.phoneCC"
                      v-mask="'+####'"
                      class="contact-sr-phone-cc"
                      autocomplete="tel-country-code"
                      required
                      aria-required="true"
                      label="Phone Country Code *"
                    />
                  </VCol>
                  <VCol cols="12" sm="8" md="9">
                    <VTextField
                      :rules="rules.srContactPhone"
                      v-model="input.serviceRequest.contact.phone"
                      v-mask="'###-###-####'"
                      class="contact-sr-phone"
                      autocomplete="tel"
                      required
                      aria-required="true"
                      label="Emergency Phone Number *"
                      hint="We will text or call this phone number in case of an emergency during the event."
                    />
                  </VCol>
                </VRow>
              </div>
              <!-- Feedback -->
              <div v-else>
                <h2 class="contact-form-section-header">
                  Contact Information
                </h2>
                <p>
                  You are not required to give us your contact information, however we will not be able to
                  get back to you if you do not enter an email. Please enter an email if you would like a response.
                </p>
                <VTextField
                  :rules="rules.feedbackContactEmail"
                  v-model="input.feedback.contact.email"
                  class="contact-feedback-email"
                  label="Email (optional)"
                  maxlength="320"
                  hint="We will respond to this email if we have one."
                />
                <VTextField v-model="input.feedback.contact.name" class="contact-feedback-name" label="Name (optional)" />
              </div>
            </VStepperContent>

            <VStepperContent step="3">
              <!-- Service Request -->
              <div v-if="input.selectedContactType === 'Service Request'">
                <h2 class="contact-form-section-header">
                  Event Details
                </h2>
                <p>
                  We recommend you contact us as soon as possible for the best chances that we will be able to cover
                  your event. We require that you contact us no later than the last week's Sunday before your event.
                </p>
                <VExpansionPanels>
                  <VExpansionPanel>
                    <VExpansionPanelHeader>Pricing</VExpansionPanelHeader>
                    <VExpansionPanelContent>
                      <p>
                        RPI TV services are free to all school affiliates. All events filmed by RPI TV will feature our
                        watermark and may be uploaded to our YouTube/website, unless otherwise specified. If you would like our
                        services, but do not want our watermark or do not want it to be uploaded, please specify so in the
                        "Other information" section and we may be able to give you a quote on how much your production would cost.
                      </p>
                      <p>
                        If you are not directly affiliated with Rensselaer Polytechnic Institute, please state so in
                        the "Other information" section and we will contact you to gather more information.
                      </p>
                    </VExpansionPanelContent>
                  </VExpansionPanel>
                </VExpansionPanels>
                <VRow>
                  <VCol cols="12" sm="6">
                    <VTextField
                      :rules="rules.organization"
                      v-model="input.serviceRequest.organization"
                      label="Club/Organization *"
                      hint="What club or organization is this request for?"
                      required
                      aria-required="true"
                    />
                  </VCol>
                  <VCol cols="12" sm="6">
                    <VTextField
                      :rules="rules.eventName"
                      v-model="input.serviceRequest.eventName"
                      label="Event Name *"
                      required
                      aria-required="true"
                    />
                  </VCol>
                </VRow>
                <VTextField
                  v-model="input.serviceRequest.location"
                  :rules="rules.eventLocation"
                  label="Location *"
                  required
                  aria-required="true"
                  hint="Please provide the full address if not located on campus."
                />
                <VRow>
                  <VCol cols="12" sm="6">
                    <VMenu
                      transition="scale-transition"
                      offset-y
                      min-width="290px"
                    >
                      <template v-slot:activator="{on}">
                        <VTextField
                          :value="formattedDate"
                          :rules="rules.eventDate"
                          v-on="on"
                          label="Date *"
                          required
                          aria-required="true"
                          readonly
                        />
                      </template>
                      <VDatePicker v-model="input.serviceRequest.date" :min="minimumServiceRequestDate()" />
                    </VMenu>
                  </VCol>
                  <VCol cols="12" sm="6">
                    <VRow>
                      <VCol>
                        <VMenu
                          :close-on-content-click="false"
                          transition="scale-transition"
                          offset-y
                          min-width="290px"
                        >
                          <template v-slot:activator="{on}">
                            <VTextField
                              :value="input.serviceRequest.startTime"
                              :rules="rules.eventStartTime"
                              v-on="on"
                              label="Start Time *"
                              required
                              aria-required="true"
                              readonly
                            />
                          </template>
                          <VTimePicker v-model="input.serviceRequest.startTime" />
                        </VMenu>
                      </VCol>
                      <VCol>
                        <VMenu
                          :close-on-content-click="false"
                          transition="scale-transition"
                          offset-y
                          min-width="290px"
                        >
                          <template v-slot:activator="{on}">
                            <VTextField
                              :value="input.serviceRequest.endTime"
                              :rules="rules.eventEndTime"
                              v-on="on"
                              label="End Time *"
                              required
                              aria-required="true"
                              readonly
                            />
                          </template>
                          <VTimePicker v-model="input.serviceRequest.endTime" />
                        </VMenu>
                      </VCol>
                    </VRow>
                  </VCol>
                </VRow>

                <VTextarea
                  v-model="input.serviceRequest.otherInfo"
                  label="Other information (optional)"
                  auto-grow
                  clearable
                  counter
                  maxlength="2000"
                  filled
                  hint="Anything else we should know?"
                />
              </div>
              <!-- Feedback -->
              <div v-else>
                <h2 class="contact-form-section-header">
                  Details
                </h2>
                <VTextarea
                  v-model="input.feedback.message"
                  label="Message *"
                  auto-grow
                  clearable
                  counter
                  maxlength="2000"
                  filled
                  hint="What would you like to tell us?"
                />
              </div>
            </VStepperContent>
          </VStepperItems>
        </VStepper>
        <div class="separator" />
        <VBtn @click="step--" :disabled="step <= 1" class="back-btn">
          Back
        </VBtn>
        <VBtn @click="goNext()" :disabled="!formValid" color="primary" class="next-btn">
          {{ step === 3 ? 'Submit' : 'Next' }}
        </VBtn>
      </VForm>
    </VCardText>
  </VCard>
</template>

<script>
import { mask } from 'vue-the-mask'
import moment from 'moment'
export default {
  name: 'ContactCard',
  directives: {
    mask
  },
  data () {
    return {
      step: 1,
      contactTypes: ['Service Request', 'Question/Feedback'],
      formValid: true,
      // Input data from the user
      input: {
        selectedContactType: 'Service Request',
        serviceRequest: { // Service request input data
          organization: '',
          eventName: '',
          location: '',
          contact: {
            name: '',
            email: '',
            phone: '',
            phoneCC: 1
          },
          date: this.minimumServiceRequestDate(),
          startTime: '18:00',
          endTime: '20:00',
          otherInfo: ''
        },
        feedback: { // Question/feedback form data
          contact: {
            name: '',
            email: ''
          },
          message: ''
        }
      },
      // Form validation rules
      rules: {
        srContactName: [ val => this.step !== 2 || (val || '').length > 0 || 'This field is required' ],
        srContactEmail: [
          val => this.step !== 2 || (val || '').length > 0 || 'This field is required',
          val => this.step !== 2 || (val || '').length < 320 || 'This cannot exceed 320 characters',
          val => this.step !== 2 || /^.{1,64}@.{1,256}\..{1,256}$/i.test(val || '') || 'This field must be a valid email'
        ],
        srContactPhone: [
          val => this.step !== 2 || (val || '').length > 0 || 'This field is required',
          val => this.step !== 2 || /^[0-9-]{12}$/.test(val || '') || 'This field must be a valid phone number'
        ],
        srContactPhoneCC: [
          val => this.step !== 2 || (val || '').length > 0 || 'This field is required',
          val => this.step !== 2 || /^\+[0-9]{1,4}$/.test(val || '') || 'This field must be a valid country code'
        ],
        organization: [ val => this.step !== 3 || (val || '').length > 0 || 'This field is required' ],
        eventName: [ val => this.step !== 3 || (val || '').length > 0 || 'This field is required' ],
        eventLocation: [ val => this.step !== 3 || (val || '').length > 0 || 'This field is required' ],
        eventDate: [ val => this.step !== 3 || (val || '').length > 0 || 'This field is required' ],
        eventStartTime: [ val => this.step !== 3 || (val || '').length > 0 || 'This field is required' ],
        eventEndTime: [ val => this.step !== 3 || (val || '').length > 0 || 'This field is required' ],
        feedbackContactEmail: [
          val => this.step !== 2 || (val || '').length < 320 || 'This cannot exceed 320 characters',
          val => this.step !== 2 || /^(?:.{1,64}@.{1,256}\..{1,256})?$/i.test(val || '') || 'This field must be a valid email'
        ],
        feedbackMessage: [ val => this.step !== 3 || (val || '').length > 0 || 'This field is required' ]
      }
    }
  },
  computed: {
    formattedDate () {
      return moment(this.input.serviceRequest.date).format('MMMM Do YYYY')
    },
    stepTwoName () {
      if (this.step === 1) {
        return 'Step 2'
      }
      return 'Contact Information'
    },
    stepThreeName () {
      if (this.step === 1) {
        return 'Step 3'
      }
      if (this.input.selectedContactType === 'Service Request') {
        return 'Event Details'
      }
      return 'Details'
    }
  },
  methods: {
    /**
     * Clients must submit their service request at least one sunday in advance, giving us a chance to meet
     * @returns {string} String date for Vuetify DatePicker
     */
    minimumServiceRequestDate () {
      return moment().day(7).format('YYYY-MM-DD')
    },
    /**
     * Go to the next page, or submit the form if we are on the last page.
     */
    goNext () {
      if (!this.$refs.form.validate()) { return }
      this.step++
    }
  }
}
</script>

<style lang="scss" scoped>
  .next-btn {
    float: right;
  }
  .separator {
    margin-bottom: 20px;
  }
  .contact-form-section-header {
    font-family: 'Roboto', sans-serif;
    color: white;
    margin-bottom: 15px;
  }
</style>
