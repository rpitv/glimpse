<template>
  <div class="loading" v-if="response.loading.value">
    <v-progress-circular indeterminate :size="54" color="red">
    </v-progress-circular>
    Loading...
  </div>
  <div v-else class="production-cards">
    <ProductionCard v-for="production in response.result.value?.productions" class="production-card" :key="production.id"
    :id="parseInt(production.id)" :name="production.name" :description="production.description" :start-time="new Date(production.startTime)"
    :thumbnail-url="production.thumbnail?.path ?? undefined"/>
  </div>
</template>

<script setup lang="ts">
import {useQuery} from "@vue/apollo-composable";
import {FindAllProductionsDocument} from "@/graphql/types";
import ProductionCard from "@/components/ProductionCard.vue";

let pageSize = 20;

const response = useQuery(FindAllProductionsDocument, {
  pagination: {
    take: pageSize
  }
});
</script>

<style scoped lang="scss">
.loading {
  display: flex;
  justify-content: center;
  padding-top: 5em;
}

.production-cards {
  padding: 7vw;
  display: grid;
  grid-template-columns: repeat(auto-fill, 300px);
  grid-gap: 1em;
  justify-content: center;
}
</style>
