<template>
  <div class="red-box" />
</template>

<script lang="ts">
export default {
  name: 'HomeBackgroundShape'
}
</script>

<style lang="scss" scoped>
  .red-box {
    transform: translateX(-50vw);
    border-left: 100vw solid transparent;
    border-right: 100vw solid transparent;
    border-top: 25vw solid #b05454; /* This should use --v-primary-darken1 however doesn't seem to be working... */
    overflow: hidden;
  }
</style>
