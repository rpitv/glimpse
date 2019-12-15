<template>
  <div class="container">
    <VRow>
      <VCol sm="8">
        <VSkeletonLoader type="image,article" height="400" class="intro-image-lg" />
      </VCol>
      <VCol sm="4">
        <VSkeletonLoader type="image" class="intro-image-sm" />
        <VSkeletonLoader type="image" class="intro-image-sm" />
      </VCol>
    </VRow>
    <VRow>
      <VCol lg="6">
        <h1>Catch our next livestream:</h1>
        <div class="player-wrapper">
          <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/kMyrghxpwy4"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          />
        </div>
      </VCol>
      <VCol lg="6">
        <h1>We are RPI TV.</h1>
        <p>
          RPI TV is a student-run organization at Rensselaer Polytechnic Institute dedicated to providing
          the best television broadcasts of RPI events.
        </p>
        <p>
          Interested in joining the club? We meet every Tuesday at 9pm in the Rensselaer Union, room 3202. If
          this doesn't work for you, get in contact with us! <NuxtLink to="/join">
            More information can be found here.
          </NuxtLink>
        </p>
      </VCol>
    </VRow>
    <h2>Recent Productions</h2>
    <div class="past-prod-list">
      <VSkeletonLoader v-for="n in 10" :index="n" type="card, list-item-two-line" class="past-prod-card" />
    </div>
  </div>
</template>

<script lang="ts">
export default {

}
</script>

<style lang="scss" scoped>
  .player-wrapper iframe {
    border: 0;
  }
  .intro-image-sm {
    height: 160px;
    margin-bottom: 15px;
  }

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
