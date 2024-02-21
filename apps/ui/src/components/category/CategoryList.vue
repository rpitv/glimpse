<template>
  <div class="top-bar">
    <DashboardSearch document-name="Categories" @search="searchCategory" />
    <div class="buttons">
      <RouterPopup
          v-if="ability.can(AbilityActions.Create, AbilitySubjects.Category)"
          :max-width="1100" v-model="showCreatePopup"
          :to="{ name: 'dashboard-category-create' }"
      >
        <template #default>
          <CreateCategoryCard
              closable
              @save="(id: number) => {
                showCreatePopup = false;
                refresh();
                createdCategory = { id: id, show: true };
              }"
              @close="showCreatePopup = false"
          />
        </template>
        <template #trigger>
          <v-btn class="top-button text-none" variant="outlined" rounded color="green"
                 prepend-icon="fa-light fa-plus">
            Create
          </v-btn>
        </template>
      </RouterPopup>
      <v-snackbar v-model="createdCategory.show" color="green-darken-1" class="text-center">
        <p>Created Category {{ createdCategory.id }}</p>
        <template #actions>
          <v-btn @click="createdCategory.show = false" icon="fa-circle-xmark"/>
        </template>
      </v-snackbar>
      <v-btn @click="refresh()" prepend-icon="fa-light fa-arrows-rotate" variant="outlined"
             rounded class="text-none top-button">
        Refresh
      </v-btn>
    </div>
  </div>
  <div>
    <v-data-table-server
      :items-per-page="take"
      :items-length="queryData.result.value ? queryData.result.value?.categoryCount : 0"
      @update:page="loadCategories"
      :page="currentPage" :headers="headers"
      :items="queryData.result.value?.categories"
      no-data-text="No categories found 💀"
      v-model:sort-by="order"
      :loading="queryData.loading.value"
      loading-text="Loading categories"
    >
      <template #item.actions="{ index, item}">
        <RouterPopup
          v-if="ability.can(AbilityActions.Update, subject(AbilitySubjects.Category, {
            id: item.id,
            name: item.name,
            priority: item.priority
          }))"
          :max-width="1100" v-model="list[index]"
          :to="{ name: 'dashboard-category-details-edit', params: {id: item.id } }"
          @update:modelValue="(value: boolean) => { shownPopup = value ? item.id : null}"
        >
          <EditCategoryCard
            @close="
                list[index] = false
                refresh();"
            :categoryId="BigInt(item.id)"
            :closable="true"

          />
          <template #trigger>
            <v-btn variant="flat" icon="fa-pen" color="green-darken-3" size="small" class="mr-2"/>
          </template>
        </RouterPopup>
        <v-dialog max-width="500">
          <template #activator="{ props }">
            <v-btn variant="flat" size="small" color="red-darken-4" v-bind="props" v-if="canDelete(item)" icon="fa-trash" />
          </template>
          <template #default="{ isActive }">
            <v-card title="Delete Category">
              <v-card-text>
                Are you sure you want to delete the category "{{item.name}}"? This will also remove its members.
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn @click="isActive.value = false" variant="outlined" text="Cancel"/>
                <v-btn @click="deleteCategory(item)" variant="outlined"
                       text="Delete" color="#FF5252" :disabled="isDeleting" />
              </v-card-actions>
            </v-card>
          </template>
        </v-dialog>
      </template>
      <template v-slot:bottom>
        <v-pagination
          v-model="currentPage"
          :length="!!queryData.result.value?.categoryCount / take ? Math.ceil(queryData.result.value?.categoryCount / take) : 1"
          @update:modelValue="loadCategories"
        />
      </template>
    </v-data-table-server>
  </div>
</template>

