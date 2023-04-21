<template>
  <n-form ref="formRef" :model="inputVideo" :rules="rules" inline>
    <n-grid cols="1 m:3" responsive="screen" x-gap="10" y-gap="10">
      <n-form-item-grid-item
        path="name"
        label="Name"
        v-if="inputVideo!.name != null"
      >
        <n-input maxlength="100" v-model:value="inputVideo!.name" />
      </n-form-item-grid-item>
      <n-form-item-grid-item path="format" label="Format">
        <n-select
          class="form-item"
          v-model:value="inputVideo.format"
          :options="formatOptions"
        />
      </n-form-item-grid-item>
      <n-form-item-grid-item
        path="metadata.url"
        label="URL"
        v-if="inputVideo!.name != null"
      >
        <n-input
          maxlength="1000"
          :value="inputVideo!.metadata?.url || ''"
          @update:value="
            inputVideo.metadata = inputVideo.metadata
              ? { ...inputVideo.metadata, url: $event }
              : { url: $event }
          "
        />
      </n-form-item-grid-item>
    </n-grid>
  </n-form>
  <div>
    <h2>Preview</h2>
    <n-button
      type="info"
      title="Preview is currently only available for embeds."
      :disabled="!inputVideo.metadata?.url || inputVideo.format !== 'EMBED'"
      @click="loadPreviewIFrame"
      >Load Preview</n-button
    >
    <component
      :is="previewIFrame"
      v-if="previewIFrame"
      class="preview-iframe"
    />
  </div>
</template>

<script setup lang="ts">
import {
  NForm,
  NGrid,
  NFormItemGridItem,
  NInput,
  FormInst,
  NSelect,
  NButton,
} from "naive-ui";
import { computed, h, PropType, ref, VNode, watch } from "vue";
import { Video } from "@/graphql/types";
import { FormRules } from "naive-ui";

const props = defineProps({
  data: {
    type: Object as PropType<Partial<Video>>,
    required: true,
  },
});

const formatOptions = [
  {
    label: "Embed",
    value: "EMBED",
  },
  {
    label: "HLS",
    value: "HLS",
  },
  {
    label: "RTMP",
    value: "RTMP",
  },
];

const emit = defineEmits(["update:data"]);

const previewIFrame = ref<null | VNode>(null);
const isValid = ref<boolean>(false);
const formRef = ref<FormInst | null>(null);
defineExpose({
  isValid,
});

watch(
  [props, props.data, formRef],
  async () => {
    if (formRef.value) {
      try {
        await formRef.value.validate();
        isValid.value = true;
        return;
      } catch (e) {}
    }
    isValid.value = false;
  },
  { deep: true, flush: "post" }
);

const inputVideo = computed<Partial<Video>>({
  get() {
    return props.data;
  },
  set(value) {
    emit("update:data", value);
  },
});

const rules: FormRules = {
  name: [
    {
      required: true,
      trigger: "change",
      validator(rule, value) {
        if (!value) {
          return new Error("Video name is required.");
        } else if (value.length > 100) {
          return new Error("Video name must be 100 characters or less");
        }
      },
    },
  ],
  format: [
    {
      required: true,
      trigger: "change",
      validator(rule, value) {
        if (!["EMBED", "HLS", "RTMP"].includes(value)) {
          return new Error('Video format must be "Embed", "HLS", or "RTMP"');
        }
      },
    },
  ],
  metadata: {
    url: [
      {
        trigger: "change",
        validator(rule, value) {
          if (inputVideo.value.format === "EMBED") {
            if (!value) {
              return new Error("Video URL is required.");
            }
          } else if (inputVideo.value.format === "HLS") {
            if (!value) {
              return new Error("Video URL is required.");
            } else if (!value.endsWith(".m3u8")) {
              return new Error('Video URL must end with ".m3u8".');
            }
          } else if (inputVideo.value.format === "RTMP") {
            if (!value) {
              return new Error("Video URL is required.");
            } else if (!value.startsWith("rtmp://")) {
              return new Error('Video URL must start with "rtmp://".');
            }
          }
        },
      },
    ],
  },
};

function loadPreviewIFrame() {
  previewIFrame.value = h("iframe", {
    style: "width: 100%; aspect-ratio: 16 / 9; margin-top: 1em;",
    src: inputVideo.value.metadata?.url,
    allow:
      "fullscreen; accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
    frameborder: 0,
    scrolling: "no",
    allowfullscreen: true,
  });
}
</script>

<style scoped lang="scss">
.form-item {
  width: 100%;
}

.parent-video-tag {
  margin: 1em 0;
}
</style>
