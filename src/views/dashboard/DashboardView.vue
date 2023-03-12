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
          <div v-if="!route.params.page">
            <DashboardComingSoon/>
          </div>
          <Transition v-else name="page">
            <component :is="selectedPage?.component ? selectedPage.component : NotFoundView" />
          </Transition>
        </n-layout>
      </n-layout>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { NCard, NMenu, NLayout, NLayoutSider } from "naive-ui";
import type { MenuOption } from "naive-ui";
import {
  canViewAssetsDashboard,
  canViewBlogPostsDashboard,
  canViewCategoriesDashboard,
  canViewContactSubmissionsDashboard,
  canViewGroupsDashboard,
  canViewImagesDashboard,
  canViewLogsDashboard,
  canViewPeopleDashboard,
  canViewProductionsDashboard,
  canViewRedirectsDashboard,
  canViewStreamDashboard,
  canViewUsersDashboard,
  canViewVideosDashboard,
  canViewVotesDashboard
} from "@/casl";
import { computed, h, ref } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import DashboardAssetsPage from "@/components/dashboard/DashboardAssetsPage.vue";
import DashboardBlogPostsPage from "@/components/dashboard/DashboardBlogPostsPage.vue";
import DashboardCategoriesPage from "@/components/dashboard/DashboardCategoriesPage.vue";
import DashboardContactSubmissionsPage from "@/components/dashboard/DashboardContactSubmissionsPage.vue";
import DashboardGroupsPage from "@/components/dashboard/DashboardGroupsPage.vue";
import DashboardImagesPage from "@/components/dashboard/DashboardImagesPage.vue";
import DashboardLogsPage from "@/components/dashboard/DashboardLogsPage.vue";
import DashboardPeoplePage from "@/components/dashboard/DashboardPeoplePage.vue";
import DashboardProductionsPage from "@/components/dashboard/DashboardProductionsPage.vue";
import DashboardRedirectsPage from "@/components/dashboard/DashboardRedirectsPage.vue";
import DashboardStreamPage from "@/components/dashboard/DashboardStreamPage.vue";
import DashboardUsersPage from "@/components/dashboard/DashboardUsersPage.vue";
import DashboardVideosPage from "@/components/dashboard/DashboardVideosPage.vue";
import DashboardVotesPage from "@/components/dashboard/DashboardVotesPage.vue";
import DashboardBreadcrumb from "@/components/DashboardBreadcrumb.vue";
import DashboardComingSoon from "@/components/dashboard/DashboardComingSoon.vue";
import NotFoundView from "@/views/NotFoundView.vue";

const route = useRoute();
const router = useRouter();

enum PageCategory {
  Content = 'Content',
  Organization = 'Organization',
  Admin = 'Admin'
}

const categoryOrder = [
  PageCategory.Content,
  PageCategory.Organization,
  PageCategory.Admin
];

