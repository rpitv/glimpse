<template>
<div>
  <h1>Edit User {{ id }}</h1>
</div>
</template>

<script setup lang="ts">

import type { PropType } from "vue";

const props = defineProps({
  id: {
    type: BigInt as unknown as PropType<BigInt>,
    required: true
  }
});
</script>

<style scoped lang="scss">

</style>
