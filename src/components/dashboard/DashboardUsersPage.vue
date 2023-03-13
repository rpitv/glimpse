<template>
  <div>
    <n-layout>
      <n-button
        v-if="ability.can(AbilityActions.Create, AbilitySubjects.User)"
        type="success"
        class="create-button"
        round
      >
        <template #icon>
          <FontAwesomeIcon icon="fa-light fa-plus" />
        </template>
        Create
      </n-button>
    </n-layout>
    <n-layout> <!-- For some reason, I'm running into accessing undefined errors when n-data-table is not a child of another NaiveUI element -->
      <div style="overflow: auto">
        <n-data-table class="user-data-table" :columns="columns" :data="data" :row-key="row => row.id" />
      </div>
    </n-layout>
  </div>
</template>

<script setup lang="ts">
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { NButton, NDataTable, NLayout, useDialog } from "naive-ui";
import { useQuery } from "@vue/apollo-composable";
import { AbilitySubjects, FindUsersDocument } from "@/graphql/types";
import type { User } from "@/graphql/types";
import { computed, h } from "vue";
import RelativeTimeTooltip from "@/components/util/RelativeTimeTooltip.vue";
import { AbilityActions, useGlimpseAbility } from "@/casl";
import { subject } from "@casl/ability";

const ability = useGlimpseAbility();
const dialog = useDialog();

const queryData = useQuery(FindUsersDocument, {
  pagination: {
    take: 20,
    skip: 0
  }
});

const columns = [
  {
    key: "id",
    title: "ID",
  },
  {
    key: "username",
    title: "Username",
  },
  {
    key: "mail",
    title: "Email",
  },
  {
    key: "joined",
    title: "Joined",
  },
  {
    key: "actions",
    title: "Actions",
    render: (row: User) => {
      const buttons = [];
      if (ability.can(AbilityActions.Update, subject(AbilitySubjects.User, row))) {
        buttons.push(h(
          NButton,
          { class: "dashboard-users-page-row-button", type: "success", onClick: () => dialog.info({ title: "Edit User" }) },
          () => "Edit")
        );
      }
      if (ability.can(AbilityActions.Delete, subject(AbilitySubjects.User, row))) {
        buttons.push(h(
          NButton,
          { class: "dashboard-users-page-row-button", type: "error", onClick: () => dialog.error({
            title: "Delete User",
            content: `Are you sure you want to delete the user "${row.username}"?`,
              positiveText: 'Delete User',
              negativeText: 'Cancel',
              onPositiveClick: () => {
                console.log();
              }
            }) },
          () => "Delete")
        );
      }
      return h("div", {}, buttons);
    }
  }
];

const data = computed(() => {
  return (queryData.result.value?.users ?? []).map((user) => {
    return {
      ...user,
      joined: h(RelativeTimeTooltip, { date: new Date(user.joined) })
    }
  });
});


</script>

<style lang="scss">
  .dashboard-users-page-row-button {
    margin-right: 0.5rem;
  }
</style>

<style scoped lang="scss">
  .user-data-table {
    min-width: 500px;
  }

  .create-button {
    margin-bottom: 1rem;
    float: right;
  }
</style>
