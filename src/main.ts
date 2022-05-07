import { createApp, provide, h } from "vue";
import { createPinia } from "pinia";
import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client/core'
import { createApolloProvider } from "@vue/apollo-option";
import { DefaultApolloClient } from '@vue/apollo-composable'

import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faCircleInfo,
  faHome,
  faArrowRightToArc,
  faEnvelope,
  faFilm,
  faEllipsis,
  faBookHeart,
  faPeopleGroup
} from "@fortawesome/pro-light-svg-icons";
import {
  faHexagonExclamation
} from "@fortawesome/pro-duotone-svg-icons";
import {
  faGithub,
  faYoutube,
  faDiscord,
  faInstagram,
  faTwitter,
  faRedditAlien
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(faHome);
library.add(faCircleInfo);
library.add(faArrowRightToArc);
library.add(faEnvelope);
library.add(faFilm);
library.add(faEllipsis);
library.add(faBookHeart);
library.add(faPeopleGroup);

library.add(faHexagonExclamation);

library.add(faGithub);
library.add(faYoutube);
library.add(faDiscord);
library.add(faInstagram);
library.add(faTwitter);
library.add(faRedditAlien);

import App from "./App.vue";
import router from "./router";

// HTTP connection to the API
const httpLink = createHttpLink({
  uri: 'http://localhost:4000/graphql',
})

// Cache implementation
const cache = new InMemoryCache()

// Create the apollo client
const apolloClient = new ApolloClient({
  link: httpLink,
  cache,
})
const apolloProvider = createApolloProvider({
  defaultClient: apolloClient,
})

const app = createApp({
  setup () {
    provide(DefaultApolloClient, apolloClient)
  },
  render: () => h(App),
})

app.use(createPinia());
app.use(router);
app.use(apolloProvider);
app.component("font-awesome-icon", FontAwesomeIcon);

app.mount("#app");
