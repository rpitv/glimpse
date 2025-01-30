import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css' // Ensure you are using css-loader
import { createVuetify } from 'vuetify';
import * as labsComponents from 'vuetify/labs/components';
import { aliases, mdi } from 'vuetify/iconsets/mdi';

export default createVuetify({
	components: {
		...labsComponents
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
			class: "text-none",
		},
		VChip: {
			label: true,
			variant: "outlined",
		},
		VColorPicker: {
			hideInputs: true,
			modes: ["hex", "rgb"],
		},
		VCombobox: {
			clearable: true,
			variant: "outlined",
		},
		VExpansionPanels: {
			variant: "accordion"
		},
		VNumberInput: {
			variant: "outlined",
			step: 0.5
		},
		VSelect: {
			variant: "outlined"
		},
		VSwitch: {
			inset: true,
			color: "primary",
		},
		VTextField: {
			clearable: true,
			variant: "outlined"
		}
	}
})
