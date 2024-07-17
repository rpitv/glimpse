import '@fortawesome/fontawesome-free/css/all.css'
import 'vuetify/styles'
import {createVuetify} from 'vuetify'
import {aliases, fa} from 'vuetify/iconsets/fa-svg';

export default createVuetify({
	icons: {
		defaultSet: 'fa',
		aliases,
		sets: { fa }
	},
	theme: {
		defaultTheme: 'dark'
	},
	defaults: {
		VSwitch: {
			inset: true,
			color: "primary"
		}
	}
})
