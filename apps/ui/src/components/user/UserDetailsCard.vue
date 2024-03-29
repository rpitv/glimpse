<template>
  <div class="card-wrapper">
    <n-card class="card">
      <div class="loading" v-if="query.loading.value">Loading...</div>
      <div class="content" v-else-if="query.result.value?.user">
        <div class="header">
          <div class="title-wrapper">
            <h1 class="title">
              <span>{{ query.result.value.user.username }}</span>
              <span class="user-id">ID {{query.result.value.user.id}}</span>
            </h1>
          </div>
          <div class="about-wrapper">
            <n-grid cols="1 350:3 650:5" class="grid">
              <n-grid-item>
                <label>Email</label>
                <p>{{ query.result.value.user.mail }}</p>
              </n-grid-item>
              <n-grid-item>
                <label>Joined</label>
                <p><RelativeTimeTooltip :date="new Date(query.result.value.user.joined)" /></p>
              </n-grid-item>
              <n-grid-item>
                <label>Last Logged In</label>
                <p v-if="query.result.value.user.accessLogs?.length > 0">
                  <RelativeTimeTooltip :date="new Date(query.result.value.user.accessLogs?.[0]?.timestamp)" />
                </p>
                <p v-else class="italic">
                  Never
                </p>
              </n-grid-item>
              <n-grid-item>
                <label>Linked Discord?</label>
                <p>{{ query.result.value.user.discord ? "Yes" : "No" }}</p>
              </n-grid-item>
              <n-grid-item>
                <label>MFA?</label>
                <p class="italic">Coming Soon</p>
              </n-grid-item>
            </n-grid>
          </div>
        </div>

        <div>
          <h2>Groups</h2>
          <n-table v-if="(userGroups?.length ?? 0) > 0">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Priority</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="group in userGroups" :key="group.id">
                <td><RouterLink :to="{ name: 'dashboard-groups', params: { id: group.id }}">{{ group.id }}</RouterLink></td>
                <td><RouterLink :to="{ name: 'dashboard-groups', params: { id: group.id }}">{{ group.name }}</RouterLink></td>
                <td>{{ group.priority }}</td>
              </tr>
            </tbody>
          </n-table>
          <span v-else class="italic">No groups found</span>
        </div>

        <n-grid :cols="`1 m:${actionCount}`" responsive="screen" x-gap="10" class="actions">
          <n-grid-item v-if="ability.can(AbilityActions.Update, userSubject)">
            <RouterPopup :max-width="900" v-model="showEditPopup" :to="{ name: 'dashboard-user-details-edit', params: { id: Number(id) }}">
              <EditUserCard
                closable
                :id="BigInt(query.result.value.user.id)"
                @save="showEditPopup = false"
                @close="showEditPopup = false"
              />
              <template #trigger>
                <n-button class="action" type="info">Edit</n-button>
              </template>
            </RouterPopup>
          </n-grid-item>
          <n-grid-item v-if="ability.can(AbilityActions.Update, userSubject, 'password')">
            <RouterPopup v-model="showChangePasswordPopup" :to="{name: 'dashboard-user-details-change-password', params: { id: Number(id) }}">
              <ChangePasswordCard
                closable
                :user-id="BigInt(query.result.value.user.id)"
                @save="showChangePasswordPopup = false"
                @close="showChangePasswordPopup = false"
              />
              <template #trigger>
                <n-button class="action" type="warning">Change Password</n-button>
              </template>
            </RouterPopup>
          </n-grid-item>
          <n-grid-item v-if="ability.can(AbilityActions.Delete, userSubject)">
            <n-button class="action" type="error" @click="deleteUser">Delete</n-button>
          </n-grid-item>
        </n-grid>
      </div>
      <span v-else>No user found</span>
    </n-card>
  </div>
</template>

<script setup lang="ts">

import { AbilitySubjects, DeleteUserDocument, UserDetailsDocument } from "@/graphql/types";
import { useMutation, useQuery } from "@vue/apollo-composable";
import { NGrid, NGridItem, NCard, NTable, NButton, useDialog } from "naive-ui";
import type { PropType } from "vue";
import RelativeTimeTooltip from "@/components/util/RelativeTimeTooltip.vue";
import { computed, ref } from "vue";
import { AbilityActions, useGlimpseAbility } from "@/casl";
import { subject } from "@casl/ability";
import { useRouter } from "vue-router";
import ChangePasswordCard from "@/components/user/ChangePasswordCard.vue";
import RouterPopup from "@/components/util/RouterPopup.vue";
import EditUserCard from "@/components/user/EditUserCard.vue";

const props = defineProps({
  id: {
    type: BigInt as unknown as PropType<BigInt>,
    required: true
  }
});

const dialog = useDialog();
const ability = useGlimpseAbility();
const router = useRouter();
const query = useQuery(UserDetailsDocument, { id: props.id });
const deleteMutation = useMutation(DeleteUserDocument);

const showEditPopup = ref<boolean>(false);
const showChangePasswordPopup = ref<boolean>(false);

const userGroups = computed(() => {
  return query.result.value?.user?.groups
    ?.map(group => group.group)
    .sort((a, b) => (b?.priority ?? 0) -(a?.priority ?? 0));
})

const userSubject = computed(() => {
  if(!query.result.value?.user) {
    return null;
  }
  return subject(AbilitySubjects.User, { ...query.result.value?.user });
})

const actionCount = computed(() => {
  let count = 0;
  if(!userSubject.value) {
    return count;
  }

  if(ability.can(AbilityActions.Update, userSubject.value)) {
    count++;
  }
  if(ability.can(AbilityActions.Update, userSubject.value, "password")) {
    count++;
  }
  if(ability.can(AbilityActions.Delete, userSubject.value)) {
    count++;
  }

  return count;
})

function deleteUser() {
  dialog.error({
    title: "Delete User",
    content: `Are you sure you want to delete the user "${query.result.value?.user?.username}"? This will also remove their connections, such as groups, attended productions, access/audit logs, and votes.`,
    positiveText: 'Delete User',
    negativeText: 'Cancel',
    onPositiveClick: async () => {
      await deleteMutation.mutate({ id: props.id });
      await router.push({ name: 'dashboard-users-list' });
    }
  })
}
</script>

<style scoped lang="scss">

.card-wrapper {
  display: flex;
  justify-content: center;
  .card {
    max-width: 1000px;
  }
}

.loading {
  text-align: center;
}

.title {
  margin: 0;
  font-size: 2.5em;

  .user-id {
    font-size: 0.6em;
    display: block;
  }
}

.about-wrapper {
  flex-grow: 1;
  text-align: center;
  margin-top: 1.5em;
  label {
    font-weight: bold;
    display: block;
    margin-bottom: 0;
  }
}

@media(min-width: 787px) {
  .header {
    display: flex;
  }
  .title {
    margin-left: 0.5em;
    .user-id {
      margin-left: 0.5em;
    }
  }
  .about-wrapper {
    margin-left: 2em;
  }
}
@media(max-width: 786px) {
  .title-wrapper {
    text-align: center;
  }
}

.italic {
  font-style: italic;
}

.actions {
  margin-top: 1em;
  .action {
    margin-top: 0.5em;
    width: 100%;
  }

  .action-link {
    text-decoration: none;
  }
}

</style>
