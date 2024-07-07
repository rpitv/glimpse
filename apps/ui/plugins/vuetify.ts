import 'vuetify/styles'
import { createVuetify } from 'vuetify';
import * as directives from 'vuetify/directives'
import { aliases, fa } from 'vuetify/iconsets/fa-svg'
import { VDateInput } from "vuetify/labs/VDateInput";
import { VNumberInput } from "vuetify/labs/VNumberInput";

export const vuetify = createVuetify({
  directives,
  theme: {
    defaultTheme: 'dark'
  },
  icons: {
    defaultSet: 'fa',
    aliases,
    sets: { fa }
  },
  defaults: {
    VBtn: {
      class: "text-none",
      variant: "outlined"
    },
    VChip: {
      variant: "outlined",
      label: true
    },
    VCombobox: {
      variant: "outlined"
    },
    VDataTableServer: {
      style: "border-style: inset;",
      fixedHeader: true,
      hover: true,
      fixedFooter: true,
      showCurrentPage: true
    },
    VDateInput: {
      variant: "outlined"
    },
    VDialog: {
      scrim: "black"
    },
    VNumberInput: {
      variant: "outlined",
    },
    VPagination: {
      rounded: true
    },
    VSelect: {
      variant: "outlined"
    },
    VTextarea: {
      variant: "outlined"
    },
    VTextField: {
      variant: "outlined"
    },
  },
  components: {
    VDateInput,
    VNumberInput
  }
});
