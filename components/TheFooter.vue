<template>
  <div>
    <VFooter absolute app class="app-footer" color="#00000000">
      <div class="app-footer-content">
        <p>All content © 2003–{{ year }} RPI TV. | All Rights Reserved.</p>
        <p>
          <NuxtLink to="/privacy">
            Privacy Policy
          </NuxtLink>
        </p>
        <p>
          |
        </p>
        <p>
          <a href="https://info.rpi.edu/statement-of-accessibility">
            Accessibility Statement
          </a>
        </p>
      </div>
    </VFooter>
  </div>
</template>

<script>
export default {
  data () {
    return {
      year: new Date().getFullYear()
    }
  }
}
</script>

<style lang="scss" scoped>
  .app-footer-content {
    position: absolute;
    right: 5%;
    text-align: right;
  }
  p {
    display: inline-block;
    margin-right: 10px;
  }
</style>
