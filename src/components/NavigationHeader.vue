<template>
  <header>
    <nav class="navbar" aria-label="Website Navigation">
      <ul class="navbar-section left">
        <li v-for="button in leftButtons">
          <RouterLink :to="{name: button.route}" :aria-current="route.name === button.route ? 'page' : undefined">
            <n-button class="nav-button" :type="route.name === button.route ? 'primary' : 'default'" large quaternary>
              <template #icon v-if="button.showIconOnDesktop || windowWidth < 500">
                <FontAwesomeIcon :icon="['fal', button.icon]" />
              </template>
              {{button.name}}
            </n-button>
          </RouterLink>
        </li>
      </ul>

      <ul class="navbar-section right">
        <li v-for="button in rightButtons">
          <RouterLink :to="{name: button.route}" :aria-current="route.name === button.route ? 'page' : undefined">
            <n-button class="nav-button" :type="route.name === button.route ? 'primary' : 'default'" large quaternary>
              <template #icon v-if="button.showIconOnDesktop || windowWidth < 500">
                <FontAwesomeIcon :icon="['fal', button.icon]" />
              </template>
              {{button.name}}
            </n-button>
          </RouterLink>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { NButton } from "naive-ui";
import {h, ref, onMounted, onUnmounted, computed, Ref} from "vue";
import {RouterLink, useRoute} from "vue-router";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import LoginLogoutPopupButton from "./LoginLogoutPopupButton.vue";
import {useAuthStore} from "@/stores/auth";
import {requirePermission} from "@/casl";

// Import composables
const authStore = useAuthStore();
const route = useRoute();

// Used in v-bind in <style>
const navbarColor = computed(() => {
  return scrollPos.value <= 0 ? "#00000000" : "#00000050";
});
// Used in v-bind in <style>
const navbarBlur = computed(() => {
  return scrollPos.value <= 0 ? "blur(0)" : "blur(0.3em)";
});

// Define references
const windowWidth = ref(window.innerWidth);
const scrollPos = ref(0);

// Listen for scrolling/resizing to update navbar transparency
onMounted(() => document.addEventListener("scroll", updateScroll));
onUnmounted(() => document.removeEventListener("scroll", updateScroll));
onMounted(() => window.addEventListener("resize", updateWindowWidth));
onUnmounted(() => window.removeEventListener("resize", updateWindowWidth));


type NavButton = {
  name: string;
  icon: string;
  showIconOnDesktop: boolean;
  route?: string;
  children?: NavButton[];
  side: string;
  visible?: (() => Ref<boolean>);
}

const buttons: Ref<NavButton[]> = ref([
  {
    name: "Home",
    icon: "home",
    showIconOnDesktop: true,
    route: "home",
    side: "left"
  },
  {
    name: "Productions",
    icon: "film",
    showIconOnDesktop: false,
    route: "productions",
    side: "left",
    visible: requirePermission("read", "Production")
  },
  {
    name: "About",
    icon: "info-circle",
    showIconOnDesktop: false,
    route: "about",
    side: "left"
  },
  {
    name: "Contact Us",
    icon: "envelope",
    showIconOnDesktop: false,
    route: "contact",
    side: "left",
    visible: requirePermission("create", "ContactSubmission")
  },
  {
    name: "Join the Club",
    icon: "people-group",
    showIconOnDesktop: false,
    route: "join",
    side: "left"
  },
  {
    name: "Donate",
    icon: "book-heart",
    showIconOnDesktop: false,
    route: "donate",
    side: "left"
  },
  { /* Login is a special case, icon and route are overwritten. */
    name: "Login",
    icon: "arrow-right-to-arc",
    showIconOnDesktop: true,
    route: "login",
    side: "right"
  }
]);

const leftButtons = computed(() => {
  return buttons.value.filter(button => button.side === "left");
});
const rightButtons = computed(() => {
  return buttons.value.filter(button => button.side === "right");
});

function updateScroll(): void {
  scrollPos.value = window.scrollY;
}

function updateWindowWidth() {
  windowWidth.value = window.innerWidth;
}
</script>

<style scoped lang="scss">
header {
  z-index: 1;
}

.navbar {
  padding: 0 10px;
  display: flex;
  position: fixed;
  width: 100%;
}

.navbar-section {
  display: flex;
  align-items: center;
  list-style: none;
}

.nav-button {
  font-size: 1.2em;
}

@media(min-width: 500px) {
  .navbar {
    justify-content: space-between;
  }
}

// Phone displays
@media (max-width: 499px) {
  // Move navbar to the bottom of the screen
  .navbar {
    bottom: 0;
    top: initial;
    padding: 1em;
    justify-content: center;
    background-color: rgb(27, 29, 35);
    height: 5em;
  }
}

// Tablets & Computers
@media (min-width: 500px) {
  // Position navbar at top of screen & enable color changing on scroll
  .navbar {
    top: 0;
    height: 4em;
    transition: background-color 0.5s, backdrop-filter 0.5s;
    background-color: v-bind(navbarColor);
    backdrop-filter: v-bind(navbarBlur);
  }
  // Uppercase buttons not on mobile
  .nav-button {
    text-transform: uppercase;
  }

  .navbar-section {
    max-width: 40vw;
    overflow: hidden;
  }
}

// Tablet displays
@media (min-width: 500px) and (max-width: 799px) {
  // Move nav over to make room for logo
  .navbar {
    padding-left: 6em;
  }
}
</style>
