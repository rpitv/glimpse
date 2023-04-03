<template>
  <header>
    <nav class="navbar" aria-label="Website Navigation">
      <ul ref="leftNav" class="navbar-section left">
        <li v-for="button in leftPriorityPlusCache.nonMoreButtons">
          <NavigationHeaderButton class="nav-button" :value="button"/>
        </li>
        <li v-if="moreDropdownButton.children.length">
          <NavigationHeaderButton class="nav-button" :value="moreDropdownButton"/>
        </li>
      </ul>
      <ul ref="rightNav" class="navbar-section right">
        <li v-for="button in rightPriorityPlusCache.nonMoreButtons">
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
import {AbilityActions, canViewDashboard, requirePermission} from "@/casl";
import {useAuthStore} from "@/stores/auth";
import type {NavButton} from "@/util/NavButton";
import NavigationHeaderButton from "./NavigationHeaderButton.vue";
import {useMessage} from "naive-ui";
import {shouldOpenInNewTab} from "@/util/helper";
import {storeToRefs} from "pinia";
import {AbilitySubjects} from "@/graphql/types";

// -------------------------------------------------------------------------------------------------
// Definitions
// -------------------------------------------------------------------------------------------------

// Define types
type PriorityPlusCache = {
  nonMoreButtons: NavButton[];
  moreButtons: NavButton[];
  moreButtonWidths: number[];
}

// Import composables
const route = useRoute();
const authStore = useAuthStore();
const refAuthStore = storeToRefs(authStore);
const message = useMessage();

// Define the list of buttons to render on the left side of the navbar
const leftButtonsSource: Ref<NavButton[]> = computed(() => [
  {
    key: "home",
    name: "Home",
    icon: ['fal', 'home'],
    showIconOnDesktop: true,
    route: "home"
  },
  {
    key: "productions",
    name: "Productions",
    icon: ['fal', 'film'],
    showIconOnDesktop: false,
    route: "productions",
    visible: requirePermission(AbilityActions.Read, AbilitySubjects.Production)
  },
  {
    key: "about",
    name: "About",
    icon: ['fal', 'info-circle'],
    showIconOnDesktop: false,
    route: "about"
  },
  {
    key: "contact",
    name: "Contact Us",
    icon: ['fal', 'envelope'],
    showIconOnDesktop: false,
    route: "contact",
    visible: requirePermission(AbilityActions.Create, AbilitySubjects.ContactSubmission)
  },
  {
    key: "join",
    name: "Join the Club",
    icon: ['fal', 'people-group'],
    showIconOnDesktop: false,
    route: "join"
  },
  {
    key: "donate",
    name: "Donate",
    icon: ['fal', 'book-heart'],
    showIconOnDesktop: false,
    route: "donate"
  }
]);
// Define the list of buttons to render on the right side of the navbar
const rightButtonsSource: Ref<NavButton[]> = computed(() => {
  const list: NavButton[] = [
    {
      key: "dashboard",
      name: "Dashboard",
      icon: ['fal', 'hammer'],
      showIconOnDesktop: true,
      route: "dashboard",
      visible: canViewDashboard
    },
    {
      key: refAuthStore.isLoggedIn.value ? "login" : "logout",
      name: refAuthStore.isLoggedIn.value ? "Logout" : "Login",
      icon: ['fal', refAuthStore.isLoggedIn.value ? "arrow-right-from-arc" : "arrow-right-to-arc"],
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
      key: "account",
      name: "Account",
      icon: ['fal', 'user'],
      showIconOnDesktop: true,
      route: "account",
      visible: () => refAuthStore.isLoggedIn
    })
  }

  return list;
});

// Define references
const windowWidth = ref(window.innerWidth);
const scrollPos = ref(0);
const leftNav = ref<HTMLElement | null>(null);
const rightNav = ref<HTMLElement | null>(null);
const showLoginPopup = ref<boolean>(false);
const leftPriorityPlusCache: Ref<PriorityPlusCache> = ref({nonMoreButtons: [], moreButtons: [], moreButtonWidths: []});
const rightPriorityPlusCache: Ref<PriorityPlusCache> = ref({nonMoreButtons: [], moreButtons: [], moreButtonWidths: []});

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

// Computed combination of the left and right buttons which should be hidden in the "More" dropdown.
//   We combine them because we only have one combined dropdown.
const moreButtons: Ref<NavButton[]> = computed(() => [
  ...leftPriorityPlusCache.value.moreButtons,
  ...rightPriorityPlusCache.value.moreButtons
]);

