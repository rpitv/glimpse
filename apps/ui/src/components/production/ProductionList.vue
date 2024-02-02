<template>
  <div class="top-bar">
    <DashboardSearch document-name="Productions" @search="searchProduction" />
    <div class="buttons">
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
              refresh();
              createdProduction = { id: id, show: true };
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
      <v-snackbar v-model="createdProduction.show" color="green-darken-1" class="text-center">
        <p>Created Production {{ createdProduction.id }}</p>
        <template #actions>
          <v-btn @click="createdProduction.show = false" icon="fa-circle-xmark"/>
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
      :items-length="queryData.result.value ? queryData.result.value?.totalProductions : 0 "
      :items-per-page-options="[{value: take, title: `${take}`}]"
      :show-current-page="true" @update:page="loadProductions"
      :page="currentPage" :headers="headers"
      :items="queryData.result.value?.productions"
      no-data-text="No productions found 💀"
      v-model:sort-by="order"
      :loading="queryData.loading.value"
      loading-text="Loading productions..."
    >
      <template #item.teamNotes="{item}">
        <v-dialog v-if="item.teamNotes?.length" width="800">
          <template #activator="{ props }">
            <v-btn v-bind="props" text="View Notes" color="light-blue-lighten-1" />
          </template>
          <template #default="{ isActive }">
            <v-card min-height="400">
              <v-card-title>Viewing notes for Production {{ item.id }}</v-card-title>
              <v-card-text>
                {{ item.teamNotes }}
              </v-card-text>
              <v-card-actions>
                <VSpacer />
                <v-btn
                    text="Close"
                    @click="isActive.value = false"
                ></v-btn>
              </v-card-actions>
            </v-card>
          </template>
        </v-dialog>
        <p v-else>No notes</p>
      </template>
      <template #item.thumbnail="{ item }">
        <a v-if="item.thumbnail" :href="item.thumbnail.path" target="_blank">Link</a>
        <p v-else>No thumbnail provided</p>
      </template>
      <template #item.actions="{ index, item }">
        <RouterPopup
          v-if="ability.can(AbilityActions.Update, subject(AbilitySubjects.Production, {
            id: item.id,
            name: item.name,
            startTime: item.startTime,
            description: item.description,
            thumbnail: item.thumbnail
          }))"
          :max-width="1100" v-model="list[index]"
          :to="{ name: 'dashboard-production-details-edit', params: { id: item.id } }"
          @update:modelValue="(value: boolean) => { shownPopup = value ? item.id : null }"
        >
          <EditProductionCard
            @save="
                list[index] = false;
                refresh();"
            :productionId="BigInt(item.id)"
          />
          <template #trigger>
            <v-btn variant="flat" icon="fa-pen" color="green-darken-3" size="small" class="mr-2"/>
          </template>
        </RouterPopup>
        <v-dialog max-width="500" scrim="black">
          <template #activator="{ props }">
            <v-btn variant="flat" size="small" color="red-darken-4" v-bind="props" v-if="canDelete(item)" icon="fa-trash" />
          </template>
          <template #default="{ isActive }">
            <v-card title="Delete Production">
              <v-card-text>
                Are you sure you want to delete the production "{{item.name}}"? This will also remove its members.
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn @click="isActive.value = false" variant="outlined" text="Cancel"/>
                <v-btn @click="deleteProduction(item)" variant="outlined"
                       text="Delete" color="#FF5252" :disabled="isDeleting" />
              </v-card-actions>
            </v-card>
          </template>
        </v-dialog>
      </template>
    </v-data-table-server>
  </div>
</template>

<script setup lang="ts">
import {AbilityActions, useGlimpseAbility} from "@/casl";
import {
  AbilitySubjects,
  SearchProductionsDocument,
  DeleteProductionDocument,
  DeleteProductionImageDocument,
  DeleteProductionTagDocument,
  DeleteProductionVideoDocument, OrderDirection, ProductionOrderableFields, CaseSensitivity,
} from "@/graphql/types";
import type { Production } from "@/graphql/types"
import RouterPopup from "@/components/util/RouterPopup.vue";
import CreateProductionCard from "@/components/production/CreateProductionCard.vue";
import {onMounted, ref, watch} from "vue";
import {useQuery, useMutation} from "@vue/apollo-composable";
import {subject} from "@casl/ability";
import EditProductionCard from "@/components/production/EditProductionCard.vue";
import DashboardSearch from "@/components/DashboardSearch.vue";

