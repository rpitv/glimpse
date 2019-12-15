<template>
  <div>
    <!-- Mobile Menu -->
    <VNavigationDrawer v-model="sidebar" app temporary dark>
      <VList nav>
        <!-- Header -->
        <VListItem class="drawer-header">
          <img src="../assets/rpitv_logo.png" alt="Logo" class="tv-logo">
          <h3>RPI TV</h3>
        </VListItem>
        <VListItemSubtitle class="drawer-social">
          <a
            v-for="item in socials"
            :key="item.title"
            :href="item.path"
          >
            <font-awesome-icon :icon="['fab', item.icon]" size="lg" />
          </a>
        </VListItemSubtitle>

        <VDivider />

        <!-- Left menu items -->
        <VListItem
          v-for="item in leftMenuItems"
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
      app
      elevate-on-scroll
      color="#a85c56"
      dark
    >
      <span class="hidden-sm-and-up">
        <font-awesome-icon :icon="['fal', 'bars']" @click="sidebar = !sidebar" class="drawer-icon" />
      </span>

      <VToolbarTitle class="app-nav-header">
        <img @load="fadeInLogo" src="../assets/rpitv_logo.png" alt="Logo" class="tv-logo">
      </VToolbarTitle>

      <!-- Left menu items -->
      <VToolbarItems class="hidden-xs-only">
        <VBtn
          v-for="item in leftMenuItems"
          :key="item.title"
          :to="item.path"
          :nuxt="true"
          text
        >
          {{ item.title }}
        </VBtn>
      </VToolbarItems>
      <!-- Right menu items -->
      <VToolbarItems class="hidden-xs-only app-nav-right-items">
        <VBtn
          v-for="item in rightMenuItems"
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

<script lang="ts">
export default {
  data (): any {
    return {
      sidebar: false, // Whether the sidebar is open. Should be false by default
      socials: [
        { title: 'YouTube', path: 'https://youtube.com/rpitv', icon: 'youtube' },
        { title: 'Twitter', path: 'https://twitter.com/rpitv', icon: 'twitter' },
        { title: 'Reddit', path: 'https://reddit.com/u/rpi_tv', icon: 'reddit-alien' }
      ],
      leftMenuItems: [
        { title: 'Home', path: '/', icon: 'house' },
        { title: 'Productions', path: '/productions', icon: 'camera-movie' },
        { title: 'Request Us', path: '/request', icon: 'file-signature' },
        { title: 'About Us', path: '/about', icon: 'info-circle' }
      ],
      rightMenuItems: [
        { title: 'Join The Club', path: '/join', icon: 'hands-helping' },
        { title: 'Donate', path: '/donate', icon: 'donate' },
        { title: 'Login', path: '/login', icon: 'sign-in' }
      ]
    }
  },
  methods: {
    /**
     * Fade in (or out) the logo. Used by load event of the logo, to fade in once loaded.
     * @param e Event
     */
    fadeInLogo (e: any) {
      e.target.classList.toggle('visible')
    }
  }
}
</script>

<style lang="scss" scoped>

  /* Drawer */
  .drawer-item {
    padding-left: 15px;
    .drawer-icon {
      --fa-primary-color: #b30000;
      --fa-secondary-color: #ff3333;
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
  .app-nav-header .tv-logo {
    /* Logo is invisible by default until .visible is applied */
    &.visible {
      opacity: 1;
    }
    opacity: 0;

    transition: opacity 0.5s;
    @media(min-width: 600px) and (max-width: 700px) {
      display: none;
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
