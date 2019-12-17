<template>
  <div>
    <VRow>
      <VCol sm="8">
        <VSheet><VSkeletonLoader type="image,article" height="400" class="image-lg" boilerplate /></VSheet>
      </VCol>
      <VCol sm="4">
        <VSheet><VSkeletonLoader type="image" class="image-sm" boilerplate /></VSheet>
        <VSheet><VSkeletonLoader type="image" class="image-sm" boilerplate /></VSheet>
      </VCol>
    </VRow>
  </div>
</template>

<script>
export default {
  name: 'LandingHighlights'
}
</script>

<style lang="scss" scoped>

  * {
    z-index: 1;
  }
  .image-sm {
    height: 160px;
    margin-bottom: 15px;
  }
</style>
