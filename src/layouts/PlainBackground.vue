<template>
  <NavigationHeader always-translucent />
  <div class="logo-wrapper">
    <img class="logo" alt="RPI TV logo" src="@/assets/rpitv_logo.svg" />
  </div>
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


.logo-wrapper {
  display: flex;
  justify-content: center;
}

.logo {
  position: fixed;
  z-index: 2;
  pointer-events: none;
}

// Phone displays
@media (max-width: 499px) {
  // Move image to the center top of the screen
  .logo {
    position: absolute;
    top: 0;
    margin: 0;
    height: 25vw;
  }
}

// Tablet displays
@media (min-width: 500px) and (max-width: 799px) {
  // Move logo to top left of nav
  .logo {
    height: 4em;
    margin-left: 0.5em;
    left: 0;
  }
}

// Computer displays
@media (min-width: 800px) {
  // Move logo to top center of screen
  .logo {
    max-width: 200px;
    top: -1vh;
    filter: drop-shadow(0.3em 0.3em 0.3em #00000090);
  }
}
</style>
