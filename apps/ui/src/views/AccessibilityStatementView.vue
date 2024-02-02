<script setup lang="ts">

</script>

<template>
  <div class="container">
    <v-card class="card">
      <h1 class="title">Accessibility Statement</h1>
      <v-card-text>
        <p>
          RPI TV strives to abide by the Rensselaer Polytechnic Institute Web Accessibility Standards and
          WCAG 2.2 AA requirements. Please reach out to us via our <RouterLink to="contact">contact form</RouterLink> if
          you run into any accessibility issues while navigating our website.
        </p>
        <p class="link"><a href="https://policy.rpi.edu/policy/web-accessibility-standards">RPI Web Accessibility Standards</a></p>
      </v-card-text>
    </v-card>
  </div>
</template>

<style scoped lang="scss">
  .container {
    margin-top: 20px;
  }
  .card {
    max-width: 500px;
    margin-left: auto;
    margin-right: auto;
  }
  .title {
    text-align: center;
  }
  .link {
    margin-top: 20px;
  }
</style>
