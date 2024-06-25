<template>
  <div class="top-bar">
    <DashboardSearch document-name="People" @search="refetchPeople"/>
    <div class="buttons">
      <RouterPopup
        v-if="ability.can(AbilityActions.Create, AbilitySubjects.Person)"
        :max-width="1100" v-model="showCreatePopup"
        :to="{ name: 'dashboard-category-create' }"
      >
        <CreatePersonCard
          @save="
            refresh();
            showCreatePopup = false;
          "
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
   :items-length="queryData.result.value ? queryData.result.value.personCount : 0"
   :items-per-page-options="[{value: take, title: `${take}`}]"
   :page="currentPage"
   :items="queryData.result.value?.people"
   no-data-text="No people found 💀"
   v-model:sort-by="order"
   :loading="queryData.loading.value"
   loading-text="Loading People..."
   :headers="personHeader"
  >
    <template #item.actions="{ item }">
      <VBtn variant="outlined" class="text-none"
          :disabled="people.findIndex(
          (ele) => ele.personId === item.id) !== -1 ||
          !ability.can(AbilityActions.Create, subject(AbilitySubjects.Credit, {imageId: item.id}))"
          @click="emit('addPerson', item.id, item.name as string)">
        Add Person
      </VBtn>
    </template>
    <template v-slot:bottom>
      <v-pagination
        v-model="currentPage"
        :length="!!queryData.result.value?.personCount ? Math.ceil(queryData.result.value?.personCount / take) : 0"
        @update:modelValue="loadPeople"
      />
    </template>
  </v-data-table-server>
</template>

<script setup lang="ts">
import DashboardSearch from "@/components/DashboardSearch.vue";
import { ability, AbilityActions } from "@/casl";
import {
  AbilitySubjects,
  PersonOrderableFields,
  OrderDirection,
  FindPeopleDocument, CaseSensitivity
} from "@/graphql/types";
import { useQuery } from "@vue/apollo-composable";
import {subject} from "@casl/ability";
import RouterPopup from "@/components/util/RouterPopup.vue";
import CreatePersonCard from "@/components/person/CreatePersonCard.vue";
import { ref, watch } from "vue";
import type { PropType } from "vue";

const props = defineProps({
  take: {
    type: Number,
    required: true,
  },
  people: {
    type: Object as PropType<{personId: number, name: string, title?: string, priority?: number}[]>,
    required: true
  }
});
const emit = defineEmits(["addPerson"])

const order = ref<{key: string, order: string}[]>([]);
const currentPage = ref(1);
const showCreatePopup = ref<boolean>(false);

interface Options {
  name?: { contains: string, mode?: CaseSensitivity.Insensitive },
  id?: { equals: number }
}

const queryData = useQuery(FindPeopleDocument, {
  pagination: { take: props.take },
  order: [{
    direction: "Desc" as OrderDirection,
    field: "id" as PersonOrderableFields
  }],
  filter: {
    name: { contains: '' }
  }
});

const personHeader = [
  { title: "ID", sortable: true, key: "id" },
  { title: "Name", sortable: true, key: "name" },
  { title: "Actions",  sortable: false, key: "actions", minWidth: "150px"}
]

async function refetchPeople(filter: string, type: string) {
  let options: Options = { name: { contains: '' } }
  if (type === "ID")
    options.id = { equals: parseInt(filter) };
  else
    options = { name: { contains: filter as string, mode: CaseSensitivity.Insensitive } };
  await queryData.refetch({
    filter: options,
    order: [{ direction: "Desc" as OrderDirection, field: "id" as PersonOrderableFields }]
  });
}

async function loadPeople(page: number) {
  await queryData.refetch({
    pagination: {
      take: props.take,
      skip: (page - 1) * props.take
    }
  });
  currentPage.value = page;
}

watch(order, () => {
  if (order.value.length)
    queryData.refetch({
      order: [{
        direction: order.value[0].order.charAt(0).toUpperCase() + order.value[0].order.slice(1) as OrderDirection,
        field: order.value[0].key as PersonOrderableFields
      }]
    })
  else
    queryData.refetch({
      order: [{direction: "Desc" as OrderDirection, field: "id" as PersonOrderableFields }]
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
  display: flex;
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
