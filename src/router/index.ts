import { createRouter, createWebHistory } from "vue-router";

import HomeView from "../views/HomeView.vue";
import AboutView from "../views/AboutView.vue";
import ProductionsView from "../views/ProductionsView.vue";
import ContactView from "../views/ContactView.vue";
import LoginView from "../views/LoginView.vue";
import DonateView from "../views/DonateView.vue";
import JoinView from "../views/JoinView.vue";
import DashboardView from "../views/dashboard/DashboardView.vue";
import DashboardAssetsView from "../views/dashboard/DashboardAssetsView.vue";
import DashboardBlogPostsView from "../views/dashboard/DashboardBlogPostsView.vue";
import DashboardCategoriesView from "../views/dashboard/DashboardCategoriesView.vue";
import DashboardContactSubmissionsView from "../views/dashboard/DashboardContactSubmissionsView.vue";
import DashboardGroupsView from "../views/dashboard/DashboardGroupsView.vue";
import DashboardImagesView from "../views/dashboard/DashboardImagesView.vue";
import DashboardLogsView from "../views/dashboard/DashboardLogsView.vue";
import DashboardPeopleView from "../views/dashboard/DashboardPeopleView.vue";
import DashboardProductionsView from "../views/dashboard/DashboardProductionsView.vue";
import DashboardRedirectsView from "../views/dashboard/DashboardRedirectsView.vue";
import DashboardStreamView from "../views/dashboard/DashboardStreamView.vue";
import DashboardUsersView from "../views/dashboard/DashboardUsersView.vue";
import DashboardVideosView from "../views/dashboard/DashboardVideosView.vue";
import DashboardVotesView from "../views/dashboard/DashboardVotesView.vue";
import AccountView from "../views/AccountView.vue";
import NotFoundView from "../views/NotFoundView.vue";
import NoPermissionView from "../views/NoPermissionView.vue";
import {
  ability,
  canViewAssetsDashboard,
  canViewBlogPostsDashboard,
  canViewCategoriesDashboard,
  canViewContactSubmissionsDashboard,
  canViewDashboard,
  canViewGroupsDashboard,
  canViewImagesDashboard,
  canViewLogsDashboard,
  canViewPeopleDashboard,
  canViewProductionsDashboard,
  canViewRedirectsDashboard,
  canViewStreamDashboard,
  canViewUsersDashboard,
  canViewVideosDashboard,
  canViewVotesDashboard,
} from "@/casl";
import type { Component } from "vue";
import { h } from "vue";
import { AbilityActions, AbilitySubjects } from "@/graphql/types";

