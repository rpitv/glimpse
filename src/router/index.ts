import { createRouter, createWebHistory } from "vue-router";
import WaveBackground from "../layouts/WaveBackground.vue";
import PlainBackground from "../layouts/PlainBackground.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: "home",
            components: {
                default: () => import("../views/HomeView.vue"),
            },
            meta: {
                layout: WaveBackground,
            },
        },
        {
            path: "/about",
            name: "about",
            components: {
                default: () => import("../views/HomeView.vue"),
            },
            meta: {
                layout: PlainBackground,
            },
        },
    ],
});

export default router;
