<template>
  <n-card
    class="create-video-card scaled-card"
    :closable="closable || false"
    @close="emit('close')"
  >
    <h1>Create Video</h1>
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
          <VideoDetailsInput
            @enter="enterKeyPressed"
            v-model:data="videoData"
            ref="videoDetailsInput"
          />
        </div>
        <div v-else-if="currentStep === 2">
          <n-grid cols="1 s:2" responsive="screen">
            <n-grid-item>
              <h2>Video Details</h2>
              <p>Name: {{ videoData.name }}</p>
              <p>Format: {{ videoData.format }}</p>
              <p>URL: {{ videoData.metadata?.url }}</p>
            </n-grid-item>
            <n-grid-item
              v-if="videoData.format === 'EMBED' && videoData.metadata?.url"
            >
              <h2>Preview</h2>
              <iframe
                class="preview-iframe"
                :src="videoData.metadata?.url"
                allow="fullscreen; accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                frameborder="0"
                scrolling="no"
                allowfullscreen
              />
            </n-grid-item>
          </n-grid>
        </div>
        <div v-else-if="currentStep === steps.length + 1">
          <n-alert v-if="error" type="error">
            {{ error }}
          </n-alert>
          <p v-else class="center-text-info">Creating video...</p>
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
        {{ currentStep >= steps.length ? "Create Video" : "Continue" }}
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
import type { Video } from "@/graphql/types";
import { useMutation } from "@vue/apollo-composable";
import { CreateVideoDocument } from "@/graphql/types";
import { useRouter } from "vue-router";
import VideoDetailsInput from "@/components/video/VideoDetailsInput.vue";

const router = useRouter();
const createVideoMutation = useMutation(CreateVideoDocument);

const props = defineProps({
  closable: {
    type: Boolean,
    default: false,
  },
	videoName: {
		type: String,
		required: false,
		default: null,
	}
});

const emit = defineEmits(["close", "save"]);

const steps = [
  {
    title: "Video Details",
    description: "Enter the Video's primary details",
  },
  {
    title: "Review",
    description:
      "Review the data to be submitted and make sure there are no mistakes",
  },
];

const currentStep = ref(1);
const error = ref<string | null>(null);

const videoDetailsInput = ref<VideoDetailsInput | null>(null);
const videoData = ref<Partial<Video>>({
  name: props.videoName ?? "",
  format: "EMBED",
  metadata: {
    url: "",
  },
});

const canContinue = computed<boolean>(() => {
  if (currentStep.value === 1) {
    return videoDetailsInput.value?.isValid;
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
    let createdVideo;
    try {
      createdVideo = await createVideoMutation.mutate({
        data: {
          name: videoData.value.name,
          metadata: videoData.value.metadata,
          format: videoData.value.format,
        },
      });

      if (!createdVideo?.data?.video) {
        error.value = "Failed to create video";
        return;
      }
    } catch (e) {
      console.error(e);
      error.value = "Failed to create video";
      return;
    }

    emit("save", createdVideo?.data?.video.id);
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

.preview-iframe {
  width: 100%;
  aspect-ratio: 16 / 9;
  margin-top: 1em;
}
</style>
