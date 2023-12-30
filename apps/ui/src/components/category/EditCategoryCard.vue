<template>
  <n-card class="edit-category-card" :closable="closable" @close="close">
    <h1>Edit Category {{ categoryId }}</h1>
    <div v-if="inputCategory === null || data.loading.value">
      <p>Loading...</p>
    </div>
    <n-spin v-else :show="isSaving">
      <template #description> Saving... </template>
      <CategoryDetailsInput v-model:data="inputCategory" />
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
  Category,
  CategoryDetailsDocument,
  UpdateCategoryDocument,
} from "@/graphql/types";
import { ref, watch } from "vue";
import CategoryDetailsInput from "@/components/category/CategoryDetailsInput.vue";

const props = defineProps({
  closable: {
    type: Boolean,
    default: false,
    required: true,
  },
  categoryId: {
    type: BigInt as unknown as PropType<BigInt>,
    required: true,
  },
});

const emit = defineEmits(["close"]);

const dialog = useDialog();
const message = useMessage();
const data = useQuery(CategoryDetailsDocument, { id: props.categoryId });
const mutation = useMutation(UpdateCategoryDocument);

const isSaving = ref<boolean>(false);
const inputCategory = ref<Category | null>(null);
watch(
  data.result,
  () => {
    inputCategory.value = data.result.value?.category
      ? { ...data.result.value?.category }
      : null;
  },
  { immediate: true }
);

function save() {
  if (inputCategory.value == null) {
    throw new Error("Cannot set inputCategory to null");
  }

  delete inputCategory.value.__typename;
  delete inputCategory.value.parent;
  delete inputCategory.value.id;

  isSaving.value = true;

  mutation.mutate({
    id: props.categoryId,
    data: inputCategory.value,
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
