<template>
  <v-dialog v-model="isPopupShown" :style="`width: min(${maxWidth}px, 80%); z-index: 1500`" scrim="black" scrollable>
    <slot name="default"/>
  </v-dialog>
  <RouterLink v-if="to"
      :to="to"
      custom v-slot="{ href, navigate }">
      <a :href="href" :aria-current="route.name === to.name ? 'page' : null" style="height: 0"
         @click="onRouterLinkClicked">
        <slot name="trigger" style="position: absolute" />
      </a>
  </RouterLink>
  <span v-else @click="isPopupShown = true">
    <slot name="trigger" />
  </span>
</template>

<script setup lang="ts">
import { computed, PropType } from "vue";
import type { RouteLocationRaw } from "vue-router";
import { useRoute } from "vue-router";

const route = useRoute();

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  maxWidth: {
    type: Number,
    default: 500
  },
  to: {
    type: Object as PropType<RouteLocationRaw>,
    required: false
  }
});

const emit = defineEmits(['close', 'update:modelValue']);

// Wrap prop in a computed property to emit an event when it's set, pushing the responsibility of
//   updating the prop to the parent component.
const isPopupShown = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit('update:modelValue', value);
  }
});

function onClose() {
  emit('close');
}

function onRouterLinkClicked(event: PointerEvent) {
  if(event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) {
    return;
  }
  event.preventDefault();
  isPopupShown.value = true;
}

</script>

<style scoped lang="scss">

</style>
