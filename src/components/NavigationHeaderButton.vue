<template>
  <component v-if="value.visible?.().value ?? true"
             :is="children.length > 0 ? NDropdown : 'div'"
             :placement="props.depth > 0 ? 'right-start' : 'bottom-end'"
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
        <v-btn class="button-elem"
            :color="route.name === value.route ? '#ff6363' : 'white'"
            :data-depth="props.depth"
            variant="text"
            size="small"
            style="letter-spacing: normal"
        >
          <FontAwesomeIcon v-if="props.depth > 0 || value.showIconOnDesktop || windowWidth < 500" :icon="value.icon" style="margin-right: 3px"/>
          {{ value.name }}
        </v-btn>
      </a>
    </RouterLink>
    <v-btn v-else
      class="button-elem"
      :type="route.name === value.route ? '#ff6363' : 'white'"
      :data-depth="props.depth"
      variant="text"
      size="small"
      style="letter-spacing: normal"
    >
      <FontAwesomeIcon v-if="props.depth > 0 || value.showIconOnDesktop || windowWidth < 500" :icon="value.icon"/>
      {{ value.name }}
    </v-btn>
  </component>
</template>

<script setup lang="ts">
import {DropdownOption, NDropdown} from "naive-ui";
import type {NavButton} from "@/util/NavButton";
import type {PropType, Ref} from "vue";
import {RouterLink, useRoute} from "vue-router";
import {computed, onMounted, onUnmounted, ref} from "vue";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {computeNavDropdownChildElement} from "@/util/helper";

// Import composables
const route = useRoute();

// Set up props
const props = defineProps({
  value: {
    type: Object as PropType<NavButton>,
    required: true
  },
  active: {
    type: Boolean as PropType<boolean | undefined>
  },
  depth: {
    type: Number,
    default: 0
  }
})

// Add computed window width
const windowWidth = ref(window.innerWidth);
onMounted(() => window.addEventListener("resize", updateWindowWidth));
onUnmounted(() => window.removeEventListener("resize", updateWindowWidth));

function updateWindowWidth() {
  windowWidth.value = window.innerWidth;
}

const isButtonActive: Ref<boolean> = computed(() => {
  if (props.active !== undefined) {
    return props.active;
  }

  return route.name === props.value.route;
})

// Computed list of children for the dropdown. If there are no children, then the dropdown is not shown.
const children: Ref<DropdownOption[]> = computed(() => {
  const dropdownOptions: DropdownOption[] = []

  for (const child of props.value.children ?? []) {
    // Push the NaiveUI configuration for the button into the options list.
    dropdownOptions.push(computeNavDropdownChildElement(child, props.depth));
  }

  return dropdownOptions;
})
</script>

<style scoped lang="scss">

.button-elem[data-depth="0"] {
  font-size: 1.2em;
}

// Tablets & Computers
@media (min-width: 500px) {
  // Uppercase buttons not on mobile
  .button-elem[data-depth="0"] {
    text-transform: uppercase;
  }
}

.button-elem:not([data-depth="0"]) {
  width: calc(100% - 10px);
  justify-content: start;
  margin: 0 5px;
}
</style>
