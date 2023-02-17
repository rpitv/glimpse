import { createRouter, createWebHistory } from "vue-router";

import HomeView from "../views/HomeView.vue";
import AboutView from "../views/AboutView.vue";
import ProductionsView from "../views/ProductionsView.vue";
import ProductionView from "../views/ProductionView.vue";
import ContactView from "../views/ContactView.vue";
import LoginView from "../views/LoginView.vue";
import DonateView from "../views/DonateView.vue";
import JoinView from "../views/JoinView.vue";
import DashboardView from "../views/dashboard/DashboardView.vue";
import AccountView from "../views/AccountView.vue";
import NotFoundView from "../views/NotFoundView.vue";
import NoPermissionView from "../views/NoPermissionView.vue";
import {
  ability,
  AbilityActions,
  canViewDashboard,
} from "@/casl";
import type { Component } from "vue";
import { h } from "vue";
import { AbilitySubjects } from "@/graphql/types";

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
      path: "/productions/:id",
      name: "production",
      component: restrictedComponent(
        ProductionView,
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
      path: "/dashboard/:page?",
      name: "dashboard",
      component: restrictedComponent(
        DashboardView,
        () => canViewDashboard().value
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
