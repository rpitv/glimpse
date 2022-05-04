<template>
    <NavigationHeader always-translucent />
    <div class="background" />
    <div class="document">
        <div class="content">
          <slot />
        </div>
    </div>
    <!--                <TheFooter />-->
</template>

<script setup lang="ts">
import NavigationHeader from "../components/NavigationHeader.vue";
</script>

<style scoped lang="scss">
@import url("https://fonts.googleapis.com/css?family=Ubuntu|Oswald:wght@200;300;400&display=swap");
/* Margin to avoid overlap due to logo overhang */
.content {
  padding-top: 15vw;
}
.background {
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    z-index: -1;
    background: linear-gradient(#1e2225, #111315) !important;
}
h1,
h2,
h3,
h4,
h5,
h6 {
    font-family: "Oswald Light", sans-serif;
}
html {
    font-family: "Ubuntu", sans-serif;
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
