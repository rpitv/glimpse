<template>
  <div class="dashboard-view">
      <v-layout style="min-height: 680px">
        <v-navigation-drawer absolute expand-on-hover rail>
          <v-list density="compact" nav>
            <v-list-item v-for="route of menuOptions.get(DashboardPageCategory.Content)"
                         :title="route.title"
                         :prepend-icon="route.icon"
                         :value="route.route"
                         @click="router.push({ name: route.route })"
            />
            <v-divider />
            <v-list-item v-for="route of menuOptions.get(DashboardPageCategory.Organization)"
                         :title="route.title"
                         :prepend-icon="route.icon"
                         :value="route.route"
                         @click="router.push({ name: route.route })"
            />
            <v-divider />
            <v-list-item v-for="route of menuOptions.get(DashboardPageCategory.Admin)"
                         :title="route.title"
                         :prepend-icon="route.icon"
                         :value="route.route"
                         @click="router.push({ name: route.route })"
            />
          </v-list>
        </v-navigation-drawer>

        <v-card class="w-100 ml-13 pa-10 pt-5">
        <v-card-title>
          <DashboardBreadcrumb :route="breadcrumbRoute"/>
        </v-card-title>

        <v-card-item>
          <router-view v-slot="{ Component }">
            <component :is="Component" />
          </router-view>
        </v-card-item>

        </v-card>
      </v-layout>
  </div>
</template>

<script setup lang="ts">
import {computed} from "vue";
import {useRoute, useRouter} from "vue-router";
import type { DashboardPageMetadata } from "@/util";
import {DashboardPageCategory} from "@/util";
import DashboardBreadcrumb from "@/components/dashboard/DashboardBreadcrumb.vue";

const route = useRoute();
const router = useRouter();

type MenuOption = { icon: string, title: string, route: string | symbol }
const menuOptions = computed<Map<DashboardPageCategory, MenuOption[]>>(() => {
  const childrenRoutes = router.getRoutes().find(r => r.name === "dashboard-parent")?.children ?? [];

  const groupedRoutesByCategory: Map<DashboardPageCategory, MenuOption[]> = new Map([
    [DashboardPageCategory.Content, []],
    [DashboardPageCategory.Organization, []],
    [DashboardPageCategory.Admin, []]
  ]);
  for(const route of childrenRoutes) {
    const routeMeta: DashboardPageMetadata = route.meta?.sider as any ?? {};

    if(!routeMeta.visible?.()) {
      continue;
    }

    let routeName = route.name;
    if(route.children && route.children?.length > 0) {
      const emptyPathChild = route.children.find(c => c.path === "");
      if(emptyPathChild) {
        routeName = emptyPathChild.name;
      }
    }

    if(!routeName) {
      throw new Error(`Dashboard navigation bar requires that all routes have a name, but one was missing from ${route}`)
    }

    const category = routeMeta.category ?? DashboardPageCategory.Organization;
    groupedRoutesByCategory.get(category)!.push({
      icon: routeMeta.icon ?? 'fas fa-question-mark',
      title: routeMeta.title ?? "Unknown",
      route: routeName
    });
  }

  return groupedRoutesByCategory
});

const breadcrumbRoute = computed(() => {
  const breadcrumb = route.meta?.breadcrumb;
  if(typeof breadcrumb === "function") {
    return breadcrumb(route);
  } else if(typeof breadcrumb === "string") {
    return breadcrumb;
  }
})
</script>

<style lang="scss">
// Hide scroll bar when transitioning between pages
.page-content div:has(> .page-leave-active) {
  overflow: hidden;
}
</style>

<style scoped lang="scss">
.dashboard-view {
  padding: 2rem;
}

.page-content {
  padding: 2rem;
}

</style>
