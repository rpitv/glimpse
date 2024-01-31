<template>
  <div class="top-bar">
    <DashboardSearch :document-name="`${archived ? 'Archived' : 'Ongoing'} Submissions`" @search="searchSubmissions" />
    <div class="buttons">
      <v-btn @click="refresh" prepend-icon="fa-light fa-arrows-rotate" variant="outlined"
             rounded class="text-none top-button">
        Refresh
      </v-btn>
    </div>
  </div>
  <v-data-table-server
      :items-per-page="take"
      :items-length="queryData.result.value ? queryData.result.value?.totalSubmissions : 0 "
      :items-per-page-options="[{value: take, title: `${take}`}]"
      :show-current-page="true" @update:page="loadSubmissions"
      :page="currentPage" :headers="headers"
      :items="queryData.result.value?.contactSubmissions"
      no-data-text="No submissions found 💀"
      v-model:sort-by="order"
      :loading="queryData.loading.value"
      loading-text="Loading submissions..."
  >
    <template #item.actions="{ index, item }">
      <RouterPopup
          v-if="ability.can(AbilityActions.Read, subject(AbilitySubjects.ContactSubmission, {
            id: item.id,
            subject: item.subject,
          }))"
          :max-width="1100" v-model="list[index]"
          :to="{ name: 'dashboard-contact-submission-details-view', params: { id: item.id } }"
          @update:modelValue="(value: boolean) => { shownPopup = value ? item.id : null }"
      >
        <ViewSubmissionCard
            @save="(production: boolean, data: any) => {
              onSave(production, data);
              list[index] = false;
            }"
            :contactSubmissionId="BigInt(item.id)"
        />
        <template #trigger>
          <v-btn color="green-darken-3" class="mr-2" variant="flat" size="small" icon="eye" />
        </template>
      </RouterPopup>
      <v-dialog max-width="500" scrim="black">
        <template #activator="{ props }">
          <v-btn variant="flat" size="small" color="red-darken-4" v-bind="props" v-if="canDelete(item)" icon="fa-trash" />
        </template>
        <template #default="{ isActive }">
          <v-card title="Delete Submission">
            <v-card-text>
              Are you sure you want to delete the submission from "{{item.name}}"? This will also remove its members.
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn @click="isActive.value = false" variant="outlined" text="Cancel"/>
              <v-btn @click="deleteSubmission(item)" variant="outlined"
                     text="Delete" color="#FF5252" :disabled="isDeleting" />
            </v-card-actions>
          </v-card>
        </template>
      </v-dialog>
    </template>
  </v-data-table-server>
  <v-dialog v-if="!archived" max-width="700px" v-model="productionsModal" style="z-index: 1000">
    <v-card title="Create Production">
      <v-card-text>Would you like to create a production with some of these details autofilled?</v-card-text>
      <v-card-actions style="height: 100px">
        <VSpacer />
        <RouterPopup
          v-if="ability.can(AbilityActions.Create, AbilitySubjects.Production)"
          :max-width="1100" v-model="showCreatePopup"
          :to="{ name: 'dashboard-production-create' }"
        >
          <template #default>
            <CreateProductionCard
              closable
              @save="(id: number) => {
                showCreatePopup = false;
                createdProduction = { id: id, show: true };
                productionsModal = false;
              }"
              :data="productionData"
            />
          </template>
          <template #trigger>
            <v-btn variant="outlined" color="green-darken-3">Create</v-btn>
          </template>
        </RouterPopup>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-snackbar v-if="!archived" v-model="createdProduction.show" color="green-darken-1" class="text-center">
    <p>Created Production {{ createdProduction.id }}</p>
    <template #actions>
      <v-btn @click="createdProduction.show = false" icon="fa-circle-xmark"/>
    </template>
  </v-snackbar>
</template>

<script setup lang="ts">
import {AbilityActions, useGlimpseAbility} from "@/casl";
import {subject} from "@casl/ability";
import {
  AbilitySubjects, CaseSensitivity, ContactSubmissionOrderableFields,
  DeleteContactSubmissionDocument, FindContactSubmissionsDocument,
  OrderDirection
} from "@/graphql/types";
import type { Production, ContactSubmission } from "@/graphql/types";
import RouterPopup from "@/components/util/RouterPopup.vue";
import ViewSubmissionCard from "@/components/contactsubmissions/ViewSubmissionCard.vue";
import {useMutation, useQuery} from "@vue/apollo-composable";
import {ref, watch, onMounted} from "vue";
import DashboardSearch from "@/components/DashboardSearch.vue";
import CreateProductionCard from "@/components/production/CreateProductionCard.vue";

