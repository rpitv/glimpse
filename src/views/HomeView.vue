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

    <n-grid x-gap="12" cols="xs:1 s:2" responsive="screen">
      <n-gi v-if="live || futureStreams">
        <n-grid cols="1">
          <n-gi cols="12" sm="6" v-if="futureStreams" >
            <h1 class="item-header">
              Catch our next livestream:
              <iframe class="player" src="https://www.youtube.com/embed/dQw4w9WgXcQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen />
            </h1>
          </n-gi>
          <n-gi v-if="live">
            <h1 class="item-header">
              We're Live:
              <iframe class="player" src="https://www.youtube.com/embed/dQw4w9WgXcQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen />
            </h1>
          </n-gi>
        </n-grid>
      </n-gi>
      <n-gi cols="12" sm="6">
        <h1 class="item-header">Our recent productions</h1>
        <n-grid cols="1">
          <n-gi>
            <n-grid cols="1 s:1 l:2 xl:3" :x-gap="12" :y-gap="12" responsive="screen">
              <n-gi v-for="production in response.result.value?.productions">
                <ProductionCard class="production-cards" :id="parseInt(production.id)" :start-time="new Date(production.startTime)"
                  :description="production.description" :name="production.name" :thumbnail-url="production.thumbnail?.path ?? undefined"/>
              </n-gi>
            </n-grid>
          </n-gi>
          <n-gi>
            <NButton class="more" @click="getMore">View More...</NButton>
          </n-gi>
        </n-grid>
      </n-gi>
      <n-gi>
        <h1 class="item-header">
          Services
          <n-grid cols="2">
            <n-gi>
              <n-card title="Live Streaming">
                TEST
                <template #footer>
                  <a>Contact Us</a>
                </template>
              </n-card>
            </n-gi>
            <n-gi>
              <n-card title="Filming">
                TEST
                <template #footer>
                  <a>Contact Us</a>
                </template>
              </n-card>
            </n-gi>
            <n-gi>
              <n-card title="Editing">
                TEST
                <template #footer>
                  <a>Contact Us</a>
                </template>
              </n-card>
            </n-gi>
            <n-gi>
              <n-card title="Something else?">
                TEST
                <template #footer>
                  <a>Contact Us</a>
                </template>
              </n-card>
            </n-gi>
          </n-grid>
        </h1>
      </n-gi>
    </n-grid>
  </div>
</template>

<script setup lang="ts">
import { NGrid, NGi, NButton, NCard } from "naive-ui";
import {useQuery} from "@vue/apollo-composable";
import {FindAllProductionsDocument} from "@/graphql/types";
import ProductionCard from "@/components/ProductionCard.vue";

let pageSize = 6;

const response = useQuery(FindAllProductionsDocument, {
  pagination: {
    take: pageSize,
  },
});

const getMore = () => {
  pageSize += 2;
  response.refetch({
    pagination: {
      take: pageSize
    }
  });
}

const live = false;
const futureStreams = false;

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

.player {
  aspect-ratio: 16/9;
  width: 100%;
}

.production-cards {
  display: block;
  margin-left: auto;
  margin-right: auto;
}

.more {
  display: block;
  margin: 20px auto;
}

</style>
