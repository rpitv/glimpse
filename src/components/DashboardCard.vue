<template>
  <n-card class="dashboard-card">
    <RouterLink :to="{name: route}">
      <div class="dashboard-card-body">
        <FontAwesomeIcon :icon="icon" class="dashboard-card-icon"/>
        <p>{{name}}</p>
      </div>
    </RouterLink>
  </n-card>
</template>

<script setup lang="ts">
import {NCard} from "naive-ui";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import type {PropType} from "vue";
import type {FontAwesomeIconWeights} from "@/util/helper";
import {RouterLink} from "vue-router";

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  icon: {
    type: Object as PropType<[FontAwesomeIconWeights, string]>,
    required: true
  },
  route: {
    type: String,
    required: true
  }
})
</script>

<style scoped lang="scss">
.dashboard-card {
  width: 12rem;
}

.dashboard-card-body {
  text-align: center;
  font-size: 1.2rem;
  color: white;
}

.dashboard-card-icon {
  font-size: 4rem;
}
</style>
