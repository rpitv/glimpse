<template>
  <n-card
    class="create-group-card"
    :closable="closable || false"
    @close="emit('close')"
  >
    <h1>Create Group</h1>
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
          <GroupDetailsInput
            @keypress.enter="enterKeyPressed"
            v-model:data="groupData"
            ref="groupDetailsInput"
          />
        </div>
        <div v-else-if="currentStep === 2" >
          <PermissionsEditor
            :save-required="false"
            :count="permissionsToAdd.length"
            v-model:permissions="permissionsToAdd"
            :creator="true"
          />
        </div>
        <div v-else-if="currentStep === 3">
          <n-grid cols="1 s:2" responsive="screen">
            <n-grid-item>
              <h2>Group Details</h2>
              <p>Name: {{ groupData.name }}</p>
              <p>Priority: {{ groupData.priority }}</p>
              <p>Parent: {{ groupParent }}</p>
            </n-grid-item>
            <n-grid-item>
              <h2>Permissions</h2>
              <p>{{ permissionsToAdd.length }} permissions</p>
              <n-button @click="currentStep = 3">View</n-button>
            </n-grid-item>
          </n-grid>
        </div>
        <div v-else-if="currentStep === steps.length + 1">
          <n-alert v-if="error" type="error">
            {{ error }}
          </n-alert>
          <p v-else class="center-text-info">Creating group...</p>
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
        {{ currentStep >= steps.length ? "Create Group" : "Continue" }}
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
  NGrid,
  NGridItem,
  NAlert,
} from "naive-ui";
import { computed, ref } from "vue";
import type { Group, GroupPermission } from "@/graphql/types";
import { useMutation } from "@vue/apollo-composable";
import {
  CreateGroupDocument,
  CreateGroupPermissionDocument,
} from "@/graphql/types";
import { useRouter } from "vue-router";
import PermissionsEditor from "@/components/util/permissions/PermissionsEditor.vue";
import GroupDetailsInput from "@/components/group/GroupDetailsInput.vue";

const router = useRouter();
const createGroupMutation = useMutation(CreateGroupDocument);
const createGroupPermissionMutation = useMutation(
  CreateGroupPermissionDocument
);

const props = defineProps({
  closable: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["close", "save"]);

const steps = [
  {
    title: "Group Details",
    description: "Enter the Group's primary details",
  },
  {
    title: "Permissions",
    description: "Assign permissions to the Group",
  },
  {
    title: "Review",
    description:
      "Review the data to be submitted and make sure there are no mistakes",
  },
];

const currentStep = ref(1);
const error = ref<string | null>(null);

const groupDetailsInput = ref<GroupDetailsInput | null>(null);
const groupData = ref<Partial<Group>>({
  name: "",
  priority: 0,
  parentId: null,
});
const permissionsToAdd = ref<GroupPermission[]>([]);

const groupParent = computed<string>(() => {
  if (groupData.value.parent?.name && groupData.value.parent?.id) {
    return `${groupData.value.parent.name} (ID ${groupData.value.parent.id})`;
  } else if (groupData.value.parent?.name) {
    return groupData.value.parent.name;
  } else if (groupData.value.parent?.id) {
    return `ID ${groupData.value.parent.id}`;
  } else if (groupData.value.parentId) {
    return `ID ${groupData.value.parentId}`;
  } else {
    return "None";
  }
});

const canContinue = computed<boolean>(() => {
  if (currentStep.value === 1) {
    return groupDetailsInput.value?.isValid;
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
    let createdGroup;
    try {
      createdGroup = await createGroupMutation.mutate({
        data: {
          name: groupData.value.name,
          priority: groupData.value.priority,
          parentId: groupData.value.parentId,
        },
      });

      if (!createdGroup?.data?.group) {
        error.value = "Failed to create group";
        return;
      }
    } catch (e) {
      console.error(e);
      error.value = "Failed to create group";
      return;
    }

    for (const permission of permissionsToAdd.value) {
      try {
        const createdGroupPermission =
          await createGroupPermissionMutation.mutate({
            input: {
              groupId: createdGroup?.data?.group.id,
              ...permission,
            },
          });

        if (!createdGroupPermission?.data?.permission) {
          error.value = "Failed to grant permission to group";
          return;
        }
      } catch (e) {
        console.error(e);
        console.log(permission);
        error.value = "Failed to grant permission to group";
        return;
      }
    }

    emit("save", createdGroup?.data?.group.id);
  }
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
