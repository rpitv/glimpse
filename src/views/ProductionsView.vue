<template>
  <div v-if="!response.result">
    <h1>Loading...</h1>
  </div>
  <div v-else>
    <pre>{{response.result}}</pre>
  </div>
</template>

<script setup lang="ts">
import { useQuery } from "@vue/apollo-composable";
import gql from "graphql-tag";

let toggledAdvancedSearch = false;
let searchValue = "";
let pageSize = 20;
let prevPageIndex = 0;

const response = useQuery(gql`query ProductionsGetProductions($prevProductionIndex: Int!, $pageSize: Int!,
            $searchVal: String, $isAdvancedSearch: Boolean) {
        productions: productions(pageSize: $pageSize, prevProductionIndex: $prevProductionIndex,
            searchCtx: $searchVal, advancedSearch: $isAdvancedSearch) {
          id
          name
          startTime
          thumbnail {
            link
          }
        }
      }`,
  {
    prevProductionIndex: prevPageIndex,
    pageSize: pageSize,
    searchVal: searchValue,
    isAdvancedSearch: toggledAdvancedSearch
  }, {
    errorPolicy: "all"
  });
</script>

<style scoped lang="scss">

</style>
