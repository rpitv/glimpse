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
    <div class="loading pa-10" v-if="upComingProductions.loading.value || liveProductions.loading.value || recentProductions.loading.value">
      <div style="display: flex; justify-content: center">
        <v-progress-circular :indeterminate="true" color="error"/>
      </div>
      Loading...
    </div>
    <div v-else class="available-productions">
      <div v-if="liveProductions.result.value?.productions.length" class="soon-productions">
        <h1 class="text-center mt-5">We're Live!</h1>
        <NextLivestream :productions="liveProductions.result.value.productions" />
      </div>
      <div v-else-if="upComingProductions.result.value?.productions.length" class="soon-productions">
        <h1 class="text-center mt-5">Upcoming Productions:</h1>
        <UpcomingProductionsList :productions="upComingProductions.result.value.productions" />
      </div>
      <div v-if="recentProductions.result.value?.productions.length" class="recent-productions">
        <h1 class="text-center mt-5">Recent Productions: </h1>
        <RecentProductionsList :productions="recentProductions.result.value.productions" />
      </div>
    </div>
    <p class="contact mt-10">Contact us at rpitv@union.lists.rpi.edu</p>
  </div>
</template>

<script setup lang="ts">
import {useQuery} from "@vue/apollo-composable";
import {
  FindLiveProductionsDocument, FindRecentProductionsDocument,
  FindUpcomingProductionsDocument
} from "@/graphql/types";
import NextLivestream from "@/components/NextLivestream.vue";
import RecentProductionsList from "@/components/RecentProductionsList.vue";
import UpcomingProductionsList from "@/components/UpcomingProductionsList.vue";


const liveProductions = useQuery(FindLiveProductionsDocument, {
  now: new Date().toISOString(),
  pagination: {
    take: 10
  }
});

const upComingProductions = useQuery(FindUpcomingProductionsDocument, {
  now: new Date().toISOString(),
  pagination: {
    take: 10
  }
});

const recentProductions = useQuery(FindRecentProductionsDocument, {
  pagination: {
    take: 4
  },
  date: new Date().toISOString()
})

</script>

<style scoped lang="scss">
.loading {
  display: flex;
  justify-content: center;
  flex-direction: column;
  text-align: center;
}
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

.available-productions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 20px;
  @media (max-width: 1100px){
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }
}

.soon-productions {
  min-width: 300px;
  width: 100%;
}

.recent-productions {
  width: 100%;
  @media (max-width: 1100px) {
    margin-top: 100px;
  }
}
</style>
