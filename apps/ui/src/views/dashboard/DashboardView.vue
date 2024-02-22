<template>
  <div class="dashboard-view">
      <v-layout class="dashboard-vert-height">
        <v-navigation-drawer absolute expand-on-hover :rail="$vuetify.display.smAndDown" permanent style="z-index: 1">
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

        <v-main scrollable>
          <v-card class="w-100 pa-10 pt-5 dashboard-vert-height" style="overflow-x: auto;">
            <DashboardBreadcrumb :route="breadcrumbRoute"/>
            <router-view v-slot="{ Component }">
              <div style="min-width: 1000px">
              <component :is="Component" />
              </div>
            </router-view>
          </v-card>
        </v-main>
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

<style scoped lang="scss">
.dashboard-view {
  padding: 2rem;
}

.dashboard-vert-height {
  min-height: max(85vh, 680px);
}
</style>
