<template>
  <DashboardBreadcrumb :route="breadcrumbRoute"/>
</template>

<script setup lang="ts">
import DashboardBreadcrumb from "@/components/DashboardBreadcrumb.vue";


const breadcrumbRoute = [
  {name: 'Dashboard', route: '/dashboard'},
  {name: 'Users', route: '/dashboard/users'}
];

</script>

<style scoped lang="scss">

</style>
