<template>
    <header class="nav-wrapper">
        <img alt="RPI TV logo" src="@/assets/rpitv_logo.svg" />
        <nav class="glimpse-main-nav">
            <n-menu mode="horizontal" :options="navOptions" />
        </nav>
    </header>
</template>

<script setup lang="ts">
import type { MenuOption } from "naive-ui";
import { NMenu } from "naive-ui";
import { h, ref, onMounted, onUnmounted, computed } from "vue";
import { RouterLink } from "vue-router";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

const props = defineProps({
    alwaysTranslucent: Boolean, // When true, the menu bar won't be transparent at Y scroll = 0
});

// Wrap Y scroll position in a Vue ref
// Needs to be greater than 0 when always translucent prop is set to true, since it isn't updated
let scrollPos = ref(props.alwaysTranslucent ? 1 : 0);
function updateScroll(): void {
    scrollPos.value = window.scrollY;
}
// Listen for scrolling, but only if the color of the navbar needs to change
if (!props.alwaysTranslucent) {
    onMounted(() => document.addEventListener("scroll", updateScroll));
    onUnmounted(() => document.removeEventListener("scroll", updateScroll));
}

// Used in v-bind in <style>
const navbarColor = computed(() => {
    return scrollPos.value <= 0 ? "#00000000" : "#00000050";
});
// Used in v-bind in <style>
const navbarBlur = computed(() => {
    return scrollPos.value <= 0 ? "blur(0)" : "blur(0.3em)";
});

const navOptions: MenuOption[] = [
    {
      label: () =>
        h(
          RouterLink,
            { to: { name: "home", }, },
            { default: () => "Home" }
        ),
      icon: () => h(FontAwesomeIcon, { icon: ['fal', 'home'] }),
      key: "home",
    },
    {
      label: () =>
        h(
          RouterLink,
            { to: { name: "about", }, },
            { default: () => "About" }
            ),
      icon: () => h(FontAwesomeIcon, { icon: ['fal', 'circle-info'] }),
      key: "about",
    },
];
</script>

<style scoped lang="scss">
header {
    display: flex;
    justify-content: center;
    z-index: 1;
}
img {
    position: fixed;
    z-index: 2;
}
nav {
    position: fixed;
    width: 100%;
    display: flex;
    align-items: center;
}

// Phone displays
@media (max-width: 499px) {
    // Move navbar to the bottom of the screen
    nav {
        bottom: 0;
        top: initial;
        height: 10vh;
        justify-content: center;
        background-color: rgb(27, 29, 35);
    }
    // Move image to the center top of the screen
    img {
        position: absolute;
        top: 0;
        margin: 0;
        height: 25vw;
    }
}
// Tablets & Computers
@media (min-width: 500px) {
    // Position navbar at top of screen & enable color changing on scroll
    nav {
        text-transform: uppercase;
        font-family: Oswald, serif;
        top: 0;
        height: 4em;
        transition: background-color 0.5s, backdrop-filter 0.5s;
        background-color: v-bind(navbarColor);
        backdrop-filter: v-bind(navbarBlur);
    }
}
// Tablet displays
@media (min-width: 500px) and (max-width: 799px) {
    // Move logo to top left of nav
    img {
        height: 4em;
        margin-left: 0.5em;
        left: 0;
    }
    // Move nav over to make room for logo
    nav {
        padding-left: 6em;
    }
}
// Computer displays
@media (min-width: 800px) {
    // Move logo to top center of screen
    img {
        height: 18vw;
        max-width: 250px;
        filter: drop-shadow(0.3em 0.3em 0.3em #00000090);
    }
}
</style>

<style lang="scss">
// Tablet displays and larger - Make menu button font slightly bigger
@media (min-width: 500px) {
  .glimpse-main-nav .n-menu-item-content-header {
      font-size: 1.2em;
  }
}
@media (max-width: 499px) {
  .glimpse-main-nav .n-menu-item-content {
    display: flex !important;
    flex-direction: column;
  }
  .glimpse-main-nav .n-menu-item-content__icon {
    margin-right: 0 !important;
  }
}
</style>
