<template>
  <n-tooltip>
    <template #trigger>
      {{ relativeTime }}
    </template>
    {{ absoluteTime }}
  </n-tooltip>
</template>

<script setup lang="ts">
import { NTooltip } from "naive-ui";
import { computed } from "vue";
import moment from "moment";

const props = defineProps({
  date: {
    type: Date,
    required: true
  }
});

const relativeTime = computed(() => {
  return moment(props.date).fromNow();
});

const absoluteTime = computed(() => {
  return moment(props.date).format("MMM Do, YYYY h:mm:ss A");
});

</script>

<style scoped lang="scss">

</style>
