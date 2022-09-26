<template>
  <DashboardBreadcrumb :route="breadcrumbRoute"/>
</template>

<script setup lang="ts">
import DashboardBreadcrumb from "@/components/DashboardBreadcrumb.vue";


const breadcrumbRoute = [
  {name: 'Dashboard', route: '/dashboard'},
  {name: 'Contact Submissions', route: '/dashboard/contact'}
];

</script>

<style scoped lang="scss">

</style>
