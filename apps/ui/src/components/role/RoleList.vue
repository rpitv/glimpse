<template>
  <div class="top-bar">
    <DashboardSearch document-name="Roles" @search="searchRole" />
    <div class="buttons">
      <RouterPopup
        v-if="ability.can(AbilityActions.Create, AbilitySubjects.Role)"
        :max-width="1100" v-model="showCreatePopup"
        :to="{ name: 'dashboard-role-create' }"
      >
        <template #default>
          <CreateRoleCard
              closable
              @save="(id: number) => {
              showCreatePopup = false;
              refresh();
              createdRole = { id: id, show: true };
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
      <v-snackbar v-model="createdRole.show" color="green-darken-1" class="text-center">
        <p>Created Role {{ createdRole.id }}</p>
        <template #actions>
          <v-btn @click="createdRole.show = false" icon="fa-circle-xmark"/>
        </template>
      </v-snackbar>
      <v-btn @click="refresh()" prepend-icon="fa-light fa-arrows-rotate" variant="outlined"
           rounded class="text-none top-button">
        Refresh
      </v-btn>
    </div>
  </div>
  <div>
    <v-data-table-server class="table"
       :items-per-page="take"
       :items-length="queryData.result.value ? queryData.result.value.roleCount : 0"
       :page="currentPage" :headers="headers"
       :items="queryData.result.value?.roles"
       no-data-text="No roles found 💀"
       v-model:sort-by="order"
       :loading="queryData.loading.value"
       loading-text="Loading Roles..."
    >
      <template #item.actions="{ index, item }">
        <RouterPopup
          v-if="ability.can(AbilityActions.Update, subject(AbilitySubjects.Role, {
            id: item.id,
            name: item.name,
            priority: item.priority
          }))"
          :max-width="1100" v-model="list[index]"
          :to="{ name: 'dashboard-role-details-edit', params: {id: item.id } }"
          @update:modelValue="(value: boolean) => { shownPopup = value ? item.id : null}"
        >
          <EditRoleCard
            @close="
                list[index] = false
                refresh();"
            :roleId="BigInt(item.id)"
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
            <v-card title="Delete Role">
              <v-card-text>
                Are you sure you want to delete the role "{{item.name}}"? This will also remove its members.
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn @click="isActive.value = false" variant="outlined" text="Cancel"/>
                <v-btn @click="deleteRole(item)" variant="outlined"
                       text="Delete" color="#FF5252" :disabled="isDeleting" />
              </v-card-actions>
            </v-card>
          </template>
        </v-dialog>
      </template>
      <template v-slot:bottom>
        <v-pagination
          v-model="currentPage"
          :length="!!queryData.result.value?.roleCount ? Math.ceil(queryData.result.value?.roleCount / take) : 1"
          @update:modelValue="loadRoles"
        />
      </template>
    </v-data-table-server>
  </div>
</template>

<script setup lang="ts">
import { useMutation, useQuery } from "@vue/apollo-composable";
import {
  AbilitySubjects, CaseSensitivity,
  DeleteRoleDocument,
  FindRolesDocument, OrderDirection, RoleOrderableFields,
} from "@/graphql/types";
import type { Role } from "@/graphql/types";
import { watch, onMounted, ref } from "vue";
import { AbilityActions, useGlimpseAbility } from "@/casl";
import { subject } from "@casl/ability";
import RouterPopup from "@/components/util/RouterPopup.vue";
import EditRoleCard from "@/components/role/EditRoleCard.vue";
import CreateRoleCard from "@/components/role/CreateRoleCard.vue";
import DashboardSearch from "@/components/DashboardSearch.vue";

const ability = useGlimpseAbility();
const showCreatePopup = ref<boolean>(false);
const shownPopup = ref<string | null>(null);
const list = ref<boolean[]>([]);
const isDeleting = ref(false);
const currentPage = ref(1);
const order = ref<{key: string, order: string}[]>([]);
const createdRole = ref<{id: number, show: boolean}>({ id: 0, show: false });
const take = 20;

for (let i = 0; i < take; i++)
  list.value[i] = false;

const queryData = useQuery(FindRolesDocument, {
  pagination: {
    take: 20,
    skip: 0,
  },
  order: [{
    direction: "Asc" as OrderDirection,
    field: "id" as RoleOrderableFields,
  }]
});
const deleteMutation = useMutation(DeleteRoleDocument);

const headers = [
  { title: "ID", sortable: true, key: "id" },
  { title: "Name", key: "name", sortable: true },
  { title: "Priority", key: "priority", sortable: true},
  { title: "Actions", key: "actions", sortable: false }
]

async function loadRoles(page: number) {
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

async function searchRole(value: string, type: string) {
  let filter: Filter = {
    name: { contains: '', mode: CaseSensitivity.Insensitive }
  };
  if (value) {
    if (type === "Name")
      filter.name.contains = value.trim();
    if (type === "ID")
      filter.id = { equals: parseInt(value) }
  }
  await queryData.refetch({
    pagination: {
      take: take,
      skip: 0
    },
    filter,
    order: [{
      direction: "Asc" as OrderDirection,
      field: "id" as RoleOrderableFields,
    }]
  });
}

async function deleteRole(role: Role) {
  try {
    isDeleting.value = true;
    await deleteMutation.mutate({id: parseInt(role.id)});
    await refresh();
  } catch (e) {
    console.error(e);
  }
  isDeleting.value = false;
}

function canDelete(role: Role): boolean {
  return ability.can(AbilityActions.Delete, subject(AbilitySubjects.Role, {
    id: role.id,
    name: role.name,
    description: role.description,
  }))
}

async function refresh() {
  await queryData.refetch();
}

watch(order, () => {
  if (order.value.length)
    queryData.refetch({
      order: [{
        // It's either asc or desc and we need to capitalize it
        direction: order.value[0].order.charAt(0).toUpperCase() + order.value[0].order.slice(1) as OrderDirection,
        field: order.value[0].key as RoleOrderableFields
      }]
    })
  else
    queryData.refetch({
      order: [{direction: "Desc" as OrderDirection, field: "id" as RoleOrderableFields }]
    })
});

onMounted(async () => {
  await refresh();
});
</script>

<style lang="scss">
.dashboard-roles-page-row-button {
  margin-right: 0.5rem;
}
</style>

<style scoped lang="scss">
.role-data-table {
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
