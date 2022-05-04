import { createRouter, createWebHistory } from "vue-router";
import WaveBackground from "../layouts/WaveBackground.vue";
import PlainBackground from "../layouts/PlainBackground.vue";

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
        layout: WaveBackground
      }
    },
    {
      path: "/about",
      name: "about",
      components: {
        default: AboutView
      },
      meta: {
        layout: PlainBackground
      }
    },
    {
      path: "/productions",
      name: "productions",
      components: {
        default: ProductionsView
      },
      meta: {
        layout: PlainBackground
      }
    },
    {
      path: "/productions",
      name: "productions",
      components: {
        default: ProductionsView
      },
      meta: {
        layout: PlainBackground
      }
    },
    {
      path: "/contact",
      name: "contact",
      components: {
        default: ContactView
      },
      meta: {
        layout: WaveBackground
      }
    },
    {
      path: "/login",
      name: "login",
      components: {
        default: LoginView
      },
      meta: {
        layout: WaveBackground
      }
    },
    {
      path: "/donate",
      name: "donate",
      components: {
        default: DonateView
      },
      meta: {
        layout: WaveBackground
      },
    },
    {
      path: "/join",
      name: "join",
      components: {
        default: JoinView
      },
      meta: {
        layout: WaveBackground
      }
    }
  ]
});

export default router;
