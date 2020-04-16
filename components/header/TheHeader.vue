<template>
  <div>
    <!-- Desktop nav bar -->
    <VAppBar
      :color="scrollDistance > 0 || !$props.transparentAtTop ? this.$vuetify.theme.currentTheme.primary.darken1 : '#00000000'"
      app
      elevate-on-scroll
      dark
    >
      <span class="hidden-sm-and-up" aria-label="open navigation drawer">
        <font-awesome-icon :icon="['fal', 'bars']" @click="sidebar = !sidebar" class="drawer-icon" />
      </span>

      <VToolbarTitle class="app-nav-header">
        <img src="../../assets/rpitv_logo_400.png" alt="Logo" class="tv-logo">
      </VToolbarTitle>

      <!-- Left menu items -->
      <VToolbarItems class="hidden-xs-only">
        <div v-for="item in menuItems.LEFT" :key="item.title" :class="'item-wrapper' + (item.customClass || '')">
          <HeaderButton
            v-if="(!item.sublist || item.sublist.length === 0) && (!item.conditional || item.conditional())"
            :class="item.customClass || ''"
            :title="item.title"
            :path="item.path"
          />
          <HeaderDropdown
            v-else-if="item.sublist && item.sublist.length > 0 && (!item.conditional || item.conditional())"
            :title="item.title"
            :class="item.customClass || ''"
            :items="item.sublist"
          />
        </div>
      </VToolbarItems>

      <div class="app-nav-right-items">
        <!-- Right menu items -->
        <VToolbarItems class="hidden-xs-only">
          <div v-for="item in menuItems.RIGHT" :key="item.title" :class="'item-wrapper ' + (item.customClass || '')">
            <HeaderButton
              v-if="(!item.sublist || item.sublist.length === 0) && (!item.conditional || item.conditional())"
              :class="item.customClass || ''"
              :title="item.title"
              :path="item.path"
            />
            <HeaderDropdown
              v-else-if="item.sublist && (!item.conditional || item.conditional())"
              :title="item.title"
              :class="item.customClass || ''"
              :items="item.sublist"
            />
          </div>
        </VToolbarItems>
      </div>
    </VAppBar>
  </div>
</template>

