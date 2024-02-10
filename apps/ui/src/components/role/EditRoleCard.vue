<template>
  <n-card class="edit-role-card scaled-card" :closable="closable" @close="close">
    <h1>Edit Role {{ roleId }}</h1>
    <div v-if="inputRole === null || data.loading.value">
      <p>Loading...</p>
    </div>
    <n-spin v-else :show="isSaving">
      <template #description> Saving... </template>
      <RoleDetailsInput v-model:data="inputRole" />
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
import { Role, RoleDetailsDocument, UpdateRoleDocument } from "@/graphql/types";
import { ref, watch } from "vue";
import RoleDetailsInput from "@/components/role/RoleDetailsInput.vue";

const props = defineProps({
  closable: {
    type: Boolean,
    default: false,
    required: true,
  },
  roleId: {
    type: BigInt as unknown as PropType<BigInt>,
    required: true,
  },
});

const emit = defineEmits(["close"]);

const dialog = useDialog();
const message = useMessage();
const data = useQuery(RoleDetailsDocument, { id: props.roleId });
const mutation = useMutation(UpdateRoleDocument);

const isSaving = ref<boolean>(false);
const inputRole = ref<Role | null>(null);
watch(
  data.result,
  () => {
    inputRole.value = data.result.value?.role
      ? { ...data.result.value?.role }
      : null;
  },
  { immediate: true }
);

function save() {
  if (inputRole.value == null) {
    throw new Error("Cannot set inputRole to null");
  }

  delete inputRole.value.__typename;
  delete inputRole.value.id;

  isSaving.value = true;

  mutation.mutate({
    id: props.roleId,
    data: inputRole.value,
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
