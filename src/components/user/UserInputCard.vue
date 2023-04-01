<template>
  <div class="card-wrapper">
    <n-card class="card">
      <div v-if="sourceData.loading.value">Loading...</div>
      <div v-else-if="loadingError">
        {{ loadingError }}
      </div>
      <div v-else>
        <h1>Edit User {{ id }}</h1>

        <UserDetailsInput v-model:data="inputUser" ref="userDetailsInput" />
        <div>
          <h2>Groups</h2>
          <n-tag
            class="group-tag"
            type="primary"
            closable
            v-for="userGroup of currentUserGroups"
            @close="removeUserGroup(userGroup)"
          >
            <RouterLink
              to="{ name: 'dashboard-groups', params: { id: group.id }}"
            >
              {{ userGroup.group?.name }} (ID {{ userGroup.group?.id }})
            </RouterLink>
          </n-tag>
          <n-tag
            class="group-tag deleted"
            closable
            v-for="userGroup of userGroupsToBeDeleted"
            @close="removeUserGroup(userGroup)"
          >
            <RouterLink
              to="{ name: 'dashboard-groups', params: { id: group.id }}"
            >
              {{ userGroup.group?.name }} (ID {{ userGroup.group?.id }})
            </RouterLink>
          </n-tag>
          <n-tag
            class="group-tag added"
            type="info"
            closable
            v-for="group of groupsToBeAdded"
            @close="removeAddedGroup(group)"
          >
            <RouterLink
              to="{ name: 'dashboard-groups', params: { id: group.id }}"
            >
              {{ group.name }} (ID {{ group.id }})
            </RouterLink>
          </n-tag>
          <GroupSearch
            @select="groupSelected"
            :disabled-groups="currentUserGroups"
          />
        </div>
        <div>
          <h2>Permissions</h2>
          <RouterPopup v-model="confirmPermissionsEditor" :max-width="1000">
            <UserPermissionsEditor
              ref="editor"
              :user-id="id"
              closable
              @close="confirmPermissionsEditor = false"
            />
            <template #trigger>
              <n-button type="primary">Open Permissions Editor</n-button>
            </template>
          </RouterPopup>
        </div>
        <div>
          <h2>Profile</h2>
          <p>Coming soon</p>
        </div>
        <div class="actions">
          <n-button
            :disabled="!userDetailsInput?.isValid || submitting"
            @click="save"
            class="action"
            type="success"
          >
            {{ submitting ? "Saving..." : "Save" }}
          </n-button>
          <n-button
            class="action"
            v-if="closable"
            @click="emit('close')"
            type="error"
          >
            Cancel
          </n-button>
        </div>
      </div>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { NCard, NTag, NButton, useDialog } from "naive-ui";
import type { PropType } from "vue";
import { useMutation, useQuery } from "@vue/apollo-composable";
import {
  CreateUserGroupDocument,
  DeleteUserGroupDocument,
  Group,
  UpdateUserDocument,
  UserDetailsDocument,
  UserGroup,
} from "@/graphql/types";
import type { User } from "@/graphql/types";
import { computed, onMounted, ref } from "vue";
import UserDetailsInput from "@/components/user/UserDetailsInput.vue";
import GroupSearch from "@/components/group/GroupSearch.vue";
import RouterPopup from "@/components/util/RouterPopup.vue";
import UserPermissionsEditor from "@/components/user/UserPermissionsEditor.vue";

