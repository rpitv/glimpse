import { createRouter, createWebHistory } from "vue-router";

import HomeView from "../views/HomeView.vue";
import AboutView from "../views/AboutView.vue";
import ProductionsView from "../views/ProductionsView.vue";
import ContactView from "../views/ContactView.vue";
import LoginView from "../views/LoginView.vue";
import DonateView from "../views/DonateView.vue";
import JoinView from "../views/JoinView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      components: {
        default: HomeView
      },
      meta: {
        layoutCssName: 'wave-layout'
      }
    },
    {
      path: "/about",
      name: "about",
      components: {
        default: AboutView
      },
      meta: {
        layoutCssName: 'plain-layout'
      }
    },
    {
      path: "/productions",
      name: "productions",
      components: {
        default: ProductionsView
      },
      meta: {
        layoutCssName: 'plain-layout'
      }
    },
    {
      path: "/productions",
      name: "productions",
      components: {
        default: ProductionsView
      },
      meta: {
        layoutCssName: 'plain-layout'
      }
    },
    {
      path: "/contact",
      name: "contact",
      components: {
        default: ContactView
      },
      meta: {
        layoutCssName: 'wave-layout'
      }
    },
    {
      path: "/login",
      name: "login",
      components: {
        default: LoginView
      },
      meta: {
        layoutCssName: 'wave-layout'
      }
    },
    {
      path: "/donate",
      name: "donate",
      components: {
        default: DonateView
      },
      meta: {
        layoutCssName: 'wave-layout'
      },
    },
    {
      path: "/join",
      name: "join",
      components: {
        default: JoinView
      },
      meta: {
        layoutCssName: 'wave-layout'
      }
    }
  ]
});

export default router;
