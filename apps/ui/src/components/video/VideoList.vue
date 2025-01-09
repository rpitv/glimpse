<template>
  <div class="top-bar">
    <DashboardSearch document-name="Videos" @search="searchVideo" />
    <div class="buttons">
      <RouterPopup
          v-if="ability.can(AbilityActions.Create, AbilitySubjects.Video)"
          :max-width="1100" v-model="showCreatePopup"
          :to="{ name: 'dashboard-video-create' }"
      >
        <template #default>
          <CreateVideoCard
              closable
              @save="(video: Video) => {
                showCreatePopup = false;
                refresh();
                createdVideo = { id: video.id, show: true };
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
      <v-snackbar v-model="createdVideo.show" color="green-darken-1" class="text-center">
        <p>Created Video {{ createdVideo.id }}</p>
        <template #actions>
          <v-btn @click="createdVideo.show = false" icon="fa-circle-xmark"/>
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
       :items-length="queryData.result.value ? queryData.result.value.videoCount : 0"
       :page="currentPage" :headers="headers"
       :items="queryData.result.value?.videos"
       no-data-text="No videos found 💀"
       v-model:sort-by="order"
       :loading="queryData.loading.value"
       loading-text="Loading Videos..."
    >
      <template #item.metadata="{ item }">
        <a v-if="item.format === 'EMBED'" :href="item.metadata.url" target="_blank">Link</a>
      </template>
      <template #item.actions="{ index, item }">
        <RouterPopup
          v-if="ability.can(AbilityActions.Update, subject(AbilitySubjects.Video, {
            id: item.id,
            name: item.name,
          }))"
          :max-width="1100" v-model="list[index]"
          :to="{ name: 'dashboard-video-details-edit', params: {id: item.id } }"
          @update:modelValue="(value: boolean) => { shownPopup = value ? item.id : null}"
        >
          <EditVideoCard
            @close="
                list[index] = false
                refresh();"
            :videoId="BigInt(item.id)"
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
            <v-card title="Delete Video">
              <v-card-text>
                Are you sure you want to delete the video "{{item.name}}"? This will also remove its members.
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn @click="isActive.value = false" variant="outlined" text="Cancel"/>
                <v-btn @click="deleteVideo(item)" variant="outlined"
                       text="Delete" color="#FF5252" :disabled="isDeleting" />
              </v-card-actions>
            </v-card>
          </template>
        </v-dialog>
      </template>
      <template v-slot:bottom>
        <v-pagination
          v-model="currentPage"
          :length="!!queryData.result.value?.videoCount ? Math.ceil(queryData.result.value?.videoCount / take) : 1"
          @update:modelValue="loadVideos"
        />
      </template>
    </v-data-table-server>
  </div>
</template>

<script setup lang="ts">
import { useMutation, useQuery } from "@vue/apollo-composable";
import {
  AbilitySubjects, CaseSensitivity,
  DeleteVideoDocument,
  FindVideosDocument, OrderDirection, VideoOrderableFields,
} from "@/graphql/types";
import type { Video } from "@/graphql/types";
import { watch, onMounted, ref } from "vue";
import { AbilityActions, useGlimpseAbility } from "@/casl";
import { subject } from "@casl/ability";
import RouterPopup from "@/components/util/RouterPopup.vue";
import EditVideoCard from "@/components/video/EditVideoCard.vue";
import DashboardSearch from "@/components/DashboardSearch.vue";
import CreateVideoCard from "@/components/video/CreateVideoCard.vue";

const ability = useGlimpseAbility();
const showCreatePopup = ref<boolean>(false);
const shownPopup = ref<string | null>(null);
const list = ref<boolean[]>([]);
const isDeleting = ref(false);
const currentPage = ref(1);
const order = ref<{key: string, order: string}[]>([]);
const createdVideo = ref<{id: number, show: boolean}>({ id: 0, show: false });
const take = 20;

for (let i = 0; i < take; i++)
  list.value[i] = false;

const queryData = useQuery(FindVideosDocument, {
  pagination: {
    take: take,
    skip: 0,
  },
  order: [{
    direction: "Asc" as OrderDirection,
    field: "id" as VideoOrderableFields,
  }]
});
const deleteMutation = useMutation(DeleteVideoDocument);

const headers = [
  { title: "ID", sortable: true, key: "id" },
  { title: "Name", key: "name", sortable: true },
  { title: "Format", key: "format", sortable: false},
  { title: "URL", key: "metadata", sortable: false },
  { title: "Actions", key: "actions", sortable: false, minWidth: "150px" }
]

async function loadVideos(page: number) {
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

async function searchVideo(value: string, type: string) {
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
      field: "id" as VideoOrderableFields,
    }]
  });
}

async function deleteVideo(video: Video) {
  try {
    isDeleting.value = true;
    await deleteMutation.mutate({id: parseInt(video.id)});
    await refresh();
  } catch (e) {
    console.error(e);
  }
  isDeleting.value = false;
}

async function refresh() {
  await queryData.refetch();
}

function canDelete(video: Video): boolean {
  return ability.can(AbilityActions.Delete, subject(AbilitySubjects.Video, {
    id: video.id,
    name: video.name,
    metadata: video.metadata,
    format: video.format
  }))
}

watch(order, () => {
  if (order.value.length)
    queryData.refetch({
      order: [{
        // It's either asc or desc and we need to capitalize it
        direction: order.value[0].order.charAt(0).toUpperCase() + order.value[0].order.slice(1) as OrderDirection,
        field: order.value[0].key as VideoOrderableFields
      }]
    })
  else
    queryData.refetch({
      order: [{direction: "Desc" as OrderDirection, field: "id" as VideoOrderableFields }]
    })
});

onMounted(async () => {
  await refresh();
});
</script>

<style lang="scss">
.dashboard-videos-page-row-button {
  margin-right: 0.5rem;
}
</style>

<style scoped lang="scss">
.video-data-table {
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
