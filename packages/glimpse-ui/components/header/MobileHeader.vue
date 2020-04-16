<template>
  <VNavigationDrawer v-model="localValue" app temporary dark>
    <VList nav>
      <!-- Header -->
      <VListItem class="drawer-header">
        <img src="../../assets/rpitv_logo_400.png" alt="Logo" class="tv-logo">
        <h3>RPI TV</h3>
      </VListItem>
      <VListItemSubtitle class="drawer-social">
        <a
          v-for="item in socials"
          :key="item.title"
          :href="item.path"
          :aria-label="item.title"
        >
          <font-awesome-icon :icon="['fab', item.icon]" size="lg" />
        </a>
      </VListItemSubtitle>

      <VDivider />

      <!-- Left menu items -->
      <span v-for="item in items.LEFT">
        <VListItem
          v-if="(!item.sublist || item.sublist.length === 0) && (!item.conditional || item.conditional())"
          :key="item.title"
          :to="item.path"
          :nuxt="true"
        >
          <VListItemIcon>
            <font-awesome-icon :icon="item.icon" class="drawer-icon" />
          </VListItemIcon>

          <VListItemTitle>
            {{ item.title }}
          </VListItemTitle>
        </VListItem>

        <HeaderDropdown
          v-else-if="item.sublist && item.sublist.length > 0 && (!item.conditional || item.conditional())"
          :title="item.title"
          :items="item.sublist"
          :icon="item.icon"
          :depth="1"
        />
      </span>

      <VDivider />

      <!-- Right menu items -->
      <span v-for="item in items.RIGHT">
        <VListItem
          v-if="(!item.sublist || item.sublist.length === 0) && (!item.conditional || item.conditional())"
          :key="item.title"
          :to="item.path"
          :class="item.customClass"
          :nuxt="true"
        >
          <VListItemIcon>
            <font-awesome-icon :icon="item.icon" class="drawer-icon" />
          </VListItemIcon>

          <VListItemTitle>
            {{ item.title }}
          </VListItemTitle>
        </VListItem>

        <HeaderDropdown
          v-else-if="item.sublist && item.sublist.length > 0 && (!item.conditional || item.conditional())"
          :title="item.title"
          :items="item.sublist"
          :icon="item.icon"
          :class="item.customClass"
          :depth="1"
        />
      </span>
    </VList>
  </VNavigationDrawer>
</template>

<script>
import HeaderDropdown from '~/components/header/HeaderDropdown'
export default {
  name: 'MobileHeader',
  components: { HeaderDropdown },
  props: {
    items: {
      type: Object,
      required: true
    },
    value: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      socials: [
        { title: 'YouTube', path: 'https://youtube.com/rpitv', icon: 'youtube' },
        { title: 'Twitter', path: 'https://twitter.com/rpitv', icon: 'twitter' },
        { title: 'Reddit', path: 'https://reddit.com/u/rpi_tv', icon: 'reddit-alien' }
      ]
    }
  },
  computed: {
    localValue: {
      get () {
        return this.value
      },
      set (newVal) {
        this.$emit('input', newVal)
      }
    }
  }
}
</script>

<style lang="scss" scoped>

  /* Drawer */
  .drawer-icon {
    --fa-primary-color: #b05454;
    --fa-secondary-color: #f56e6c;
    --fa-secondary-opacity: 1.0;
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
</style>
