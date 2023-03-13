<template>
  <div class="dashboard-breadcrumb">
    <n-breadcrumb>
      <n-breadcrumb-item v-for="item of nBreadcrumbItems" :key="getName(item)" separator="»">
        <RouterLink v-if="item.route" :to="item.route" class="breadcrumb-item-link">
          {{getName(item)}}
        </RouterLink>
        <span v-else>{{getName(item)}}</span>
      </n-breadcrumb-item>
      <span class="last-breadcrumb-item">{{getName(route[route.length - 1])}}</span>
    </n-breadcrumb>

  </div>
</template>

<script setup lang="ts">
import {NBreadcrumb, NBreadcrumbItem} from "naive-ui";
import type {PropType} from "vue";
import {computed} from "vue";
import { RouteLocationNormalizedLoaded, RouteLocationRaw, RouterLink, useRoute } from "vue-router";

const routerRoute = useRoute();

const props = defineProps({
  route: {
    type: Object as PropType<{name: string | ((route: RouteLocationNormalizedLoaded) => string), route?: RouteLocationRaw}[]>,
    required: true
  }
})

function getName(breadcrumb: { name: string | ((route: RouteLocationNormalizedLoaded) => string) }) {
  if (typeof breadcrumb?.name === "function") {
    return breadcrumb.name(routerRoute);
  }
  return breadcrumb?.name || "";
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