const pages = [
  {
    name: 'Assets',
    route: 'assets',
    icon: 'fa-light fa-box-open-full',
    category: PageCategory.Organization,
    component: DashboardAssetsPage,
    visible: canViewAssetsDashboard
  },
  {
    name: 'Blog Posts',
    route: 'blog-posts',
    icon: 'fa-light fa-newspaper',
    category: PageCategory.Content,
    component: DashboardBlogPostsPage,
    visible: canViewBlogPostsDashboard
  },
  {
    name: 'Categories',
    route: 'categories',
    icon: 'fa-light fa-layer-group',
    category: PageCategory.Content,
    component: DashboardCategoriesPage,
    visible: canViewCategoriesDashboard
  },
  {
    name: 'Contact Submissions',
    route: 'contact-submissions',
    icon: 'fa-light fa-message-lines',
    category: PageCategory.Admin,
    component: DashboardContactSubmissionsPage,
    visible: canViewContactSubmissionsDashboard
  },
  {
    name: 'Groups',
    route: 'groups',
    icon: 'fa-light fa-users-line',
    category: PageCategory.Organization,
    component: DashboardGroupsPage,
    visible: canViewGroupsDashboard
  },
  {
    name: 'Images',
    route: 'images',
    icon: 'fa-light fa-images',
    category: PageCategory.Content,
    component: DashboardImagesPage,
    visible: canViewImagesDashboard
  },
  {
    name: 'Logs',
    route: 'logs',
    icon: 'fa-light fa-clipboard-list',
    category: PageCategory.Admin,
    component: DashboardLogsPage,
    visible: canViewLogsDashboard
  },
  {
    name: 'People',
    route: 'people',
    icon: 'fa-light fa-address-card',
    category: PageCategory.Organization,
    component: DashboardPeoplePage,
    visible: canViewPeopleDashboard
  },
  {
    name: 'Productions',
    route: 'productions',
    icon: 'fa-light fa-clapperboard',
    category: PageCategory.Content,
    component: DashboardProductionsPage,
    visible: canViewProductionsDashboard
  },
  {
    name: 'Redirects',
    route: 'redirects',
    icon: 'fa-light fa-signs-post',
    category: PageCategory.Admin,
    component: DashboardRedirectsPage,
    visible: canViewRedirectsDashboard
  },
  {
    name: 'Stream',
    route: 'stream',
    icon: 'fa-light fa-signal-stream',
    category: PageCategory.Content,
    component: DashboardStreamPage,
    visible: canViewStreamDashboard
  },
  {
    name: 'Users',
    route: 'users',
    icon: 'fa-light fa-user',
    category: PageCategory.Organization,
    component: DashboardUsersPage,
    visible: canViewUsersDashboard
  },
  {
    name: 'Videos',
    route: 'videos',
    icon: 'fa-light fa-video',
    category: PageCategory.Content,
    component: DashboardVideosPage,
    visible: canViewVideosDashboard
  },
  {
    name: 'Votes',
    route: 'votes',
    icon: 'fa-light fa-ballot-check',
    category: PageCategory.Organization,
    component: DashboardVotesPage,
    visible: canViewVotesDashboard
  }
]

const selectedPage = computed(() => {
  return pages.find(page => page.route === route.params.page);
})

const breadcrumbRoute = computed(() => {
  const breadcrumbs = [];
  breadcrumbs.push({
    name: 'Dashboard',
    route: {
      name: 'dashboard'
    }
  });
  if(selectedPage.value) {
    breadcrumbs.push({
      name: selectedPage.value.name,
      route: {
        name: 'dashboard',
        params: {
          page: selectedPage.value.route
        }
      }
    });
  }
  return breadcrumbs;
})

function generateOptionComponent(label: string, icon: string, page: string) {
  return {
    label: () => {
      return h(
        RouterLink,
        { to: { name: "dashboard", params: { page } } },
        {
          default: () => label
        }
      )
    },
    key: `${label}:${page}`,
    icon: () => {
      return h(FontAwesomeIcon, { icon })
    }
  }
}

const menuOptions = computed<MenuOption[]>(() => {

  const categories: Map<PageCategory, MenuOption[]> = new Map();

  for(const page of pages) {
    if(!page.visible()) {
      continue;
    }

    const category = categories.get(page.category);
    if(category) {
      category.push(generateOptionComponent(page.name, page.icon, page.route));
    } else {
      categories.set(page.category, [generateOptionComponent(page.name, page.icon, page.route)]);
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
})

function menuOptionClicked(key: string) {
  if(key.includes("divider")) {
    return;
  }
  const route = key.split(':').pop();
  router.push({ name: 'dashboard', params: { page: route } });
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

// Animation between pages using <Transition>
.page-enter-from {
  left: -100vw;
}

.page-enter-to, .page-leave-from {
  left: 0;
}


.page-leave-to {
  left: 100vw;
}

@media(prefers-reduced-motion: no-preference) {
  .page-enter-active, .page-leave-active {
    transition: all 0.3s ease;
    position: absolute;
    width: 100%;
  }
}

</style>
