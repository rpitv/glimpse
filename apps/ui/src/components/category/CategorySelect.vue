<template>
  <div>
    <n-auto-complete
      v-model:value="searchInput"
      :input-props="{
        autocomplete: 'disabled',
      }"
      :options="results"
      :loading="categorySearchResults.loading.value"
      placeholder="Search Category Name or ID"
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
  FilterCategoryInput,
  Category,
  SearchCategoriesDocument, OrderDirection, PersonOrderableFields,
} from "@/graphql/types";

const emit = defineEmits(["select"]);

const props = defineProps({
  disabledCategories: {
    type: Array as PropType<Pick<Category, "id">[]>,
    default: () => [],
  },
});

const searchInput = ref<string>("");
const searchFilter = computed<FilterCategoryInput>(() => {
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
const categorySearchResults = useQuery(
  SearchCategoriesDocument,
  () => ({
    filter: searchFilter.value,
    order: [{
      field: "id" as PersonOrderableFields,
      direction: "Desc" as OrderDirection
    }]
  }),
  {
    throttle: 1000,
  },
);

const results = computed<AutoCompleteOption[]>(() => {
  if (!searchInput.value) {
    return [];
  }
  return (
    categorySearchResults.result.value?.categories.map((category) => ({
      disabled: props.disabledCategories?.some(
        (disabledCategory) =>
          BigInt(disabledCategory.id) === BigInt(category.id)
      ),
      label: `${category.name} (ID ${category.id})`,
      value: category.id,
    })) ?? []
  );
});

function optionSelected(option: string) {
  const category = categorySearchResults.result.value?.categories.find(
    (category) => category.id === option
  );
  emit("select", category);
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
