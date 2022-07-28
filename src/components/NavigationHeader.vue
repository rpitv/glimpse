<template>
  <header>
    <nav class="navbar" aria-label="Website Navigation">
      <ul ref="leftNav" class="navbar-section left">
        <li v-for="button in leftButtons">
          <RouterLink :to="{name: button.route}" :aria-current="route.name === button.route ? 'page' : undefined">
            <n-button class="nav-button" :type="route.name === button.route ? 'primary' : 'default'" large quaternary>
              <template #icon v-if="button.showIconOnDesktop || windowWidth < 500">
                <FontAwesomeIcon :icon="['fal', button.icon]"/>
              </template>
              {{ button.name }}
            </n-button>
          </RouterLink>
        </li>
        <li v-if="leftMoreButtons.length || rightMoreButtons.length">
          <n-dropdown :options="moreButtonsOptions" placement="bottom-end">
            <n-button class="nav-button" large quaternary>
              <template #icon>
                <FontAwesomeIcon :icon="windowWidth >= 500 ? ['fas', 'caret-down'] : ['fal', 'ellipsis']"/>
              </template>
              More
            </n-button>
          </n-dropdown>
        </li>
      </ul>

      <ul ref="rightNav" class="navbar-section right">
        <li v-for="button in rightButtons">
          <RouterLink :to="{name: button.route}" :aria-current="route.name === button.route ? 'page' : undefined">
            <n-button class="nav-button" :type="route.name === button.route ? 'primary' : 'default'" large quaternary>
              <template #icon v-if="button.showIconOnDesktop || windowWidth < 500">
                <FontAwesomeIcon :icon="['fal', button.icon]"/>
              </template>
              {{ button.name }}
            </n-button>
          </RouterLink>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script setup lang="ts">
import {DropdownOption, NButton, NDropdown} from "naive-ui";
import {h, ref, onMounted, onUnmounted, computed, Ref, nextTick, watch} from "vue";
import {RouterLink, useRoute} from "vue-router";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
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
const leftNav = ref<HTMLElement | null>(null);
const rightNav = ref<HTMLElement | null>(null);

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
  visible?: (() => Ref<boolean>);
}

const leftButtons: Ref<NavButton[]> = ref([
  {
    name: "Home",
    icon: "home",
    showIconOnDesktop: true,
    route: "home"
  },
  {
    name: "Productions",
    icon: "film",
    showIconOnDesktop: false,
    route: "productions",
    visible: requirePermission("read", "Production")
  },
  {
    name: "About",
    icon: "info-circle",
    showIconOnDesktop: false,
    route: "about"
  },
  {
    name: "Contact Us",
    icon: "envelope",
    showIconOnDesktop: false,
    route: "contact",
    visible: requirePermission("create", "ContactSubmission")
  },
  {
    name: "Join the Club",
    icon: "people-group",
    showIconOnDesktop: false,
    route: "join"
  },
  {
    name: "Donate",
    icon: "book-heart",
    showIconOnDesktop: false,
    route: "donate"
  }
]);
const rightButtons: Ref<NavButton[]> = ref([
  { /* Login is a special case, icon and route are overwritten. */
    name: "Login",
    icon: "arrow-right-to-arc",
    showIconOnDesktop: true,
    route: "login"
  }
]);

const leftMoreButtons: Ref<NavButton[]> = ref([]);
const leftMoreButtonWidths: Ref<number[]> = ref([]);
const rightMoreButtons: Ref<NavButton[]> = ref([]);
const rightMoreButtonWidths: Ref<number[]> = ref([]);

const moreButtonsOptions = computed(() => {
  const options: DropdownOption[] = [];
  const combinedMoreButtons = [...rightMoreButtons.value, ...leftMoreButtons.value];

  for (let i = combinedMoreButtons.length - 1; i >= 0; i--) {
    const button = combinedMoreButtons[i];

    options.push({
      type: "render",
      key: button.name,
      render: () => h(RouterLink, {
        to: {name: button.route}
      }, () => [
        h(NButton, {
          class: "navbar-dropdown-button",
          type: "default",
          large: true,
          quaternary: true,
        }, () => [
          h(FontAwesomeIcon, {
            class: "navbar-dropdown-button-icon",
            icon: ["fal", button.icon]
          }),
          button.name
        ])
      ])
    });
  }
  return options;
});

const leftMaxWidth: Ref<number> = computed(() => {
  if (windowWidth.value >= 800) {
    return windowWidth.value / 2 - 100;
  } else if (windowWidth.value >= 500) {
    return windowWidth.value - (rightNav.value?.clientWidth ?? 0) - 100;
  } else {
    return windowWidth.value;
  }
});

const rightMaxWidth: Ref<number> = computed(() => {
  if (windowWidth.value >= 800) {
    return windowWidth.value / 2 - 100;
  } else {
    return 0;
  }
});

watch(() => windowWidth.value, () => {
  handlePriorityPlus(leftButtons, leftMoreButtons, leftMoreButtonWidths, leftNav, leftMaxWidth.value);
  handlePriorityPlus(rightButtons, rightMoreButtons, rightMoreButtonWidths, rightNav, rightMaxWidth.value);
})
onMounted(() => {
  handlePriorityPlus(leftButtons, leftMoreButtons, leftMoreButtonWidths, leftNav, leftMaxWidth.value);
  handlePriorityPlus(rightButtons, rightMoreButtons, rightMoreButtonWidths, rightNav, rightMaxWidth.value);
})

function handlePriorityPlus(buttonList: Ref<NavButton[]>,
                            moreButtonList: Ref<NavButton[]>,
                            moreButtonWidths: Ref<number[]>,
                            navElement: Ref<HTMLElement | null>,
                            maxWidth: number) {
  const currentWidth = navElement.value?.clientWidth ?? 0;
  // If the screen is too small to fit the current buttons in the row, move one to the more list.
  if (currentWidth > maxWidth) {
    const poppedButton = buttonList.value.pop();
    if (!poppedButton) {
      return;
    }
    moreButtonList.value.push(poppedButton);
    moreButtonWidths.value.push(currentWidth);
    // Keep calling until no more changes need to be made.
    nextTick(() => {
      handlePriorityPlus(buttonList, moreButtonList, moreButtonWidths, navElement, maxWidth);
    })
  } else if (moreButtonWidths.value.length > 0 && moreButtonWidths.value[moreButtonWidths.value.length - 1] < maxWidth) {
    // If the screen is large enough to fit the last button in the more list, move it back to the main list.
    const poppedButton = moreButtonList.value.pop();
    if (!poppedButton) {
      return;
    }
    buttonList.value.push(poppedButton);
    moreButtonWidths.value.pop();
    // Keep calling until no more changes need to be made.
    nextTick(() => {
      handlePriorityPlus(buttonList, moreButtonList, moreButtonWidths, navElement, maxWidth);
    })
  }
}

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

  //.navbar-section {
  //  max-width: 40vw;
  //  overflow: hidden;
  //}
}

// Tablet displays
@media (min-width: 500px) and (max-width: 799px) {
  // Move nav over to make room for logo
  .navbar {
    padding-left: 6em;
  }
}

</style>

<style lang="scss">
.navbar-dropdown-button {
  width: calc(100% - 10px);
  margin: 0 5px;
  justify-content: start;
}

.navbar-dropdown-button-icon {
  margin-right: 5px;
}
</style>
