import { createApp } from 'vue';
import App from './glimpse/main.vue';
import vuetify from '../../plugins/vuetify';

const app = createApp(App);
app.use(vuetify);
app.mount('#app');
