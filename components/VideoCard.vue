<template>
  <div class="aspect-ratio-maintain">
    <!-- TODO - Added for demonstration -->
    <iframe
      src="https://www.youtube.com/embed/shqIYTVrFvo"
      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    />
  </div>
</template>

<script>
import gql from 'graphql-tag'
export default {
  name: 'VideoCard',
  props: {
    videoId: {
      type: Number,
      default: 0
    }
  },
  apollo: {
    video: {
      prefetch: false,
      query: gql`
        query VideoCardGetVideo($id: Int!) {
          video:getVideo(id: $id) {
#            data
            id
            name
            videoType
          }
        }`,
      variables () {
        return {
          id: this.videoId
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .aspect-ratio-maintain {
    position: relative;
    width: 100%;

    iframe {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      border: none;
    }
  }
</style>
