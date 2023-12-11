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
            @save="
              list[index] = false;
              refresh();
              emit('refresh');
            "
            :id="item.id"
        />
        <template #trigger>
          <v-btn color="green-darken-3" class="mr-2" variant="flat" size="small" icon="eye"></v-btn>
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
</template>

<script setup lang="ts">
import {AbilityActions, useGlimpseAbility} from "@/casl";
import {subject} from "@casl/ability";
import {
  AbilitySubjects, CaseSensitivity, ContactSubmission,
  ContactSubmissionOrderableFields, DeleteContactSubmissionDocument,
  FindContactSubmissionsDocument,
  OrderDirection, ProductionOrderableFields
} from "@/graphql/types";
import RouterPopup from "@/components/util/RouterPopup.vue";
import ViewSubmissionCard from "@/components/contactsubmissions/ViewSubmissionCard.vue";
import {useMutation, useQuery} from "@vue/apollo-composable";
import {onMounted, PropType, ref, watch} from "vue";
import DashboardSearch from "@/components/DashboardSearch.vue";

const ability = useGlimpseAbility();
const order = ref<{key: string, order: string}[]>([]);
const currentPage = ref(1);
const shownPopup = ref<string | null>(null);
const list = ref<boolean[]>([]);
const isDeleting = ref(false);

const take = 20;

for (let i = 0; i < take; i++)
  list.value[i] = false;

// When an adminstrative user resolves or unresolves a submission, we want to tell the other component to refresh.
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
    direction: "Desc" as OrderDirection
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
  { title: "Name", key: "name", sortable: true },
  { title: "Email Address", value: "email" },
  { title: "Subject", value: "subject" },
  { title: "Created At", key: "startTime", value:
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


async function refresh() {
  await queryData.refetch();
}

watch(() => props.remoteRefresh, () => {
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
