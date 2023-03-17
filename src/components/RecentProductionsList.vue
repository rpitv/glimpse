<template>
  <n-grid cols="350:1 650:2 950:3 1250:4 1550:5 1850:6" y-gap="10" :collapsed="true" :collapsed-rows="2">
    <n-grid-item v-for="production in response.result.value?.findManyProduction" class="productions">
      <ProductionCard
        :id="parseInt(production.id)" :start-time="new Date(production.startTime)" :description="production.description" :name="production.name" />
    </n-grid-item>
  </n-grid>
  <div class="link">
    <router-link to="productions" style="text-decoration: none"><NButton>See more...</NButton></router-link>
  </div>
</template>

<script setup lang="ts">
import ProductionCard from "@/components/ProductionCard.vue";
import { NButton, NGrid, NGridItem } from "naive-ui";
import { useQuery } from "@vue/apollo-composable";
import { FindRecentProductionsDocument } from "@/graphql/types";

const response = useQuery(FindRecentProductionsDocument, {
  paginationInput: {
    take: 12
  }
})

</script>

<style scoped lang="scss">
.productions {
  display: flex;
  justify-content: center;
}
.link {
  display: flex;
  justify-content: center;
  margin: 20px;
}

</style>
