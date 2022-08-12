<template>
  <div class="dashboard-breadcrumb">
    <n-breadcrumb>
      <n-breadcrumb-item v-for="item of nBreadcrumbItems" :key="item.name" separator="»">
        <RouterLink :to="item.route" class="breadcrumb-item-link">
          {{item.name}}
        </RouterLink>
      </n-breadcrumb-item>
      <span class="last-breadcrumb-item">{{route[route.length - 1].name}}</span>
    </n-breadcrumb>

  </div>
</template>

<script setup lang="ts">
import {NBreadcrumb, NBreadcrumbItem} from "naive-ui";
import type {PropType} from "vue";
import {computed} from "vue";
import {RouterLink} from "vue-router";

const props = defineProps({
  route: {
    type: Object as PropType<{name: string, route: string}[]>,
    required: true
  }
})

if(props.route.length <= 0) {
  throw new Error("Invalid usage of DashboardBreadcrumb: at least one element is required.");
}

const nBreadcrumbItems = computed(() => {
  const routeCopy = [...props.route];
  routeCopy.pop();
  return routeCopy;
})
</script>

<style scoped lang="scss">
.dashboard-breadcrumb {
  margin-bottom: 25px;
}
.last-breadcrumb-item {
  font-size: 2em;
  position: relative;
  top: 0.2em;
}
.breadcrumb-item-link {
  color: inherit;
}
</style>
