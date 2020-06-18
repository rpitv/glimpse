<template>
  <VDialog v-model="visible" max-width="600px">
    <template v-slot:activator="{ on, attrs }">
      <slot :attrs="attrs" :on="on" name="activator" />
    </template>
    <VCard>
      <VCardTitle>
        <h2>Create Person</h2>
        <div v-if="submitting" class="loading-wrapper">
          <p>Submitting...</p>
          <VProgressLinear class="loading" indeterminate rounded />
        </div>
        <VAlert v-if="error" color="error">
          Something went wrong. Error: {{ error.message }}
        </VAlert>
      </VCardTitle>
      <VCardText>
        <VRow>
          <VCol cols="12" sm="4">
            <VTextField :disabled="submitting" v-model="formFirstName" label="First Name *" required />
          </VCol>
          <VCol cols="12" sm="4">
            <VTextField :disabled="submitting" v-model="formPreferredName" label="Preferred Name" />
          </VCol>
          <VCol cols="12" sm="4">
            <VTextField :disabled="submitting" v-model="formLastName" label="Last Name" />
          </VCol>
        </VRow>
        <VTextField v-model.number="formClassYear" :disabled="submitting" label="Class Year" type="number" />
        <small>*indicates required field</small>
      </VCardText>
      <VCardActions>
        <VSpacer />
        <VBtn @click="cancel" color="error" text>
          Cancel
        </VBtn>
        <VBtn @click="create" text>
          Create
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script>
import gql from 'graphql-tag'

export default {
  name: 'CreatePersonDialog',
  data () {
    return {
      visible: false,
      submitting: false,
      error: null,
      formFirstName: '',
      formPreferredName: '',
      formLastName: '',
      formClassYear: new Date().getFullYear() + 4
    }
  },
  methods: {
    cancel () {
      this.visible = false
      setTimeout(() => { // Wait for animation to complete
        this.formFirstName = this.formPreferredName = this.formLastName = ''
        this.formClassYear = new Date().getFullYear() + 4
      }, 100)
    },
    create () {
      this.submitting = true
      this.$apollo.mutate({
        mutation: gql`mutation($firstName: String, $preferredName: String, $lastName: String, $classYear: Int) {
            createPerson(firstName: $firstName, preferredName: $preferredName, lastName: $lastName, classYear: $classYear) {
                id
            }
        }`,
        variables: {
          firstName: this.formFirstName,
          preferredName: this.formPreferredName,
          lastName: this.formLastName,
          classYear: this.formClassYear
        }
      }).then(() => {
        this.$store.commit('admin/people/CLEAR_CACHED')
        this.$store.dispatch('admin/people/gotoPage', { page: this.$store.state.admin.people.currentPage })
        this.$store.dispatch('admin/people/getPeopleCount')
        this.submitting = false
        this.visible = false
      }).catch((err) => {
        this.$sentry.captureException(err)
        this.error = err
      })
    }
  }
}
</script>

<style scoped lang="scss">
  .loading-wrapper {
    width: 100%;
    margin-top: 20px;
    text-align: center;
  }
</style>