const props = defineProps({
  id: {
    type: BigInt as unknown as PropType<BigInt>,
    required: true,
  },
  closable: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["save", "close"]);

const dialog = useDialog();

const sourceData = useQuery(UserDetailsDocument, { id: props.id });
const updateUserMutation = useMutation(UpdateUserDocument);
const createUserGroupMutation = useMutation(CreateUserGroupDocument);
const deleteUserGroupMutation = useMutation(DeleteUserGroupDocument);

sourceData.onResult(reloadInputData);
onMounted(reloadInputData);

const editor = ref<UserPermissionsEditor | null>(null);
const submitting = ref<boolean>(false);
const loadingError = ref<string>("");
const inputUser = ref<Partial<User>>({});
const userGroupsToBeDeleted = ref<UserGroup[]>([]);
const groupsToBeAdded = ref<Pick<Group, "name" | "id">[]>([]);
const userDetailsInput = ref<UserDetailsInput | null>(null);
const showPermissionsEditor = ref<boolean>(false);

const confirmPermissionsEditor = computed({
  get: () => showPermissionsEditor.value,
  set: (value: boolean) => {
    if (!value && editor.value.hasUnsavedChanges) {
      dialog.warning({
        title: "Close without saving?",
        content: "Are you sure you want to close without saving?",
        positiveText: "Yes",
        negativeText: "Go Back",
        onPositiveClick: () => {
          showPermissionsEditor.value = false;
        },
      });
    } else {
      showPermissionsEditor.value = value;
    }
  },
});

const currentUserGroups = computed<UserGroup[]>(() => {
  if (!sourceData.result.value?.user?.groups) {
    return [];
  }
  return sourceData.result.value.user?.groups?.filter(
    (ug) => !userGroupsToBeDeleted.value.find((ug2) => ug2.id === ug.id)
  );
});

function reloadInputData() {
  loadingError.value = "";
  const result = sourceData.result.value;
  if (!result?.user) {
    loadingError.value = "User not found";
  }
  inputUser.value = { ...result?.user };
  groupsToBeAdded.value = [];
  userGroupsToBeDeleted.value = [];
}

async function save() {
  if (!userDetailsInput.value?.isValid) {
    return;
  }
  submitting.value = true;

  // Update the actual user
  await updateUserMutation.mutate({
    id: inputUser.value.id,
    data: {
      username: inputUser.value.username,
      mail: inputUser.value.mail,
      discord: inputUser.value.discord,
    },
  });

  // Delete any groups that have been removed
  for (const userGroup of userGroupsToBeDeleted.value) {
    await deleteUserGroupMutation.mutate({
      id: userGroup.id,
    });
  }

  // Add any groups that have been added
  for (const group of groupsToBeAdded.value) {
    await createUserGroupMutation.mutate({
      userId: inputUser.value.id,
      groupId: group.id,
    });
  }

  // Re-fetch the user data
  await sourceData.refetch();

  reloadInputData();
  submitting.value = false;
  emit("close");
}

function groupSelected(group: Pick<Group, "name" | "id">) {
  if (groupsToBeAdded.value.find((g) => g.id === group.id)) {
    return;
  }
  if (inputUser.value.groups?.find((g) => g.group?.id === group.id)) {
    return;
  }
  groupsToBeAdded.value.push(group);
}

function removeAddedGroup(group: Pick<Group, "name" | "id">) {
  groupsToBeAdded.value = groupsToBeAdded.value.filter(
    (g) => g.id !== group.id
  );
}
function removeUserGroup(userGroup: UserGroup) {
  if (userGroupsToBeDeleted.value.find((ug) => ug.id === userGroup.id)) {
    userGroupsToBeDeleted.value = userGroupsToBeDeleted.value.filter(
      (ug) => ug.id !== userGroup.id
    );
  } else if (inputUser.value.groups?.find((ug) => ug?.id === userGroup.id)) {
    userGroupsToBeDeleted.value.push(userGroup);
  }
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
.input-item label {
  display: block;
  margin-bottom: 0.5em;
}

.group-tag {
  margin-right: 0.5em;
  margin-bottom: 0.5em;

  &.added a {
    font-style: italic;
    color: rgba(112, 192, 232);
  }
  &.deleted a {
    font-style: italic;
    color: rgb(145, 144, 144);
  }
}

.actions {
  margin-top: 0.5em;
  display: flex;
  justify-content: right;

  .action {
    margin-left: 0.5em;
  }
}
</style>
