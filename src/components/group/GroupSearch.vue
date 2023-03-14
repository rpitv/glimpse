<template>
  <div>
    <n-auto-complete
      v-model:value="searchInput"
      :input-props="{
        autocomplete: 'disabled'
      }"
      :options="results"
      :loading="groupSearchResults.loading.value"
      placeholder="Search Group Name or ID"
      clear-after-select
      @select="optionSelected"
    />
  </div>
</template>

<script setup lang="ts">
import { AutoCompleteOption, NAutoComplete } from "naive-ui";
import { computed, PropType, ref } from "vue";
import { useQuery } from "@vue/apollo-composable";
import { CaseSensitivity, FilterGroupInput, Group, SearchGroupsDocument } from "@/graphql/types";

const emit = defineEmits(['select']);

const props = defineProps({
  disabledGroups: {
    type: Array as PropType<Pick<Group, "id">[]>,
    default: () => []
  }
})

const searchInput = ref<string>('');
const searchFilter = computed<FilterGroupInput>(() => {
  if(!searchInput.value) {
    return {};
  }
  const searchInputAsNumber = parseInt(searchInput.value);
  if(isNaN(searchInputAsNumber)) {
    return {
      name: {
        contains: searchInput.value,
        mode: CaseSensitivity.Insensitive
      }
    }
  } else {
    return {
      OR: [
        {
          name: {
            contains: searchInput.value,
            mode: CaseSensitivity.Insensitive
          }
        },
        {
          id: {
            equals: searchInputAsNumber
          }
        }
      ]
    }
  }
})
const groupSearchResults = useQuery(SearchGroupsDocument, () => ({
  filter: searchFilter.value
}), {
  throttle: 1000
});

const results = computed<AutoCompleteOption[]>(() => {
  if(!searchInput.value) {
    return [];
  }
  return groupSearchResults.result.value?.groups.map(group => ({
    disabled: props.disabledGroups?.some(disabledGroup => disabledGroup.id === group.id),
    label: `${group.name} (ID ${group.id})`,
    value: group.id
  })) ?? [];
})

function optionSelected(option: string) {
  const group = groupSearchResults.result.value?.groups.find(group => group.id === option);
  emit('select', group);
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