// Computed "More" dropdown button in the form of a NavButton which can be passed to a NavigationHeaderButton.
const moreDropdownButton: Ref<NavButton> = computed(() => {
  return {
    key: "more",
    name: "More",
    icon: windowWidth.value >= 500 ? ['fas', 'caret-down'] : ['fal', 'ellipsis'],
    showIconOnDesktop: true,
    children: moreButtons.value,
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

// -------------------------------------------------------------------------------------------------
// Functions
// -------------------------------------------------------------------------------------------------

/**
 * Update the scroll position reference with the current window scroll position. This is used in
 *   a document scroll event listener.
 */
function updateScroll(): void {
  scrollPos.value = window.scrollY;
}

/**
 * Update the window width reference with the current window width. This is used in
 *   a document resize event listener.
 */
function updateWindowWidth(): void {
  windowWidth.value = window.innerWidth;
}

/**
 * Compute the buttons which should be rendered in the "More" dropdown, and then update the lists of
 *   buttons to be shown in the dropdown vs. not in the dropdown. Any buttons which overflow the
 *   maximum width will be popped off of the button list and pushed onto the more button list. Similarly,
 *   if a button is on the more button list but is able to fit in the maximum width, it will be popped
 *   off of the more button list and pushed onto the button list.
 *
 *   This is known as the priority plus paradigm.
 *
 * @param sourceButtons List of buttons which should not be rendered in the "More" dropdown. This list will not be updated.
 *   It is used as a reference to check which buttons exist in the first place. Buttons which are in this list but not
 *   in the "More" list will be rendered as normal. Buttons which are in the "More" list but not this list will be
 *   removed from the "More" list.
 * @param cache A cache used by this method to store data between calls. This cache is updated by this method, and
 *   shouldn't ever be modified directly. You can retrieve the list of buttons which should be rendered in the "More"
 *   dropdown from this cache.
 * @param navElement The element which contains all the buttons in the navbar.
 * @param maxWidth The maximum width that buttons should take up in navElement. Any buttons that overflow this width
 *   will be hidden in the "More" dropdown.
 */
function updatePriorityPlus(sourceButtons: Ref<NavButton[]>,
                            cache: Ref<PriorityPlusCache>,
                            navElement: Ref<HTMLElement | null>,
                            maxWidth: number): void {
  const currentWidth = navElement.value?.clientWidth ?? 0;

  let sourceChanged = false;
  // Go through the list of "More" and non-"More" buttons and remove any which aren't in the button list anymore.
  for (let i = 0; i < cache.value.moreButtons.length; i++) {
    if (!sourceButtons.value.some(button => button.key === cache.value.moreButtons[i].key)) {
      cache.value.moreButtons.splice(i, 1);
      cache.value.moreButtonWidths.splice(i, 1);
      sourceChanged = true;
    }
  }
  for (let i = 0; i < cache.value.nonMoreButtons.length; i++) {
    if (!sourceButtons.value.some(button => button.key === cache.value.nonMoreButtons[i].key)) {
      cache.value.nonMoreButtons.splice(i, 1);
      sourceChanged = true;
    }
  }

  // Similarly, if there's a button in the source list which isn't in either the "More" or non-"More" list, add it
  // to the non-"More" list.
  for(let i = 0; i < sourceButtons.value.length; i++) {
    if (!cache.value.moreButtons.some(button => button.key === sourceButtons.value[i].key) &&
        !cache.value.nonMoreButtons.some(button => button.key === sourceButtons.value[i].key)) {
      cache.value.nonMoreButtons.push(sourceButtons.value[i]);
      sourceChanged = true;
    }
  }

  // If the source list changed, then we need the virtual DOM to re-render to compute the new nav width.
  if(sourceChanged) {
    nextTick(() => {
      updatePriorityPlus(sourceButtons, cache, navElement, maxWidth);
    })
    return;
  }

  // At this point, we're confident source has not changed during this execution and nav element is up to date.
  // If the screen is too small to fit the current buttons in the row, move one to the more list.
  if (currentWidth > maxWidth) {
    const poppedButton = cache.value.nonMoreButtons.pop();
    if (!poppedButton) {
      return;
    }
    cache.value.moreButtons.push(poppedButton);
    cache.value.moreButtonWidths.push(currentWidth);
    // Keep calling until no more changes need to be made.
    nextTick(() => {
      updatePriorityPlus(sourceButtons, cache, navElement, maxWidth);
    })
  } else if (cache.value.moreButtonWidths.length > 0 && cache.value.moreButtonWidths[cache.value.moreButtonWidths.length - 1] < maxWidth) {
    // If the screen is large enough to fit the last button in the more list, move it back to the main list.
    const poppedButton = cache.value.moreButtons.pop();
    if (!poppedButton) {
      return;
    }
    cache.value.nonMoreButtons.push(poppedButton);
    cache.value.moreButtonWidths.pop();
    // Keep calling until no more changes need to be made.
    nextTick(() => {
      updatePriorityPlus(sourceButtons, cache, navElement, maxWidth);
    })
  }
}

// -------------------------------------------------------------------------------------------------
// Event Hooks
// -------------------------------------------------------------------------------------------------

// Listen for scrolling/resizing to update navbar transparency
onMounted(() => document.addEventListener("scroll", updateScroll));
onUnmounted(() => document.removeEventListener("scroll", updateScroll));
onMounted(() => window.addEventListener("resize", updateWindowWidth));
onUnmounted(() => window.removeEventListener("resize", updateWindowWidth));

// Watch the window's width for changes, and re-compute what goes in the "More" dropdown if it changes.
//   Also compute once initially on mount.
watch(windowWidth, () => {
  updatePriorityPlus(leftButtonsSource, leftPriorityPlusCache, leftNav, leftMaxWidth.value);
  updatePriorityPlus(rightButtonsSource, rightPriorityPlusCache, rightNav, rightMaxWidth.value);
})
watch(leftButtonsSource, () => {
  updatePriorityPlus(leftButtonsSource, leftPriorityPlusCache, leftNav, leftMaxWidth.value);
  updatePriorityPlus(rightButtonsSource, rightPriorityPlusCache, rightNav, rightMaxWidth.value);
})
watch(rightButtonsSource, () => {
  updatePriorityPlus(leftButtonsSource, leftPriorityPlusCache, leftNav, leftMaxWidth.value);
  updatePriorityPlus(rightButtonsSource, rightPriorityPlusCache, rightNav, rightMaxWidth.value);
})
onMounted(() => {
  updatePriorityPlus(leftButtonsSource, leftPriorityPlusCache, leftNav, leftMaxWidth.value);
  updatePriorityPlus(rightButtonsSource, rightPriorityPlusCache, rightNav, rightMaxWidth.value);
})
</script>

<style scoped lang="scss">
header {
  z-index: 10;
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
