import { createRouter, createWebHistory } from "vue-router";
import WaveBackground from "../layouts/WaveBackground.vue";
import PlainBackground from "../layouts/PlainBackground.vue";
import HomeView from "../views/HomeView.vue";
import AboutView from "../views/AboutView.vue";

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
    }
  ]
});

export default router;
