<template>
  <div>
    <n-auto-complete
      v-model:value="searchInput"
      :input-props="{
        autocomplete: 'disabled',
      }"
      :options="results"
      :loading="videoSearchResults.loading.value"
      placeholder="Search Video Name or ID"
      clear-after-select
      @select="optionSelected"
    />
  </div>
</template>

<script setup lang="ts">
import { AutoCompleteOption, NAutoComplete } from "naive-ui";
import { computed, PropType, ref } from "vue";
import { useQuery } from "@vue/apollo-composable";
import {
  CaseSensitivity,
  FilterVideoInput,
  Video,
  SearchVideosDocument, PersonOrderableFields, OrderDirection, VideoOrderableFields,
} from "@/graphql/types";

const emit = defineEmits(["select"]);

const props = defineProps({
  disabledVideos: {
    type: Array as PropType<Pick<Video, "id">[]>,
    default: () => [],
  },
});

const searchInput = ref<string>("");
const searchFilter = computed<FilterVideoInput>(() => {
  if (!searchInput.value) {
    return {};
  }
  const searchInputAsNumber = parseInt(searchInput.value);
  if (isNaN(searchInputAsNumber)) {
    return {
      name: {
        contains: searchInput.value,
        mode: CaseSensitivity.Insensitive,
      },
    };
  } else {
    return {
      OR: [
        {
          name: {
            contains: searchInput.value,
            mode: CaseSensitivity.Insensitive,
          },
        },
        {
          id: {
            equals: searchInputAsNumber,
          },
        },
      ],
    };
  }
});
const videoSearchResults = useQuery(
  SearchVideosDocument,
  () => ({
    filter: searchFilter.value,
    order: [{
      field: "id" as VideoOrderableFields,
      direction: "Desc" as OrderDirection
    }]
  }),
  {
    throttle: 1000,
  }
);

const results = computed<AutoCompleteOption[]>(() => {
  if (!searchInput.value) {
    return [];
  }
  return (
    videoSearchResults.result.value?.videos.map((video) => ({
      disabled: props.disabledVideos?.some(
        (disabledVideo) => BigInt(disabledVideo.id) === BigInt(video.id)
      ),
      label: `${video.name} (ID ${video.id})`,
      value: video.id,
    })) ?? []
  );
});

function optionSelected(option: string) {
  const video = videoSearchResults.result.value?.videos.find(
    (video) => video.id === option
  );
  emit("select", video);
}
</script>

<style scoped lang="scss">
.results {
  position: absolute;
  width: 100%;
  z-index: 1;

  .result {
    padding: 5px;
    margin: 0;
    background-color: #3b3b3b;

    &:hover {
      background-color: #4b4b4b;
    }
  }
}
</style>
