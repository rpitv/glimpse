import { createRouter, createWebHistory } from "vue-router";
import WaveLayout from "../layouts/WaveLayout.vue";
import PlainLayout from "../layouts/PlainLayout.vue";

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
        layout: WaveLayout
      }
    },
    {
      path: "/about",
      name: "about",
      components: {
        default: AboutView
      },
      meta: {
        layout: PlainLayout
      }
    },
    {
      path: "/productions",
      name: "productions",
      components: {
        default: ProductionsView
      },
      meta: {
        layout: PlainLayout
      }
    },
    {
      path: "/productions",
      name: "productions",
      components: {
        default: ProductionsView
      },
      meta: {
        layout: PlainLayout
      }
    },
    {
      path: "/contact",
      name: "contact",
      components: {
        default: ContactView
      },
      meta: {
        layout: WaveLayout
      }
    },
    {
      path: "/login",
      name: "login",
      components: {
        default: LoginView
      },
      meta: {
        layout: WaveLayout
      }
    },
    {
      path: "/donate",
      name: "donate",
      components: {
        default: DonateView
      },
      meta: {
        layout: WaveLayout
      },
    },
    {
      path: "/join",
      name: "join",
      components: {
        default: JoinView
      },
      meta: {
        layout: WaveLayout
      }
    }
  ]
});

export default router;
