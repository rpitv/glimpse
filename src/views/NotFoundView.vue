<template>
  <div>
    <StaticBackground />
    <div class="error">
      <FontAwesomeIcon icon="fa-duotone fa-hexagon-exclamation" class="icon error" />
    </div>
    <h1 class="error">404 Not Found</h1>
    <h3 class="error">This page does not exist</h3>
    <div class="error">
      <a @click="$router.back()">
        <v-btn color="#ff6363" elevation="24" class="back-button text-none">Go Back</v-btn>
      </a>
      <RouterLink to="/">
        <v-btn color="#ff6363" elevation="24" class="text-none">Go Home</v-btn>
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import StaticBackground from "@/components/StaticBackground.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {NResult, NButton} from "naive-ui";
</script>

<style scoped lang="scss">
div {
  padding-top: 8vh;
}
.icon {
  --fa-primary-color: #f4fbff;
  --fa-secondary-color: #ff6363;
  --fa-secondary-opacity: 1.0;
  font-size: 10em;
}
a {
  text-decoration: none;
}
.back-button {
  margin-right: 10px;
}
.error-wrapper {
  padding-top: 15vh;
}
.error {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
