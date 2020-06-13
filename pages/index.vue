<template>
  <div class="container">
    <div class="about-wrapper">
      <h1>We are RPI TV.</h1>
      <p>
        RPI TV is a student-run organization at Rensselaer Polytechnic Institute dedicated to providing
        the best television broadcasts of RPI events.
      </p>
    </div>

    <VRow>
      <VCol cols="12" sm="6">
        <h1 class="item-header">
          Catch our next livestream:
        </h1>
        <NextLivestream />
      </VCol>
      <VCol cols="12" sm="6">
        <h1 class="item-header">
          Our recent productions:
        </h1>
        <RecentProductionsList />
      </VCol>
    </VRow>
  </div>
</template>

<script>
import RecentProductionsList from '~/components/RecentProductionsList.vue'
import NextLivestream from '~/components/NextLivestream.vue'
export default {
  layout: 'with-shape',
  components: {
    NextLivestream,
    RecentProductionsList
  },
  data () {
    return {
      title: 'RPI TV Official Site - Your exclusive home for RPI Hockey and campus broadcasting.',
      description: 'RPI TV is a student-run broadcasting club committed to providing ' +
        'professional coverage of campus events and sports games.'
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
  .item-header {
    text-align: center;
  }
  .about-wrapper {
    margin-top: 8vw;
    width: 100%;
    text-align: center;
    padding: 15px;
    h1 {
      font-size: 40px;
      margin-bottom: 20px;
    }
    p {
      font-size: 20px;
      font-family: 'Roboto', sans-serif;
      font-weight: 200;
      display: inline-block;
      max-width: 600px;
    }
  }
</style>
