import { createApp } from 'vue';
import App from '@news/dashboard/image/main.vue';
import Vuetify from '@news/plugins/vuetify';

const app = createApp(App);
app.use(Vuetify);
app.mount('#app');
