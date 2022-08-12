<template>
  <DashboardBreadcrumb :route="breadcrumbRoute"/>
</template>

<script setup lang="ts">
import DashboardBreadcrumb from "@/components/DashboardBreadcrumb.vue";


const breadcrumbRoute = [
  {name: 'Dashboard', route: '/dashboard'},
  {name: 'People', route: '/dashboard/people'}
];

</script>

<style scoped lang="scss">

</style>
