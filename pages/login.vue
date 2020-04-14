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
  async mounted () {
    try {
      await axios.post('/api/login', {
        ticket: this.$route.query.ticket
      }, { withCredentials: true })

      await this.$router.push('/')
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
