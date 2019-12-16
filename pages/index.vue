<template>
  <div class="container">
    <HomeBackgroundShape class="bg-shape" />
    <LandingHighlights />
    <VRow>
      <VCol lg="6">
        <h1>Catch our next livestream:</h1>
        <NextLivestream />
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
    <RecentProductionsList />
  </div>
</template>

<script lang="ts">
import HomeBackgroundShape from '../components/TheHomeBackgroundShape.vue'
import RecentProductionsList from '~/components/RecentProductionsList.vue'
import NextLivestream from '~/components/NextLivestream.vue'
import LandingHighlights from '~/components/LandingHighlights.vue'
export default {
  components: {
    LandingHighlights,
    NextLivestream,
    RecentProductionsList,
    HomeBackgroundShape
  }
}
</script>

<style lang="scss" scoped>
  .bg-shape {
    position: absolute;
    top: -65px;
    left: 0;
  }
</style>
