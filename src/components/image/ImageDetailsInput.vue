<template>
  <div>
    <n-form ref="formRef" :model="inputImage" :rules="rules" inline>
      <n-grid cols="1 m:3" responsive="screen" x-gap="10" y-gap="10">
        <n-form-item-grid-item
          path="name"
          label="Name"
          v-if="inputImage!.name != null"
        >
          <n-input maxlength="50" v-model:value="inputImage!.name" />
        </n-form-item-grid-item>
        <n-form-item-grid-item path="description" label="Description">
          <n-input maxlength="200" v-model:value="inputImage!.description" />
        </n-form-item-grid-item>
        <n-form-item-grid-item
          path="path"
          label="Path"
          v-if="inputImage!.path != null"
        >
          <n-input maxlength="1000" v-model:value="inputImage!.path" />
        </n-form-item-grid-item>
      </n-grid>
    </n-form>
    <div>
      <h2>Preview</h2>
      <n-button
        type="info"
        :disabled="!inputImage.path"
        @click="previewPath = inputImage.path"
        >Load Preview</n-button
      >
      <img
        v-if="previewPath"
        class="preview-image"
        :src="previewPath"
        :alt="inputImage.name"
        :title="inputImage.description"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  NForm,
  NGrid,
  NFormItemGridItem,
  NInput,
  NButton,
  FormInst,
} from "naive-ui";
import { computed, PropType, ref, watch } from "vue";
import { Image } from "@/graphql/types";
import { FormRules } from "naive-ui";

const props = defineProps({
  data: {
    type: Object as PropType<Partial<Image>>,
    required: true,
  },
});

const emit = defineEmits(["update:data"]);

const isValid = ref<boolean>(false);
const previewPath = ref<string | null>(null);
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

const inputImage = computed<Partial<Image>>({
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
          return new Error("Image name is required.");
        } else if (value.length > 50) {
          return new Error("Image name must be 50 characters or less");
        }
      },
    },
  ],
  path: [
    {
      required: true,
      trigger: "change",
      validator(rule, value) {
        if (!value) {
          return new Error("Image path is required.");
        } else if (value.length > 50) {
          return new Error("Image path must be 1000 characters or less");
        } else if (!value.match(/^https?:\/\/.*/)) {
          return new Error("Image path must start with http:// or https://");
        }
      },
    },
  ],
  description: [
    {
      required: false,
      trigger: "change",
      validator(rule, value) {
        if (value?.length > 200) {
          return new Error("Image description must be 200 characters or less");
        }
      },
    },
  ],
};
</script>

<style scoped lang="scss">
.form-item {
  width: 100%;
}

.parent-image-tag {
  margin: 1em 0;
}
.preview-image {
  max-width: 100%;
  margin-top: 1em;
}
</style>
