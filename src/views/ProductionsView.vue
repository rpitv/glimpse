<template>
  <div style="margin-left: 7%; margin-top: 7%; width: 86%">
    <v-text-field variant="outlined" label="Search for Productions"
      append-inner-icon="fa-magnifying-glass" @click:append-inner="search" @keydown.enter="search" v-model="searchVal"
    />
    <v-expansion-panels class="mb-5">
      <v-expansion-panel title="Production Filters">
        <v-expansion-panel-text>
          <v-checkbox label="Name" false-icon="fa-square" v-model="filterName" />
          <v-checkbox label="Tag" false-icon="fa-square" v-model="filterTag" />
          <v-checkbox label="Category" false-icon="fa-square" v-model="filterCategory" />
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
  <v-infinite-scroll :onLoad="getMoreProductions" style="overflow-y: hidden; ">
    <div class="production-cards">
      <template v-for="production in productions" :key="production.id">
        <ProductionCard  class="production-card"
           :id="parseInt(production.id)" :name="production.name" :end-time="new Date(production.endTime)"
           :description="production.description?.length ? production.description : 'No description provided'"
           :start-time="new Date(production.startTime)" :thumbnail-url="production.thumbnail?.path ?? undefined"/>
      </template>
    </div>
    <template #loading>
    </template>
    <template #empty>
    </template>
  </v-infinite-scroll>
  <div class="glimpse-loading" v-if="response.loading.value">
      <v-progress-circular indeterminate :size="54" color="#ff6363" />
      Loading...
  </div>
  <div v-if="response.result.value?.totalProductions === 0 && !response.loading.value" style="text-align: center">
    <h1>No productions found...</h1>
  </div>
</template>

<script setup lang="ts">
import {useQuery} from "@vue/apollo-composable";
import type {Production} from "@/graphql/types";
import {
  CaseSensitivity,
  FindAllProductionsDocument,
  FindCategoriesDocument,
  FindProductionTagsDocument,
  OrderDirection,
  ProductionOrderableFields
} from "@/graphql/types";
import ProductionCard from "@/components/ProductionCard.vue";
import {computed, ref} from "vue";


const take = 20;
const skip = ref(0);
const productions = ref<Set<Partial<Production>>>(new Set([]));
const searchVal = ref("");
const filterName = ref(false);
const filterTag = ref(false);
const filterCategory = ref(false);

const response = useQuery(FindAllProductionsDocument, {
  order: [{
    direction: OrderDirection.Desc,
    field: ProductionOrderableFields.StartTime
  }]
});
const tags = useQuery(FindProductionTagsDocument, {
  filter: {}
});
const categories = useQuery(FindCategoriesDocument, {
  filter: {}
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
        productions.value.add(production);
    }
    if (totalProductions <= productions.value.size)
      done('empty');
    else
      done('ok');
    skip.value = skip.value + take;
  } catch (e) {
    done('error');
  }
}

const noneChecked = computed(() => {
  if (!filterTag.value && !filterCategory.value && !filterName.value)
    return true;
})

async function search() {
  try {
    skip.value = 0;
    productions.value = new Set<Partial<Production>>();
    const filter = [];

    if (filterName.value || noneChecked.value)
      filter.push({name: { contains: searchVal.value, mode: CaseSensitivity.Insensitive}})
    if (filterCategory.value || noneChecked.value) {
      const filteredCategories = await categories.refetch({
        filter: {name: {contains: searchVal.value, mode: CaseSensitivity.Insensitive}}
      });
      if (filteredCategories?.data.categories.length)
      filter.push({OR: filteredCategories?.data.categories.map(category => ({categoryId: {equals: parseInt(category.id)}}))});
    }
    if (filterTag.value || noneChecked.value) {
      const filteredTags = await tags.refetch({
        filter: {tag: {contains: searchVal.value, mode: CaseSensitivity.Insensitive}}
      });
      if (filteredTags?.data.tags.length)
        filter.push({OR: filteredTags.data.tags.map(tag => ({id: {equals: parseInt(tag.productionId)}}))});
    }

    if (!filter.length)
      filter.push({name: {equals: ""}});
    /*
      This query takes productions from either a production matching the name,
      a production that has the same category id, or tags that match the production
      that they're in.
    */
    await response.refetch({
      pagination: {
        take: take,
        skip: skip.value,
      },
      filter: {
        OR: filter
      }
    });
    totalProductions = response.result.value?.totalProductions ? response.result.value?.totalProductions : 0;
    if (response.result.value) {
      for (const production of response.result.value.productions)
        productions.value.add(production);
    }
  } catch (e) {
    console.log(e);
  }
}

</script>

<style scoped lang="scss">
.production-cards {
  margin: 0 7%;
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
