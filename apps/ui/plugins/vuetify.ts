import 'vuetify/styles'
import { createVuetify } from 'vuetify';
import * as directives from 'vuetify/directives'
import { aliases, fa } from 'vuetify/iconsets/fa-svg'

export const vuetify= createVuetify({
  directives,
  theme: {
    defaultTheme: 'dark'
  },
  icons: {
    defaultSet: 'fa',
    aliases,
    sets: { fa }
  }
});
