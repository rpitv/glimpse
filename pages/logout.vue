<template>
  <VCard class="logging-out-card">
    <VCardTitle>
      Logging out...
    </VCardTitle>

    <VCardSubtitle>Please wait!</VCardSubtitle>
    <VCardText>
      <VProgressCircular indeterminate color="primary" />
    </VCardText>
  </VCard>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      title: 'Logout - RPI TV',
      description: 'Log out of the RPI TV website via RPI CAS.'
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
  },
  async mounted () {
    await axios.get('/api/auth/logout', { withCredentials: true })
    window.location.replace('https://cas-auth.rpi.edu/cas/logout?service=' + encodeURIComponent(process.env.BASE_URL))
  }
}
</script>

<style lang="scss" scoped>
  .logging-out-card {
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
