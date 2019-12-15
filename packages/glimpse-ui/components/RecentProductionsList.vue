<template>
  <div class="past-prod-list">
    <VSkeletonLoader v-for="n in 10" :index="n" type="card, list-item-two-line" class="past-prod-card" boilerplate />
  </div>
</template>

<script lang="ts">
export default {
  name: 'RecentProductionsList'
}
</script>

<style lang="scss" scoped>
  .past-prod-list {
    white-space: nowrap;
    overflow-x: scroll;
    .past-prod-card {
      display: inline-block;
      width: 300px;
      margin-right: 20px;
    }
  }
</style>
