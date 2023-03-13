<template>
  <div>
    <n-layout>
      <n-button
        v-if="ability.can(AbilityActions.Create, AbilitySubjects.User)"
        type="success"
        class="top-button"
        round
      >
        <template #icon>
          <FontAwesomeIcon icon="fa-light fa-plus" />
        </template>
        Create
      </n-button>
      <n-button
        class="top-button"
        @click="refresh"
        round
      >
        <template #icon>
          <FontAwesomeIcon icon="fa-light fa-arrows-rotate" />
        </template>
        Refresh
      </n-button>
    </n-layout>
    <n-layout> <!-- For some reason, I'm running into accessing undefined errors when n-data-table is not a child of another NaiveUI element -->
      <div style="overflow: auto">
        <n-data-table class="user-data-table" :columns="columns" :data="queryData.result.value?.users ?? []" :row-key="row => row.id" />
      </div>
    </n-layout>
  </div>
</template>

<script setup lang="ts">
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { NButton, NDataTable, NLayout, useDialog } from "naive-ui";
import { useMutation, useQuery } from "@vue/apollo-composable";
import { AbilitySubjects, DeleteUserDocument, FindUsersDocument } from "@/graphql/types";
import type { User } from "@/graphql/types";
import { h, onMounted } from "vue";
import RelativeTimeTooltip from "@/components/util/RelativeTimeTooltip.vue";
import { AbilityActions, useGlimpseAbility } from "@/casl";
import { subject } from "@casl/ability";
import { RouterLink, useRoute } from "vue-router";

const ability = useGlimpseAbility();
const dialog = useDialog();
const route = useRoute();

const queryData = useQuery(FindUsersDocument, {
  pagination: {
    take: 20,
    skip: 0
  }
});
const deleteMutation = useMutation(DeleteUserDocument);

const columns = [
  {
    key: "id",
    title: "ID",
    render(row: User) {
      return h(RouterLink, { to: { name: "dashboard", params: { args: ["users", row.id]}}}, () => row.id);
    }
  },
  {
    key: "username",
    title: "Username",
    render(row: User) {
      return h(RouterLink, { to: { name: "dashboard", params: { args: ["users", row.id]}}}, () => row.username);
    }
  },
  {
    key: "mail",
    title: "Email",
  },
  {
    key: "joined",
    title: "Joined",
    render(row: User) {
      return h(RelativeTimeTooltip, { date: new Date(row.joined) });
    }
  },
  {
    key: "actions",
    title: "Actions",
    render: (row: User) => {
      const buttons = [];
      if (ability.can(AbilityActions.Update, subject(AbilitySubjects.User, { ...row }))) {
        buttons.push(h(
          NButton,
          { class: "dashboard-users-page-row-button", type: "success", onClick: () => dialog.info({ title: "Edit User" }) },
          () => "Edit")
        );
      }
      if (ability.can(AbilityActions.Delete, subject(AbilitySubjects.User, { ...row }))) {
        buttons.push(h(
          NButton,
          { class: "dashboard-users-page-row-button", type: "error", onClick: () => dialog.error({
            title: "Delete User",
            content: `Are you sure you want to delete the user "${row.username}"?`,
              positiveText: 'Delete User',
              negativeText: 'Cancel',
              onPositiveClick: async () => {
                await deleteMutation.mutate({ id: row.id });
                await refresh();
              }
            }) },
          () => "Delete")
        );
      }
      return h("div", {}, buttons);
    }
  }
];

onMounted(async () => {
  await refresh();
})

async function refresh() {
  await queryData.refetch();
}
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

  .top-button {
    margin-bottom: 1rem;
    margin-left: 1rem;
    float: right;
  }
</style>
