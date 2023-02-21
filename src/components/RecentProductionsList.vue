<template>
  <n-grid cols="350:1 650:2 950:3 1250:4 1550:5 1850:6" y-gap="10" :collapsed="true" :collapsed-rows="rows">
    <n-grid-item v-for="production in response.result.value?.findManyProduction" class="productions">
      <ProductionCard
        :id="parseInt(production.id)" :start-time="new Date(production.startTime)" :description="production.description" :name="production.name" />
    </n-grid-item>
  </n-grid>
  <div class="more">
    <n-button @click="rows++">Load More...</n-button>
  </div>
</template>

<script setup lang="ts">
import ProductionCard from "@/components/ProductionCard.vue";
import { useQuery } from "@vue/apollo-composable";
import { FindRecentProductionsDocument } from "@/graphql/types";
import { NButton, NGrid, NGridItem } from "naive-ui";
import { ref } from "vue";

const response = useQuery(FindRecentProductionsDocument)

const rows = ref<number>(2);
</script>

<style scoped lang="scss">
.productions {
  display: flex;
  justify-content: center;
}
.more {
  display: flex;
  justify-content: center;
  margin: 2% 0;
}
</style>
