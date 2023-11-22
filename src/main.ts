import { createApp, provide, h } from "vue";
import { createPinia } from "pinia";
import { createApolloProvider } from "@vue/apollo-option";
import { DefaultApolloClient } from "@vue/apollo-composable";
import { vuetify } from "../plugins/vuetify";
import { DatePicker, setupCalendar } from 'v-calendar';
import 'v-calendar/style.css';
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faCaretDown, faAngleRight, faAngleLeft, faPen, faCalendar,
  faCircleXmark, faTrash, faBackwardStep, faForwardStep, faChevronLeft, faChevronRight,
  faMagnifyingGlass, faIdCard, faInputText, faArrowUp, faArrowDown, faEdit
} from "@fortawesome/pro-solid-svg-icons";

import {
  faCircleInfo,
  faHome,
  faArrowRightToArc,
  faArrowRightFromArc,
  faEnvelope,
  faFilm,
  faEllipsis,
  faBookHeart,
  faPeopleGroup,
  faXmark,
  faHammer,
  faUser,
  faUsersLine,
  faClipboardList,
  faBoxOpenFull,
  faNewspaper,
  faLayerGroup,
  faMessageLines,
  faImages,
  faAddressCard,
  faClapperboard,
  faSignsPost,
  faVideo,
  faBallotCheck,
  faPlus,
  faSignalStream,
  faArrowsRotate,
  faBadgeSheriff,
} from "@fortawesome/pro-light-svg-icons";
import {
  faHexagonExclamation,
  faDoNotEnter,
  faUserRobotXmarks,
  faUserHelmetSafety,
} from "@fortawesome/pro-duotone-svg-icons";
import {
  faGithub,
  faYoutube,
  faDiscord,
  faInstagram,
  faTwitter,
  faRedditAlien,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(faCaretDown);
library.add(faAngleLeft);
library.add(faAngleRight);
library.add(faPen);
library.add(faCalendar);
library.add(faCircleXmark);
library.add(faTrash)
library.add(faBackwardStep);
library.add(faForwardStep);
library.add(faChevronLeft);
library.add(faChevronRight);
library.add(faMagnifyingGlass);
library.add(faIdCard);
library.add(faInputText);
library.add(faArrowUp);
library.add(faArrowDown);
library.add(faEdit);

library.add(faHome);
library.add(faCircleInfo);
library.add(faArrowRightToArc);
library.add(faArrowRightFromArc);
library.add(faEnvelope);
library.add(faFilm);
library.add(faEllipsis);
library.add(faBookHeart);
library.add(faPeopleGroup);
library.add(faXmark);
library.add(faHammer);
library.add(faUser);
library.add(faUsersLine);
library.add(faClipboardList);
library.add(faBoxOpenFull);
library.add(faNewspaper);
library.add(faLayerGroup);
library.add(faMessageLines);
library.add(faImages);
library.add(faAddressCard);
library.add(faClapperboard);
library.add(faSignsPost);
library.add(faVideo);
library.add(faBallotCheck);
library.add(faPlus);
library.add(faSignalStream);
library.add(faArrowsRotate);
library.add(faBadgeSheriff);

library.add(faHexagonExclamation);
library.add(faDoNotEnter);
library.add(faUserRobotXmarks);
library.add(faUserHelmetSafety);

library.add(faGithub);
library.add(faYoutube);
library.add(faDiscord);
library.add(faInstagram);
library.add(faTwitter);
library.add(faRedditAlien);

library.add(faAngleRight);

import App from "./App.vue";
import router from "./router";
import { apolloClient } from "./apollo";
import { abilitiesPlugin } from "@casl/vue";
import { ability } from "@/casl";

const apolloProvider = createApolloProvider({
  defaultClient: apolloClient,
});

const app = createApp({
  setup() {
    provide(DefaultApolloClient, apolloClient);
  },
  render: () => h(App),
});

app.use(abilitiesPlugin, ability);
app.use(createPinia());
app.use(router);
app.use(apolloProvider);
app.use(vuetify);
app.component("font-awesome-icon", FontAwesomeIcon);
app.use(vuetify);
app.mount("#app");
app.use(setupCalendar, {});
app.component('DatePicker', DatePicker);
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt#use_within_json
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};
