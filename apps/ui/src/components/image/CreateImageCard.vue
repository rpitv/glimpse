<template>
  <n-card
    class="create-image-card scaled-card"
    :closable="closable || false"
    @close="emit('close')"
  >
    <h1>Create Image</h1>
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
          <ImageDetailsInput
            @keydown.enter="enterKeyPressed"
            v-model:data="imageData"
            ref="imageDetailsInput"
          />
        </div>
        <div v-else-if="currentStep === 2">
          <n-grid cols="1 s:2" responsive="screen">
            <n-grid-item>
              <h2>Image Details</h2>
              <p>Name: {{ imageData.name }}</p>
              <p>Description: {{ imageData.description }}</p>
              <p>Path: {{ imageData.path }}</p>
            </n-grid-item>
            <n-grid-item>
              <h2>Preview</h2>
              <img
                class="preview-image"
                :src="imageData.path"
                :alt="imageData.name"
                :title="imageData.description"
              />
            </n-grid-item>
          </n-grid>
        </div>
        <div v-else-if="currentStep === steps.length + 1">
          <n-alert v-if="error" type="error">
            {{ error }}
          </n-alert>
          <p v-else class="center-text-info">Creating image...</p>
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
        {{ currentStep >= steps.length ? "Create Image" : "Continue" }}
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
  NAlert,
  NGrid,
  NGridItem,
} from "naive-ui";
import { computed, ref } from "vue";
import type { Image } from "@/graphql/types";
import { useMutation } from "@vue/apollo-composable";
import { CreateImageDocument } from "@/graphql/types";
import { useRouter } from "vue-router";
import ImageDetailsInput from "@/components/image/ImageDetailsInput.vue";

const router = useRouter();
const createImageMutation = useMutation(CreateImageDocument);

const props = defineProps({
  closable: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["close", "save"]);

const steps = [
  {
    title: "Image Details",
    description: "Enter the Image's primary details",
  },
  {
    title: "Review",
    description:
      "Review the data to be submitted and make sure there are no mistakes",
  },
];

const currentStep = ref(1);
const error = ref<string | null>(null);

const imageDetailsInput = ref<ImageDetailsInput | null>(null);
const imageData = ref<Partial<Image>>({
  name: "",
  description: "",
  path: "",
});

const canContinue = computed<boolean>(() => {
  if (currentStep.value === 1) {
    return imageDetailsInput.value?.isValid;
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
    let createdImage;
    try {
      createdImage = await createImageMutation.mutate({
        data: {
          name: imageData.value.name,
          description: imageData.value.description,
          path: imageData.value.path,
        },
      });

      if (!createdImage?.data?.image) {
        error.value = "Failed to create image";
        return;
      }
    } catch (e) {
      console.error(e);
      error.value = "Failed to create image";
      return;
    }

    emit("save", createdImage?.data?.image.id);
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

.actions {
  margin-top: 2rem;
  display: flex;
  justify-content: right;
  .action {
    margin-left: 0.5em;
  }
}
.preview-image {
  max-width: 100%;
  margin-top: 1em;
}
</style>
