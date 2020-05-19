<template>
  <div class="container">
    <VRow>
      <VCol md="6" cols="12" class="left-col">
        <h1 class="error-title">
          An error occurred!
        </h1>
        <p class="subtitle-1">
          Something went wrong while trying to view that page...
        </p>
        <div>
          <p>Our team has been notified. In the mean time, could you provide some more information?</p>
          <VBtn @click="showFeedback()" color="primary">
            Submit Feedback
          </VBtn>
        </div>
        <div class="other-buttons">
          <p>Here's some other buttons which might be helpful...</p>
          <VBtn @click="reload()">
            Reload page
          </VBtn>
          <VBtn href="/">
            Go to home page
          </VBtn>
        </div>
      </VCol>
      <VCol mc="6" class="right-col">
        <img src="../assets/error-tv.png" alt="TV" class="error-tv">
      </VCol>
    </VRow>
  </div>
</template>

<script>
export default {
  layout: 'default',
  props: {
    error: {
      type: Object,
      default: () => {
        return {
          sentryEventId: undefined
        }
      }
    }
  },
  data () {
    return {
      title: 'Something went wrong!',
      description: 'RPI TV is a student-run broadcasting club committed to providing ' +
          'professional coverage of campus events and sports games.'
    }
  },
  methods: {
    reload () {
      window.location.reload()
    },
    showFeedback () {
      this.$sentry.showReportDialog({ eventId: this.error.sentryEventId })
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
  .left-col {
    margin-top: 100px
  }
  .error-tv {
    max-height: 65vh;
    margin-top: 50px;
  }
  .error-title {
    font-size: 60px
  }
  .other-buttons {
    margin-top: 15px
  }
</style>
