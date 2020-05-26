import { createProxyMiddleware } from 'http-proxy-middleware'
const defaultTitle = 'RPI TV - Your exclusive home for RPI Hockey and campus broadcasting.'
const defaultDescription = 'RPI TV is a student-run broadcasting club committed to providing ' +
  'professional coverage of campus events and sports games.'

export default {
  name: 'RPI TV',
  mode: 'universal',
  server: {
    port: process.env.PORT || 3000,
    server: '0.0.0.0'
  },
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
  serverMiddleware: [
    // Proxy API requests (including GraphQL)
    { path: '/api',
      handler: createProxyMiddleware({
        target: process.env.API_URL,
        pathRewrite: {
          '^/api': '/'
        }
      }) },
    // Proxy static assets w/o "/api" prefix
    { path: '/static',
      handler: createProxyMiddleware({ target: process.env.API_URL }) }
  ],
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
    '@nuxtjs/dotenv',
    '@nuxtjs/apollo',
    '@nuxtjs/sentry'
  ],
  sentry: {
    dsn: 'https://54941f6193e54057862ad82f766fc330@o392437.ingest.sentry.io/5239916'
    // disabled: (process.env.NODE_ENV === 'production')
  },
  apollo: {
    clientConfigs: {
      default: {
        // required
        httpEndpoint: process.env.BASE_URL + 'api/graphql'
      }
    }
  },

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
    babel: {
      babelrc: false,
      plugins: process.env.NODE_ENV !== 'production' ? ['istanbul'] : []
    },
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
  },
  /*
   ** PWA Configuration
   */
  pwa: {
    workbox: {

    },
    icon: {
      iconSrc: 'static/rpitv-app-icon.png'
    },
    manifest: {
      name: 'RPI TV Official',
      short_name: 'RPI TV',
      display: 'standalone',
      background_color: '#313131',
      description: 'Official Website for RPI TV.',
      categories: ['entertainment', 'news', 'sports'],
      lang: 'en-US',
      theme_color: '#b05454'
    }
  }
}
