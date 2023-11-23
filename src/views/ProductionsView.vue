<template>
  <v-infinite-scroll :onLoad="getMoreProductions" style="overflow-y: hidden; ">
    <div class="production-cards">
      <template v-for="production in productions" :key="production.id">
        <ProductionCard  class="production-card"
           :id="parseInt(production.id)" :name="production.name" :description="production.description ? production.description : ''"
           :start-time="new Date(production.startTime)" :thumbnail-url="production.thumbnail?.path ?? undefined"/>
      </template>
    </div>
    <template #loading>
      <div class="glimpse-loading">
        <v-progress-circular indeterminate :size="54" color="#ff6363" />
        Loading...
      </div>
    </template>
    <template #empty>
    </template>
  </v-infinite-scroll>
</template>

<script setup lang="ts">
import {useQuery} from "@vue/apollo-composable";
import {FindAllProductionsDocument, OrderDirection, ProductionOrderableFields} from "@/graphql/types";
import ProductionCard from "@/components/ProductionCard.vue";
import {onMounted, ref} from "vue";
import type { Production } from "@/graphql/types";

const take = 20;
const skip = ref(0);
const productions = ref<Partial<Production>[]>([]);
const response = useQuery(FindAllProductionsDocument, {
  order: [{
    direction: OrderDirection.Desc,
    field: ProductionOrderableFields.Id
  }]
});
let totalProductions = response.result.value?.totalProductions ? response.result.value?.totalProductions : 0;

async function getMoreProductions({ done }) {
  try {
    await response.refetch({
      pagination: {
        take: take,
        skip: skip.value,
      }
    });
    totalProductions = response.result.value?.totalProductions ? response.result.value?.totalProductions : 0;
    if (response.result.value) {
      for (const production of response.result.value.productions)
        productions.value.push(production);
    }
    if (totalProductions <= productions.value.length)
      done('empty');
    else
      done('ok');
    skip.value = skip.value + take;
  } catch (e) {
    done('error');
  }
}

</script>

<style scoped lang="scss">
.production-cards {
  padding: 7vw;
  display: grid;
  grid-template-columns: repeat(auto-fill, 300px);
  grid-gap: 1em;
  justify-content: center;
}

.glimpse-loading {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100px;
}
</style>
