<template>
  <div class="top-bar">
    <DashboardSearch document-name="Users" @search="searchUser" />
    <div class="buttons">
      <RouterPopup
          v-if="ability.can(AbilityActions.Create, AbilitySubjects.User)"
          :max-width="1100" v-model="showCreatePopup"
          :to="{ name: 'dashboard-user-create' }"
      >
        <template #default>
          <CreateUserCard
              closable
              @save="(id: number) => {
                showCreatePopup = false;
                refresh();
                createdUser = { id: id, show: true };
              }"
              @close="showCreatePopup = false"
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
        <p>Created User {{ createdUser.id }}</p>
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
  <div>
    <v-data-table-server class="table"
       :items-per-page="take"
       :items-length="queryData.result.value ? queryData.result.value.userCount : 0"
       :page="currentPage" :headers="headers"
       :items="queryData.result.value?.users"
       no-data-text="No users found 💀"
       v-model:sort-by="order"
       :loading="queryData.loading.value"
       loading-text="Loading Users..."
    >
      <template #item.username="{index, item}">
        <RouterPopup
          :max-width="1100" v-model="details[index]"
          :to="{ name: 'dashboard-user-details-edit', params: {id: item.id } }"
          @update:modelValue="(value: boolean) => { shownPopup = value ? item.id : null}"
        >
          <UserDetailsCard
            @close="
                details[index] = false
                refresh();"
            :id="BigInt(item.id)"
            :closable="true"
          />
          <template #trigger>
            {{ item.username }}
          </template>
        </RouterPopup>
      </template>
      <template #item.actions="{ index, item }">
        <RouterPopup
          v-if="ability.can(AbilityActions.Update, subject(AbilitySubjects.User, {
            id: item.id,
            name: item.name,
            email: item.mail,
            joined: item.joined
          }))"
          :max-width="1100" v-model="list[index]"
          :to="{ name: 'dashboard-user-details-edit', params: {id: item.id } }"
          @update:modelValue="(value: boolean) => { shownPopup = value ? item.id : null}"
        >
          <EditUserCard
            @close="
                list[index] = false
                refresh();"
            :id="BigInt(item.id)"
            :closable="true"
          />
          <template #trigger>
            <v-btn variant="flat" icon="fa-pen" color="green-darken-3" size="small" class="mr-2"/>
          </template>
        </RouterPopup>
        <v-dialog max-width="500">
          <template #activator="{ props }">
            <v-btn variant="flat" size="small" color="red-darken-4" v-bind="props" v-if="canDelete(item)" icon="fa-trash" />
          </template>
          <template #default="{ isActive }">
            <v-card title="Delete User">
              <v-card-text>
                Are you sure you want to delete the user "{{item.name}}"? This will also remove its members.
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn @click="isActive.value = false" variant="outlined" text="Cancel"/>
                <v-btn @click="deleteUser(item)" variant="outlined"
                       text="Delete" color="#FF5252" :disabled="isDeleting" />
              </v-card-actions>
            </v-card>
          </template>
        </v-dialog>
      </template>
      <template v-slot:bottom>
        <v-pagination
          v-model="currentPage"
          :length="!!queryData.result.value?.userCount ? Math.ceil(queryData.result.value?.userCount / take) : 1"
          @update:modelValue="loadUsers"
        />
      </template>
    </v-data-table-server>
  </div>
</template>

<script setup lang="ts">
import { useMutation, useQuery } from "@vue/apollo-composable";
import {
  AbilitySubjects, CaseSensitivity,
  DeleteUserDocument,
  FindUsersDocument,
  OrderDirection,
  UserOrderableFields
} from "@/graphql/types";
import type { User } from "@/graphql/types";
import { watch, onMounted, ref } from "vue";
import { AbilityActions, useGlimpseAbility } from "@/casl";
import { subject } from "@casl/ability";
import RouterPopup from "@/components/util/RouterPopup.vue";
import EditUserCard from "@/components/user/EditUserCard.vue";
import UserDetailsCard from "@/components/user/UserDetailsCard.vue";
import DashboardSearch from "@/components/DashboardSearch.vue";
import CreateUserCard from "@/components/user/CreateUserCard.vue";

const ability = useGlimpseAbility();
const showCreatePopup = ref<boolean>(false);
const shownPopup = ref<string | null>(null);
const list = ref<boolean[]>([]);
const details = ref<boolean[]>([]);
const isDeleting = ref(false);
const currentPage = ref(1);
const order = ref<{key: string, order: string}[]>([]);
const createdUser = ref<{id: number, show: boolean}>({ id: 0, show: false });
const take = 20;

for (let i = 0; i < take; i++)
  list.value[i] = false;

for (let i = 0; i < take; i++)
  details.value[i] = false;

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

const headers = [
  { title: "ID", sortable: true, key: "id" },
  { title: "Username", key: "username", sortable: true },
  { title: "Email", key: "mail", sortable: true},
  { title: "Joined", key: "joined", value:
      (user: User) => formattedTime(user.joined), sortable: true},
  { title: "Actions", key: "actions", sortable: false, minWidth: "150px" }
]

async function loadUsers(page: number) {
  await queryData.refetch({
    pagination: {
      take: take,
      skip: (page - 1) * take
    }
  });
  currentPage.value = page;
}

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

async function deleteUser(user: User) {
  try {
    isDeleting.value = true;
    await deleteMutation.mutate({id: parseInt(user.id)});
    await refresh();
  } catch (e) {
    console.error(e);
  }
  isDeleting.value = false;
}

function canDelete(user: User): boolean {
  return ability.can(AbilityActions.Delete, subject(AbilitySubjects.Role, {
    id: user.id,
    username: user.username,
    email: user.mail,
    joined: user.joined
  }))
}

function formattedTime(time: string) {
  const date = new Date(time);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short"
  };
  return new Intl.DateTimeFormat("en-US", options).format(date);
}

async function refresh() {
  await queryData.refetch();
}

watch(order, () => {
  if (order.value.length)
    queryData.refetch({
      order: [{
        // It's either asc or desc and we need to capitalize it
        direction: order.value[0].order.charAt(0).toUpperCase() + order.value[0].order.slice(1) as OrderDirection,
        field: order.value[0].key as UserOrderableFields
      }]
    })
  else
    queryData.refetch({
      order: [{direction: "Desc" as OrderDirection, field: "id" as UserOrderableFields }]
    })
});

onMounted(async () => {
  await refresh();
})
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
