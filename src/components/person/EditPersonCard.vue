<template>
  <n-card class="edit-person-card" :closable="closable" @close="close">
    <h1>Edit Person {{ personId }}</h1>
    <div v-if="inputPerson === null || data.loading.value">
      <p>Loading...</p>
    </div>
    <n-spin v-else :show="isSaving">
      <template #description> Saving... </template>
      <PersonDetailsInput v-model:data="inputPerson" />
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
  Person,
  PersonDetailsDocument,
  UpdatePersonDocument,
} from "@/graphql/types";
import { ref, watch } from "vue";
import PersonDetailsInput from "@/components/person/PersonDetailsInput.vue";

const props = defineProps({
  closable: {
    type: Boolean,
    default: false,
    required: true,
  },
  personId: {
    type: BigInt as unknown as PropType<BigInt>,
    required: true,
  },
});

const emit = defineEmits(["close"]);

const dialog = useDialog();
const message = useMessage();
const data = useQuery(PersonDetailsDocument, { id: props.personId });
const mutation = useMutation(UpdatePersonDocument);

const isSaving = ref<boolean>(false);
const inputPerson = ref<Person | null>(null);
watch(
  data.result,
  () => {
    inputPerson.value = data.result.value?.person
      ? { ...data.result.value?.person }
      : null;
  },
  { immediate: true }
);

function save() {
  if (inputPerson.value == null) {
    throw new Error("Cannot set inputPerson to null");
  }

  delete inputPerson.value.__typename;
  delete inputPerson.value.id;

  isSaving.value = true;

  mutation.mutate({
    id: props.personId,
    data: inputPerson.value,
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
