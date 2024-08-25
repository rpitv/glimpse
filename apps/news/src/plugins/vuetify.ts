import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify';
import { VNumberInput } from 'vuetify/labs/VNumberInput';
import { aliases, mdi } from 'vuetify/iconsets/mdi';

export default createVuetify({
	components: {
		VNumberInput
	},
	icons: {
		defaultSet: 'mdi',
		aliases,
		sets: {
			mdi,
		},
	},
	theme: {
		defaultTheme: 'dark'
	},
	defaults: {
		VBtn: {
			variant: "outlined",
			class: "text-none"
		},
		VExpansionPanels: {
			style: {
				width: "350px"
			},
			variant: "accordion"
		},
		VNumberInput: {
			density: "compact",
			variant: "outlined",
		},
		VTextField: {
			clearable: true,
			variant: "outlined",
		}
	}
})
