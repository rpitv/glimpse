import { createRouter, createWebHistory } from "vue-router";

import HomeView from "../views/HomeView.vue";
import AboutView from "../views/AboutView.vue";
import ProductionsView from "../views/ProductionsView.vue";
import ContactView from "../views/ContactView.vue";
import LoginView from "../views/LoginView.vue";
import DonateView from "../views/DonateView.vue";
import JoinView from "../views/JoinView.vue";
import DashboardView from "../views/DashboardView.vue";
import AccountView from "../views/AccountView.vue";
import NotFoundView from "../views/NotFoundView.vue";
import NoPermissionView from "../views/NoPermissionView.vue";
import { ability } from "@/casl";
import type { Component } from "vue";
import { h } from "vue";
import { AbilityActions, AbilitySubjects } from "@/graphql/types";

function restrictedComponent(
  component: Component,
  action: AbilityActions,
  subject: AbilitySubjects,
  field?: string
) {
  return {
    functional: true,
    render() {
      return ability.can(action, subject, field)
        ? h(component)
        : h(NoPermissionView);
    },
  };
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
      component: DashboardView,
      meta: {
        layoutCssName: "wave-layout",
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
