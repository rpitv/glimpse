<template>
  <div>
    <n-auto-complete
      v-model:value="searchInput"
      :input-props="{
        autocomplete: 'disabled',
      }"
      :options="results"
      :loading="roleSearchResults.loading.value"
      placeholder="Search Role Name or ID"
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
  FilterRoleInput,
  Role,
  SearchRolesDocument,
} from "@/graphql/types";

const emit = defineEmits(["select"]);

const props = defineProps({
  disabledRoles: {
    type: Array as PropType<Pick<Role, "id">[]>,
    default: () => [],
  },
});

const searchInput = ref<string>("");
const searchFilter = computed<FilterRoleInput>(() => {
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
const roleSearchResults = useQuery(
  SearchRolesDocument,
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
    roleSearchResults.result.value?.roles.map((role) => ({
      disabled: props.disabledRoles?.some(
        (disabledRole) => BigInt(disabledRole.id) === BigInt(role.id)
      ),
      label: `${role.name} (ID ${role.id})`,
      value: role.id,
    })) ?? []
  );
});

function optionSelected(option: string) {
  const role = roleSearchResults.result.value?.roles.find(
    (role) => role.id === option
  );
  emit("select", role);
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
