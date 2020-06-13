<template>
  <VApp class="default-layout-app">
    <VSnackbar v-model="showFailedAuth" :timeout="5000" :bottom="true" color="error">
      Authentication failed! Try refreshing.
    </VSnackbar>
    <div class="default-layout-custom-bg" />
    <div>
      <TheHeader />
      <VContent>
        <VContainer fluid>
          <nuxt class="default-layout-nuxt-content" />
        </VContainer>
      </VContent>
      <TheFooter />
    </div>
  </VApp>
</template>

<script>
import TheHeader from '../components/header/TheHeader.vue'
import TheFooter from '../components/TheFooter.vue'

export default {
  components: {
    TheHeader,
    TheFooter
  },
  computed: {
    showFailedAuth () {
      return this.$store.state.showFailedAuth
    }
  },
  mounted () {
    this.$sentry.configureScope((scope) => {
      if (!this.$store.getters.isAuthenticated) {
        return
      }

      scope.setUser({
        email: this.$store.state.rcs_id + '@rpi.edu'
      })
      scope.setTag('admin', this.$store.state.admin)
    })
  }
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Ubuntu|Oswald:wght@200;300;400&display=swap');

/* Margin to avoid overlap due to logo overhang */
.default-layout-nuxt-content {
  margin-top: 10px;
}

.default-layout-custom-bg {
  width: 100vw;
  height: 100vh;
  position: fixed;
  z-index: 0;
  background: linear-gradient(#1E2225, #111315) !important;
}

h1,h2,h3,h4,h5,h6 {
  font-family: 'Oswald Light', sans-serif;
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

/* Fix word wrapping in cards - See vuetifyjs/vuetify/issues/9130 */
.v-card__text, .v-card__title {
  word-break: normal;
}
</style>
