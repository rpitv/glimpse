<template>
  <n-config-provider :theme="darkTheme" :theme-overrides="theme">
    <n-message-provider placement="bottom">
      <!-- Background -->
      <div class="background" />
      <BackgroundShape :class="layoutCssName + ' layout background-shape'" />

      <!-- Navbar -->
      <NavigationHeader />

      <!-- Logo -->
      <div class="main-logo-wrapper">
        <img :class="layoutCssName + ' layout main-logo'" alt="RPI TV logo" src="@/assets/rpitv_logo.svg" />
      </div>

      <!-- Page content -->
      <div :class="layoutCssName + ' layout content'">
        <RouterView v-slot="{ Component, route }">
          <Transition name="router">
            <div class="router-page" :key="route.name">
              <component :is="Component" />
            </div>
          </Transition>
        </RouterView>
      </div>

    </n-message-provider>
  </n-config-provider>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import NavigationHeader from "./components/NavigationHeader.vue";
import BackgroundShape from "./components/BackgroundShape.vue";
import { NMessageProvider, NConfigProvider, darkTheme } from "naive-ui";

export default defineComponent({
  name: "App",
  data: () => {
    return {
      layoutCssName: "wave-layout",
      darkTheme,
      theme: {
        Menu: {
          itemTextColorHoverHorizontal: "#E77F7FFF",
          itemIconColorHoverHorizontal: "#E77F7FFF",
          itemColorActiveInverted: "rgba(148, 42, 42, 1)",
          itemColorActiveHoverInverted: "rgba(148, 42, 42, 1)",
          itemColorActiveCollapsedInverted: "rgba(148, 42, 42, 1)"
        },
        common: {
          primaryColor: "#E26363FF",
          primaryColorHover: "#E77F7FFF",
          primaryColorPressed: "#CE5A5AFF",
          primaryColorSuppl: "rgba(148, 42, 42, 1)",
          errorColor: "#E88080FF"
        },
        Alert: {
          colorSuccess: "rgba(148, 42, 42, 0.25)",
          iconColorSuccess: "rgba(148, 42, 42, 1)"
        },
        Progress: {
          iconColor: "#70c0e8"
        }
      }
    };
  },
  watch: {
    $route(val: any): void {
      try {
        this.layoutCssName = val.meta.layoutCssName;
      } catch (e) {
        console.error("Error!");
      }
    }
  },
  components: {
    NMessageProvider,
    NConfigProvider,
    NavigationHeader,
    BackgroundShape
  }
});
</script>

<style lang="scss">
@import "./assets/base.css";
</style>

<style scoped lang="scss">
// Imported layouts are expected to restrict their styles to their layout class
@import './assets/plain-layout.css';
@import './assets/wave-layout.css';

// Router transition. Animates switching between pages
.router-enter-from, .router-leave-to {
  opacity: 0;
}

.router-enter-active, .router-leave-active {
  transition: all 0.3s ease;
}

.router-enter-to, .router-leave-from {
  opacity: 1;
}
// End router transition

// Router page content must be positioned absolutely in order for the transition
// to work. Width 100% since this would otherwise throw off positioning via
// margins.
.router-page {
  position: absolute;
  width: 100%;
  // On mobile displays, the navbar is at the bottom of the page
  @media (max-width: 499px) {
    padding-bottom: 6em;
  }
}


// Animate all layout changes at 0.3s ease.
// I.e., whenever the layout changes from "plain" to "wave" or vice versa.
.layout {
  transition: all 0.3s ease;
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
