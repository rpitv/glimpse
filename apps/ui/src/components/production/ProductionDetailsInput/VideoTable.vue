<template>
  <div class="top-bar">
    <ProductionSearch document-name="Videos" @search="refetchVideo"/>
    <div class="buttons">
      <RouterPopup
              v-if="ability.can(AbilityActions.Create, AbilitySubjects.Image)"
              :max-width="1100" v-model="showCreatePopup"
              :to="{ name: 'dashboard-video-create' }"
      >
        <CreateVideoCard
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
                       :items-length="queryData.result.value ? queryData.result.value.videoCount : 0"
                       :items-per-page-options="[{value: take, title: `${take}`}]"
                       :show-current-page="true"
                       :page="currentPage" @update:page="loadProductions"
                       :items="queryData.result.value?.videos"
                       no-data-text="No videos found 💀"
                       v-model:sort-by="order"
                       :loading="queryData.loading.value"
                       loading-text="Loading Videos..."
                       :headers="videoHeader"
  >
    <template #item.videoLink="{ item }">
      <a :href="item.metadata.url" target="_blank">Link</a>
    </template>
    <template #item.actions="{ item }">
      <VBtn variant="outlined" class="text-none ml-3"
          :disabled="(productionVideos.findIndex((ele) => ele.id === item.id && ele.url === item.metadata.url) !== -1)
          || !ability.can(AbilityActions.Create, subject(AbilitySubjects.ProductionVideo, {videoId: item.id}))"
          @click="emit('addVideo', item.id, item.metadata.url)">Add Video</VBtn>
    </template>
  </v-data-table-server>
</template>

<script setup lang="ts">
import ProductionSearch from "@/components/DashboardSearch.vue";
import {
  AbilitySubjects, CaseSensitivity,
  ImageOrderableFields,
  OrderDirection,
  SearchImagesDocument, SearchVideosDocument, VideoOrderableFields
} from "@/graphql/types";
import {useQuery} from "@vue/apollo-composable";
import {ref, watch} from "vue";
import type {PropType} from "vue";
import {ability, AbilityActions} from "@/casl";
import {subject} from "@casl/ability";
import CreateImageCard from "@/components/image/CreateImageCard.vue";
import RouterPopup from "@/components/util/RouterPopup.vue";
import CreateVideoCard from "@/components/video/CreateVideoCard.vue";

const props = defineProps({
  take: {
    type: Number,
    required: true
  },
  productionVideos: {
    type: Object as PropType<Array<{id: number, url: string, priority: number}>>,
    required: true
  }
});

const emit = defineEmits(["addVideo"])

const videoHeader = [
  { title: "ID", sortable: true, key: "id" },
  { title: "Name", sortable: true, key: "name" },
  { title: "Video Link", sortable: false, key: "videoLink" },
  { title: "Actions", sortable: false, key: "actions" }
]
const order = ref<{key: string, order: string}[]>([]);
const currentPage = ref(1);
const showCreatePopup = ref<boolean>(false);

interface Options {
  name?: { contains: string, mode?: CaseSensitivity.Insensitive },
  id?: { equals: number }
}

const queryData = useQuery(SearchVideosDocument, {
  pagination: { take: props.take },
  order: [{
    direction: "Desc" as OrderDirection,
    field: "id" as VideoOrderableFields
  }],
  filter: {
    name: {contains: ''}
  }
});

async function loadProductions(page: number) {
  await queryData.refetch({
    pagination: {
      take: props.take,
      skip: (page - 1) * props.take
    }
  });
  currentPage.value = page;
}

async function refetchVideo(filter: string, type: string) {
  let options: Options = { name: { contains: '' } };
  if (type === "ID")
    options.id = { equals: parseInt(filter) }
  else
    options = {
      name: { contains: filter as string, mode: CaseSensitivity.Insensitive }
    }
  await queryData.refetch({
    filter: options,
    order: [{ direction: "Desc" as OrderDirection, field: "id" as VideoOrderableFields }]
  });
}

watch(order, () => {
  if (order.value.length)
    queryData.refetch({
      order: [{
        direction: order.value[0].order.charAt(0).toUpperCase() + order.value[0].order.slice(1) as OrderDirection,
        field: order.value[0].key as VideoOrderableFields
      }]
    })
  else
    queryData.refetch({
      order: [{direction: "Desc" as OrderDirection, field: "id" as VideoOrderableFields }]
    })
})

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
