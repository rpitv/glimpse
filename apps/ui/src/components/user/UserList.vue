<template>
  <div class="top-bar">
    <DashboardSearch document-name="Users" @search="searchUser" />
    <div class="buttons">
      <RouterPopup
          v-if="ability.can(AbilityActions.Create, AbilitySubjects.Production)"
          :max-width="1100" v-model="showCreatePopup"
          :to="{ name: 'dashboard-production-create' }"
      >
        <template #default>
          <CreateUserCard
              closable
              @save="(id: number) => {
              showCreatePopup = false;
              refresh();
              createdUser = { id: id, show: true };
            }"
          />
        </template>
        <template #trigger>
          <v-btn class="top-button text-none" variant="outlined" rounded color="green"
                 prepend-icon="fa-light fa-plus">
            Create
          </v-btn>
        </template>
      </RouterPopup>
      <v-snackbar v-model="createdUser.show" color="green-darken-1" class="text-center">
        <p>Created Role {{ createdUser.id }}</p>
        <template #actions>
          <v-btn @click="createdUser.show = false" icon="fa-circle-xmark"/>
        </template>
      </v-snackbar>
      <v-btn @click="refresh()" prepend-icon="fa-light fa-arrows-rotate" variant="outlined"
             rounded class="text-none top-button">
        Refresh
      </v-btn>
    </div>
  </div>
  <n-layout> <!-- For some reason, I'm running into accessing undefined errors when n-data-table is not a child of another NaiveUI element -->
    <div style="overflow: auto">
      <n-data-table class="user-data-table" :columns="columns" :data="queryData.result.value?.users ?? []" :row-key="row => row.id" />
    </div>
  </n-layout>
</template>

<script setup lang="ts">
import { NButton, NDataTable, NLayout, useDialog } from "naive-ui";
import { useMutation, useQuery } from "@vue/apollo-composable";
import {
  AbilitySubjects, CaseSensitivity,
  DeleteUserDocument,
  FindUsersDocument,
  OrderDirection,
  UserOrderableFields
} from "@/graphql/types";
import type { User } from "@/graphql/types";
import { computed, h, onMounted, ref } from "vue";
import RelativeTimeTooltip from "@/components/util/RelativeTimeTooltip.vue";
import { AbilityActions, useGlimpseAbility } from "@/casl";
import { subject } from "@casl/ability";
import { useRoute } from "vue-router";
import RouterPopup from "@/components/util/RouterPopup.vue";
import EditUserCard from "@/components/user/EditUserCard.vue";
import UserDetailsCard from "@/components/user/UserDetailsCard.vue";
import DashboardSearch from "@/components/DashboardSearch.vue";
import CreateUserCard from "@/components/user/CreateUserCard.vue";

const ability = useGlimpseAbility();
const dialog = useDialog();
const route = useRoute();
const take = 20;

const showCreatePopup = ref<boolean>(false);
const shownPopup = ref<string | null>(null);
const createdUser = ref<{id: number, show: boolean}>({ id: 0, show: false });

const queryData = useQuery(FindUsersDocument, {
  pagination: {
    take: 20,
    skip: 0
  },
  order: [{
    direction: "Asc" as OrderDirection,
    field: "id" as UserOrderableFields,
  }]
});
const deleteMutation = useMutation(DeleteUserDocument);

const columns = [
  {
    key: "id",
    title: "ID",
    render(row: User) {
      const rowPopupKey = `${row.id}-id`;
      const isPopupShown = computed<boolean>({
        get: () => shownPopup.value === rowPopupKey,
        set: (value: boolean) => shownPopup.value = value ? rowPopupKey : null
      });
      return h(
        RouterPopup,
        {
          maxWidth: 900,
          to: { name: "dashboard-user-details", params: { id: row.id }},
          modelValue: isPopupShown.value,
          'onUpdate:modelValue': (value: boolean) => isPopupShown.value = value
        },
        {
          default: () => h(
            UserDetailsCard,
            { closable: true, id: BigInt(row.id), onSave: () => {
                isPopupShown.value = false;
                refresh();
              }, onClose: () => {
                isPopupShown.value = false;
              } }
          ),
          trigger: () => row.id
        }
      )
    }
  },
  {
    key: "username",
    title: "Username",
    render(row: User) {
      const rowPopupKey = `${row.id}-username`;
      const isPopupShown = computed<boolean>({
        get: () => shownPopup.value === rowPopupKey,
        set: (value: boolean) => shownPopup.value = value ? rowPopupKey : null
      });
      return h(
        RouterPopup,
        {
          maxWidth: 900,
          to: { name: "dashboard-user-details", params: { id: row.id }},
          modelValue: isPopupShown.value,
          'onUpdate:modelValue': (value: boolean) => isPopupShown.value = value
        },
        {
          default: () => h(
            UserDetailsCard,
            { closable: true, id: BigInt(row.id), onSave: () => {
                isPopupShown.value = false;
                refresh();
              }, onClose: () => {
                isPopupShown.value = false;
              } }
          ),
          trigger: () => row.username
        }
      )
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
      const rowPopupKey = `${row.id}-edit`;
      const isPopupShown = computed<boolean>({
        get: () => shownPopup.value === rowPopupKey,
        set: (value: boolean) => shownPopup.value = value ? rowPopupKey : null
      });
      const buttons = [];
      if (ability.can(AbilityActions.Update, subject(AbilitySubjects.User, { ...row }))) {
        buttons.push(
          h(
            RouterPopup,
            {
              maxWidth: 900,
              to: { name: "dashboard-user-details-edit", params: { id: row.id }},
              modelValue: isPopupShown.value,
              'onUpdate:modelValue': (value: boolean) => isPopupShown.value = value
            },
            {
              default: () => h(
                EditUserCard,
                { closable: true, id: BigInt(row.id), onSave: () => {
                    isPopupShown.value = false;
                    refresh();
                  }, onClose: () => {
                    isPopupShown.value = false;
                  } }
              ),
              trigger: () => h(
                NButton,
                { class: "dashboard-users-page-row-button", type: "info", secondary: true, size: "small" },
                () => "Edit"
              )
            }
        ));
      }
      if (ability.can(AbilityActions.Delete, subject(AbilitySubjects.User, { ...row }))) {
        buttons.push(h(
          NButton,
          { class: "dashboard-users-page-row-button", type: "error", secondary: true, size: "small", onClick: () => dialog.error({
              title: "Delete User",
              content: `Are you sure you want to delete the user "${row.username}"? This will also remove their connections, such as groups, attended productions, access/audit logs, and votes.`,
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

interface Filter {
  username: { contains: string, mode: CaseSensitivity.Insensitive }
  id?: { equals?: number }
}

async function searchUser(value: string, type: string) {
  let filter: Filter = {
    username: { contains: '', mode: CaseSensitivity.Insensitive }
  };
  if (value) {
    if (type === "Name")
      filter.username.contains = value.trim();
    if (type === "ID")
      filter.id = { equals: parseInt(value) }
  };
  await queryData.refetch({
    pagination: {
      take: take,
      skip: 0
    },
    filter,
    order: [{
      direction: "Asc" as OrderDirection,
      field: "id" as UserOrderableFields,
    }]
  });
}

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
  margin-bottom: 1.5rem;
  margin-left: 1rem;
  float: right;
}

.top-bar {
  display: flex;
  align-items: center;
}

.buttons {
  display: flex;
}
</style>
