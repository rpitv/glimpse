<template>
  <div>
    <VNavigationDrawer v-model="sidebar" app>
      <VList>
        <VListItem class="drawer-header">
          <img src="../assets/rpitv_logo.png" alt="Logo" class="tv-logo">
          <h3>RPI TV</h3>
        </VListItem>
        <VDivider />
        <VListItemTitle
          v-for="item in menuItems"
          :key="item.title"
          :to="item.path"
        >
          <VListItemAction>
            <font-awesome-icon :icon="['fad', item.icon]" />
          </VListItemAction>
          <VListItemContent>{{ item.title }}</VListItemContent>
        </VListItemTitle>
      </VList>
    </VNavigationDrawer>
    <v-app-bar app>
      <span class="hidden-sm-and-up">
        <p @click="sidebar = !sidebar">
          OPEN MENU
        </p>
      </span>
      <VToolbarTitle class="app-nav-header">
        <NuxtLink to="/">
          <img src="../assets/rpitv_logo.png" alt="Logo" class="tv-logo">
        </NuxtLink>
      </VToolbarTitle>
      <VToolbarItems class="hidden-xs-only">
        <VBtn
          v-for="item in menuItems"
          :key="item.title"
          :to="item.path"
          flat
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
      appTitle: 'Awesome App',
      sidebar: false,
      menuItems: [
        { title: 'Home', path: '/', icon: 'house' },
        { title: 'Productions', path: '/productions', icon: 'camera-movie' },
        { title: 'Request Us', path: '/request', icon: 'file-signature' },
        { title: 'About', path: '/about', icon: 'info-circle' }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
  .header-wrapper {
    background-color: #7c4e4e;
    color: white;
    padding: 20px;
    position: fixed;
    width: 100%;
  }
  .drawer-header .tv-logo {
    width: 50px;
    margin-right: 10px;
  }

  .app-nav-header .tv-logo {
    @media(max-device-width: 600px) {
      display: none;
    }
    @media(max-device-width: 1049px) {
      height: 60px;
      float: left;
      margin-right: 15px;
    }
    @media(min-device-width: 1050px) {
      position: absolute;
      height: 150px;
      left: calc(50% - 100px);
      top: -20px;
    }
  }
</style>
