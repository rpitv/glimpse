<template>
  <div>
    <!-- Mobile Menu -->
    <VNavigationDrawer v-model="sidebar" app temporary>
      <VList nav>
        <VListItem class="drawer-header">
          <img src="../assets/rpitv_logo.png" alt="Logo" class="tv-logo">
          <h3>RPI TV</h3>
        </VListItem>

        <VDivider />

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

    <v-app-bar app elevate-on-scroll>
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
    </v-app-bar>
  </div>
</template>

<script lang="ts">
export default {
  data (): any {
    return {
      sidebar: false,
      leftMenuItems: [
        { title: 'Home', path: '/', icon: 'house' },
        { title: 'Productions', path: '/productions', icon: 'camera-movie' },
        { title: 'Request Us', path: '/request', icon: 'file-signature' },
        { title: 'About', path: '/about', icon: 'info-circle' }
      ],
      rightMenuItems: [
        { title: 'Login', path: '/login', icon: 'sign-in' }
      ]
    }
  },
  methods: {
    fadeInLogo (e: any) {
      e.target.classList.toggle('visible')
    }
  }
}
</script>

<style lang="scss" scoped>
  .app-nav-right-items {
    position: absolute;
    right: 15px;
  }

  .drawer-item {
    padding-left: 15px;
    .drawer-icon {
      --fa-primary-color: #b30000;
      --fa-secondary-color: #9c0000;
    }
    .drawer-item-content {
      display: inline;
    }
  }
  .drawer-header .tv-logo {
    width: 75px;
    margin-right: 10px;
  }

  .app-nav-header .tv-logo {
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