<script>
import HeaderButton from '~/components/header/HeaderButton'
import HeaderDropdown from '~/components/header/HeaderDropdown'
export default {
  components: { HeaderDropdown, HeaderButton },
  props: {
    transparentAtTop: Boolean
  },
  data () {
    return {
      scrollDistance: 0, // Number of px scrolled down
      sidebar: false, // Whether the sidebar is open. Should be false by default
      menuItems: {
        'LEFT': [
          {
            'title': 'Home',
            'path': '/',
            'icon': ['fal', 'house'],
            'sublist': [],
            'customClass': '',
            'conditional': null
          },
          {
            'title': 'Productions',
            'path': '/productions',
            'icon': ['fal', 'camera-movie'],
            'sublist': [],
            'customClass': '',
            'conditional': null
          },
          {
            'title': 'Contact Us',
            'path': '/contact',
            'icon': ['fal', 'file-signature'],
            'sublist': [],
            'customClass': '',
            'conditional': null
          },
          {
            'title': 'About',
            'path': '/about',
            'icon': ['fal', 'info-circle'],
            'sublist': [],
            'customClass': '',
            'conditional': null
          }
        ],
        'RIGHT': [
          {
            'title': 'Join The Club',
            'path': '/join',
            'icon': ['fal', 'hands-helping'],
            'sublist': [],
            'customClass': 'hidden-sm-and-down',
            'conditional': () => !this.$store.getters.isAuthenticated
          },
          {
            'title': 'Donate',
            'path': '/donate',
            'icon': ['fal', 'donate'],
            'sublist': [],
            'customClass': 'hidden-sm-and-down',
            'conditional': () => !this.$store.getters.isAuthenticated
          },
          {
            'title': 'Login',
            'path': '/login',
            'icon': ['fal', 'sign-in'],
            'sublist': [],
            'customClass': 'hidden-sm-and-down',
            'conditional': () => !this.$store.getters.isAuthenticated
          },
          {
            'title': this.$store.state.rcs_id + '@rpi.edu',
            'path': '#',
            'icon': ['fal', 'user-circle'],
            'sublist': [
              {
                'title': 'Account Settings',
                'path': '/account',
                'icon': ['fal', 'cog'],
                'sublist': [],
                'customClass': '',
                'conditional': null
              },
              {
                'title': 'Admin Panel',
                'path': '/admin',
                'icon': ['fal', 'toolbox'],
                'sublist': [],
                'customClass': '',
                'conditional': () => this.$store.state.admin
              }
            ],
            'customClass': 'hidden-sm-and-down',
            'conditional': () => this.$store.getters.isAuthenticated
          },
          {
            'title': 'Logout',
            'path': '/logout',
            'icon': ['fal', 'sign-out'],
            'sublist': [],
            'customClass': 'hidden-sm-and-down',
            'conditional': () => this.$store.getters.isAuthenticated
          },
          {
            'title': 'More',
            'path': '#',
            'icon': null,
            'sublist': [
              {
                'title': 'Join The Club',
                'path': '/join',
                'icon': ['fal', 'hands-helping'],
                'sublist': [],
                'customClass': '',
                'conditional': () => !this.$store.getters.isAuthenticated
              },
              {
                'title': 'Donate',
                'path': '/donate',
                'icon': ['fal', 'donate'],
                'sublist': [],
                'customClass': '',
                'conditional': () => !this.$store.getters.isAuthenticated
              },
              {
                'title': 'Login',
                'path': '/login',
                'icon': ['fal', 'sign-in'],
                'sublist': [],
                'customClass': '',
                'conditional': () => !this.$store.getters.isAuthenticated
              },
              {
                'title': this.$store.state.rcs_id + '@rpi.edu',
                'path': '#',
                'icon': ['fal', 'user-circle'],
                'sublist': [
                  {
                    'title': 'Account Settings',
                    'path': '/account',
                    'icon': ['fal', 'cog'],
                    'sublist': [],
                    'customClass': '',
                    'conditional': null
                  },
                  {
                    'title': 'Admin Panel',
                    'path': '/admin',
                    'icon': ['fal', 'toolbox'],
                    'sublist': [],
                    'customClass': '',
                    'conditional': () => this.$store.state.admin
                  }
                ],
                'conditional': () => this.$store.getters.isAuthenticated
              },
              {
                'title': 'Logout',
                'path': '/logout',
                'icon': ['fal', 'sign-out'],
                'sublist': [],
                'customClass': '',
                'conditional': () => this.$store.getters.isAuthenticated
              }
            ],
            'customClass': 'hidden-md-and-up',
            'conditional': null
          }
        ]
      }
    }
  },
  mounted () {
    window.addEventListener('scroll', this.scrollHandler)
    this.scrollHandler()
  },
  destroyed () {
    window.removeEventListener('scroll', this.scrollHandler)
  },
  methods: {
    scrollHandler () {
      this.scrollDistance = window.scrollY
    }
  }
}
</script>

<style lang="scss" scoped>

  .item-wrapper {
    display: flex;
    margin: 0;
  }
  /* Main nav bar */
  .app-nav-right-items {
    position: absolute;
    right: 15px;
    height: 100%;
  }

  .app-nav-header .tv-logo {

    transition: opacity 0.5s;
    @media(min-width: 600px) and (max-width: 700px) {
      height: 30px !important;
    }
    @media (max-width: 1049px) {
      height: 60px;
      float: left;
      margin-right: 15px;
    }
    @media (min-width: 1050px), (max-width: 600px) {
      pointer-events: none;
      position: absolute;
      height: 150px;
      left: calc(50% - 100px);
      top: -20px;
      z-index: 3000;
    }
  }
</style>
