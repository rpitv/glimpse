<template>
  <div>
    <n-auto-complete
      v-model:value="searchInput"
      :input-props="{
        autocomplete: 'disabled',
      }"
      :options="results"
      :loading="peopleearchResults.loading.value"
      placeholder="Search Person Name or ID"
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
  FilterPersonInput,
  Person,
  SearchPeopleDocument,
} from "@/graphql/types";

const emit = defineEmits(["select"]);

const props = defineProps({
  disabledPeople: {
    type: Array as PropType<Pick<Person, "id">[]>,
    default: () => [],
  },
});

const searchInput = ref<string>("");
const searchFilter = computed<FilterPersonInput>(() => {
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
const peopleearchResults = useQuery(
  SearchPeopleDocument,
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
    peopleearchResults.result.value?.people.map((person) => ({
      disabled: props.disabledPeople?.some(
        (disabledPerson) => BigInt(disabledPerson.id) === BigInt(person.id)
      ),
      label: `${person.name} (ID ${person.id})`,
      value: person.id,
    })) ?? []
  );
});

function optionSelected(option: string) {
  const person = peopleearchResults.result.value?.people.find(
    (person) => person.id === option
  );
  emit("select", person);
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
