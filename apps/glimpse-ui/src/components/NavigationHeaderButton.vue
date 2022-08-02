<template>
  <component v-if="value.visible?.().value ?? true"
             :is="children.length > 0 ? NDropdown : 'div'"
             placement="bottom-end"
             :options="children"
  >
    <RouterLink v-if="value.route"
                :to="{name: value.route}"
                custom v-slot="{ href, navigate }"
    >
      <a :href="href"
         :aria-current="route.name === value.route ? 'page' : null"
         @click="value.onClick !== undefined ? value.onClick($event, value, navigate) : navigate($event)"
      >
        <n-button class="button-elem"
                  :type="route.name === value.route ? 'primary' : 'default'"
                  large
                  quaternary
        >
          <template #icon v-if="value.showIconOnDesktop || windowWidth < 500">
            <FontAwesomeIcon :icon="value.icon"/>
          </template>
          {{ value.name }}
        </n-button>
      </a>
    </RouterLink>

    <n-button v-else
              class="button-elem"
              :type="route.name === value.route ? 'primary' : 'default'"
              large
              quaternary
    >
      <template #icon v-if="value.showIconOnDesktop || windowWidth < 500">
        <FontAwesomeIcon :icon="value.icon"/>
      </template>
      {{ value.name }}
    </n-button>
  </component>
</template>

<script setup lang="ts">
import {DropdownOption, NButton, NDropdown} from "naive-ui";
import type {NavButton} from "@/util/NavButton";
import type {PropType, Ref} from "vue";
import {RouterLink, useRoute} from "vue-router";
import {computed, h, onMounted, onUnmounted, ref} from "vue";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import LoginPopup from "@/components/LoginPopup.vue";

// Import composables
const route = useRoute();

// Set up props
const props = defineProps({
  value: {
    type: Object as PropType<NavButton>,
    required: true
  }
})

// Add computed window width
const windowWidth = ref(window.innerWidth);
onMounted(() => window.addEventListener("resize", updateWindowWidth));
onUnmounted(() => window.removeEventListener("resize", updateWindowWidth));

function updateWindowWidth() {
  windowWidth.value = window.innerWidth;
}

// Computed list of children for the dropdown. If there are no children, then the dropdown is not shown.
const children: Ref<DropdownOption[]> = computed(() => {
  const dropdownOptions: DropdownOption[] = []

  for (const child of props.value.children ?? []) {
    // Push the NaiveUI configuration for the button into the options list.
    dropdownOptions.push({
      type: "render",
      key: child.name,
      render: () => h(child.route === "login" ? LoginPopup : RouterLink,
        child.route === "login" ? {} : {
          to: {name: child.route},
          ariaCurrentValue: route.name === child.route ? "page" : null
        }, () => [
          h(NButton, {
            class: "navbar-dropdown-button",
            type: "default",
            large: true,
            quaternary: true,
          }, () => [
            h(FontAwesomeIcon, {
              class: "navbar-dropdown-button-icon",
              icon: child.icon
            }),
            child.name
          ])
        ])
    });
  }

  return dropdownOptions;
})
</script>

<style scoped lang="scss">

.button-elem {
  font-size: 1.2em;
}

// Tablets & Computers
@media (min-width: 500px) {
  // Uppercase buttons not on mobile
  .button-elem {
    text-transform: uppercase;
  }
}
</style>
