<template>
  <div class="container">
    <VCard class="logging-in-card">
      <VCardTitle v-if="!this.$route.query.ticket" class="title">
        Redirecting...
      </VCardTitle>
      <VCardTitle v-else>
        Logging you in...
      </VCardTitle>

      <VCardSubtitle>Please wait!</VCardSubtitle>
      <VCardText>
        <VProgressCircular indeterminate color="primary" />
      </VCardText>
    </VCard>
  </div>
</template>

<script>

export default {
  middleware: 'login',
  data () {
    return {
      title: 'Login - RPI TV',
      description: 'Log into the RPI TV website via RPI CAS.'
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
