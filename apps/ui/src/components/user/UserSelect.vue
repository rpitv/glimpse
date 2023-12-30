<template>
  <div>
    <n-auto-complete
      v-model:value="searchInput"
      :input-props="{
        autocomplete: 'disabled',
      }"
      :options="results"
      :loading="userSearchResults.loading.value"
      placeholder="Search User Name or ID"
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
  FilterUserInput,
  User,
  SearchUsersDocument,
} from "@/graphql/types";

const emit = defineEmits(["select"]);

const props = defineProps({
  disabledUsers: {
    type: Array as PropType<Pick<User, "id">[]>,
    default: () => [],
  },
});

const searchInput = ref<string>("");
const searchFilter = computed<FilterUserInput>(() => {
  if (!searchInput.value) {
    return {};
  }
  const searchInputAsNumber = parseInt(searchInput.value);
  if (isNaN(searchInputAsNumber)) {
    return {
      username: {
        contains: searchInput.value,
        mode: CaseSensitivity.Insensitive,
      },
    };
  } else {
    return {
      OR: [
        {
          username: {
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
const userSearchResults = useQuery(
  SearchUsersDocument,
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
    userSearchResults.result.value?.users.map((user) => ({
      disabled: props.disabledUsers?.some(
        (disabledUser) => BigInt(disabledUser.id) === BigInt(user.id)
      ),
      label: `${user.username} (ID ${user.id})`,
      value: user.id,
    })) ?? []
  );
});

function optionSelected(option: string) {
  const user = userSearchResults.result.value?.users.find(
    (user) => user.id === option
  );
  emit("select", user);
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
