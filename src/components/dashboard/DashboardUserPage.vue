<template>
  <UserDetailsCard :id="props.id" />
</template>

<script setup lang="ts">
import type { PropType } from "vue";
import UserDetailsCard from "@/components/dashboard/UserDetailsCard.vue";

const props = defineProps({
  id: {
    type: BigInt as unknown as PropType<BigInt>,
    required: true
  }
});
</script>

<style scoped lang="scss">

</style>
