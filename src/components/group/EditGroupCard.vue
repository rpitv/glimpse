<template>
  <n-card class="edit-group-card" :closable="closable" @close="close">
    <h1>Edit Group {{ groupId }}</h1>
    <div v-if="inputGroup === null || data.loading.value">
      <p>Loading...</p>
    </div>
    <n-spin v-else :show="isSaving">
      <template #description> Saving... </template>
      <GroupDetailsInput v-model:data="inputGroup" />
      <RouterPopup v-model="confirmPermissionsEditor" :max-width="1000">
        <GroupPermissionsEditor
          ref="editor"
          :group-id="groupId"
          closable
          @close="confirmPermissionsEditor = false"
        />
        <template #trigger>
          <n-button type="primary">Open Permissions Editor</n-button>
        </template>
      </RouterPopup>
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
import { NCard, NButton, NSpin, useMessage, useDialog } from "naive-ui";
import type { PropType } from "vue";
import { useMutation, useQuery } from "@vue/apollo-composable";
import {
  Group,
  GroupDetailsDocument,
  UpdateGroupDocument,
} from "@/graphql/types";
import { computed, ref, watch } from "vue";
import RouterPopup from "@/components/util/RouterPopup.vue";
import GroupPermissionsEditor from "@/components/group/GroupPermissionsEditor.vue";
import GroupDetailsInput from "@/components/group/GroupDetailsInput.vue";

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

const dialog = useDialog();
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

const showPermissionsEditor = ref<boolean>(false);
const editor = ref<GroupPermissionsEditor | null>(null);
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
.actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 1em;
  * {
    margin-left: 0.5em;
  }
}
</style>
