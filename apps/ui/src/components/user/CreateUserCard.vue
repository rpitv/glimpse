<template>
  <n-card class="create-user-card scaled-card">
    <h1>Create User</h1>
    <div class="steps">
      <n-steps :current="currentStep">
        <n-step
          v-for="step of steps"
          :key="step.title"
          :title="step.title"
          :description="step.description"
        />
      </n-steps>
    </div>

    <div class="step">
      <Transition name="steps">
        <div v-if="currentStep === 1">
          <UserDetailsInput
            @keypress.enter="enterKeyPressed"
            v-model:data="userData"
            ref="userDetailsInput"
          />
        </div>
        <div v-else-if="currentStep === 2">
          <n-tag
            class="group-tag"
            v-for="group of groupsToAdd"
            closable
            @close="removeGroup(group)"
            >{{ group.name }} (ID {{ group.id }})</n-tag
          >
          <GroupSearch @select="addGroup" :disabled-groups="groupsToAdd" />
        </div>
        <div v-else-if="currentStep === 3">
          <PermissionsEditor
            :save-required="false"
            :count="permissionsToAdd.length"
            v-model:permissions="permissionsToAdd"
            :creator="true"
          />
        </div>
        <div v-else-if="currentStep === 4">
          <p class="center-text-info">Coming Soon</p>
        </div>
        <div v-else-if="currentStep === 5">
          <n-grid cols="1 s:2 m:4" responsive="screen">
            <n-grid-item>
              <h2>User Details</h2>
              <p>Username: {{ userData.username }}</p>
              <p>Email: {{ userData.mail }}</p>
              <p>Discord ID: {{ userData.discord ?? "None" }}</p>
            </n-grid-item>
            <n-grid-item>
              <h2>Groups</h2>
              <p>{{ groupsToAdd.length }} groups</p>
              <ul>
                <li v-for="group of groupsToAdd" :key="group.id">
                  {{ group.name }} (ID {{ group.id }})
                </li>
              </ul>
            </n-grid-item>
            <n-grid-item>
              <h2>Permissions</h2>
              <p>{{ permissionsToAdd.length }} permissions</p>
              <n-button @click="currentStep = 3">View</n-button>
            </n-grid-item>
            <n-grid-item>
              <h2>Profile</h2>
              <p>Coming Soon</p>
            </n-grid-item>
          </n-grid>
        </div>
        <div v-else-if="currentStep === steps.length + 1">
          <n-alert v-if="error" type="error">
            {{ error }}
          </n-alert>
          <p v-else class="center-text-info">Creating user...</p>
        </div>
      </Transition>
    </div>

    <div class="actions">
      <n-button
        v-if="closable"
        class="action"
        @click="emit('close')"
        type="error"
        :disabled="currentStep > steps.length && !error"
      >
        Cancel
      </n-button>
      <n-button
        tertiary
        type="error"
        class="action"
        v-if="currentStep > 1"
        @click="currentStep--"
        :disabled="currentStep > steps.length && !error"
      >
        Back
      </n-button>
      <n-button
        :primary="currentStep >= steps.length"
        :tertiary="currentStep < steps.length"
        class="action"
        type="success"
        @click="nextStep"
        :disabled="!canContinue"
      >
        {{ currentStep >= steps.length ? "Create User" : "Continue" }}
      </n-button>
    </div>
  </n-card>
</template>

<script setup lang="ts">
import {
  NCard,
  NSteps,
  NStep,
  NButton,
  NTag,
  NGrid,
  NGridItem,
  NAlert,
} from "naive-ui";
import { computed, ref } from "vue";
import GroupSearch from "@/components/group/GroupSelect.vue";
import type { Group, User, UserPermission } from "@/graphql/types";
import UserDetailsInput from "@/components/user/UserDetailsInput.vue";
import { useMutation } from "@vue/apollo-composable";
import {
  CreateUserDocument,
  CreateUserGroupDocument,
  CreateUserPermissionDocument,
} from "@/graphql/types";
import { useRouter } from "vue-router";
import PermissionsEditor from "@/components/util/permissions/PermissionsEditor.vue";

const router = useRouter();
const createUserMutation = useMutation(CreateUserDocument);
const createUserGroupMutation = useMutation(CreateUserGroupDocument);
const createUserPermissionMutation = useMutation(CreateUserPermissionDocument);

const props = defineProps({
  closable: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["close", "save"]);

const steps = [
  {
    title: "User Details",
    description: "Enter the User's primary details",
  },
  {
    title: "Groups",
    description: "Add the User to Groups",
  },
  {
    title: "Permissions",
    description: "Assign custom permissions exclusively for this user",
  },
  {
    title: "Profile",
    description: "Attach a Person to the User for their profile",
  },
  {
    title: "Review",
    description:
      "Review the data to be submitted and make sure there are no mistakes",
  },
];

const currentStep = ref(1);
const error = ref<string | null>(null);

const userData = ref<Partial<User>>({});
const userDetailsInput = ref<UserDetailsInput | null>(null);
const groupsToAdd = ref<Pick<Group, "name" | "id">[]>([]);
const permissionsToAdd = ref<UserPermission[]>([]);

const canContinue = computed<boolean>(() => {
  if (currentStep.value === 1) {
    return userDetailsInput.value?.isValid;
  }
  return currentStep.value <= steps.length;
});

function enterKeyPressed() {
  if (canContinue.value) {
    nextStep();
  }
}

async function nextStep() {
  currentStep.value++;

  if (currentStep.value >= steps.length + 1) {
    let createdUser;
    try {
      createdUser = await createUserMutation.mutate({
        data: {
          username: userData.value.username,
          mail: userData.value.mail,
          discord: userData.value.discord,
        },
      });

      if (!createdUser?.data?.user) {
        error.value = "Failed to create user";
        return;
      }
    } catch (e) {
      console.error(e);
      error.value = "Failed to create user";
      return;
    }

    for (const group of groupsToAdd.value) {
      try {
        const createdUserGroup = await createUserGroupMutation.mutate({
          userId: createdUser?.data?.user.id,
          groupId: group.id,
        });

        if (!createdUserGroup?.data?.userGroup) {
          error.value = "Failed to add user to group";
          return;
        }
      } catch (e) {
        console.error(e);
        error.value = `Failed to add user to the group "${group.name} (ID ${group.id})"`;
        return;
      }
    }

    for (const permission of permissionsToAdd.value) {
      try {
        const createdUserPermission = await createUserPermissionMutation.mutate(
          {
            input: {
              userId: createdUser?.data?.user.id,
              ...permission,
            },
          }
        );

        if (!createdUserPermission?.data?.permission) {
          error.value = "Failed to grant permission to user";
          return;
        }
      } catch (e) {
        console.error(e);
        console.log(permission);
        error.value = "Failed to grant permission to user";
        return;
      }
    }

    emit("save", createdUser?.data?.user.id);
  }
}

function addGroup(group: Group) {
  groupsToAdd.value.push(group);
}

function removeGroup(group: Pick<Group, "name" | "id">) {
  groupsToAdd.value = groupsToAdd.value.filter((g) => g.id !== group.id);
}
</script>

<style scoped lang="scss">
@media (max-width: 1100px) {
  .steps {
    display: none;
  }
}

.center-text-info {
  font-size: 1.5em;
  text-align: center;
}

.step {
  margin-top: 3em;
}

.group-tag {
  margin-bottom: 1em;
  margin-right: 1em;
}

.actions {
  margin-top: 2rem;
  display: flex;
  justify-content: right;
  .action {
    margin-left: 0.5em;
  }
}
</style>
