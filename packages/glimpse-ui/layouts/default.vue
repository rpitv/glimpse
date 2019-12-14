<template>
  <VApp>
    <div>
      <Header />
      <nuxt />
    </div>
  </VApp>
</template>

<script lang="ts">
import Header from '../components/Header.vue'

export default {
  components: {
    Header
  }
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Ubuntu|Oswald&display=swap');

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
</style>
