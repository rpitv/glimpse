import { createRouter, createWebHistory, RouterView } from "vue-router";
import type { RouteLocationNormalizedLoaded } from "vue-router";

import HomeView from "../views/HomeView.vue";
import AboutView from "../views/AboutView.vue";
import ProductionsView from "../views/ProductionsView.vue";
import ContactView from "../views/ContactView.vue";
import LoginView from "../views/LoginView.vue";
import DonateView from "../views/DonateView.vue";
import JoinView from "../views/JoinView.vue";
import DashboardView from "../views/dashboard/DashboardView.vue";
import DashboardAssetsPage from "../components/dashboard/DashboardAssetsPage.vue";
import DashboardBlogPostsPage from "../components/dashboard/DashboardBlogPostsPage.vue";
import DashboardCategoriesPage from "../components/dashboard/DashboardCategoriesPage.vue";
import DashboardContactSubmissionsPage from "../components/dashboard/DashboardContactSubmissionsPage.vue";
import DashboardGroupsPage from "../components/dashboard/DashboardGroupsPage.vue";
import DashboardImagesPage from "../components/dashboard/DashboardImagesPage.vue";
import DashboardLogsPage from "../components/dashboard/DashboardLogsPage.vue";
import DashboardPeoplePage from "../components/dashboard/DashboardPeoplePage.vue";
import DashboardProductionsPage from "../components/dashboard/DashboardProductionsPage.vue";
import DashboardRedirectsPage from "../components/dashboard/DashboardRedirectsPage.vue";
import DashboardStreamPage from "../components/dashboard/DashboardStreamPage.vue";
import DashboardUsersPage from "../components/dashboard/DashboardUsersPage.vue";
import DashboardVideosPage from "../components/dashboard/DashboardVideosPage.vue";
import DashboardVotesPage from "../components/dashboard/DashboardVotesPage.vue";
import AccountView from "../views/AccountView.vue";
import NotFoundView from "../views/NotFoundView.vue";
import NoPermissionView from "../views/NoPermissionView.vue";
import {
  ability,
  AbilityActions,
  canViewDashboard,
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
  canViewVotesDashboard,
  canViewRolesDashboard,
} from "@/casl";
import type { Component } from "vue";
import { h } from "vue";
import { AbilitySubjects } from "@/graphql/types";
import { DashboardPageCategory } from "@/util";
import DashboardComingSoon from "@/components/dashboard/DashboardComingSoon.vue";
import DashboardUserPage from "@/components/dashboard/DashboardUserPage.vue";
import UserList from "@/components/user/UserList.vue";
import DashboardEditUserPage from "@/components/dashboard/DashboardEditUserPage.vue";
import { useAuthStore } from "@/stores/auth";
import CreateUserCard from "@/components/user/CreateUserCard.vue";
import ChangePasswordCard from "@/components/user/ChangePasswordCard.vue";
import DashboardRolesPage from "@/components/dashboard/DashboardRolesPage.vue";
import GroupList from "@/components/group/GroupList.vue";
import CreateGroupCard from "@/components/group/CreateGroupCard.vue";
import EditGroupCard from "@/components/group/EditGroupCard.vue";
import RoleList from "@/components/role/RoleList.vue";
import EditRoleCard from "@/components/role/EditRoleCard.vue";
import CreateRoleCard from "@/components/role/CreateRoleCard.vue";

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
      name: "dashboard-parent",
      component: restrictedComponent(
        DashboardView,
        () => canViewDashboard().value
      ),
      meta: {
        layoutCssName: "plain-layout",
      },
      children: [
        {
          path: "",
          name: "dashboard",
          component: restrictedComponent(
            DashboardComingSoon,
            () => canViewDashboard().value
          ),
          meta: {
            breadcrumb: () => [
              { route: { name: "dashboard" }, name: "Dashboard" },
            ],
          },
        },
        {
          path: "assets",
          name: "dashboard-assets",
          component: restrictedComponent(DashboardAssetsPage, () =>
            canViewAssetsDashboard()
          ),
          meta: {
            sider: {
              title: "Assets",
              icon: "fa-light fa-box-open-full",
              category: DashboardPageCategory.Organization,
              visible: () => canViewAssetsDashboard(),
            },
            breadcrumb: () => [
              { route: { name: "dashboard" }, name: "Dashboard" },
              { route: { name: "dashboard-assets" }, name: "Assets" },
            ],
          },
        },
        {
          path: "blog-posts",
          name: "dashboard-blog-posts",
          component: restrictedComponent(DashboardBlogPostsPage, () =>
            canViewBlogPostsDashboard()
          ),
          meta: {
            sider: {
              title: "Blog Posts",
              icon: "fa-light fa-newspaper",
              category: DashboardPageCategory.Content,
              visible: () => canViewBlogPostsDashboard(),
            },
            breadcrumb: () => [
              { route: { name: "dashboard" }, name: "Dashboard" },
              { route: { name: "dashboard-blog-posts" }, name: "Blog Posts" },
            ],
          },
        },
        {
          path: "categories",
          name: "dashboard-categories",
          component: restrictedComponent(DashboardCategoriesPage, () =>
            canViewCategoriesDashboard()
          ),
          meta: {
            sider: {
              title: "Categories",
              icon: "fa-light fa-layer-group",
              category: DashboardPageCategory.Content,
              visible: () => canViewCategoriesDashboard(),
            },
            breadcrumb: () => [
              { route: { name: "dashboard" }, name: "Dashboard" },
              { route: { name: "dashboard-categories" }, name: "Categories" },
            ],
          },
        },
        {
          path: "contact-submissions",
          name: "dashboard-contact-submissions",
          component: restrictedComponent(DashboardContactSubmissionsPage, () =>
            canViewContactSubmissionsDashboard()
          ),
          meta: {
            sider: {
              title: "Contact Submissions",
              icon: "fa-light fa-message-lines",
              category: DashboardPageCategory.Admin,
              visible: () => canViewContactSubmissionsDashboard(),
            },
            breadcrumb: () => [
              { route: { name: "dashboard" }, name: "Dashboard" },
              {
                route: { name: "dashboard-contact-submissions" },
                title: "Contact Submissions",
              },
            ],
          },
        },
        {
          path: "groups",
          name: "dashboard-groups",
          component: restrictedComponent(DashboardGroupsPage, () =>
            canViewGroupsDashboard()
          ),
          meta: {
            sider: {
              title: "Groups",
              icon: "fa-light fa-users-line",
              category: DashboardPageCategory.Organization,
              visible: () => canViewGroupsDashboard(),
            },
            breadcrumb: () => [
              { route: { name: "dashboard" }, name: "Dashboard" },
              { route: { name: "dashboard-groups" }, name: "Groups" },
            ],
          },
          children: [
            {
              path: "",
              name: "dashboard-groups-list",
              component: restrictedComponent(GroupList, () =>
                canViewGroupsDashboard()
              ),
              meta: {
                breadcrumb: () => [
                  { route: { name: "dashboard" }, name: "Dashboard" },
                  { route: { name: "dashboard-groups-list" }, name: "Groups" },
                ],
              },
            },
            {
              path: ":id",
              name: "dashboard-group-parent",
              component: restrictedComponent(RouterView, () =>
                canViewGroupsDashboard()
              ),
              meta: {
                breadcrumb: (route: RouteLocationNormalizedLoaded) => [
                  { route: { name: "dashboard" }, name: "Dashboard" },
                  { route: { name: "dashboard-groups-list" }, name: "Groups" },
                  {
                    route: { name: "dashboard-group-details-edit" },
                    name: `Edit Group ${route.params.id}`,
                  },
                ],
              },
              children: [
                {
                  path: "edit",
                  name: "dashboard-group-details-edit",
                  component: restrictedComponent(EditGroupCard, () =>
                    canViewGroupsDashboard()
                  ),
                  props: (route) => ({
                    groupId: BigInt(route.params.id.toString()),
                  }),
                  meta: {
                    breadcrumb: (route: RouteLocationNormalizedLoaded) => [
                      { route: { name: "dashboard" }, name: "Dashboard" },
                      {
                        route: { name: "dashboard-groups-list" },
                        name: "Groups",
                      },
                      {
                        route: { name: "dashboard-group-details-edit" },
                        name: `Edit Group ${route.params.id}`,
                      },
                    ],
                  },
                },
              ],
            },
            {
              path: "create",
              name: "dashboard-group-create",
              component: restrictedComponent(CreateGroupCard, () =>
                canViewGroupsDashboard()
              ),
              meta: {
                breadcrumb: () => [
                  { route: { name: "dashboard" }, name: "Dashboard" },
                  { route: { name: "dashboard-groups-list" }, name: "Groups" },
                  {
                    route: { name: "dashboard-group-create" },
                    name: "Create",
                  },
                ],
              },
            },
          ],
        },
        {
          path: "images",
          name: "dashboard-images",
          component: restrictedComponent(DashboardImagesPage, () =>
            canViewImagesDashboard()
          ),
          meta: {
            sider: {
              title: "Images",
              icon: "fa-light fa-images",
              category: DashboardPageCategory.Content,
              visible: () => canViewImagesDashboard(),
            },
            breadcrumb: () => [
              { route: { name: "dashboard" }, name: "Dashboard" },
              { route: { name: "dashboard-images" }, name: "Images" },
            ],
          },
        },
        {
          path: "logs",
          name: "dashboard-logs",
          component: restrictedComponent(DashboardLogsPage, () =>
            canViewLogsDashboard()
          ),
          meta: {
            sider: {
              title: "Logs",
              icon: "fa-light fa-clipboard-list",
              category: DashboardPageCategory.Admin,
              visible: () => canViewLogsDashboard(),
            },
            breadcrumb: () => [
              { route: { name: "dashboard" }, name: "Dashboard" },
              { route: { name: "dashboard-logs" }, name: "Logs" },
            ],
          },
        },
        {
          path: "people",
          name: "dashboard-people",
          component: restrictedComponent(DashboardPeoplePage, () =>
            canViewPeopleDashboard()
          ),
          meta: {
            sider: {
              title: "People",
              icon: "fa-light fa-address-card",
              category: DashboardPageCategory.Organization,
              visible: () => canViewPeopleDashboard(),
            },
            breadcrumb: () => [
              { route: { name: "dashboard" }, name: "Dashboard" },
              { route: { name: "dashboard-people" }, name: "People" },
            ],
          },
        },
        {
          path: "productions",
          name: "dashboard-productions",
          component: restrictedComponent(DashboardProductionsPage, () =>
            canViewProductionsDashboard()
          ),
          meta: {
            sider: {
              title: "Productions",
              icon: "fa-light fa-clapperboard",
              category: DashboardPageCategory.Content,
              visible: () => canViewProductionsDashboard(),
            },
            breadcrumb: () => [
              { route: { name: "dashboard" }, name: "Dashboard" },
              {
                route: { name: "dashboard-productions" },
                title: "Productions",
              },
            ],
          },
        },
        {
          path: "redirects",
          name: "dashboard-redirects",
          component: restrictedComponent(DashboardRedirectsPage, () =>
            canViewRedirectsDashboard()
          ),
          meta: {
            sider: {
              title: "Redirects",
              icon: "fa-light fa-signs-post",
              category: DashboardPageCategory.Admin,
              visible: () => canViewRedirectsDashboard(),
            },
            breadcrumb: () => [
              { route: { name: "dashboard" }, name: "Dashboard" },
              { route: { name: "dashboard-redirects" }, name: "Redirects" },
            ],
          },
        },
        {
          path: "roles",
          name: "dashboard-roles",
          component: restrictedComponent(DashboardRolesPage, () =>
            canViewRolesDashboard()
          ),
          meta: {
            sider: {
              title: "Roles",
              icon: "fa-light fa-badge-sheriff",
              category: DashboardPageCategory.Organization,
              visible: () => canViewRolesDashboard(),
            },
            breadcrumb: () => [
              { route: { name: "dashboard" }, name: "Dashboard" },
              { route: { name: "dashboard-roles" }, name: "Roles" },
            ],
          },
          children: [
            {
              path: "",
              name: "dashboard-roles-list",
              component: restrictedComponent(RoleList, () =>
                canViewRolesDashboard()
              ),
              meta: {
                breadcrumb: () => [
                  { route: { name: "dashboard" }, name: "Dashboard" },
                  { route: { name: "dashboard-roles-list" }, name: "Roles" },
                ],
              },
            },
            {
              path: ":id",
              name: "dashboard-role-parent",
              component: restrictedComponent(RouterView, () =>
                canViewRolesDashboard()
              ),
              meta: {
                breadcrumb: (route: RouteLocationNormalizedLoaded) => [
                  { route: { name: "dashboard" }, name: "Dashboard" },
                  { route: { name: "dashboard-roles-list" }, name: "Roles" },
                  {
                    route: { name: "dashboard-role-details-edit" },
                    name: `Edit Role ${route.params.id}`,
                  },
                ],
              },
              children: [
                {
                  path: "edit",
                  name: "dashboard-role-details-edit",
                  component: restrictedComponent(EditRoleCard, () =>
                    canViewRolesDashboard()
                  ),
                  props: (route) => ({
                    roleId: BigInt(route.params.id.toString()),
                  }),
                  meta: {
                    breadcrumb: (route: RouteLocationNormalizedLoaded) => [
                      { route: { name: "dashboard" }, name: "Dashboard" },
                      {
                        route: { name: "dashboard-role-list" },
                        name: "Roles",
                      },
                      {
                        route: { name: "dashboard-role-details-edit" },
                        name: `Edit Role ${route.params.id}`,
                      },
                    ],
                  },
                },
              ],
            },
            {
              path: "create",
              name: "dashboard-role-create",
              component: restrictedComponent(CreateRoleCard, () =>
                canViewRolesDashboard()
              ),
              meta: {
                breadcrumb: () => [
                  { route: { name: "dashboard" }, name: "Dashboard" },
                  { route: { name: "dashboard-roles-list" }, name: "Roles" },
                  {
                    route: { name: "dashboard-role-create" },
                    name: "Create",
                  },
                ],
              },
            },
          ],
        },
        {
          path: "stream",
          name: "dashboard-stream",
          component: restrictedComponent(DashboardStreamPage, () =>
            canViewStreamDashboard()
          ),
          meta: {
            sider: {
              title: "Stream",
              icon: "fa-light fa-signal-stream",
              category: DashboardPageCategory.Content,
              visible: () => canViewStreamDashboard(),
            },
            breadcrumb: () => [
              { route: { name: "dashboard" }, name: "Dashboard" },
              { route: { name: "dashboard-stream" }, name: "Stream" },
            ],
          },
        },
        {
          path: "users",
          name: "dashboard-users",
          component: restrictedComponent(DashboardUsersPage, () =>
            canViewUsersDashboard()
          ),
          meta: {
            sider: {
              title: "Users",
              icon: "fa-light fa-user",
              category: DashboardPageCategory.Organization,
              visible: () => canViewUsersDashboard(),
            },
            breadcrumb: () => [
              { route: { name: "dashboard" }, name: "Dashboard" },
              { route: { name: "dashboard-users-list" }, name: "Users" },
            ],
          },
          children: [
            {
              path: "",
              name: "dashboard-users-list",
              component: restrictedComponent(UserList, () =>
                canViewUsersDashboard()
              ),
              meta: {
                breadcrumb: () => [
                  { route: { name: "dashboard" }, name: "Dashboard" },
                  { route: { name: "dashboard-users-list" }, name: "Users" },
                ],
              },
            },
            {
              path: "create",
              name: "dashboard-user-create",
              component: restrictedComponent(
                h(CreateUserCard, {
                  onSave: (id: string) =>
                    router.push({
                      name: "dashboard-user-details",
                      params: { id },
                    }),
                }),
                () => canViewUsersDashboard()
              ),
              meta: {
                breadcrumb: () => [
                  { route: { name: "dashboard" }, name: "Dashboard" },
                  { route: { name: "dashboard-users-list" }, name: "Users" },
                  { route: { name: "dashboard-user-create" }, name: "Create" },
                ],
              },
            },
            {
              path: ":id",
              name: "dashboard-user-parent",
              component: restrictedComponent(RouterView, () =>
                canViewUsersDashboard()
              ),
              meta: {
                breadcrumb: (route: RouteLocationNormalizedLoaded) => [
                  { route: { name: "dashboard" }, name: "Dashboard" },
                  { route: { name: "dashboard-users-list" }, name: "Users" },
                  {
                    route: { name: "dashboard-user-details" },
                    name: `User ${route.params.id}`,
                  },
                ],
              },
              children: [
                {
                  path: "",
                  name: "dashboard-user-details",
                  component: restrictedComponent(DashboardUserPage, () =>
                    canViewUsersDashboard()
                  ),
                  meta: {
                    breadcrumb: (route: RouteLocationNormalizedLoaded) => [
                      { route: { name: "dashboard" }, name: "Dashboard" },
                      {
                        route: { name: "dashboard-users-list" },
                        name: "Users",
                      },
                      {
                        route: { name: "dashboard-user-details" },
                        name: `User ${route.params.id}`,
                      },
                    ],
                  },
                },
                {
                  path: "edit",
                  name: "dashboard-user-details-edit",
                  component: restrictedComponent(DashboardEditUserPage, () =>
                    canViewUsersDashboard()
                  ),
                  meta: {
                    breadcrumb: (route: RouteLocationNormalizedLoaded) => [
                      { route: { name: "dashboard" }, name: "Dashboard" },
                      {
                        route: { name: "dashboard-users-list" },
                        name: "Users",
                      },
                      {
                        route: { name: "dashboard-user-details" },
                        name: `User ${route.params.id}`,
                      },
                      {
                        route: { name: "dashboard-user-details-edit" },
                        name: "Edit",
                      },
                    ],
                  },
                },
                {
                  path: "change-password",
                  name: "dashboard-user-details-change-password",
                  component: restrictedComponent(ChangePasswordCard, () =>
                    canViewUsersDashboard()
                  ),
                  meta: {
                    breadcrumb: (route: RouteLocationNormalizedLoaded) => [
                      { route: { name: "dashboard" }, name: "Dashboard" },
                      {
                        route: { name: "dashboard-users-list" },
                        name: "Users",
                      },
                      {
                        route: { name: "dashboard-user-details" },
                        name: `User ${route.params.id}`,
                      },
                      {
                        route: {
                          name: "dashboard-user-details-change-password",
                        },
                        name: "Change Password",
                      },
                    ],
                  },
                },
              ],
            },
          ],
        },
        {
          path: "videos",
          name: "dashboard-videos",
          component: restrictedComponent(DashboardVideosPage, () =>
            canViewVideosDashboard()
          ),
          meta: {
            sider: {
              title: "Videos",
              icon: "fa-light fa-video",
              category: DashboardPageCategory.Content,
              visible: () => canViewVideosDashboard(),
            },
            breadcrumb: () => [
              { route: { name: "dashboard" }, name: "Dashboard" },
              { route: { name: "dashboard-videos" }, name: "Videos" },
            ],
          },
        },
        {
          path: "votes",
          name: "dashboard-votes",
          component: restrictedComponent(DashboardVotesPage, () =>
            canViewVotesDashboard()
          ),
          meta: {
            sider: {
              title: "Votes",
              icon: "fa-light fa-ballot-check",
              category: DashboardPageCategory.Organization,
              visible: () => canViewVotesDashboard(),
            },
            breadcrumb: () => [
              { route: { name: "dashboard" }, name: "Dashboard" },
              { route: { name: "dashboard-votes" }, name: "Votes" },
            ],
          },
        },
      ],
    },
    {
      path: "/account",
      name: "account",
      component: restrictedComponent(AccountView, () => {
        const auth = useAuthStore();
        return auth.isLoggedIn;
      }),
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
