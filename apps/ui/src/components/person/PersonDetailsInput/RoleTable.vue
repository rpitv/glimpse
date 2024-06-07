<template>
  <div class="top-bar">
    <ProductionSearch document-name="Roles" @search="refetchRole"/>
    <div class="buttons">
      <RouterPopup
        v-if="ability.can(AbilityActions.Create, AbilitySubjects.Role)"
        :max-width="1100" v-model="showCreatePopup"
        :to="{ name: 'dashboard-role-create' }"
      >
        <CreateRoleCard
          closable
          @save="
                refresh();
                showCreatePopup = false;
              "
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
     :items-length="queryData.result.value ? queryData.result.value.roleCount : 0"
     :page="currentPage"
     :items="queryData.result.value?.roles"
     no-data-text="No roles found 💀"
     v-model:sort-by="order"
     :loading="queryData.loading.value"
     loading-text="Loading Roles..."
     :headers="roleHeader"
  >
    <template #item.description="{ item }">
      {{ item.description?.trim().length ? item : "No description" }}
    </template>
    <template #item.actions="{ item }">
      <VBtn variant="outlined" class="text-none"
          :disabled="roles.findIndex(
          (ele) => ele.id === item.id && ele.name === item.name) !== -1 ||
          !ability.can(AbilityActions.Create, subject(AbilitySubjects.Role, {roleId: item.id}))"
          @click="emit('addRole', item.id, item.name)">
        Add Role
      </VBtn>
    </template>
    <template v-slot:bottom>
      <v-pagination
        v-model="currentPage"
        :length="!!queryData.result.value?.roleCount ? Math.ceil(queryData.result.value?.roleCount / take) : 0"
        @update:modelValue="loadRoles"
      />
    </template>
  </v-data-table-server>
</template>

<script setup lang="ts">
import ProductionSearch from "@/components/DashboardSearch.vue";
import {
  AbilitySubjects, CaseSensitivity,
  RoleOrderableFields,
  OrderDirection,
  SearchRolesDocument
} from "@/graphql/types";
import {useQuery} from "@vue/apollo-composable";
import {ref, watch} from "vue";
import type {PropType} from "vue";
import {subject} from "@casl/ability";
import {ability, AbilityActions} from "@/casl";
import RouterPopup from "@/components/util/RouterPopup.vue";
import CreateRoleCard from "@/components/role/CreateRoleCard.vue";

const props = defineProps({
  take: {
    type: Number,
    required: true
  },
  roles: {
    type: Object as PropType<Array<{id: number | null, name: string, startTime: Date, endTime: Date}>>,
    required: true
  },
});

const emit = defineEmits(["addRole"]);

const roleHeader = [
  { title: "ID", sortable: true, key: "id" },
  { title: "Name", sortable: true, key: "name" },
  { title: "Description", sortable: false, key: "description"},
  { title: "Actions", sortable: false, key: "actions", minWidth: "150px"}
]
const order = ref<{key: string, order: string}[]>([]);
const currentPage = ref(1);
const showCreatePopup = ref<boolean>(false);

interface Options {
  name?: { contains: string, mode?: CaseSensitivity.Insensitive },
  id?: { equals: number }
}

const queryData = useQuery(SearchRolesDocument, {
  pagination: { take: props.take },
  order: [{
    direction: "Desc" as OrderDirection,
    field: "id" as RoleOrderableFields
  }],
  filter: {
    name: { contains: '', mode: CaseSensitivity.Insensitive }
  }
});

async function loadRoles(page: number) {
  await queryData.refetch({
    pagination: {
      take: props.take,
      skip: (page - 1) * props.take
    }
  });
  currentPage.value = page;
}

async function refetchRole(filter: string, type: string) {
  let options: Options = { name: { contains: '' } }
  if (type === "ID")
    options.id = { equals: parseInt(filter) }
  else
    options = { name: { contains: filter as string, mode: CaseSensitivity.Insensitive } }
  console.log(options);
  await queryData.refetch({
    filter: options,
    order: [{ direction: "Desc" as OrderDirection, field: "id" as RoleOrderableFields }]
  });
}

watch(order, () => {
  if (order.value.length)
    queryData.refetch({
      order: [{
        direction: order.value[0].order.charAt(0).toUpperCase() + order.value[0].order.slice(1) as OrderDirection,
        field: order.value[0].key as RoleOrderableFields
      }]
    })
  else
    queryData.refetch({
      order: [{direction: "Desc" as OrderDirection, field: "id" as RoleOrderableFields }]
    })
});

async function refresh() {
  await queryData.refetch();
}

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
