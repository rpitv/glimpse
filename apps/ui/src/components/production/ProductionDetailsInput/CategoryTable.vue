<template>
  <div class="top-bar">
    <DashboardSearch document-name="Categories" @search="refetchCategory"/>
    <div class="buttons">
      <RouterPopup
        v-if="ability.can(AbilityActions.Create, AbilitySubjects.Image)"
        :max-width="1100" v-model="showCreatePopup"
        :to="{ name: 'dashboard-category-create' }"
      >
        <CreateCategoryCard
          closable
          @save="(category: Category) => {
						emit('setCategory', category);
            refresh();
            showCreatePopup = false;
					}"
          @close="showCreatePopup = false"
        />
        <template #trigger>
          <v-btn class="top-button text-none" variant="outlined" rounded color="green"
            prepend-icon="fa-light fa-plus">
            Create
          </v-btn>
        </template>
      </RouterPopup>
      <v-btn @click="refresh()" prepend-icon="fa-light fa-arrows-rotate" variant="outlined"
         rounded class="text-none top-button">
          Refresh
      </v-btn>
    </div>
  </div>
  <v-data-table-server class="table" height="300px"
   :items-per-page="take"
   :items-length="queryData.result.value ? queryData.result.value.categoryCount : 0"
   :items-per-page-options="[{value: take, title: `${take}`}]"
   :page="currentPage"
   :items="queryData.result.value?.categories"
   no-data-text="No categories found 💀"
   v-model:sort-by="order"
   :loading="queryData.loading.value"
   loading-text="Loading Categories..."
   :headers="categoryHeader"
  >
    <template #item.actions="{ item }">
      <VBtn variant="outlined" class="text-none"
            :disabled="(productionCategory?.id === item.id)"
            @click="emit('setCategory', item)">
        Set As Category
      </VBtn>
    </template>
    <template v-slot:bottom>
      <v-pagination
        v-model="currentPage"
        :length="!!queryData.result.value?.categoryCount ? Math.ceil(queryData.result.value?.categoryCount / take) : 0"
        @update:modelValue="loadCategories"
      />
    </template>
  </v-data-table-server>
</template>

<script setup lang="ts">
import DashboardSearch from "@/components/DashboardSearch.vue";
import {
  AbilitySubjects,
  CaseSensitivity,
  CategoryOrderableFields,
  OrderDirection,
  SearchCategoriesDocument
} from "@/graphql/types";
import type { Category } from "@/graphql/types";
import { useQuery } from "@vue/apollo-composable";
import { ref, watch, onMounted } from "vue";
import type { PropType } from "vue";
import { ability, AbilityActions } from "@/casl";
import RouterPopup from "@/components/util/RouterPopup.vue";
import CreateCategoryCard from "@/components/category/CreateCategoryCard.vue";

const props = defineProps({
  take: {
    type: Number,
    required: true
  },
  productionCategory: {
    type: Object as PropType<Category>,
    required: true
  }
});


const emit = defineEmits(["setCategory"])

const categoryHeader = [
  { title: "ID", sortable: true, key: "id" },
  { title: "Name", sortable: true, key: "name" },
  { title: "Actions",  sortable: false, key: "actions", minWidth: "150px"}
]
const order = ref<{key: string, order: string}[]>([]);
const currentPage = ref(1);
const showCreatePopup = ref<boolean>(false);

interface Options {
  name?: { contains: string, mode?: CaseSensitivity.Insensitive },
  id?: { equals: number }
}

const queryData = useQuery(SearchCategoriesDocument, {
  pagination: { take: props.take },
  order: [{
    direction: "Desc" as OrderDirection,
    field: "id" as CategoryOrderableFields
  }],
  filter: {
    name: { contains: '' }
  }
});

async function loadCategories(page: number) {
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
    options = { name: { contains: filter as string, mode: CaseSensitivity.Insensitive } };
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
});

async function refresh() {
  await queryData.refetch();
}

onMounted(async () => {
  await refresh();
});
</script>

<style scoped lang="scss">
.top-bar {
  display: flex;
  align-items: center;
}
.buttons {
  display:  flex;
}
.top-button {
  margin-bottom: 1.5rem;
  margin-left: 1rem;
  float: right;
}
.table {
  border-style: solid;
  border-color:  #a9aeb3;
  border-radius: 5px;
}
</style>