const ability = useGlimpseAbility();
const showCreatePopup = ref<boolean>(false);
const shownPopup = ref<string | null>(null);
const list = ref<boolean[]>([]);
const isDeleting = ref(false);
const currentPage = ref(1);
const order = ref<{key: string, order: string}[]>([]);
const createdProduction = ref<{id: number, show: boolean}>({ id: 0, show: false });
const take = 20;

for (let i = 0; i < take; i++)
  list.value[i] = false;

const deleteMutation = useMutation(DeleteProductionDocument);
const deleteTag = useMutation(DeleteProductionTagDocument);
const deleteImage = useMutation(DeleteProductionImageDocument);
const deleteVideo = useMutation(DeleteProductionVideoDocument);
const queryData = useQuery(SearchProductionsDocument, {
  pagination: {
    take: take,
    skip: 0
  },
  order: [{
    field: "id" as ProductionOrderableFields,
    direction: "Desc" as OrderDirection
  }]
});

const headers = [
  { title: "ID", sortable: true, key: "id" },
  { title: "Name", key: "name", sortable: true },
  { title: "Start Time", key: "startTime", value:
      (production: Partial<Production>) => formattedTime(production.startTime)},
  { title: "Notes", key: "teamNotes", sortable: false },
  { title: "Thumbnail", key: "thumbnail", sortable: false },
  { title: "Actions", key: "actions", sortable: false }
]

async function loadProductions(page: number) {
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

async function searchProduction(value: string, type: string) {
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
      direction: "Desc" as OrderDirection,
      field: "id" as ProductionOrderableFields,
    }]
  });
}

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

async function deleteProduction(production: Partial<Production>) {
  try {
    isDeleting.value = true;
    const tags = production.tags;
    const images = production.images;
    const videos = production.videos;
    if (images)
      for (const image of images)
        await deleteImage.mutate({id: parseInt(image.id)});

    if (tags)
      for (const tag of tags)
        await deleteTag.mutate({id: parseInt(tag.id)});


    if (videos)
      for (const video of videos)
        await deleteVideo.mutate({id: parseInt(video.id)});

    await deleteMutation.mutate({id: parseInt(production.id)});

    await refresh();
    isDeleting.value = false;
  } catch (e) {
    console.error(e);
  }
}

/*
  Due to partial permissions, we have to make sure that the user
  can delete each type of item for the production.
 */
function canDelete(production: Partial<Production>): boolean {
  if (!ability.can(AbilityActions.Delete, subject(AbilitySubjects.Production, {
    id: production.id,
    name: production.name,
    startTime: production.startTime,
    description: production.description,
    thumbnail: production.thumbnail
  }))) {
    return false;
  }
  if (production.tags)
    for (const tag of production.tags)
      if (!ability.can(AbilityActions.Delete, subject(AbilitySubjects.ProductionTag, {
        id: tag.id,
        tag: tag.tag
      })))
        return false;

  if (production.images)
    for (const image of production.images)
      if (!ability.can(AbilityActions.Delete, subject(AbilitySubjects.ProductionImage, {
        id: image.id,
        imageId: image.imageId
      })))
        return false;

  if (production.videos)
    for (const video of production.videos)
      if (!ability.can(AbilityActions.Delete, subject(AbilitySubjects.ProductionVideo, {
        id: video.id,
        videoId: video.videoId
      })))
        return false;

  return true;
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
        field: order.value[0].key as ProductionOrderableFields
      }]
    })
  else
    queryData.refetch({
      order: [{direction: "Desc" as OrderDirection, field: "id" as ProductionOrderableFields }]
    })
});

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

.dashboard-productions-page-row-button {
  margin-right: 0.5rem;
}
</style>
