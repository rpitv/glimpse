import '@fortawesome/fontawesome-free/css/all.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import {aliases, fa} from 'vuetify/lib/iconsets/fa';

export default createVuetify({
	icons: {
		defaultSet: 'fa',
		aliases,
		sets: { fa }
	}
})
