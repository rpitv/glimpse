<template>
  <div class="player-wrapper">
    <!--    <VSkeletonLoader type="image,card-heading,paragraph" class="player" boilerplate />-->
    <!-- TODO - Added for demonstration -->
    <VideoCard :video-id="0" class="video-card" />
  </div>
</template>

<script>
import VideoCard from './VideoCard'
export default {
  name: 'NextLivestream',
  components: { VideoCard }
}
</script>

<style lang="scss" scoped>
  .player-wrapper {
  }
  .video-card {
    padding-top: 56.25%;
  }
</style>
