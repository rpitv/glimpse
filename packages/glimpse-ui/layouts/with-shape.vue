<template>
  <VApp class="default-layout-app">
    <VSnackbar v-model="showFailedAuth" :timeout="5000" :bottom="true" color="error">
      Authentication failed! Try refreshing.
    </VSnackbar>
    <div class="default-layout-custom-bg" />
    <div>
      <Header transparent-at-top />
      <BackgroundShape class="bg-shape" />
      <VContent>
        <VContainer fluid>
          <nuxt class="default-layout-nuxt-content" />
        </VContainer>
      </VContent>
      <Footer />
    </div>
  </VApp>
</template>

<script>
import Header from '../components/header/TheHeader.vue'
import Footer from '../components/TheFooter.vue'
import BackgroundShape from '~/components/BackgroundShape.vue'

export default {
  components: {
    BackgroundShape,
    Header,
    Footer
  },
  computed: {
    showFailedAuth () {
      return this.$store.state.auth.showFailedAuth
    }
  }
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Ubuntu|Oswald&display=swap');

/* Margin to avoid overlap due to logo overhang */
.default-layout-nuxt-content {
  margin-top: 10px;
}

.default-layout-custom-bg {
  width: 100vw;
  height: 100vh;
  position: fixed;
  z-index: 0;
  background: linear-gradient(#383838, #282828) !important;
}

h1,h2,h3,h4,h5,h6 {
  font-family: 'Oswald', sans-serif;
}
html {
  font-family: 'Ubuntu', sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}
*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}

.bg-shape {
  position: absolute;
  top: 0;
  left: 0;
}
</style>
