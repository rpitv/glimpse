
const defaultTitle = 'RPI TV - Your exclusive home for RPI Hockey and campus broadcasting.'
const defaultDescription = 'RPI TV is a student-run broadcasting club committed to providing ' +
  'professional coverage of campus events and sports games.'

export default {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    title: defaultTitle,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'keywords', name: 'keywords', content: 'RPI,RPITV,RPI TV,Rensselaer,Polytechnic,Institute,RPI Hockey,RPI Club' },
      { hid: 'apple-mobile-web-app-title', name: 'apple-mobile-web-app-title', content: 'RPI TV' },
      { hid: 'og:site_name', name: 'og:site_name', content: 'RPI TV' },
      { hid: 'twitter:card', name: 'twitter:card', content: 'true' },
      { hid: 'twitter:site', name: 'twitter:site', content: 'rpitv' },
      { hid: 'twitter:creator', name: 'twitter:creator', content: 'rpitv' },
      // These SHOULD be changed by each page
      { hid: 'og:title', name: 'og:title', content: defaultTitle },
      { hid: 'og:description', name: 'og:description', content: defaultDescription },
      { hid: 'twitter:description', name: 'twitter:description', content: defaultDescription },
      { hid: 'description', name: 'description', content: defaultDescription }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#ff3333' },
  /*
  ** Global CSS
  */
  css: [
    'vuetify/dist/vuetify.min.css',
    '@fortawesome/fontawesome-svg-core/styles.css'
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~/plugins/fontawesome.js'
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    '@nuxt/typescript-build',
    '@nuxtjs/vuetify'
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    // Doc: https://github.com/nuxt-community/dotenv-module
    '@nuxtjs/dotenv'
  ],
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
  },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
    }
  },
  /*
   ** Vuetify configuration
   */
  vuetify: {
    optionsPath: './vuetify.config.js'
  }
}
