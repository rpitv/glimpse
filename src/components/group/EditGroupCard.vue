<template>
  <n-card class="edit-group-card" :closable="closable" @close="close">
    <h1>Edit Group {{ groupId }}</h1>
    <div v-if="inputGroup === null || data.loading.value">
      <p>Loading...</p>
    </div>
    <n-spin v-else :show="isSaving">
      <template #description> Saving... </template>
      <n-form ref="formRef" :model="inputGroup" :rules="rules" inline>
        <n-grid cols="1 m:3" responsive="screen" x-gap="10" y-gap="10">
          <n-form-item-grid-item path="name" label="Name">
            <n-input
              v-if="inputGroup!.name != null"
              maxlength="50"
              v-model:value="inputGroup!.name"
            />
          </n-form-item-grid-item>
          <n-form-item-grid-item path="priority" label="Priority">
            <n-input-number
              class="form-item"
              v-if="inputGroup?.priority != null"
              v-model:value="inputGroup.priority"
            />
          </n-form-item-grid-item>
          <n-form-item-grid-item path="parentId" label="Parent">
            <div>
              <GroupSearch
                class="form-item"
                :disabled-groups="[{ id: groupId }]"
                @select="parentGroupSelected"
              />
              <n-tag
                v-if="inputGroup!.parent != null"
                closable
                @close="parentGroupSelected(null)"
                type="primary"
                class="parent-group-tag"
              >
                {{ inputGroup!.parent?.name }} (ID {{ inputGroup!.parent?.id }})
              </n-tag>
              <p v-else>None</p>
            </div>
          </n-form-item-grid-item>
        </n-grid>
      </n-form>
    </n-spin>
    <div class="actions">
      <n-button :disabled="isSaving" type="success" @click="save"
        >Save</n-button
      >
      <n-button v-if="closable" :disabled="isSaving" type="error" @click="close"
        >Cancel</n-button
      >
    </div>
  </n-card>
</template>

<script setup lang="ts">
import {
  FormRules,
  NCard,
  NForm,
  NButton,
  NFormItemGridItem,
  NGrid,
  NInput,
  NSpin,
  NTag,
  NInputNumber,
  useMessage,
} from "naive-ui";
import type { PropType } from "vue";
import GroupSearch from "@/components/group/GroupSearch.vue";
import { useMutation, useQuery } from "@vue/apollo-composable";
import {
  Group,
  GroupDetailsDocument,
  UpdateGroupDocument,
} from "@/graphql/types";
import { ref, watch } from "vue";

const props = defineProps({
  closable: {
    type: Boolean,
    default: false,
    required: true,
  },
  groupId: {
    type: BigInt as unknown as PropType<BigInt>,
    required: true,
  },
});

const emit = defineEmits(["close"]);

const message = useMessage();
const data = useQuery(GroupDetailsDocument, { id: props.groupId });
const mutation = useMutation(UpdateGroupDocument);

const isSaving = ref<boolean>(false);
const inputGroup = ref<Group | null>(null);
watch(
  data.result,
  () => {
    inputGroup.value = data.result.value?.group
      ? { ...data.result.value?.group }
      : null;
  },
  { immediate: true }
);

const rules: FormRules = {
  name: [
    {
      required: true,
      trigger: "change",
      validator(rule, value) {
        if (!value) {
          return new Error("Group name is required.");
        } else if (value.length > 50) {
          return new Error("Group name must be 50 characters or less");
        }
      },
    },
  ],
  priority: [
    {
      required: true,
      trigger: "change",
      validator(rule, value) {
        if (isNaN(value)) {
          return new Error("Priority is required.");
        } else if (!Number.isInteger(value) && typeof value !== "bigint") {
          return new Error("Priority must be an integer.");
        }
      },
    },
  ],
  parentId: [
    {
      trigger: "change",
      validator(rule, value) {
        if (value == null) {
          return;
        }
        if (!Number.isInteger(value) && typeof value !== "bigint") {
          return new Error("Parent group ID must be an integer.");
        }
      },
    },
  ],
};

function parentGroupSelected(parent: Pick<Group, "id"> | null) {
  if (!inputGroup.value) {
    throw new Error("Cannot set parent group on null group");
  }
  inputGroup.value.parentId = parent?.id ?? null;
  inputGroup.value.parent = parent ?? null;
}

function save() {
  if (inputGroup.value == null) {
    throw new Error("Cannot set inputGroup to null");
  }

  delete inputGroup.value.__typename;
  delete inputGroup.value.parent;
  delete inputGroup.value.id;

  isSaving.value = true;

  mutation.mutate({
    id: props.groupId,
    data: inputGroup.value,
  });

  mutation.onDone((result) => {
    isSaving.value = false;
    if (!result.errors?.length) {
      emit("close");
      data.refetch();
    } else {
      for (const error of result.errors) {
        message.error(error.message);
      }
    }
  });
}

function close() {
  emit("close");
}
</script>

<style scoped lang="scss">
.form-item {
  width: 100%;
}

.parent-group-tag {
  margin: 1em 0;
}

.actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 1em;
  * {
    margin-left: 0.5em;
  }
}
</style>
