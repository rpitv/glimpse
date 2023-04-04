<template>
  <n-card class="edit-group-card">
    <h1>Edit Group {{ groupId }}</h1>
  </n-card>
</template>

<script setup lang="ts">
import { NCard } from "naive-ui";
import type { PropType } from "vue";

const props = defineProps({
  groupId: {
    type: BigInt as unknown as PropType<BigInt>,
    required: true,
  },
});
</script>

<style scoped lang="scss"></style>