<script setup lang="ts">
import { useMutation, useQuery } from "@vue/apollo-composable";
import {
  AbilitySubjects, CaseSensitivity, CategoryOrderableFields,
  DeleteCategoryDocument, FindCategoriesDocument, OrderDirection,
} from "@/graphql/types";
import type { Category } from "@/graphql/types";
import { onMounted, ref, watch } from "vue";
import { AbilityActions, useGlimpseAbility } from "@/casl";
import { subject } from "@casl/ability";
import RouterPopup from "@/components/util/RouterPopup.vue";
import EditCategoryCard from "@/components/category/EditCategoryCard.vue";
import CreateCategoryCard from "@/components/category/CreateCategoryCard.vue";
import DashboardSearch from "@/components/DashboardSearch.vue";

const ability = useGlimpseAbility();
const showCreatePopup = ref<boolean>(false);
const shownPopup = ref<string | null>(null);
const list = ref<boolean[]>([]);
const isDeleting = ref(false);
const currentPage = ref(1);
const order = ref<{key: string, order: string}[]>([]);
const createdCategory = ref<{id: number, show: boolean}>({ id: 0, show: false });
const take = 20;

for (let i = 0; i < take; i++)
  list.value[i] = false;

const queryData = useQuery(FindCategoriesDocument, {
  pagination: {
    take: 20,
    skip: 0,
  },
  order: [{
    direction: "Asc" as OrderDirection,
    field: "id" as CategoryOrderableFields,
  }]
});
const deleteMutation = useMutation(DeleteCategoryDocument);

const headers = [
  { title: "ID", sortable: true, key: "id" },
  { title: "Name", key: "name", sortable: true },
  { title: "Priority", key: "priority", sortable: false },
  { title: "Actions", key: "actions", sortable: false, minWidth: "150px" }
]

async function loadCategories(page: number) {
  await queryData.refetch({
    pagination: {
      take: take,
      skip: (page - 1) * take
    }
  });
  currentPage.value = page;
}

interface Filter {
  name: { contains: string, mode: CaseSensitivity.Insensitive }
  id?: { equals?: number }
}

async function searchCategory(value: string, type: string) {
  let filter: Filter = {
    name: { contains: '', mode: CaseSensitivity.Insensitive }
  };
  if (value) {
    if (type === "Name")
      filter.name.contains = value.trim();
    if (type === "ID")
      filter.id = { equals: parseInt(value) }
  };
  await queryData.refetch({
    pagination: {
      take: take,
      skip: 0
    },
    filter,
    order: [{
      direction: "Asc" as OrderDirection,
      field: "id" as CategoryOrderableFields,
    }]
  });
}

async function deleteCategory(category: Category) {
  try {
    isDeleting.value = true;
    await deleteMutation.mutate({id: parseInt(category.id)});
    await refresh();
  } catch (e) {
    console.error(e);
  }
  isDeleting.value = false;
}

async function refresh() {
  await queryData.refetch();
}

function canDelete(category: Category): boolean {
  return ability.can(AbilityActions.Delete, subject(AbilitySubjects.Category, {
    id: category.id,
    name: category.name,
    priority: category.priority
  }))
}

watch(order, () => {
  if (order.value.length)
    queryData.refetch({
      order: [{
        // It's either asc or desc and we need to capitalize it
        direction: order.value[0].order.charAt(0).toUpperCase() + order.value[0].order.slice(1) as OrderDirection,
        field: order.value[0].key as CategoryOrderableFields
      }]
    })
  else
    queryData.refetch({
      order: [{direction: "Desc" as OrderDirection, field: "id" as CategoryOrderableFields }]
    })
});

onMounted(async () => {
  await refresh();
});

</script>

<style lang="scss">
.dashboard-categories-page-row-button {
  margin-right: 0.5rem;
}
</style>

<style scoped lang="scss">
.category-data-table {
  min-width: 500px;
}

.top-button {
  margin-bottom: 1.5rem;
  margin-left: 1rem;
  float: right;
}

.top-bar {
  display: flex;
  align-items: center;
}

.buttons {
  display: flex;
}
</style>
