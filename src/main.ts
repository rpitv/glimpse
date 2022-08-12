import { createApp, provide, h } from "vue";
import { createPinia } from "pinia";
import { createApolloProvider } from "@vue/apollo-option";
import { DefaultApolloClient } from "@vue/apollo-composable";

import { library } from "@fortawesome/fontawesome-svg-core";
import { faCaretDown } from "@fortawesome/pro-solid-svg-icons";
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
} from "@fortawesome/pro-light-svg-icons";
import {
  faHexagonExclamation,
  faDoNotEnter,
  faUserRobotXmarks,
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

library.add(faHexagonExclamation);
library.add(faDoNotEnter);
library.add(faUserRobotXmarks);

library.add(faGithub);
library.add(faYoutube);
library.add(faDiscord);
library.add(faInstagram);
library.add(faTwitter);
library.add(faRedditAlien);

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
app.component("font-awesome-icon", FontAwesomeIcon);

app.mount("#app");