const ability = useGlimpseAbility();
const order = ref<{key: string, order: string}[]>([]);
const currentPage = ref(1);
const shownPopup = ref<string | null>(null);
const list = ref<boolean[]>([]);
const isDeleting = ref(false);
const createdProduction = ref<{id: number, show: boolean}>({ id: 0, show: false });
const showCreatePopup = ref<boolean>(false);
const productionsModal = ref(false);
const productionData = ref<Partial<Production>>();

const take = 20;

for (let i = 0; i < take; i++)
  list.value[i] = false;

// When an administrative user resolves or unresolves a submission, we want to tell the other component to refresh.
const props = defineProps({
  remoteRefresh: {
    type: Boolean,
    required: true
  },
  archived: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['refresh']);

const queryData = useQuery(FindContactSubmissionsDocument, {
  filter: {
    resolved: { equals: props.archived }
  },
  pagination: {
    take: take,
    skip: 0
  },
  order: [{
    field: "timestamp" as ContactSubmissionOrderableFields,
    direction: props.archived ? "Desc" as OrderDirection : "Asc" as OrderDirection
  }]
});

const deleteMutation = useMutation(DeleteContactSubmissionDocument);

function formattedTime(time: string) {
  const date = new Date(time);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short"
  };
  return new Intl.DateTimeFormat("en-US", options).format(date);
}

const headers = [
  { title: "ID", sortable: true, key: "id" },
  { title: "Name", key: "name", sortable: false },
  { title: "Email Address", value: "email" },
  { title: "Type", value: "type" },
  { title: "Created At", key: "timestamp", value:
        (submission: Partial<ContactSubmission>) => formattedTime(submission.timestamp)},
  { title: "Actions", key: "actions", sortable: false }
]

function canDelete(submission: Partial<ContactSubmission>) {
  return ability.can(AbilityActions.Delete, subject(AbilitySubjects.ContactSubmission, {
    id: submission.id,
    name: submission.name,
    timestamp: submission.timestamp,
    resolved: submission.resolved,
    email: submission.email
  }));
}

async function deleteSubmission(submission: Partial<ContactSubmission>) {
  try {
    isDeleting.value = true;
    await deleteMutation.mutate({
      id: submission.id
    });
    await refresh();
    emit('refresh');
  } catch (e) {
    console.error(e);
  }
}

async function loadSubmissions(page: number) {
  await queryData.refetch({
    filter: {
      resolved: { equals: props.archived }
    },
    pagination: {
      take: take,
      skip: (page - 1) * take
    },
    order: [{
      field: "timestamp" as ContactSubmissionOrderableFields,
      direction: "Desc" as OrderDirection
    }]
  });
  currentPage.value = page;
}

interface Filter {
  resolved: { equals: boolean },
  name: { contains: string, mode: CaseSensitivity.Insensitive }
  id?: { equals?: number }
}

async function searchSubmissions(value: string, type: string) {
  let filter: Filter = {
    resolved: { equals: props.archived } ,
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
      direction: "Desc" as OrderDirection,
      field: "id" as ContactSubmissionOrderableFields,
    }]
  });
}

function onSave(production: boolean, data: any) {
  refresh();
  emit('refresh');
  if (production) {
    productionsModal.value = true;
    productionData.value = {
      name: data.name,
      endTime: data.endTime,
      startTime: data.startTime,
      eventLocation: data.eventLocation,
    };
  }
}

async function refresh() {
  await queryData.refetch();
}

watch(() => props.remoteRefresh, () => {
  refresh();
})

watch(order, () => {
  if (order.value.length)
    queryData.refetch({
      order: [{
        // It's either asc or desc and we need to capitalize it
        direction: order.value[0].order.charAt(0).toUpperCase() + order.value[0].order.slice(1) as OrderDirection,
        field: order.value[0].key as ContactSubmissionOrderableFields
      }]
    })
  else
    queryData.refetch({
      order: [{direction: "Desc" as OrderDirection, field: "timestamp" as ContactSubmissionOrderableFields }]
    })
});

onMounted(() => {
  refresh();
})

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
</style>
