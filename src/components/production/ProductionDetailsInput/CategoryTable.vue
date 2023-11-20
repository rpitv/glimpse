<template>
  <ProductionSearch document-name="Categories" @search="refetchCategory"/>
  <v-data-table-server class="table" height="300px"
   :items-per-page="take"
   :items-length="queryData.result.value ? queryData.result.value.categoryCount : 0"
   :items-per-page-options="[{value: take, title: `${take}`}]"
   :show-current-page="true"
   :page="currentPage" @update:page="loadProductions"
   :items="queryData.result.value?.categories"
   no-data-text="No categories found 💀"
   v-model:sort-by="order"
   :loading="queryData.loading.value"
   loading-text="Loading Categories..."
   :headers="categoryHeader"
  >
    <template #item.actions="{ item }">
      <VBtn variant="outlined" class="text-none"
            :disabled="(productionCategory.id === item.id)"
            @click="emit('setCategory', { id: item.id, name: item.name as string})">
        Set As Category
      </VBtn>
    </template>
  </v-data-table-server>
</template>

<script setup lang="ts">
import ProductionSearch from "@/components/production/ProductionSearch.vue";
import {
  CaseSensitivity,
  CategoryOrderableFields,
  OrderDirection,
  SearchCategoriesDocument
} from "@/graphql/types";
import {useQuery} from "@vue/apollo-composable";
import {ref, watch} from "vue";
import type {PropType} from "vue";

const props = defineProps({
  take: {
    type: Number,
    required: true
  },
  productionCategory: {
    type: Object as PropType<{id: string, name: string}>,
    required: true
  }
});

const emit = defineEmits(["setCategory"])

const categoryHeader = [
  { title: "ID", sortable: true, key: "id" },
  { title: "Name", sortable: true, key: "name" },
  { title: "Actions",  sortable: false, key: "actions"}
]
const order = ref<{key: string, order: string}[]>([]);
const currentPage = ref(1);

interface Options {
  name?: { contains: string },
  id?: { equals: number }
}

const queryData = useQuery(SearchCategoriesDocument, {
  pagination: { take: props.take },
  order: [{
    direction: "Desc" as OrderDirection,
    field: "id" as CategoryOrderableFields
  }],
  filter: {
    name: { contains: '', mode: CaseSensitivity.Insensitive }
  }
});

async function loadProductions(page: number) {
  await queryData.refetch({
    pagination: {
      take: props.take,
      skip: (page - 1) * props.take
    }
  });
  currentPage.value = page;
}

async function refetchCategory(filter: string, type: string) {
  let options: Options = { name: { contains: '' } }
  if (type === "ID")
    options.id = { equals: parseInt(filter) };
  else
    options = { name: { contains: filter as string } };
  await queryData.refetch({
    filter: options,
    order: [{ direction: "Desc" as OrderDirection, field: "id" as CategoryOrderableFields }]
  });
}

watch(order, () => {
  if (order.value.length)
    queryData.refetch({
      order: [{
        direction: order.value[0].order.charAt(0).toUpperCase() + order.value[0].order.slice(1) as OrderDirection,
        field: order.value[0].key as CategoryOrderableFields
      }]
    })
  else
    queryData.refetch({
      order: [{direction: "Desc" as OrderDirection, field: "id" as CategoryOrderableFields }]
    })
})
</script>

<style scoped lang="scss">
.table {
  border-style: solid;
  border-color:  #a9aeb3;
  border-radius: 5px;
}

</style>
