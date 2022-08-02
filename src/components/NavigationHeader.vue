<template>
  <header>
    <nav class="navbar" aria-label="Website Navigation">
      <ul ref="leftNav" class="navbar-section left">
        <li v-for="button in leftButtons">
          <NavigationHeaderButton class="nav-button" :value="button"/>
        </li>
        <li v-if="moreDropdownButton.children.length">
          <NavigationHeaderButton class="nav-button" :value="moreDropdownButton"/>
        </li>
      </ul>

      <ul ref="rightNav" class="navbar-section right">
        <li v-for="button in rightButtons">
          <NavigationHeaderButton class="nav-button" :value="button"/>
        </li>
      </ul>

      <LoginPopup v-model="showLoginPopup"/>
    </nav>
  </header>
</template>

<script setup lang="ts">
import {computed, nextTick, onMounted, onUnmounted, Ref, ref, watch} from "vue";
import {useRoute} from "vue-router";
import LoginPopup from "./LoginPopup.vue";
import {canViewDashboard, requirePermission} from "@/casl";
import {useAuthStore} from "@/stores/auth";
import {subject} from "@casl/ability";
import {AbilityActions, AbilitySubjects} from "@/graphql/types";
import type {NavButton} from "@/util/NavButton";
import NavigationHeaderButton from "./NavigationHeaderButton.vue";
import {useMessage} from "naive-ui";
import {shouldOpenInNewTab} from "@/util/helper";

// Import composables
const route = useRoute();
const authStore = useAuthStore();
const message = useMessage();

// Used in v-bind in <style>
// noinspection JSUnusedGlobalSymbols
const navbarColor = computed(() => {
  return scrollPos.value <= 0 ? "#00000000" : "#00000050";
});
// Used in v-bind in <style>
// noinspection JSUnusedGlobalSymbols
const navbarBlur = computed(() => {
  return scrollPos.value <= 0 ? "blur(0)" : "blur(0.3em)";
});

// Define references
const windowWidth = ref(window.innerWidth);
const scrollPos = ref(0);
const leftNav = ref<HTMLElement | null>(null);
const rightNav = ref<HTMLElement | null>(null);
const showLoginPopup = ref<boolean>(false);

// Listen for scrolling/resizing to update navbar transparency
onMounted(() => document.addEventListener("scroll", updateScroll));
onUnmounted(() => document.removeEventListener("scroll", updateScroll));
onMounted(() => window.addEventListener("resize", updateWindowWidth));
onUnmounted(() => window.removeEventListener("resize", updateWindowWidth));

function updateScroll(): void {
  scrollPos.value = window.scrollY;
}

function updateWindowWidth() {
  windowWidth.value = window.innerWidth;
}

// Define the list of buttons to render on the left side of the navbar
const leftButtons: Ref<NavButton[]> = ref([
  {
    name: "Home",
    icon: ['fal', 'home'],
    showIconOnDesktop: true,
    route: "home"
  },
  {
    name: "Productions",
    icon: ['fal', 'film'],
    showIconOnDesktop: false,
    route: "productions",
    visible: requirePermission(AbilityActions.Read, AbilitySubjects.Production)
  },
  {
    name: "About",
    icon: ['fal', 'info-circle'],
    showIconOnDesktop: false,
    route: "about"
  },
  {
    name: "Contact Us",
    icon: ['fal', 'envelope'],
    showIconOnDesktop: false,
    route: "contact",
    visible: requirePermission(AbilityActions.Create, AbilitySubjects.ContactSubmission)
  },
  {
    name: "Join the Club",
    icon: ['fal', 'people-group'],
    showIconOnDesktop: false,
    route: "join"
  },
  {
    name: "Donate",
    icon: ['fal', 'book-heart'],
    showIconOnDesktop: false,
    route: "donate"
  }
]);
// Define the list of buttons to render on the right side of the navbar
const rightButtons: Ref<NavButton[]> = computed(() => {
  const list: NavButton[] = [
    {
      name: "Dashboard",
      icon: ['fal', 'hammer'],
      showIconOnDesktop: true,
      route: "dashboard",
      visible: canViewDashboard
    },
    {
      name: authStore.isLoggedIn ? "Logout" : "Login",
      icon: ['fal', authStore.isLoggedIn ? "arrow-right-from-arc" : "arrow-right-to-arc"],
      showIconOnDesktop: true,
      route: "login",
      onClick: async (event, value, next) => {
        // If the click on the link should open in a new tab (e.g. ctrl held down), then trigger the
        //   default RouterLink action.
        if(shouldOpenInNewTab(event)) {
          return next(event);
        }

        event.preventDefault();
        // If the user is logged in, then log them out and display a success/failure message. Otherwise,
        //   show the login popup.
        if (authStore.isLoggedIn) {
          try {
            await authStore.logout()
            message.success("Logged out successfully")
          } catch(e: any) {
            if(e instanceof Error) {
              message.error(e.message)
            } else {
              message.error(e)
            }
          }
        } else {
          showLoginPopup.value = true;
        }
      }
    }
  ]

  // Insert "Account" button if user is logged in. In between the login and admin buttons.
  if (authStore.isLoggedIn) {
    list.splice(1, 0, {
      name: "Account",
      icon: ['fal', 'user'],
      showIconOnDesktop: true,
      route: "account",
      visible: requirePermission(AbilityActions.Update, subject(AbilitySubjects.User, {id: authStore.userId})),
    })
  }

  return list;
});

