<template>
<div>
  <StaticBackground />
  <n-result
    status="404"
    title="404 Not Found"
    description="This page does not exist."
    size="huge"
  >
    <template #icon>
      <FontAwesomeIcon :icon="['fad', 'hexagon-exclamation']" class="icon" />
    </template>
    <template #footer>
      <a @click="$router.back()">
        <n-button class="back-button">Go Back</n-button>
      </a>
      <RouterLink to="/">
        <n-button>Go Home</n-button>
      </RouterLink>
    </template>
  </n-result>
</div>
</template>

<script setup lang="ts">
import StaticBackground from "@/components/StaticBackground.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {NResult, NButton} from "naive-ui";
</script>

<style scoped lang="scss">
.icon {
  --fa-primary-color: #f4fbff;
  --fa-secondary-color: #ff6363;
  --fa-secondary-opacity: 1.0;
  font-size: 10em;
}
div {
  padding-top: 5vw;
}
a {
  text-decoration: none;
}
.back-button {
  margin-right: 10px;
}
</style>
