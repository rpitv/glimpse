<template>
  <n-config-provider :theme="darkTheme" :theme-overrides="theme">
    <n-message-provider placement="bottom">
      <component :is="layout">
        <div class="mobile-navbar-padding">
          <RouterView />
        </div>
      </component>
    </n-message-provider>
  </n-config-provider>
</template>

<script lang="ts">
import { defineComponent, markRaw } from "vue";
import WaveBackground from "./layouts/WaveBackground.vue";
import { NMessageProvider, NConfigProvider, darkTheme } from "naive-ui";

export default defineComponent({
  name: "App",
  data: () => {
    return {
      layout: markRaw(WaveBackground),
      darkTheme,
      theme: {
        Menu: {
          itemTextColorHoverHorizontal: "#E77F7FFF",
          itemIconColorHoverHorizontal: "#E77F7FFF",
          itemColorActiveInverted: "rgba(148, 42, 42, 1)",
          itemColorActiveHoverInverted: "rgba(148, 42, 42, 1)",
          itemColorActiveCollapsedInverted: "rgba(148, 42, 42, 1)",
        },
        common: {
          primaryColor: "#E26363FF",
          primaryColorHover: "#E77F7FFF",
          primaryColorPressed: "#CE5A5AFF",
          primaryColorSuppl: "rgba(148, 42, 42, 1)",
          errorColor: "#E88080FF",
        },
        Alert: {
          colorSuccess: "rgba(148, 42, 42, 0.25)",
          iconColorSuccess: "rgba(148, 42, 42, 1)",
        },
        Progress: {
          iconColor: "#70c0e8",
        },
      },
    };
  },
  watch: {
    $route(val: any): void {
      try {
        this.layout = markRaw(val.meta.layout);
      } catch (e) {
        console.error("Error!");
      }
    },
  },
  components: {
    NMessageProvider,
    NConfigProvider,
  },
});
</script>

<style lang="scss">
@import "./assets/base.css";

// On mobile displays, the navbar is at the bottom of the page
@media (max-width: 499px) {
  .mobile-navbar-padding {
    padding-bottom: 6em;
  }
}
</style>

<style scoped lang="scss"></style>
