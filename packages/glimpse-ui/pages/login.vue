<template>
  <div class="container">
    <VCard class="logging-in-card">
      <span v-if="error === ''">
        <VCardTitle>
          Logging you in...
        </VCardTitle>

        <VCardSubtitle>Please wait!</VCardSubtitle>
        <VCardText>
          <VProgressCircular indeterminate color="primary" />
        </VCardText>
      </span>
      <span v-else>
        <VCardTitle>
          Womp womp!
        </VCardTitle>

        <VCardSubtitle>Something went wrong! Here's an error code: {{ error }}</VCardSubtitle>
        <VCardSubtitle>Try again, perhaps.</VCardSubtitle>
      </span>
    </VCard>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  middleware: 'login',
  data () {
    return {
      title: 'Login - RPI TV',
      description: 'Log into the RPI TV website via RPI CAS.',
      error: ''
    }
  },
  computed: {
    isAuthenticated () {
      return this.$store.getters.isAuthenticated
    }
  },
  watch: {
    // Watch for changes in the isAuthenticated state in the store: redirect once its true.
    isAuthenticated (newVal) {
      if (newVal) {
        this.$router.push('/')
      }
    }
  },
  async mounted () {
    try {
      const response = await axios.post('/api/auth/login', {
        ticket: this.$route.query.ticket
      }, { withCredentials: true })
      // No error so commit new admin & rcs id to store
      this.$store.commit('SET_AUTH', { rcs_id: response.data.rcs_id, admin: !!response.data.admin })
    } catch (e) {
      if (e.response && e.response.data && e.response.data.error) {
        this.error = e.response.data.error
      } else {
        this.error = e.response.statusText.toUpperCase()
      }
    }
  },
  head () {
    return {
      title: this.title,
      meta: [
        { hid: 'og:title', name: 'og:title', content: this.title },
        { hid: 'og:description', name: 'og:description', content: this.description },
        { hid: 'description', name: 'description', content: this.description },
        { hid: 'twitter:description', name: 'twitter:description', content: this.description }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
  .logging-in-card {
    max-width: 300px;
    position: relative;
    text-align: center;
    left: 50%;
    margin-top: 50px;
    transform: translateX(-50%);

    .v-card__title {
      display: block;
    }
  }
</style>
