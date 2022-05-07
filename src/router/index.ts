import { createRouter, createWebHistory } from "vue-router";

import HomeView from "../views/HomeView.vue";
import AboutView from "../views/AboutView.vue";
import ProductionsView from "../views/ProductionsView.vue";
import ContactView from "../views/ContactView.vue";
import LoginView from "../views/LoginView.vue";
import DonateView from "../views/DonateView.vue";
import JoinView from "../views/JoinView.vue";
import NotFoundView from "../views/NotFoundView.vue"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
      meta: {
        layoutCssName: 'wave-layout'
      }
    },
    {
      path: "/about",
      name: "about",
      component: AboutView,
      meta: {
        layoutCssName: 'plain-layout'
      }
    },
    {
      path: "/productions",
      name: "productions",
      component: ProductionsView,
      meta: {
        layoutCssName: 'plain-layout'
      }
    },
    {
      path: "/productions",
      name: "productions",
      component: ProductionsView,
      meta: {
        layoutCssName: 'plain-layout'
      }
    },
    {
      path: "/contact",
      name: "contact",
      component: ContactView,
      meta: {
        layoutCssName: 'wave-layout'
      }
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
      meta: {
        layoutCssName: 'wave-layout'
      }
    },
    {
      path: "/donate",
      name: "donate",
      component: DonateView,
      meta: {
        layoutCssName: 'wave-layout'
      },
    },
    {
      path: "/join",
      name: "join",
      component: JoinView,
      meta: {
        layoutCssName: 'wave-layout'
      }
    },
    {
      path: '/:pathMatch(.*)*',
      name: '404',
      component: NotFoundView,
      meta: {
        layoutCssName: 'plain-layout'
      }
    }
  ]
});

export default router;
