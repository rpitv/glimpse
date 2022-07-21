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
import LoginLogoutPopupButton from "./LoginLogoutPopupButton.vue";

/**
 * Create a button for the navbar
 * @param name Text to display on this button.
 * @param to Name of router page that this button should open, or undefined if none. If "login", this is a special
 *   case that will open the login modal when clicked.
 * @param icon Name of the FontAwesome icon, or undefined if none.
 * @param children Children MenuOptions to show in the dropdown.
 */
function createButton(name: string, to?: string, icon?: string, children?: MenuOption[]): MenuOption {
  if(to === "login") {
    return {
      label: () => h(
        LoginLogoutPopupButton,
        {},
        {default: () => name} /* TODO change name & icon based on login state */
      ),
      icon: icon ? () => h(FontAwesomeIcon, {icon: ["fal", icon]}) : undefined,
      key: name,
      children: children
    };
  } else {
    return {
      label: () => h(
        RouterLink,
        {to: {name: to}},
        {default: () => name}
      ),
      icon: icon ? () => h(FontAwesomeIcon, {icon: ["fal", icon]}) : undefined,
      key: name,
      children: children
    };
  }
}

// Wrap Y scroll position in a Vue ref
let scrollPos = ref(0);

function updateScroll(): void {
  scrollPos.value = window.scrollY;
}

// Listen for scrolling to update navbar transparency
onMounted(() => document.addEventListener("scroll", updateScroll));
onUnmounted(() => document.removeEventListener("scroll", updateScroll));

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

onMounted(() => window.addEventListener("resize", updateWindowWidth));
onUnmounted(() => window.removeEventListener("resize", updateWindowWidth));

// Compute items on left side of navigation bar
const leftNavOptions = computed(() => {
  // Width < 500 -- Phones
  // Navigation is along the bottom
  if (windowWidth.value < 500) {
    return [
      createButton("Home", "home", "home"),
      createButton("Productions", "productions", "film"),
      createButton("More", undefined, "ellipsis", [
        createButton("Login", "login", "arrow-right-to-arc"),
        createButton("Contact Us", "contact", "envelope"),
        createButton("About", "about", "circle-info"),
        createButton("Join the Club", "join", "people-group"),
        createButton("Donate", "donate", "book-heart")
      ])
    ];
  }
  // 500 < width < 550 -- Large phones / small tablets
  // Nav is at the top, logo on left and login on right, only enough space for 2 buttons
  if (500 <= windowWidth.value && windowWidth.value < 550) {
    return [
      createButton("Home", "home", "home"),
      createButton("More", undefined, "ellipsis", [
        createButton("Productions", "productions", "film"),
        createButton("Contact Us", "contact", "envelope"),
        createButton("About", "about", "circle-info"),
        createButton("Join the Club", "join", "people-group"),
        createButton("Donate", "donate", "book-heart")
      ])
    ];
  }
  // 550 < width < 675 -- Tablets
  // Nav is at the top, logo on left and login on right, enough space for 3 buttons
  if (550 <= windowWidth.value && windowWidth.value < 675) {
    return [
      createButton("Home", "home", "home"),
      createButton("Productions", "productions"),
      createButton("More", undefined, "ellipsis", [
        createButton("Contact Us", "contact", "envelope"),
        createButton("About", "about", "circle-info"),
        createButton("Join the Club", "join", "people-group"),
        createButton("Donate", "donate", "book-heart")
      ])
    ];
  }
  // 675 < width < 800 -- Tablets
  // Nav is at the top, logo on left and login on right, enough space for 4 buttons
  if (675 <= windowWidth.value && windowWidth.value < 800) {
    return [
      createButton("Home", "home", "home"),
      createButton("Productions", "productions"),
      createButton("Contact Us", "contact", "envelope"),
      createButton("More", undefined, "ellipsis", [
        createButton("About", "about", "circle-info"),
        createButton("Join the Club", "join", "people-group"),
        createButton("Donate", "donate", "book-heart")
      ])
    ];
  }
  // 800 < width < 1000 -- Small computers
  // Nav is at the top, logo centered and login on right, enough space for only 3 buttons
  if (800 <= windowWidth.value && windowWidth.value < 1000) {
    return [
      createButton("Home", "home", "home"),
      createButton("Productions", "productions"),
      createButton("More", undefined, "ellipsis", [
        createButton("Contact Us", "contact", "envelope"),
        createButton("About", "about", "circle-info"),
        createButton("Join the Club", "join", "people-group"),
        createButton("Donate", "donate", "book-heart")
      ])
    ];
  }
  // 1000 < width < 1200 -- Computers
  // Nav is at the top, logo centered and login on right, enough space for 4 buttons
  if (1000 <= windowWidth.value && windowWidth.value < 1200) {
    return [
      createButton("Home", "home", "home"),
      createButton("Productions", "productions"),
      createButton("Contact Us", "contact"),
      createButton("More", undefined, "ellipsis", [
        createButton("About", "about", "circle-info"),
        createButton("Join the Club", "join", "people-group"),
        createButton("Donate", "donate", "book-heart")
      ])
    ];
  }
  // 1200 < width < 1400 -- Computers
  // Nav is at the top, logo centered and login on right, enough space for 5 buttons
  if (1200 <= windowWidth.value && windowWidth.value < 1400) {
    return [
      createButton("Home", "home", "home"),
      createButton("Productions", "productions"),
      createButton("Contact Us", "contact"),
      createButton("About", "about"),
      createButton("More", undefined, "ellipsis", [
        createButton("Join the Club", "join", "people-group"),
        createButton("Donate", "donate", "book-heart")
      ])
    ];
  }

  // 1600 < width -- Large computers
  // Nav is at the top, logo centered and login on right, enough space for 6 buttons
  return [
    createButton("Home", "home", "home"),
    createButton("Productions", "productions"),
    createButton("Contact Us", "contact"),
    createButton("About", "about"),
    createButton("Join the Club", "join"),
    createButton("Donate", "donate")
  ];
});

// Compute items on right side of navigation bar
const rightNavOptions = computed(() => {
  // Tablets and larger. Navbar is used
  if (500 <= windowWidth.value) {
    return [
      createButton("Login", "login", "arrow-right-to-arc")
    ];
  }
  // Phones. Everything in "more" dropdown
  return [];
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
    height: 5em;
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
