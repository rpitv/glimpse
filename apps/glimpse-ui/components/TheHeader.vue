<template>
  <div>
    <!-- Mobile Menu -->
    <VNavigationDrawer v-model="sidebar" app temporary dark>
      <VList nav>
        <!-- Header -->
        <VListItem class="drawer-header">
          <img src="../assets/rpitv_logo_400.png" alt="Logo" class="tv-logo">
          <h3>RPI TV</h3>
        </VListItem>
        <VListItemSubtitle class="drawer-social">
          <a
            v-for="item in socials"
            v-if="!item.shouldDisplay || item.shouldDisplay()"
            :key="item.title"
            :href="item.path"
            :aria-label="item.title"
          >
            <font-awesome-icon :icon="['fab', item.icon]" size="lg" />
          </a>
        </VListItemSubtitle>

        <VDivider />

        <!-- Left menu items -->
        <VListItem
          v-for="item in leftMenuItems"
          v-if="!item.shouldDisplay || item.shouldDisplay()"
          :key="item.title"
          :to="item.path"
          class="drawer-item"
        >
          <VListItemAction>
            <font-awesome-icon :icon="['fad', item.icon]" class="drawer-icon" />
          </VListItemAction>

          <VListItemContent class="drawer-item-content">
            {{ item.title }}
          </VListItemContent>
        </VListItem>

        <VDivider />

        <!-- Right menu items -->
        <VListItem
          v-for="item in rightMenuItems"
          v-if="!item.shouldDisplay || item.shouldDisplay()"
          :key="item.title"
          :to="item.path"
          class="drawer-item"
        >
          <VListItemAction>
            <font-awesome-icon :icon="['fad', item.icon]" class="drawer-icon" />
          </VListItemAction>

          <VListItemContent class="drawer-item-content">
            {{ item.title }}
          </VListItemContent>
        </VListItem>
      </VList>
    </VNavigationDrawer>

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
        <img src="../assets/rpitv_logo_400.png" alt="Logo" class="tv-logo">
      </VToolbarTitle>

      <!-- Left menu items -->
      <VToolbarItems class="hidden-xs-only">
        <VBtn
          v-for="item in leftMenuItems"
          v-if="!item.shouldDisplay || item.shouldDisplay()"
          :key="item.title"
          :to="item.path"
          :nuxt="true"
          text
        >
          {{ item.title }}
        </VBtn>
      </VToolbarItems>
      <div class="d-none d-sm-flex d-md-none app-nav-right-items">
        <VMenu open-on-hover>
          <template v-slot:activator="{ on }">
            <VBtn
              v-on="on"
              text
            >
              More <font-awesome-icon :icon="['fal','chevron-down']" class="more-icon" />
            </VBtn>
          </template>

          <VList>
            <VListItem
              v-for="item in rightMenuItems"
              v-if="!item.shouldDisplay || item.shouldDisplay()"
              :key="item.title"
              @click=""
              :to="item.path"
              :nuxt="true"
              text
            >
              {{ item.title }}
            </VListItem>
          </VList>
        </VMenu>
      </div>
      <!-- Right menu items -->
      <VToolbarItems class="hidden-sm-and-down app-nav-right-items">
        <VBtn
          v-for="item in rightMenuItems"
          v-if="!item.shouldDisplay || item.shouldDisplay()"
          :key="item.title"
          :to="item.path"
          :nuxt="true"
          text
        >
          {{ item.title }}
        </VBtn>
      </VToolbarItems>
    </VAppBar>
  </div>
</template>

<script>
export default {
  props: {
    transparentAtTop: Boolean
  },
  data () {
    return {
      scrollDistance: 0, // Number of px scrolled down
      sidebar: false, // Whether the sidebar is open. Should be false by default
      socials: [
        { title: 'YouTube', path: 'https://youtube.com/rpitv', icon: 'youtube' },
        { title: 'Twitter', path: 'https://twitter.com/rpitv', icon: 'twitter' },
        { title: 'Reddit', path: 'https://reddit.com/u/rpi_tv', icon: 'reddit-alien' }
      ],
      leftMenuItems: [
        { title: 'Home', path: '/', icon: 'house' },
        { title: 'Productions', path: '/productions', icon: 'camera-movie' },
        { title: 'Contact Us', path: '/contact', icon: 'file-signature' },
        { title: 'About', path: '/about', icon: 'info-circle' }
      ],
      rightMenuItems: [
        { title: 'Join The Club', path: '/join', icon: 'hands-helping' },
        { title: this.$store.state.rcs_id + '@rpi.edu',
          path: '#',
          icon: 'user-circle',
          shouldDisplay: () => this.$store.getters.isAuthenticated },
        { title: 'Donate', path: '/donate', icon: 'donate', shouldDisplay: () => !this.$store.getters.isAuthenticated },
        { title: 'Login', path: '/login', icon: 'sign-in', shouldDisplay: () => !this.$store.getters.isAuthenticated },
        { title: 'Logout', path: '/logout', icon: 'sign-out', shouldDisplay: () => this.$store.getters.isAuthenticated }
      ]
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

  /* Drawer */
  .drawer-item {
    padding-left: 15px;
    .drawer-icon {
      --fa-primary-color: #b05454;
      --fa-secondary-color: #f56e6c;
      --fa-secondary-opacity: 1.0;
    }
    .drawer-item-content {
      display: inline;
    }
  }
  .drawer-header .tv-logo {
    width: 75px;
    margin-right: 10px;
  }
  .drawer-social {
    position: relative;
    margin-bottom: 10px;
    top: -10px;
    left: 10px;

    * {
      margin-right: 10px;
    }
  }

  /* Main nav bar */
  .app-nav-right-items {
    position: absolute;
    right: 15px;
  }
  .more-icon {
    margin-left: 5px;
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
