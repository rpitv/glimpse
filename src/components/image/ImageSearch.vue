<template>
  <div>
    <n-auto-complete
      v-model:value="searchInput"
      :input-props="{
        autocomplete: 'disabled',
      }"
      :options="results"
      :loading="imageSearchResults.loading.value"
      placeholder="Search Image Name or ID"
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
  FilterImageInput,
  Image,
  SearchImagesDocument,
} from "@/graphql/types";

const emit = defineEmits(["select"]);

const props = defineProps({
  disabledImages: {
    type: Array as PropType<Pick<Image, "id">[]>,
    default: () => [],
  },
});

const searchInput = ref<string>("");
const searchFilter = computed<FilterImageInput>(() => {
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
const imageSearchResults = useQuery(
  SearchImagesDocument,
  () => ({
    filter: searchFilter.value,
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
    imageSearchResults.result.value?.images.map((image) => ({
      disabled: props.disabledImages?.some(
        (disabledImage) => BigInt(disabledImage.id) === BigInt(image.id)
      ),
      label: `${image.name} (ID ${image.id})`,
      value: image.id,
    })) ?? []
  );
});

function optionSelected(option: string) {
  const image = imageSearchResults.result.value?.images.find(
    (image) => image.id === option
  );
  emit("select", image);
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
