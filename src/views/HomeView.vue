<template>
  <div class="container">
    <div class="about-wrapper">
      <h1>We are RPI TV.</h1>
      <p>
        RPI TV is a student-run organization at Rensselaer Polytechnic
        Institute dedicated to providing the best television broadcasts
        of RPI events.
      </p>
    </div>

    <n-grid x-gap="2" :cols="2">
      <n-gi cols="12" sm="6">
        <h1 class="item-header" v-if="liveProductions.result.value?.findManyProduction">We're Live:</h1>
        <h1 class="item-header" v-else-if="upComingProductions.result.value?.findManyProduction">Catch our next livestream:</h1>
        <div v-if="liveProductions.result.value?.findManyProduction" v-for="production in liveProductions.result.value?.findManyProduction">
          <NextLivestream :production="production"/>
        </div>
        <div v-else-if="upComingProductions.result.value?.findManyProduction" v-for="production in upComingProductions.result.value?.findManyProduction">
          <NextLivestream :production="production"/>
        </div>
      </n-gi>
      <n-gi cols="12" sm="6">
        <h1 class="item-header">Our recent productions:</h1>
        <!--<RecentProductionsList />-->
      </n-gi>
    </n-grid>
  </div>
</template>

<script setup lang="ts">
import { NGrid, NGi } from "naive-ui";
import {useQuery} from "@vue/apollo-composable";
import {FindLiveProductionsDocument, FindUpcomingProductionsDocument} from "@/graphql/types";
import NextLivestream from "@/components/NextLivestream.vue";

const liveProductions = useQuery(FindLiveProductionsDocument, {
  now: new Date().toISOString()
})

const upComingProductions = useQuery(FindUpcomingProductionsDocument, {
  now: new Date().toISOString()
})

</script>

<style scoped lang="scss">
.item-header {
  text-align: center;
}

.about-wrapper {
  width: 100%;
  text-align: center;

  h1 {
    font-size: 40px;
    margin-bottom: 20px;
  }

  p {
    font-size: 20px;
    font-weight: 300;
    display: inline-block;
    max-width: 600px;
  }
}
</style>
