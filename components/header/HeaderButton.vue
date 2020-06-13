<template>
  <VBtn
    :to="path"
    :nuxt="true"
    text
    tile
    class="header-btn"
  >
    {{ title }}
  </VBtn>
</template>

<script>
export default {
  name: 'HeaderButton',
  props: {
    title: {
      type: String,
      required: true
    },
    path: {
      type: String,
      default: '#'
    }
  }
}
</script>

<style lang="scss" scoped>
  .header-btn {
    font-family: 'Oswald Light', sans-serif;
    height: 100% !important;
    margin: 0;
  }
</style>
