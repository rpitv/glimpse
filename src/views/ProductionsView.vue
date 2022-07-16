<template>
  <div class="loading" v-if="response.loading.value">
    <n-spin size="large">
      <template #description>
        Loading...
      </template>
    </n-spin>
  </div>
  <div v-else>
    <pre>{{ response.result }}</pre>
  </div>
</template>

<script setup lang="ts">
import {NSpin} from "naive-ui";
import {useQuery} from "@vue/apollo-composable";
import {FindAllProductionsDocument} from "@/graphql/types";

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
</style>
