<template>
  <VCard class="contact-card">
    <VCardTitle class="title">
      Contact Us
    </VCardTitle>
    <VCardText>
      <VForm>
        <VStepper v-model="step">
          <VStepperHeader>
            <VStepperStep :complete="step > 1" step="1">
              Step 1
            </VStepperStep>
            <VStepperStep :complete="step > 2" step="2">
              Step 2
            </VStepperStep>
            <VStepperStep :complete="step > 3" step="3">
              Step 3
            </VStepperStep>
          </VStepperHeader>
          <VStepperItems>
            <VStepperContent step="1">
              <VSelect
                :items="contactTypes"
                v-model="selectedContactType"
                menu-props="auto"
                label="What are you contacting us about?"
                aria-required="true"
              />
            </VStepperContent>
            <VStepperContent step="2">
              <VSubheader>What are you contacting us about?</VSubheader>
              <VSelect :items="contactTypes" v-model="selectedContactType" menu-props="auto" />
            </VStepperContent>
            <VStepperContent step="3">
              <VSubheader>What are you contacting us about?</VSubheader>
              <VSelect :items="contactTypes" v-model="selectedContactType" menu-props="auto" />
            </VStepperContent>
          </VStepperItems>
        </VStepper>
        <div class="separator" />
        <VBtn @click="step--">
          Back
        </VBtn>
        <VBtn @click="step++" color="primary" class="next-btn">
          Next
        </VBtn>
      </VForm>
    </VCardText>
  </VCard>
</template>

<script>
export default {
  name: 'ContactCard',
  data () {
    return {
      step: 1,
      selectedContactType: 'Service Request',
      contactTypes: ['Service Request', 'Question', 'Feedback']
    }
  },
  methods: {
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
</style>
