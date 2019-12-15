<template>
  <div class="red-box"></div>
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
    border-top: 25vw solid #a85c56;
    overflow: hidden;
  }
</style>
