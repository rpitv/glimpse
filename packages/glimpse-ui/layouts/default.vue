<template>
  <VApp class="default-layout-app">
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
import TheHeader from '../components/TheHeader.vue'
import TheFooter from '../components/TheFooter.vue'

export default {
  components: {
    TheHeader,
    TheFooter
  }
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Ubuntu|Oswald&display=swap');

/* Margin to avoid overlap due to logo overhang */
.default-layout-nuxt-content {
  margin-top: 10px;
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

/* Fix word wrapping in cards - See vuetifyjs/vuetify/issues/9130 */
.v-card__text, .v-card__title {
  word-break: normal;
}
</style>
