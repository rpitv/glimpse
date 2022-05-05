<template>
  <header class="nav-wrapper">
    <nav class="glimpse-main-nav">
      <n-menu class="left-nav" mode="horizontal" :options="leftNavOptions" />
      <n-menu class="right-nav" mode="horizontal" :options="rightNavOptions" />
    </nav>
  </header>
</template>

<script setup lang="ts">
import type { MenuOption } from "naive-ui";
import { NMenu } from "naive-ui";
import { h, ref, onMounted, onUnmounted, computed } from "vue";
import { RouterLink } from "vue-router";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

/**
 * Create a button for the navbar
 * @param name Text to display on this button.
 * @param to Name of router page that this button should open, or undefined if none.
 * @param icon Name of the FontAwesome icon, or undefined if none.
 * @param children Children MenuOptions to show in the dropdown.
 */
function createButton(name: string, to?: string, icon?: string, children?: MenuOption[]): MenuOption {
  return {
    label: () => h(
      RouterLink,
      { to: { name: to } },
      { default: () => name }
    ),
    icon: icon ? () => h(FontAwesomeIcon, { icon: ["fal", icon] }) : undefined,
    key: name,
    children: children
  }
}

const props = defineProps({
  alwaysTranslucent: Boolean // When true, the menu bar won't be transparent at Y scroll = 0
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

// Arrangement of navbar items is based on screen size. Watch for changes.
const windowWidth = ref(window.innerWidth);
function updateWindowWidth() {
  windowWidth.value = window.innerWidth;
}
onMounted(() => window.addEventListener("resize", updateWindowWidth))
onUnmounted(() => window.removeEventListener("resize", updateWindowWidth))

// Compute items on left side of navigation bar
const leftNavOptions = computed(() => {
  // Width < 500 -- Phones
  if(windowWidth.value < 500) {
    return [
      createButton("Home", "home", "home"),
      createButton("Productions", "productions", "film"),
      createButton("More", undefined, "ellipsis", [
        createButton("Contact Us", "contact", "envelope"),
        createButton("About", "about", "circle-info"),
        createButton("Login", "login", "arrow-right-to-arc")
      ])
    ]
  }
  // 500 < width < 550 -- Large phones / small tablets
  if(500 <= windowWidth.value && windowWidth.value < 550) {
    return [
      createButton("Home", "home", "home"),
      createButton("More", undefined, "ellipsis", [
        createButton("Productions", "productions", "film"),
        createButton("Contact Us", "contact", "envelope"),
        createButton("About", "about", "circle-info")
      ])
    ]
  }
  // 550 < width < 700 -- Tablets
  if(550 <= windowWidth.value && windowWidth.value < 700) {
    return [
      createButton("Home", "home", "home"),
      createButton("Productions", "productions"),
      createButton("More", undefined, "ellipsis", [
        createButton("Contact Us", "contact", "envelope"),
        createButton("About", "about", "circle-info")
      ])
    ]
  }
  // 700 < width < 1000 -- Tablets
  if(700 <= windowWidth.value && windowWidth.value < 1000) {
    return [
      createButton("Home", "home", "home"),
      createButton("Productions", "productions"),
      createButton("Contact Us", "contact")
    ]
  }
  // 1000 < width -- Large computers
  return [
    createButton("Home", "home", "home"),
    createButton("Productions", "productions"),
    createButton("Contact Us", "contact"),
    createButton("About", "about")
  ]
});

// Compute items on right side of navigation bar
const rightNavOptions = computed(() => {
  // 500 < width < 700 -- Small screens. About moved to "more" dropdown
  if(500 <= windowWidth.value && windowWidth.value < 700) {
    return [
      createButton("Login", "login", "arrow-right-to-arc")
    ]
  }
  // 700 < width -- Medium screens.
  if(700 <= windowWidth.value && windowWidth.value < 1000) {
    return [
      createButton("About", "about"),
      createButton("Login", "login", "arrow-right-to-arc")
    ]
  }
  // 1000 < width -- Large screens. About moved to left side of menu bar
  if(1000 <= windowWidth.value) {
    return [
      createButton("Login", "login", "arrow-right-to-arc")
    ]
  }
  // Phones. Everything in "more" dropdown
  return []
});
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
  pointer-events: none;
}

nav {
  position: fixed;
  width: 100%;
  display: flex;
  align-items: center;
}

@media(min-width: 500px) {
  .right-nav {
    position: absolute;
    right: 0;
  }
}

// Phone displays
@media (max-width: 499px) {
  // Move navbar to the bottom of the screen
  nav {
    bottom: 0;
    top: initial;
    padding: 1em;
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
