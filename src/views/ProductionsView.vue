<template>
  <div class="loading" v-if="response.loading.value">
    <n-spin size="large">
      <template #description>
        Loading...
      </template>
    </n-spin>
  </div>
  <div v-else>
    <pre>{{response.result}}</pre>
  </div>
</template>

<script setup lang="ts">
import { NSpin } from "naive-ui";
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
  .loading {
    display: flex;
    justify-content: center;
    padding-top: 5em;
  }
</style>
