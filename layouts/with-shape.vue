<template>
  <VApp class="default-layout-app">
    <VSnackbar v-model="errorMessage" :timeout="5000" :bottom="true" color="error">
      {{ errorMessage }}
    </VSnackbar>
    <div class="default-layout-custom-bg" />
    <div>
      <TheHeader transparent-at-top />
      <div class="bg-shape-wrapper">
        <BackgroundShape class="bg-shape" />
      </div>
      <VMain>
        <VContainer fluid>
          <nuxt class="default-layout-nuxt-content" />
        </VContainer>
      </VMain>
      <TheFooter />
    </div>
  </VApp>
</template>

<script>
import TheHeader from '../components/header/TheHeader.vue'
import TheFooter from '../components/TheFooter.vue'
import BackgroundShape from '~/components/BackgroundShape.vue'

export default {
  components: {
    BackgroundShape,
    TheHeader,
    TheFooter
  },
  computed: {
    errorMessage: {
      get () {
        return this.$store.state.popups.errorMessage
      },
      set (v) {
        // Once the error message is done displaying, clear it from the store
        if (!v) {
          this.$store.commit('popups/SHOW_ERROR_MESSAGE', '')
        }
      }
    }
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
</style>
