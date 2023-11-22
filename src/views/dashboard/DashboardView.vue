<template>
  <div class="dashboard-view">
    <n-card>

      <n-layout has-sider>
        <n-layout-sider

          bordered
          collapse-mode="width"
          :collapsed-width="64"
          :width="240"
          :collapsed="menuCollapsed"
          show-trigger
          @collapse="menuCollapsed = true"
          @expand="menuCollapsed = false"
          >
            <n-menu
              :options="menuOptions"
              @update:value="menuOptionClicked"
            />
        </n-layout-sider>
        <n-layout class="page-content">
          <DashboardBreadcrumb :route="breadcrumbRoute"/>
          <router-view v-slot="{ Component }">
            <component :is="Component" />
          </router-view>
        </n-layout>
      </n-layout>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { NCard, NMenu, NLayout, NLayoutSider } from "naive-ui";
import type { MenuOption } from "naive-ui";
import { computed, h, ref } from "vue";
import { RouteRecordRaw, RouterLink, useRoute, useRouter } from "vue-router";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { DashboardPageCategory, DashboardPageMetadata } from "@/util";
import DashboardBreadcrumb from "@/components/dashboard/DashboardBreadcrumb.vue";

const route = useRoute();
const router = useRouter();

const categoryOrder = [
  DashboardPageCategory.Content,
  DashboardPageCategory.Organization,
  DashboardPageCategory.Admin
];

function generateOptionComponent(route: RouteRecordRaw) {
  const routeMeta = route.meta?.sider as DashboardPageMetadata;

  let toRouteName = route.name;
  if(route.children && route.children?.length > 0) {
    const emptyPathChild = route.children.find(c => c.path === "");
    if(emptyPathChild) {
      toRouteName = emptyPathChild.name;
    }
  }

  return {
    label: () => {
      return h(
        RouterLink,
        { to: { name: toRouteName } },
        {
          default: () => routeMeta.title ?? toRouteName
        }
      )
    },
    key: `${String(toRouteName)}`,
    icon: () => {
      return h(FontAwesomeIcon, { icon: routeMeta.icon })
    }
  }
}

const menuOptions = computed<MenuOption[]>(() => {
  const childrenRoutes = router.getRoutes().find(r => r.name === "dashboard-parent")?.children;
  if(!childrenRoutes) {
    return [];
  }

  const categories: Map<DashboardPageCategory, MenuOption[]> = new Map();

  for(const route of childrenRoutes) {
    const routeMeta: DashboardPageMetadata = route.meta?.sider as any ?? {};

    if(!routeMeta.visible?.()) {
      continue;
    }

    const category = routeMeta.category ?? DashboardPageCategory.Organization;
    const categoryEntries = categories.get(category);
    if(categoryEntries) {
      categoryEntries.push(generateOptionComponent(route));
    } else {
      categories.set(category, [generateOptionComponent(route)]);
    }
  }

  const options: MenuOption[] = [];

  for(let i = 0; i < categoryOrder.length; i++) {
    const categoryName = categoryOrder[i];
    const nextCategoryName = categoryOrder[i + 1];
    const categoryOptions = categories.get(categoryName);
    if(categoryOptions) {
      options.push(...categoryOptions);

      if(categoryOptions.length && categories.get(nextCategoryName)?.length ) {
        options.push({
          key: `divider:${categoryName}:${nextCategoryName}`,
          type: 'divider'
        })
      }
    }
  }

  return options;
});

const breadcrumbRoute = computed(() => {
  const breadcrumb = route.meta?.breadcrumb;
  if(typeof breadcrumb === "function") {
    return breadcrumb(route);
  } else if(typeof breadcrumb === "string") {
    return breadcrumb;
  }
})

function menuOptionClicked(key: string) {
  if(key.includes("divider")) {
    return;
  }
  const route = key.split(':').pop();
  if(!route) {
    return;
  }
  router.push({ name: key });
}

const menuCollapsed = ref<boolean>(true);
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
