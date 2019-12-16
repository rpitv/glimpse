<template>
  <div class="red-box-wrapper">
    <div class="red-box" />
  </div>
</template>

<script lang="ts">
export default {
  name: 'HomeBackgroundShape'
}
</script>

<style lang="scss" scoped>
  .red-box-wrapper {
    filter: drop-shadow(5px 5px 10px #00000080);
  }
  .red-box {
    width: 100vw;
    height: 40vh;
    background-image: linear-gradient(#b05454, #502626);
    clip-path: polygon(0 0, 0 100px, 50% 100%, 100% 100px, 100% 0);
  }
  .red-box-old {
    transform: translateX(-50vw);
    border-left: 100vw solid transparent;
    border-right: 100vw solid transparent;
    border-top: 25vw solid #b05454; /* This should use --v-primary-darken1 however doesn't seem to be working... */
    overflow: hidden;
  }
</style>
