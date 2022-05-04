import { createApp } from "vue";
import { createPinia } from "pinia";

import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faCircleInfo,
  faHome,
  faArrowRightToArc,
  faEnvelope,
  faFilm,
  faEllipsis
} from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(faHome);
library.add(faCircleInfo);
library.add(faArrowRightToArc);
library.add(faEnvelope);
library.add(faFilm);
library.add(faEllipsis);

import App from "./App.vue";
import router from "./router";

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.component("font-awesome-icon", FontAwesomeIcon);

app.mount("#app");
