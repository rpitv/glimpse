<template>
  <n-card
    class="create-person-card scaled-card"
    :closable="closable || false"
    @close="emit('close')"
  >
    <h1>Create Person</h1>
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
          <PersonDetailsInput
            @keypress.enter="enterKeyPressed"
            v-model:data="personData"
            ref="personDetailsInput"
          />
        </div>
        <div v-else-if="currentStep === 2">
          <n-grid cols="1 s:2" responsive="screen" x-gap="10">
            <n-grid-item>
              <h2>Profile Picture</h2>
              <ImageSearch @select="profilePictureSelected" />
              <div
                v-if="personData.profilePictureId && personData.profilePicture"
              >
                <div class="profile-picture-remove-btn-wrapper">
                  <n-button
                    round
                    secondary
                    type="error"
                    @click="profilePictureSelected(null)"
                  >
                    Remove
                    <template #icon>
                      <font-awesome-icon icon="fa-light fa-times" />
                    </template>
                  </n-button>
                </div>
                <img
                  class="profile-picture centered"
                  :src="personData.profilePicture.path"
                  :alt="personData.profilePicture.name"
                  :title="personData.profilePicture.description"
                />
              </div>
            </n-grid-item>
            <n-grid-item>
              <h2>Images</h2>
              <ImageSearch @select="imageSelected" />
              <div v-for="image of personData.images">
                <n-button
                  secondary
                  type="error"
                  class="remove-image-btn"
                  @click="removeImage(image)"
                >
                  Remove
                  <template #icon>
                    <font-awesome-icon icon="fa-light fa-times" />
                  </template>
                </n-button>
                <img
                  class="image"
                  :src="image.image?.path"
                  :alt="image.image?.name"
                  :title="image.image?.description"
                />
              </div>
            </n-grid-item>
          </n-grid>
        </div>
        <div v-else-if="currentStep === 3">
          <n-grid cols="1 s:4" responsive="screen">
            <n-grid-item>
              <h2>Profile Picture</h2>
              <p
                v-if="
                  !personData.profilePictureId || !personData.profilePicture
                "
              >
                None
              </p>
              <img
                v-else
                class="profile-picture"
                :src="personData.profilePicture.path"
                :alt="personData.profilePicture.name"
                :title="personData.profilePicture.description"
              />
            </n-grid-item>
            <n-grid-item>
              <h2>Person Details</h2>
              <p>Name: {{ personData.name }}</p>
              <p>Pronouns: {{ personData.pronouns || "None" }}</p>
              <p>
                Graduation:
                {{
                  personData.graduation
                    ? moment(personData.graduation).format("MMMM Do, YYYY")
                    : "None"
                }}
              </p>
            </n-grid-item>
            <n-grid-item>
              <h2>Description</h2>
              <Markdown v-if="personData.description">{{
                personData.description
              }}</Markdown>
              <p v-else>None</p>
            </n-grid-item>
            <n-grid-item>
              <h2>Images</h2>
              <div v-for="image of personData.images">
                <img
                  class="image"
                  :src="image.image?.path"
                  :alt="image.image?.name"
                  :title="image.image?.description"
                />
              </div>
            </n-grid-item>
          </n-grid>
        </div>
        <div v-else-if="currentStep === steps.length + 1">
          <n-alert v-if="error" type="error">
            {{ error }}
          </n-alert>
          <p v-else class="center-text-info">Creating person...</p>
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
        {{ currentStep >= steps.length ? "Create Person" : "Continue" }}
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
  NGrid,
  NGridItem,
  NAlert,
} from "naive-ui";
import { computed, ref } from "vue";
import type { Image, Person, PersonImage } from "@/graphql/types";
import { useMutation } from "@vue/apollo-composable";
import {
  CreatePersonDocument,
  CreatePersonImageDocument,
} from "@/graphql/types";
import { useRouter } from "vue-router";
import PersonDetailsInput from "@/components/person/PersonDetailsInput.vue";
import moment from "moment";
import Markdown from "@/components/util/Markdown.vue";
import ImageSearch from "@/components/image/ImageSelect.vue";

const personDetailsInput = ref<PersonDetailsInput | null>(null);
const personData = ref<Partial<Person>>({
  name: "",
  description: "",
  pronouns: null,
  graduation: null,
  profilePictureId: null,
  profilePicture: null,
  images: [],
});

const router = useRouter();
const createPersonMutation = useMutation(CreatePersonDocument);
const createPersonImageMutation = useMutation(CreatePersonImageDocument);

const props = defineProps({
  closable: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["close", "save"]);

const steps = [
  {
    title: "Person Details",
    description: "Enter the Person's primary details",
  },
  {
    title: "Images",
    description: "Select images to display on this person's profile",
  },
  {
    title: "Review",
    description:
      "Review the data to be submitted and make sure there are no mistakes",
  },
];

const currentStep = ref(1);
const error = ref<string | null>(null);

const canContinue = computed<boolean>(() => {
  if (currentStep.value === 1) {
    return personDetailsInput.value?.isValid;
  }
  return currentStep.value <= steps.length;
});

function enterKeyPressed() {
  if (canContinue.value) {
    nextStep();
  }
}

function profilePictureSelected(
  image: Pick<Image, "id" | "name" | "description" | "path"> | null
) {
  personData.value.profilePicture = image;
  personData.value.profilePictureId = image?.id || null;
}

function imageSelected(
  image: Pick<Image, "id" | "name" | "description" | "path">
) {
  if (!personData.value.images) {
    personData.value.images = [];
  }
  if (personData.value.images.find((i) => i.image?.id === image.id)) {
    return;
  }
  personData.value.images.push({ image });
}

function removeImage(image: PersonImage) {
  const index =
    personData.value.images?.findIndex(
      (i) => i.image?.id === image.image?.id
    ) ?? -1;
  if (index >= 0) {
    personData.value.images?.splice(index, 1);
  }
}

async function nextStep() {
  currentStep.value++;

  if (currentStep.value >= steps.length + 1) {
    let createdPerson;
    try {
      createdPerson = await createPersonMutation.mutate({
        data: {
          name: personData.value.name,
          description: personData.value.description,
          pronouns: personData.value.pronouns,
          graduation: personData.value.graduation,
          profilePictureId: personData.value.profilePictureId,
        },
      });

      if (!createdPerson?.data?.person) {
        error.value = "Failed to create person";
        return;
      }

      if (personData.value.images) {
        for (const image of personData.value.images) {
          await createPersonImageMutation.mutate({
            personId: createdPerson.data.person.id,
            imageId: image.image?.id,
          });
        }
      }
    } catch (e) {
      console.error(e);
      error.value = "Failed to create person";
      return;
    }

    emit("save", createdPerson?.data?.person.id);
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

.profile-picture {
  border-radius: 50%;
  margin-top: 1em;
  width: 50%;
  aspect-ratio: 1;
  object-fit: cover;

  &.centered {
    margin-left: 25%;
  }
}

.profile-picture-remove-btn-wrapper {
  margin-top: 1em;
  display: flex;
  justify-content: center;
}

.image {
  margin-top: 0.5em;
  width: 100%;
}
.remove-image-btn {
  margin-top: 1em;
  width: 100%;
}
</style>
