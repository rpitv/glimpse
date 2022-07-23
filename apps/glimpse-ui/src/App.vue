<template>
  <n-config-provider :theme="darkTheme" :theme-overrides="theme">
    <n-loading-bar-provider>
      <n-message-provider placement="bottom">
        <Suspense>
          <Page/>
          <template #fallback>
            <div class="glimpse-loading">
              <n-spin></n-spin>
              <p>Loading...</p>
            </div>
          </template>
        </Suspense>
      </n-message-provider>
    </n-loading-bar-provider>
  </n-config-provider>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import Page from "./Page.vue";
import {NMessageProvider, NConfigProvider, NLoadingBarProvider, darkTheme, NSpin} from "naive-ui";

export default defineComponent({
  name: "App",
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
    NSpin,
    Page
  }
});
</script>

<style lang="scss">
@import "./assets/base.css";

.glimpse-loading {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100vh;
}
</style>
