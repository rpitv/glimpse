<template>
  <n-card class="edit-video-card scaled-card" :closable="closable" @close="close">
    <h1>Edit Video {{ videoId }}</h1>
    <div v-if="inputVideo === null || data.loading.value">
      <p>Loading...</p>
    </div>
    <n-spin v-else :show="isSaving">
      <template #description> Saving... </template>
      <VideoDetailsInput v-model:data="inputVideo" />
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
  Video,
  VideoDetailsDocument,
  UpdateVideoDocument,
} from "@/graphql/types";
import { ref, watch } from "vue";
import VideoDetailsInput from "@/components/video/VideoDetailsInput.vue";

const props = defineProps({
  closable: {
    type: Boolean,
    default: false,
    required: false,
  },
  videoId: {
    type: BigInt as unknown as PropType<BigInt>,
    required: true,
  },
});

const emit = defineEmits(["close"]);

const dialog = useDialog();
const message = useMessage();
const data = useQuery(VideoDetailsDocument, { id: props.videoId });
const mutation = useMutation(UpdateVideoDocument);

const isSaving = ref<boolean>(false);
const inputVideo = ref<Video | null>(null);
watch(
  data.result,
  () => {
    inputVideo.value = data.result.value?.video
      ? { ...data.result.value?.video }
      : null;
  },
  { immediate: true }
);

function save() {
  if (inputVideo.value == null) {
    throw new Error("Cannot set inputVideo to null");
  }

  delete inputVideo.value.__typename;
  delete inputVideo.value.id;

  isSaving.value = true;

  mutation.mutate({
    id: props.videoId,
    data: inputVideo.value,
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
