<template>
  <n-config-provider :theme="darkTheme" :theme-overrides="theme">
    <n-loading-bar-provider>
      <n-message-provider placement="bottom">
        <Page />
      </n-message-provider>
    </n-loading-bar-provider>
  </n-config-provider>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Page from "./Page.vue";
import { NMessageProvider, NConfigProvider, NLoadingBarProvider, darkTheme } from "naive-ui";
import {useAuthStore} from "@/stores/auth";

export default defineComponent({
  name: "App",
  async mounted() {
    const authStore = useAuthStore();
    const ownId = await authStore.getOwnId();
    if(typeof ownId === "number") {
      authStore.isLoggedIn = true;
    }
    await authStore.getPermissions();
  },
  data: () => {
    return {
      layoutCssName: "wave-layout",
      darkTheme,
      scrollY: window.scrollY,
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
  components: {
    NMessageProvider,
    NConfigProvider,
    NLoadingBarProvider,
    Page
  }
});
</script>

<style lang="scss">
@import "./assets/base.css";
</style>
