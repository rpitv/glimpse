<template>
  <div class="top-bar">
    <DashboardSearch document-name="Categories" @search="searchCategory" />
    <div class="buttons">
      <RouterPopup
          v-if="ability.can(AbilityActions.Create, AbilitySubjects.Production)"
          :max-width="1100" v-model="showCreatePopup"
          :to="{ name: 'dashboard-production-create' }"
      >
        <template #default>
          <CreateRoleCard
              closable
              @save="(id: number) => {
              showCreatePopup = false;
              refresh();
              createdCategory = { id: id, show: true };
            }"
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
        <p>Created Role {{ createdCategory.id }}</p>
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
  <n-layout>
    <!-- For some reason, I'm running into accessing undefined errors when n-data-table is not a child of another NaiveUI element -->
    <div style="overflow: auto">
      <n-data-table
        class="category-data-table"
        :columns="columns"
        :data="queryData.result.value?.categories ?? []"
        :row-key="(row) => row.id"
      />
    </div>
  </n-layout>
</template>

<script setup lang="ts">
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { NButton, NDataTable, NLayout, useDialog } from "naive-ui";
import { useMutation, useQuery } from "@vue/apollo-composable";
import {
  AbilitySubjects, CaseSensitivity, CategoryOrderableFields,
  DeleteCategoryDocument,
  FindCategoriesDocument, OrderDirection, RoleOrderableFields,
} from "@/graphql/types";
import type { Category } from "@/graphql/types";
import { computed, h, onMounted, ref } from "vue";
import { AbilityActions, useGlimpseAbility } from "@/casl";
import { subject } from "@casl/ability";
import { useRoute } from "vue-router";
import RouterPopup from "@/components/util/RouterPopup.vue";
import EditCategoryCard from "@/components/category/EditCategoryCard.vue";
import CreateCategoryCard from "@/components/category/CreateCategoryCard.vue";
import DashboardSearch from "@/components/DashboardSearch.vue";
import CreateRoleCard from "@/components/role/CreateRoleCard.vue";

const ability = useGlimpseAbility();
const dialog = useDialog();
const route = useRoute();
const take = 20;

const showCreatePopup = ref<boolean>(false);
const shownPopup = ref<string | null>(null);
const createdCategory = ref<{id: number, show: boolean}>({ id: 0, show: false });

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

const columns = [
  {
    key: "id",
    title: "ID",
    render(row: Category) {
      const rowPopupKey = `${row.id}-id`;
      const isPopupShown = computed<boolean>({
        get: () => shownPopup.value === rowPopupKey,
        set: (value: boolean) =>
          (shownPopup.value = value ? rowPopupKey : null),
      });
      return h(
        RouterPopup,
        {
          maxWidth: 900,
          to: {
            name: "dashboard-category-details-edit",
            params: { id: row.id },
          },
          modelValue: isPopupShown.value,
          "onUpdate:modelValue": (value: boolean) =>
            (isPopupShown.value = value),
        },
        {
          default: () =>
            h(EditCategoryCard, {
              closable: true,
              categoryId: BigInt(row.id),
              onSave: () => {
                isPopupShown.value = false;
                refresh();
              },
              onClose: () => {
                isPopupShown.value = false;
              },
            }),
          trigger: () => row.id,
        }
      );
    },
  },
  {
    key: "name",
    title: "Name",
    render(row: Category) {
      const rowPopupKey = `${row.id}-name`;
      const isPopupShown = computed<boolean>({
        get: () => shownPopup.value === rowPopupKey,
        set: (value: boolean) =>
          (shownPopup.value = value ? rowPopupKey : null),
      });
      return h(
        RouterPopup,
        {
          maxWidth: 900,
          to: {
            name: "dashboard-category-details-edit",
            params: { id: row.id },
          },
          modelValue: isPopupShown.value,
          "onUpdate:modelValue": (value: boolean) =>
            (isPopupShown.value = value),
        },
        {
          default: () =>
            h(EditCategoryCard, {
              closable: true,
              categoryId: BigInt(row.id),
              onSave: () => {
                isPopupShown.value = false;
                refresh();
              },
              onClose: () => {
                isPopupShown.value = false;
              },
            }),
          trigger: () => row.name,
        }
      );
    },
  },
  {
    key: "priority",
    title: "Priority",
  },
  {
    key: "actions",
    title: "Actions",
    render: (row: Category) => {
      const rowPopupKey = `${row.id}-edit`;
      const isPopupShown = computed<boolean>({
        get: () => shownPopup.value === rowPopupKey,
        set: (value: boolean) =>
          (shownPopup.value = value ? rowPopupKey : null),
      });
      const buttons = [];
      if (
        ability.can(
          AbilityActions.Update,
          subject(AbilitySubjects.Category, { ...row })
        )
      ) {
        buttons.push(
          h(
            RouterPopup,
            {
              maxWidth: 900,
              to: {
                name: "dashboard-category-details-edit",
                params: { id: row.id },
              },
              modelValue: isPopupShown.value,
              "onUpdate:modelValue": (value: boolean) =>
                (isPopupShown.value = value),
            },
            {
              default: () =>
                h(EditCategoryCard, {
                  closable: true,
                  categoryId: BigInt(row.id),
                  onSave: () => {
                    isPopupShown.value = false;
                    refresh();
                  },
                  onClose: () => {
                    isPopupShown.value = false;
                  },
                }),
              trigger: () =>
                h(
                  NButton,
                  {
                    class: "dashboard-categories-page-row-button",
                    type: "info",
                    secondary: true,
                    size: "small",
                  },
                  () => "Edit"
                ),
            }
          )
        );
      }
      if (
        ability.can(
          AbilityActions.Delete,
          subject(AbilitySubjects.Category, { ...row })
        )
      ) {
        buttons.push(
          h(
            NButton,
            {
              class: "dashboard-categories-page-row-button",
              type: "error",
              secondary: true,
              size: "small",
              onClick: () =>
                dialog.error({
                  title: "Delete Category",
                  content: `Are you sure you want to delete the category "${row.name}"? This will also remove the category from associated productions and parent/child categories.`,
                  positiveText: "Delete Category",
                  negativeText: "Cancel",
                  onPositiveClick: async () => {
                    await deleteMutation.mutate({ id: row.id });
                    await refresh();
                  },
                }),
            },
            () => "Delete"
          )
        );
      }
      return h("div", {}, buttons);
    },
  },
];

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

onMounted(async () => {
  await refresh();
});

async function refresh() {
  await queryData.refetch();
}
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
