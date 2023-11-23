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
    <n-grid v-if="liveProductions.result.value?.findManyProduction.length || upComingProductions.result.value?.findManyProduction.length" x-gap="2"
            cols="1 850:2" responsive="self"
    >
      <n-gi sm="6" v-if="liveProductions.result.value?.findManyProduction.length !== 0">
        <h1 class="item-header">We're Live:</h1>
        <div v-for="production in liveProductions.result.value?.findManyProduction">
          <NextLivestream :production="production"/>
        </div>
      </n-gi>
      <n-gi v-else-if="upComingProductions.result.value?.findManyProduction.length !== 0">
        <h1 class="item-header">Catch our next livestream:</h1>
        <div v-for="production in upComingProductions.result.value?.findManyProduction">
          <NextLivestream :production="production"/>
        </div>
      </n-gi>
      <n-gi sm="6" >
        <h1 class="item-header">Our recent productions:</h1>
        <RecentProductionsList ref="recentProductions"/>
      </n-gi>
    </n-grid>
    <div v-else>
      <h1 class="item-header">Our recent productions:</h1>
      <RecentProductionsList ref="recentProductions"/>
    </div>
    <p class="contact">Contact us at rpitv@union.lists.rpi.edu</p>
  </div>
</template>

<script setup lang="ts">
import { NGrid, NGi, NButton } from "naive-ui";
import {useQuery} from "@vue/apollo-composable";
import {
  FindLiveProductionsDocument,
  FindRecentProductionsDocument,
  FindUpcomingProductionsDocument
} from "@/graphql/types";
import NextLivestream from "@/components/NextLivestream.vue";
import RecentProductionsList from "@/components/RecentProductionsList.vue";


const liveProductions = useQuery(FindLiveProductionsDocument, {
  now: new Date().toISOString(),
  pagination: {
    take: 3
  }
})

const upComingProductions = useQuery(FindUpcomingProductionsDocument, {
  now: new Date().toISOString(),
  pagination: {
    take: 3
  }
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
.contact {
  text-align: center;
  font-style: italic;
}
</style>
