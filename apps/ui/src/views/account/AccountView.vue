<template>
<div class="full-container mb-10 mt-3" style="min-height: max(40vh, 680px); padding-top: 2rem">
  <v-layout>
    <v-navigation-drawer absolute expand-on-hover :rail="$vuetify.display.smAndDown" permanent style="z-index: 1; min-height: max(40vh, 680px)">
      <v-list density="compact" nav>
        <v-list-item
          title="Settings"
          prepend-icon="fa-light fa-gear"
          to="settings"
        />
        <v-list-item
          title="Profile"
          prepend-icon="fa-light fa-address-card"
          to="profile"
        />
      </v-list>
    </v-navigation-drawer>


    <v-main scrollable style=" min-height: max(40vh, 680px)">
      <v-card class="w-100 pa-10 pt-5" style="overflow-x: auto; min-height: max(40vh, 680px)">
        <router-view v-slot="{ Component }">
          <div style="min-width: 200px">
            <component :is="Component" />
          </div>
        </router-view>
      </v-card>
    </v-main>
  </v-layout>
</div>
</template>

<script setup lang="ts">
  import router from "@/router";

  if(router.currentRoute.value.name === "account") {
    router.replace({name: 'account-settings'})
  }
</script>

<style scoped lang="scss">
</style>
