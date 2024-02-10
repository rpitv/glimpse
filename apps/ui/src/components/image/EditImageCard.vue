<template>
  <n-card class="edit-image-card scaled-card" :closable="closable" @close="close">
    <h1>Edit Image {{ imageId }}</h1>
    <div v-if="inputImage === null || data.loading.value">
      <p>Loading...</p>
    </div>
    <n-spin v-else :show="isSaving">
      <template #description> Saving... </template>
      <ImageDetailsInput v-model:data="inputImage" />
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
  Image,
  ImageDetailsDocument,
  UpdateImageDocument,
} from "@/graphql/types";
import { ref, watch } from "vue";
import ImageDetailsInput from "@/components/image/ImageDetailsInput.vue";

const props = defineProps({
  closable: {
    type: Boolean,
    default: false,
    required: false,
  },
  imageId: {
    type: BigInt as unknown as PropType<BigInt>,
    required: true,
  },
});

const emit = defineEmits(["close"]);

const dialog = useDialog();
const message = useMessage();
const data = useQuery(ImageDetailsDocument, { id: props.imageId });
const mutation = useMutation(UpdateImageDocument);

const isSaving = ref<boolean>(false);
const inputImage = ref<Image | null>(null);
watch(
  data.result,
  () => {
    inputImage.value = data.result.value?.image
      ? { ...data.result.value?.image }
      : null;
  },
  { immediate: true }
);

function save() {
  if (inputImage.value == null) {
    throw new Error("Cannot set inputImage to null");
  }

  delete inputImage.value.__typename;
  delete inputImage.value.id;

  isSaving.value = true;

  mutation.mutate({
    id: props.imageId,
    data: inputImage.value,
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
