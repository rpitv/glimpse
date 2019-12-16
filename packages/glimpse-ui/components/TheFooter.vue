<template>
  <div>
    <VFooter absolute app class="app-footer" color="#00000000">
      <p>All content © 2003–{{ year }} RPI TV. | All Rights Reserved.</p>
      <p>
        <NuxtLink to="/privacy">
          Privacy Policy
        </NuxtLink>
      </p>
    </VFooter>
  </div>
</template>

<script lang="ts">
export default {
  data (): any {
    return {
      year: new Date().getFullYear()
    }
  }
}
</script>

<style lang="scss" scoped>
  p {
    margin-right: 10px;
  }
</style>
