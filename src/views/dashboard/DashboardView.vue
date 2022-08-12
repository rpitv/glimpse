<template>
  <div class="dashboard-view">
    <DashboardBreadcrumb :route="[{name: 'Dashboard', route: '/dashboard'}]"/>
    <div class="dashboard-buttons">
      <DashboardCard v-if="canViewAssetsDashboard()" :icon="['fal', 'box-open-full']" name="Assets"
                     route="dashboardAssets"/>
      <DashboardCard v-if="canViewBlogPostsDashboard()" :icon="['fal', 'newspaper']" name="Blog Posts"
                     route="dashboardBlogPosts"/>
      <DashboardCard v-if="canViewCategoriesDashboard()" :icon="['fal', 'layer-group']" name="Categories" route="dashboardCategories"/>
      <DashboardCard v-if="canViewContactSubmissionsDashboard()" :icon="['fal', 'message-lines']" name="Contact Submissions" route="dashboardContactSubmissions"/>
      <DashboardCard v-if="canViewGroupsDashboard()" :icon="['fal', 'users-line']" name="Groups" route="dashboardGroups"/>
      <DashboardCard v-if="canViewImagesDashboard()" :icon="['fal', 'images']" name="Images" route="dashboardImages"/>
      <DashboardCard v-if="canViewLogsDashboard()" :icon="['fal', 'clipboard-list']" name="Logs" route="dashboardLogs"/>
      <DashboardCard v-if="canViewPeopleDashboard()" :icon="['fal', 'address-card']" name="People" route="dashboardPeople"/>
      <DashboardCard v-if="canViewProductionsDashboard()" :icon="['fal', 'clapperboard']" name="Productions" route="dashboardProductions"/>
      <DashboardCard v-if="canViewRedirectsDashboard()" :icon="['fal', 'signs-post']" name="Redirects" route="dashboardRedirects"/>
      <DashboardCard v-if="canViewUsersDashboard()" :icon="['fal', 'user']" name="Users" route="dashboardUsers"/>
      <DashboardCard v-if="canViewVideosDashboard()" :icon="['fal', 'video']" name="Videos" route="dashboardVideos"/>
      <DashboardCard v-if="canViewVotesDashboard()" :icon="['fal', 'ballot-check']" name="Votes" route="dashboardVotes"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import DashboardBreadcrumb from "@/components/DashboardBreadcrumb.vue";
import DashboardCard from "@/components/DashboardCard.vue";
import {
  canViewAssetsDashboard,
  canViewBlogPostsDashboard,
  canViewCategoriesDashboard,
  canViewContactSubmissionsDashboard,
  canViewGroupsDashboard,
  canViewImagesDashboard,
  canViewLogsDashboard,
  canViewPeopleDashboard,
  canViewProductionsDashboard,
  canViewRedirectsDashboard,
  canViewUsersDashboard,
  canViewVideosDashboard,
  canViewVotesDashboard
} from "@/casl";
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
