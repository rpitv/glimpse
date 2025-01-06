<template>
  <div></div>
</template>

<script setup lang="ts">
import {useRoute, useRouter} from "vue-router";

// Redirect to edit page
const router = useRouter();
const route = useRoute();
router.replace(route.fullPath + '/edit')
</script>

<style scoped lang="scss">

</style>
