<template>
  <UserInputCard :id="id" />
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { computed } from "vue";
import UserInputCard from "@/components/user/EditUserCard.vue";

const route = useRoute();

const id = computed(() => BigInt(route.params.id.toString()));
</script>

<style scoped lang="scss">

</style>