function restrictedComponent(
  component: Component,
  condition: () => boolean
): Component;
function restrictedComponent(
  component: Component,
  action: AbilityActions,
  subject: AbilitySubjects,
  field?: string
): Component;
function restrictedComponent(
  component: Component,
  action: AbilityActions | (() => boolean),
  subject?: AbilitySubjects,
  field?: string
): Component {
  if (typeof action === "function") {
    return {
      functional: true,
      render() {
        return action() ? h(component) : h(NoPermissionView);
      },
    };
  } else {
    if (subject === undefined) {
      throw new Error("subject is required when action is not a function");
    }
    return {
      functional: true,
      render() {
        return ability.can(action, subject, field)
          ? h(component)
          : h(NoPermissionView);
      },
    };
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0, behavior: "smooth" };
    }
  },
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
      meta: {
        layoutCssName: "wave-layout",
      },
    },
    {
      path: "/about",
      name: "about",
      component: AboutView,
      meta: {
        layoutCssName: "plain-layout",
      },
    },
    {
      path: "/productions",
      name: "productions",
      component: restrictedComponent(
        ProductionsView,
        AbilityActions.Read,
        AbilitySubjects.Production
      ),
      meta: {
        layoutCssName: "plain-layout",
      },
    },
    {
      path: "/productions",
      name: "productions",
      component: ProductionsView,
      meta: {
        layoutCssName: "plain-layout",
      },
    },
    {
      path: "/contact",
      name: "contact",
      component: restrictedComponent(
        ContactView,
        AbilityActions.Create,
        AbilitySubjects.ContactSubmission
      ),
      meta: {
        layoutCssName: "wave-layout",
      },
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
      meta: {
        layoutCssName: "wave-layout",
      },
    },
    {
      path: "/donate",
      name: "donate",
      component: DonateView,
      meta: {
        layoutCssName: "wave-layout",
      },
    },
    {
      path: "/join",
      name: "join",
      component: JoinView,
      meta: {
        layoutCssName: "wave-layout",
      },
    },
    {
      path: "/dashboard",
      name: "dashboard",
      component: restrictedComponent(
        DashboardView,
        () => canViewDashboard().value
      ),
      meta: {
        layoutCssName: "wave-layout",
      },
    },
    {
      path: "/dashboard/assets",
      name: "dashboardAssets",
      component: restrictedComponent(DashboardAssetsView, () =>
        canViewAssetsDashboard()
      ),
      meta: {
        layoutCssName: "plain-layout",
      },
    },
    {
      path: "/dashboard/blog",
      name: "dashboardBlogPosts",
      component: restrictedComponent(DashboardBlogPostsView, () =>
        canViewBlogPostsDashboard()
      ),
      meta: {
        layoutCssName: "plain-layout",
      },
    },
    {
      path: "/dashboard/categories",
      name: "dashboardCategories",
      component: restrictedComponent(DashboardCategoriesView, () =>
        canViewCategoriesDashboard()
      ),
      meta: {
        layoutCssName: "plain-layout",
      },
    },
    {
      path: "/dashboard/contact",
      name: "dashboardContactSubmissions",
      component: restrictedComponent(DashboardContactSubmissionsView, () =>
        canViewContactSubmissionsDashboard()
      ),
      meta: {
        layoutCssName: "plain-layout",
      },
    },
    {
      path: "/dashboard/groups",
      name: "dashboardGroups",
      component: restrictedComponent(DashboardGroupsView, () =>
        canViewGroupsDashboard()
      ),
      meta: {
        layoutCssName: "plain-layout",
      },
    },
    {
      path: "/dashboard/images",
      name: "dashboardImages",
      component: restrictedComponent(DashboardImagesView, () =>
        canViewImagesDashboard()
      ),
      meta: {
        layoutCssName: "plain-layout",
      },
    },
    {
      path: "/dashboard/logs",
      name: "dashboardLogs",
      component: restrictedComponent(DashboardLogsView, () =>
        canViewLogsDashboard()
      ),
      meta: {
        layoutCssName: "plain-layout",
      },
    },
    {
      path: "/dashboard/people",
      name: "dashboardPeople",
      component: restrictedComponent(DashboardPeopleView, () =>
        canViewPeopleDashboard()
      ),
      meta: {
        layoutCssName: "plain-layout",
      },
    },
    {
      path: "/dashboard/productions",
      name: "dashboardProductions",
      component: restrictedComponent(DashboardProductionsView, () =>
        canViewProductionsDashboard()
      ),
      meta: {
        layoutCssName: "plain-layout",
      },
    },
    {
      path: "/dashboard/redirects",
      name: "dashboardRedirects",
      component: restrictedComponent(DashboardRedirectsView, () =>
        canViewRedirectsDashboard()
      ),
      meta: {
        layoutCssName: "plain-layout",
      },
    },
    {
      path: "/dashboard/stream",
      name: "dashboardStream",
      component: restrictedComponent(DashboardStreamView, () =>
        canViewStreamDashboard()
      ),
      meta: {
        layoutCssName: "plain-layout",
      },
    },
    {
      path: "/dashboard/users",
      name: "dashboardUsers",
      component: restrictedComponent(DashboardUsersView, () =>
        canViewUsersDashboard()
      ),
      meta: {
        layoutCssName: "plain-layout",
      },
    },
    {
      path: "/dashboard/videos",
      name: "dashboardVideos",
      component: restrictedComponent(DashboardVideosView, () =>
        canViewVideosDashboard()
      ),
      meta: {
        layoutCssName: "plain-layout",
      },
    },
    {
      path: "/dashboard/votes",
      name: "dashboardVotes",
      component: restrictedComponent(DashboardVotesView, () =>
        canViewVotesDashboard()
      ),
      meta: {
        layoutCssName: "plain-layout",
      },
    },
    {
      path: "/account",
      name: "account",
      component: AccountView,
      meta: {
        layoutCssName: "wave-layout",
      },
    },
    {
      path: "/:pathMatch(.*)*",
      name: "404",
      component: NotFoundView,
      meta: {
        layoutCssName: "plain-layout",
      },
    },
  ],
});

export default router;
