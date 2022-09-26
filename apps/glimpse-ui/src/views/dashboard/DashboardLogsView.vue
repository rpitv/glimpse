<template>
  <DashboardBreadcrumb :route="breadcrumbRoute"/>
</template>

<script setup lang="ts">
import DashboardBreadcrumb from "@/components/DashboardBreadcrumb.vue";


const breadcrumbRoute = [
  {name: 'Dashboard', route: '/dashboard'},
  {name: 'Logs', route: '/dashboard/logs'}
];

</script>

<style scoped lang="scss">

</style>
