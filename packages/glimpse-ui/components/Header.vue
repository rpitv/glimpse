<template>
  <ElMenu mode="horizontal" router="true" background-color="#8c3c3c" text-color="#ffffff" active-text-color="#ffdddd">
    <ElMenuItem :router="this.$router" index="/">Home</ElMenuItem>
    <ElMenuItem :router="this.$router" index="/productions">Productions</ElMenuItem>
    <ElMenuItem :router="this.$router" index="/about">About</ElMenuItem>
    <ElMenuItem :router="this.$router" index="/request">Request Service</ElMenuItem>
    <NuxtLink to="/"><img src="../assets/rpitv_logo.png" alt="Logo" class="tv-logo" /></NuxtLink>
  </ElMenu>
</template>

<script lang="ts">
export default {
}
</script>

<style lang="scss" scoped>
  .header-wrapper {
    background-color: #7c4e4e;
    color: white;
    padding: 20px;
    position: fixed;
    width: 100%;
  }

  .tv-logo {
    position: absolute;
    width: 200px;
    left: calc(50% - 100px);
    top: -20px;
  }
</style>
