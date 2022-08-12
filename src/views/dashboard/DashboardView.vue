<template>
  <div class="dashboard-view">
    <DashboardBreadcrumb :route="[{name: 'Dashboard', route: '/dashboard'}]"/>
    <div class="dashboard-buttons">
      <DashboardCard :icon="['fal', 'box-open-full']" name="Assets" route="dashboardAssets"/>
      <DashboardCard :icon="['fal', 'newspaper']" name="Blog Posts" route="dashboardBlogPosts"/>
      <DashboardCard :icon="['fal', 'layer-group']" name="Categories" route="dashboardCategories"/>
      <DashboardCard :icon="['fal', 'message-lines']" name="Contact Submissions" route="dashboardContactSubmissions"/>
      <DashboardCard :icon="['fal', 'users-line']" name="Groups" route="dashboardGroups"/>
      <DashboardCard :icon="['fal', 'images']" name="Images" route="dashboardImages"/>
      <DashboardCard :icon="['fal', 'clipboard-list']" name="Logs" route="dashboardLogs"/>
      <DashboardCard :icon="['fal', 'address-card']" name="People" route="dashboardPeople"/>
      <DashboardCard :icon="['fal', 'clapperboard']" name="Productions" route="dashboardProductions"/>
      <DashboardCard :icon="['fal', 'signs-post']" name="Redirects" route="dashboardRedirects"/>
      <DashboardCard :icon="['fal', 'user']" name="Users" route="dashboardUsers"/>
      <DashboardCard :icon="['fal', 'video']" name="Videos" route="dashboardVideos"/>
      <DashboardCard :icon="['fal', 'ballot-check']" name="Votes" route="dashboardVotes"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import DashboardBreadcrumb from "@/components/DashboardBreadcrumb.vue";
import DashboardCard from "@/components/DashboardCard.vue";
</script>

<style scoped lang="scss">
.dashboard-view {
  padding: 2rem;
}
.dashboard-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fill, 12rem);
  grid-column-gap: 2rem;
  grid-row-gap: 3rem;
  justify-content: center;
}
</style>
