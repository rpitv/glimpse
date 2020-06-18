<template>
  <span>
    <VMenu
      v-if="depth === 0"
      :close-on-content-click="false"
      :attach="'*[data-for=\'' + $options._scopeId + '\']'"
      open-on-hover
      class="header-dropdown"
      auto
      nudge-bottom="56"
      nudge-width="40"
      nudge-left="50"
    >
      <template v-slot:activator="{ on }">
        <VBtn
          v-on="on"
          :data-for="$options._scopeId"
          text
          class="header-btn"
          aria-haspopup="listbox"
        >
          {{ title }} <font-awesome-icon :icon="['fal','chevron-down']" class="dropdown-icon" />
        </VBtn>
      </template>

      <VList class="header-dropdown">
        <span v-for="item in items" :key="item.title" :class="item.customClass || ''">
          <VListItem
            @click=""
            v-if="(!item.sublist || item.sublist.length === 0) && (!item.conditional || item.conditional())"
            :to="item.path"
            :nuxt="true"
            text
          >
            <VListItemIcon>
              <font-awesome-icon v-if="item.icon != null" :icon="item.icon" />
            </VListItemIcon>
            <VListItemTitle class="item-title">
              {{ item.title }}
            </VListItemTitle>
          </VListItem>
          <HeaderDropdown
            v-else-if="item.sublist && item.sublist.length > 0 && (!item.conditional || item.conditional())"
            :title="item.title"
            :items="item.sublist"
            :icon="item.icon"
            :depth="depth + 1"
          />
        </span>
      </VList>
    </VMenu>

    <VListGroup v-else :sub-group="depth > 1">
      <template v-slot:activator>
        <VListItemIcon v-if="icon != null">
          <font-awesome-icon :icon="icon" />
        </VListItemIcon>

        <VListItemTitle class="item-title">
          {{ title }}
        </VListItemTitle>
      </template>

      <span v-for="item in items" :key="item.title" :class="item.customClass || ''">
        <VListItem
          @click=""
          v-if="(!item.sublist || item.sublist.length === 0) && (!item.conditional || item.conditional())"
          :to="item.path"
          :nuxt="true"
          text
        >
          <VListItemIcon>
            <font-awesome-icon v-if="item.icon != null" :icon="item.icon" />
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
          :depth="depth + 1"
        />
      </span>
    </VListGroup>
  </span>
</template>

<script>
export default {
  name: 'HeaderDropdown',
  props: {
    title: {
      type: String,
      required: true
    },
    items: {
      type: Array,
      default: () => []
    },
    depth: {
      type: Number,
      default: 0
    },
    icon: {
      type: Array,
      default: null
    }
  }
}
</script>

<style lang="scss" scoped>
  .v-menu__content { /* See: https://github.com/vuetifyjs/vuetify/issues/1438, haven't run into any issues yet... */
    max-height: 100vh !important;
  }
  .header-btn {
    height: 100% !important;
    font-family: 'Oswald Light', sans-serif;

  }
  .item-title {
    font-family: 'Ubuntu', sans-serif;
    text-transform: initial;
    font-size: 1.2em;
  }

  .dropdown-icon {
    margin-left: 5px;
  }
</style>
