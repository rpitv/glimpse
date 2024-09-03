<template>
  <div class="top-bar">
    <DashboardSearch document-name="People" @search="searchPerson" />
    <div class="buttons">
      <RouterPopup
          v-if="ability.can(AbilityActions.Create, AbilitySubjects.Person)"
          :max-width="1100" v-model="showCreatePopup"
          :to="{ name: 'dashboard-person-create' }"
      >
        <template #default>
          <CreatePersonCard
              @save="(id: number) => {
              showCreatePopup = false;
              refresh();
              createdPerson = { id: id, show: true };
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
      <v-snackbar v-model="createdPerson.show" color="green-darken-1" class="text-center">
        <p>Created Person {{ createdPerson.id }}</p>
        <template #actions>
          <v-btn @click="createdPerson.show = false" icon="fa-circle-xmark"/>
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
     :items-length="queryData.result.value ? queryData.result.value.personCount : 0"
     :page="currentPage" :headers="headers"
     :items="queryData.result.value?.people"
     no-data-text="No people found 💀"
     v-model:sort-by="order"
     :loading="queryData.loading.value"
     loading-text="Loading People..."
    >
      <template #item.description="{ item }">
        {{ item.description?.length ? item.description : "No description provided." }}
      </template>
      <template #item.actions="{ index, item }">
        <RouterPopup
          v-if="ability.can(AbilityActions.Update, subject(AbilitySubjects.Person, {
            id: item.id,
            name: item.name,
          }))"
          :max-width="1100" v-model="list[index]"
          :to="{ name: 'dashboard-person-details-edit', params: {id: item.id } }"
          @update:modelValue="(value: boolean) => { shownPopup = value ? item.id : null}"
        >
          <EditPersonCard
            @save="(id) => {
                list[index] = false;
                refresh();
                editedPerson = { id: id, show: true };
              }
            "
            :personId="BigInt(item.id)"
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
            <v-card title="Delete Person">
              <v-card-text>
                Are you sure you want to delete the person "{{item.name}}"? This will also remove its members.
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn @click="isActive.value = false" variant="outlined" text="Cancel"/>
                <v-btn @click="deletePerson(item)" variant="outlined"
                       text="Delete" color="#FF5252" :disabled="isDeleting" />
              </v-card-actions>
            </v-card>
          </template>
        </v-dialog>
      </template>
      <template v-slot:bottom>
        <v-pagination
          v-model="currentPage"
          :length="!!queryData.result.value?.personCount ? Math.ceil(queryData.result.value?.personCount / take) : 1"
          @update:modelValue="loadPeople"
        />
      </template>
    </v-data-table-server>
    <v-snackbar v-model="editedPerson.show" color="green-darken-1" class="text-center">
      <p>Edited Person {{ editedPerson.id }}</p>
      <template #actions>
        <v-btn @click="editedPerson.show = false" icon="fa-circle-xmark"/>
      </template>
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { useMutation, useQuery } from "@vue/apollo-composable";
import {
  AbilitySubjects, CaseSensitivity,
  DeletePersonDocument,
  FindPeopleDocument, OrderDirection, PersonOrderableFields,
} from "@/graphql/types";
import type { Person } from "@/graphql/types";
import { watch, onMounted, ref } from "vue";
import { AbilityActions, useGlimpseAbility } from "@/casl";
import { subject } from "@casl/ability";
import RouterPopup from "@/components/util/RouterPopup.vue";
import EditPersonCard from "@/components/person/EditPersonCard.vue";
import DashboardSearch from "@/components/DashboardSearch.vue";
import CreatePersonCard from "@/components/person/CreatePersonCard.vue";

const ability = useGlimpseAbility();
const showCreatePopup = ref<boolean>(false);
const shownPopup = ref<string | null>(null);
const list = ref<boolean[]>([]);
const isDeleting = ref(false);
const currentPage = ref(1);
const order = ref<{key: string, order: string}[]>([]);
const createdPerson = ref({ id: 0, show: false });
const editedPerson = ref({ id: 0, show: false });
const take = 20;

for (let i = 0; i < take; i++)
  list.value[i] = false;

const queryData = useQuery(FindPeopleDocument, {
  pagination: {
    take: 20,
    skip: 0,
  },
  order: [{
    direction: "Asc" as OrderDirection,
    field: "id" as PersonOrderableFields,
  }]
});
const deleteMutation = useMutation(DeletePersonDocument);

const headers = [
  { title: "ID", sortable: true, key: "id" },
  { title: "Name", key: "name", sortable: true },
  { title: "Description", key: "description", sortable: false},
  { title: "Actions", key: "actions", sortable: false, minWidth: "150px" }
]

async function loadPeople(page: number) {
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

async function searchPerson(value: string, type: string) {
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
      field: "id" as PersonOrderableFields,
    }]
  });
}

async function deletePerson(person: Person) {
  try {
    isDeleting.value = true;
    await deleteMutation.mutate({id: parseInt(person.id)});
    await refresh();
  } catch (e) {
    console.error(e);
  }
  isDeleting.value = false;
}

function canDelete(person: Person): boolean {
  return ability.can(AbilityActions.Delete, subject(AbilitySubjects.Person, {
    id: person.id,
    name: person.name,
    description: person.description,
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
        field: order.value[0].key as PersonOrderableFields
      }]
    })
  else
    queryData.refetch({
      order: [{direction: "Desc" as OrderDirection, field: "id" as PersonOrderableFields }]
    })
});

onMounted(async () => {
  await refresh();
});
</script>

<style lang="scss">
.dashboard-role-page-row-button {
  margin-right: 0.5rem;
}
</style>

<style scoped lang="scss">
.person-data-table {
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
