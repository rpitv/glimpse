<template>
  <UserDetailsCard :id="id" />
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { computed } from "vue";
import UserDetailsCard from "@/components/user/UserDetailsCard.vue";

const route = useRoute();

const id = computed(() => BigInt(route.params.id.toString()));
</script>

<style scoped lang="scss">

</style>