// List of buttons to render in the "More" dropdown, along with their widths. Separate lists are maintained
//   here for the left and right side, however when it comes time to render, we combine them (see below).
const leftMoreButtons: Ref<NavButton[]> = ref([]);
const leftMoreButtonWidths: Ref<number[]> = ref([]);
const rightMoreButtons: Ref<NavButton[]> = ref([]);
const rightMoreButtonWidths: Ref<number[]> = ref([]);

const moreDropdownButton: Ref<NavButton> = computed(() => {
  return {
    name: "More",
    icon: windowWidth.value >= 500 ? ['fas', 'caret-down'] : ['fal', 'ellipsis'],
    showIconOnDesktop: true,
    children: [...rightMoreButtons.value, ...leftMoreButtons.value],
  };
})

// Computed maximum width of the left side of the navbar. Any buttons which overflow this width will be
//   rendered in the "More" dropdown.
const leftMaxWidth: Ref<number> = computed(() => {
  if (windowWidth.value >= 800) {
    return windowWidth.value / 2 - 60;
  } else if (windowWidth.value >= 500) {
    return windowWidth.value - (rightNav.value?.clientWidth ?? 0) - 100;
  } else {
    return windowWidth.value;
  }
});

// Computed maximum width of the right side of the navbar. Any buttons which overflow this width will be
//   rendered in the "More" dropdown.
const rightMaxWidth: Ref<number> = computed(() => {
  if (windowWidth.value >= 800) {
    return windowWidth.value / 2 - 100;
  } else {
    return 0;
  }
});

// Watch the window's width for changes, and re-compute what goes in the "More" dropdown if it changes.
//   Also compute once initially on mount.
watch(() => windowWidth.value, () => {
  updatePriorityPlus(leftButtons, leftMoreButtons, leftMoreButtonWidths, leftNav, leftMaxWidth.value);
  updatePriorityPlus(rightButtons, rightMoreButtons, rightMoreButtonWidths, rightNav, rightMaxWidth.value);
})
onMounted(() => {
  updatePriorityPlus(leftButtons, leftMoreButtons, leftMoreButtonWidths, leftNav, leftMaxWidth.value);
  updatePriorityPlus(rightButtons, rightMoreButtons, rightMoreButtonWidths, rightNav, rightMaxWidth.value);
})

/**
 * Compute the buttons which should be rendered in the "More" dropdown, and then update the lists of
 *   buttons to be shown in the dropdown vs. not in the dropdown. Any buttons which overflow the
 *   maximum width will be popped off of the button list and pushed onto the more button list. Similarly,
 *   if a button is on the more button list but is able to fit in the maximum width, it will be popped
 *   off of the more button list and pushed onto the button list.
 *
 *   This is known as the priority plus paradigm.
 *
 * @param buttonList List of buttons which should not be rendered in the "More" dropdown. This list will be updated.
 * @param moreButtonList List of buttons which should be rendered in the "More" dropdown. This list will be updated.
 * @param moreButtonWidths List of widths required to move a button from the "More" dropdown to the main navbar. The
 *   size of this list will always be equal to the size of the moreButtonList. This is essentially a cache from
 *   previous calls to this function. This list will be updated.
 * @param navElement The element which contains all the buttons in the navbar.
 * @param maxWidth The maximum width that buttons should take up in navElement. Any buttons that overflow this width
 *   will be hidden in the "More" dropdown.
 */
function updatePriorityPlus(buttonList: Ref<NavButton[]>,
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
      updatePriorityPlus(buttonList, moreButtonList, moreButtonWidths, navElement, maxWidth);
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
      updatePriorityPlus(buttonList, moreButtonList, moreButtonWidths, navElement, maxWidth);
    })
  }
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
}

// Tablet displays
@media (min-width: 500px) and (max-width: 799px) {
  // Logo is on the left, so we can center the navbar
  .navbar {
    justify-content: center;
  }
}

.nav-button {
  margin-right: 3px;
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
