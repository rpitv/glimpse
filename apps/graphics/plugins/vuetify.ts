import '@fortawesome/fontawesome-free/css/all.css'
import 'vuetify/styles'
import {createVuetify, ThemeDefinition} from 'vuetify'
import {aliases, fa} from 'vuetify/lib/iconsets/fa';

const glimpseTheme: ThemeDefinition = {
	dark: true,
	colors: {
		background: "#2f3a4f"
	}
}

export default createVuetify({
	icons: {
		defaultSet: 'fa',
		aliases,
		sets: { fa }
	},
	theme: {
		defaultTheme: 'dark'
	}
})
