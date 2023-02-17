<template>
  <!-- Background -->
  <div class="background"/>
  <div v-if="topLevelError !== null">
    <ServerErrorView :error="topLevelError" />
  </div>
  <div v-else>
    <BackgroundShape :class="layoutCssName + ' layout background-shape'"/>

    <!-- Navbar -->
    <NavigationHeader/>

    <!-- Logo -->
    <div class="main-logo-wrapper">
      <img :class="layoutCssName + ' layout main-logo'" :data-scroll="scrollY"
           alt="RPI TV logo" src="@/assets/rpitv_logo.svg"/>
    </div>

    <!-- Page content -->
    <div :class="layoutCssName + ' layout content'">
      <RouterView v-slot="{ Component, route }">
        <Transition name="router">
          <div :class="layoutCssName + ' layout router-page'" :key="route.name">
            <div v-if="maintenanceMode && !authStore.isLoggedIn">
              <MaintenanceView />
            </div>
            <div v-else>
              <component :is="Component"/>
            </div>
            <Footer/>
          </div>
        </Transition>
      </RouterView>
    </div>
  </div>
</template>

<script setup lang="ts">

import NavigationHeader from "@/components/NavigationHeader.vue";
import BackgroundShape from "@/components/BackgroundShape.vue";
import Footer from "@/components/Footer.vue";
import {onMounted, onUnmounted, ref, watch} from "vue";
import {useLoadingBar, useMessage} from "naive-ui";
import {useRoute} from "vue-router";
import {useAuthStore} from "@/stores/auth";
import ServerErrorView from "@/views/ServerErrorView.vue";
import MaintenanceView from "@/views/MaintenanceView.vue";

const route = useRoute();
const message = useMessage();
const authStore = useAuthStore();

const topLevelError = ref<Error | null>(null);
const maintenanceMode = ref<boolean>(false);

try {
// Fetch identity and permissions from server
  const ownId = await authStore.getOwnId();
  if (typeof ownId === "number") {
    authStore.isLoggedIn = true;
  }
  await authStore.getPermissions();
} catch(e: any) {
  if(e instanceof Error) {
    topLevelError.value = e;
  } else {
    topLevelError.value = new Error(e);
  }
  console.error(topLevelError.value);
}


// Listen for scrolling to update the logo size
const scrollY = ref(window.scrollY);

function updateScroll() {
  scrollY.value = window.scrollY;
}

onMounted(() => window.addEventListener("scroll", updateScroll));
onUnmounted(() => window.removeEventListener("scroll", updateScroll));

const loadingBar = useLoadingBar();
// Listen to all fetch calls for the loading bar
// https://stackoverflow.com/questions/38995750/how-to-listen-on-all-fetch-api-calls
let pendingFetches = 0;
(function (ns, fetch) {
  if (typeof fetch !== "function") {
    return;
  }
  ns.fetch = function () {
    // @ts-ignore
    const out = fetch.apply(this, arguments);

    if (pendingFetches++ === 0) {
      loadingBar.start();
    }
    out
      .then(() => {
        if (--pendingFetches === 0) {
          loadingBar.finish()
        }
      })
      .catch((e: Error) => {
        loadingBar.error();
        // Send an error message to the user
        message.error("Network error: " + e.message);
      });

    return out;
  };

}(window, window.fetch));

// Watch for page layout CSS class to change on the router
let layoutCssName = ref(route.meta.layoutCssName);
watch(() => route.meta.layoutCssName,
  (): void => {
    try {
      layoutCssName.value = <string>route.meta.layoutCssName;
    } catch (e) {
      console.error(e);
    }
  });
</script>

<style scoped lang="scss">
// Imported layouts are expected to restrict their styles to their layout class
@import './assets/plain-layout.css';
@import './assets/wave-layout.css';

// Router transition. Animates switching between pages
.router-enter-from, .router-leave-to {
  opacity: 0;
}

@media(prefers-reduced-motion: no-preference) {
  .router-enter-active, .router-leave-active {
    transition: all 0.3s ease;
  }
}

.router-enter-to, .router-leave-from {
  opacity: 1;
}

// End router transition

// Router page content must be positioned absolutely in order for the transition
// to work. Width 100% since this would otherwise throw off positioning via
// margins.
.router-page {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: absolute;
  width: 100%;
  // On mobile displays, the navbar is at the bottom of the page
  @media (max-width: 499px) {
    padding-bottom: 5em;
  }
}


// Animate all layout changes at 0.3s ease.
// I.e., whenever the layout changes from "plain" to "wave" or vice versa.

@media(prefers-reduced-motion: no-preference) {
  .layout {
    transition: all 0.3s ease;
  }
}

// Backgroud gradient
.background {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  z-index: -1;
  background: linear-gradient(#21292f, #0c0f12) !important;
}

.main-logo-wrapper {
  display: flex;
  justify-content: center;
}

.main-logo {
  position: fixed;
  z-index: 2;
  pointer-events: none;
}

/* Phone displays */
@media (max-width: 499px) {
  /* Move image to the center top of the screen */
  .main-logo {
    position: absolute;
    top: 0;
    margin: 0;
    height: 25vw;
  }
}

/* Tablet displays */
@media (min-width: 500px) and (max-width: 799px) {
  /* Move logo to top left of nav */
  .main-logo {
    height: 4em;
    margin-left: 0.5em;
    left: 0;
  }
}

/* Computer displays */
@media (min-width: 800px) {
  .main-logo.plain-layout {
    filter: drop-shadow(0.3em 0.3em 0.3em #00000090);
  }
}
</style>
