<template>
  <v-card title="Create Production">
    <v-stepper :flat="true" v-model="step">
      <template v-slot:actions="{ prev, next }">
        <v-stepper-header >
          <v-stepper-item value="1" title="Production Details" subtitle="Required" />
          <v-divider />
          <v-stepper-item value="2" title="Additional Information" subtitle="Optional"/>
          <v-divider />
          <v-stepper-item value="3" title="Set Category" subtitle="Optional" />
          <v-divider />
          <v-stepper-item value="4" title="Attach Images" subtitle="Optional"/>
          <v-divider />
          <v-stepper-item value="5" title="Attach Videos" subtitle="Optional" />
          <v-divider />
          <v-stepper-item value="6" title="Review" subtitle="Required" />
        </v-stepper-header>
        <v-stepper-window >
          <v-stepper-window-item value="1" >
            <v-form ref="requiredForm">
              <RequiredInput v-model="productionData" :closet-time-missing="closetTimeMissing"
                             :start-time-missing="startTimeMissing" :end-time-missing="endTimeMissing" />
            </v-form>
          </v-stepper-window-item>
          <v-stepper-window-item value="2" >
            <OptionalInput v-model="productionData" :tags="productionTags" @update:tags="(value: string[]) => productionTags = value" />
          </v-stepper-window-item>
          <v-stepper-window-item value="3">
            <CategoryTable :take="take" :productionCategory="productionCategory" @setCategory="(category: any) => productionCategory = category"/>
            <div class="flex-container mt-2" v-if="productionCategory.id">
              <h2>Chosen Category: </h2>
              <v-chip-group column>
                <v-chip class="ml-3" closable
                        @click:close="productionCategory = { id: '', name: ''}" >
                  Category ID: {{ productionCategory.id }}
                </v-chip>
              </v-chip-group>
            </div>
          </v-stepper-window-item>
          <v-stepper-window-item value="4" >
            <ImageTable :take="take" :productionImages="productionImages" :thumbnailId="productionThumbnail.id"
              @setThumbnail="setThumbnailId"
              @addImage="addImage"
            />
            <div class="flex-container mt-2" v-if="productionThumbnail.id">
              <h2>Thumbnail: </h2>
              <v-dialog width="400" scrim="black">
                <template v-slot:activator="{ props }" >
                  <v-chip v-bind="props" class="ml-3" closable
                          @click:close="() => { productionThumbnail.url = ''; productionThumbnail.id = ''}">
                    Image ID: {{ productionThumbnail.id }}
                  </v-chip>
                </template>
                <template v-slot:default>
                  <img :src="productionThumbnail.url">
                </template>
              </v-dialog>
            </div>
            <div class="flex-container mt-2" v-if="productionImages.length">
              <h2>Production Images: </h2>
              <v-chip-group column>
                <v-dialog v-for="(image, i) in productionImages" :key="image.id" width="400" scrim="black">
                  <template v-slot:activator="{ props }">
                    <v-chip class="ml-3" closable v-bind="props"
                            @click:close="productionImages.splice(i, 1)" >
                      Image ID: {{ image.id }}
                    </v-chip>
                  </template>
                  <template v-slot:default>
                    <img :src="image.url">
                  </template>
                </v-dialog>
              </v-chip-group>
            </div>
          </v-stepper-window-item>
          <v-stepper-window-item value="5">
            <VideoTable :productionVideos="productionVideos" :take="take" @addVideo="addVideo" />
            <div class="flex-container mt-2" v-if="productionVideos.length" >
              <h2>Production Videos: </h2>
              <v-chip-group column>
                <v-chip class="ml-3" v-for="(video, i) in productionVideos" closable @click="openURL(video.url)"
                        @click:close="productionVideos.splice(i, 1)" :key="video.id">
                  Video ID: {{ video.id }}
                </v-chip>
              </v-chip-group>
            </div>
          </v-stepper-window-item>
          <v-stepper-window-item value="6">
            <v-alert v-if="error" color="red">
              {{ error }}
            </v-alert>
            <div class="flex-container"
                 :style="productionVideos.length > 0 || productionImages.length > 0 ? 'justify-content: space-evenly' : ''">
              <div>
                <h2>Production Details</h2>
                <p>Name: {{ productionData.name }}</p>
                <p>Closet Location: {{ productionData.closetLocation }}</p>
                <p>Event Location: {{ productionData.eventLocation }}</p>
                <p>Closet Time: {{ productionData.closetTime }}</p>
                <p>Start Time: {{ productionData.startTime }}</p>
                <p>End Time: {{ productionData.endTime }}</p>
                <div class="flex-container" style="align-items: center">
                  <p>Tags: </p>
                  <v-chip-group v-if="productionTags.length > 0">
                    <v-chip class="ml-1" v-for="tag in productionTags" :key="tag">
                      {{ tag }}
                    </v-chip>
                  </v-chip-group>
                  <p v-else class="ml-1">No tags provided.</p>
                </div>
                <p>Description: {{ productionData.description ? productionData.description : 'No description provided.'}}</p>
                <p>Team Notes: {{ productionData.teamNotes ? productionData.teamNotes : 'No notes provided.' }}</p>
                <div class="flex-container" style="align-items: center">
                  <p>Category: </p>
                  <v-hover v-if="productionCategory.id" v-slot:default="{ isHovering, props }">
                    <div class="ml-1" v-bind="props">
                      <v-chip v-if="isHovering">
                        Category Name: {{ productionCategory.name }}
                      </v-chip>
                      <v-chip v-else class="ml-1">
                        Category ID: {{ productionCategory.id }}
                      </v-chip>
                    </div>
                  </v-hover>
                  <p class="ml-1" v-else>No category provided.</p>
                </div>
                <div class="flex-container mt-2" style="align-items: center">
                  <p>Thumbnail: </p>
                  <v-dialog width="400" scrim="black" v-if="productionThumbnail.id">
                    <template v-slot:activator="{ props }" >
                      <v-chip v-bind="props" class="ml-1">
                        Image ID: {{ productionThumbnail.id }}
                      </v-chip>
                    </template>
                    <template v-slot:default>
                      <img :src="productionThumbnail.url">
                    </template>
                  </v-dialog>
                  <p class="ml-1" v-else>No thumbnail provided.</p>
                </div>
                <div class="flex-container" style="align-items: center">
                  <p>Images: </p>
                    <v-chip-group column v-if="productionImages.length">
                      <v-dialog v-for="image in productionImages" :key="image.id" width="400" scrim="black">
                        <template v-slot:activator="{ props }">
                          <v-chip class="ml-1" v-bind="props" >
                            Image ID: {{ image.id }}
                          </v-chip>
                        </template>
                        <template v-slot:default>
                          <img :src="image.url">
                        </template>
                      </v-dialog>
                    </v-chip-group>
                    <p class="ml-1" v-else>No images provided.</p>
                </div>
                <div class="flex-container" style="align-items: center">
                  <p>Videos:</p>
                  <v-chip-group v-if="productionVideos.length > 0">
                    <v-chip class="ml-2" v-for="video in productionVideos" :key="video.id" @click="openURL(video.url)">
                      Video ID: {{ video.id }}
                    </v-chip>
                  </v-chip-group>
                  <p v-else class="ml-1">No videos provided.</p>
                </div>
              </div>
              <div></div>
              <PriorityEditor v-if="productionVideos.length > 0 || productionImages.length > 0"
                      :productionVideos="productionVideos" :productionImages="productionImages" />
            </div>
          </v-stepper-window-item>
        </v-stepper-window>
        <v-stepper-actions @click:next="validate(next)" @click:prev="prev" :next-text="step >= 6 ? 'Create' : 'Next'"
                           :disabled="loading ? 'next' : step <= 1 ? 'prev' : false">
          </v-stepper-actions>
      </template>
    </v-stepper>
  </v-card>
</template>

<script setup lang="ts">
import {watch, ref} from "vue";
import {
  CreateProductionDocument, CreateProductionTagDocument, CreateProductionImageDocument,
  CreateProductionVideoDocument, InputMaybe
} from "@/graphql/types";
import type { Production } from "@/graphql/types";
import {useMutation} from "@vue/apollo-composable";
import RequiredInput from "@/components/production/ProductionDetailsInput/RequiredInput.vue";
import OptionalInput from "@/components/production/ProductionDetailsInput/OptionalInput.vue";
import CategoryTable from "@/components/production/ProductionDetailsInput/CategoryTable.vue";
import ImageTable from "@/components/production/ProductionDetailsInput/ImageTable.vue";
import VideoTable from "@/components/production/ProductionDetailsInput/VideoTable.vue";
import PriorityEditor from "@/components/production/ProductionDetailsInput/PriorityEditor.vue";

const createProductionMutation = useMutation(CreateProductionDocument);
const createTagsMutation = useMutation(CreateProductionTagDocument);
const createImageMutation = useMutation(CreateProductionImageDocument);
const createVideoMutation = useMutation(CreateProductionVideoDocument);

const take = 20;
const requiredForm = ref();
const error = ref<string | null>(null);
const emit = defineEmits(["save"]);

const productionData = ref<Partial<Production>>({
  name: "",
  closetLocation: "",
  eventLocation: "",
  closetTime: "",
  startTime: "",
  endTime: "",
  description: "",
  teamNotes: "",
});

interface urlInterface {
  id: string,
  url: string,
  priority: number,
}

const step = ref(0);
let firstTime = true;
const loading = ref(false);
const closetTimeMissing = ref(false);
const startTimeMissing = ref(false);
const endTimeMissing = ref(false);
const productionTags = ref<string[]>([]);
const productionCategory = ref({id: '', name: ''});
const productionThumbnail = ref<urlInterface>({id: '', url: '', priority: 0});
const productionImages = ref<urlInterface[]>([]);
const productionVideos = ref<urlInterface[]>([]);

watch((productionData.value), () => {
  if (productionData.value.closetTime) {
    closetTimeMissing.value = false;
    if (!productionData.value.startTime && !productionData.value.endTime && firstTime) {
      productionData.value.startTime = productionData.value.closetTime;
      productionData.value.endTime = productionData.value.closetTime;
      firstTime = false;
    }
  }
  if (productionData.value.startTime) {
    startTimeMissing.value = false;
    if (!productionData.value.closetTime && !productionData.value.endTime && firstTime) {
      productionData.value.closetTime = productionData.value.startTime;
      productionData.value.endTime = productionData.value.startTime;
      firstTime = false;
    }
  }

  if (productionData.value.endTime) {
    endTimeMissing.value = false;
    if (!productionData.value.closetTime && !productionData.value.startTime && firstTime) {
      productionData.value.closetTime = productionData.value.endTime;
      productionData.value.startTime = productionData.value.endTime;
      firstTime = false;
    }
  }
});

async function validate(next: any) {
  const validation = await requiredForm.value.validate();
  loading.value = false;
  if (step.value >= 6) {
    loading.value = true;
    await createProduction();
    return;
  }
  if (validation.valid && productionData.value.closetTime && productionData.value.startTime && productionData.value.endTime)
    next();
  if (!productionData.value.closetTime)
    closetTimeMissing.value = true;
  if (!productionData.value.startTime)
    startTimeMissing.value = true;
  if (!productionData.value.endTime)
    endTimeMissing.value = true;
}

async function createProduction() {
  let createdProduction;
  try {
    let production: Partial<Production> = {
      name: productionData.value.name,
      closetLocation: productionData.value.closetLocation,
      eventLocation: productionData.value.eventLocation,
      closetTime: new Date(productionData.value.closetTime).toISOString(),
      startTime: new Date(productionData.value.startTime).toISOString(),
      endTime: new Date(productionData.value.endTime).toISOString(),
      description: productionData.value.description,
      teamNotes: productionData.value.teamNotes,
    }
    if (productionThumbnail.value.id)
      production.thumbnailId = productionThumbnail.value.id;

    if (productionCategory.value.id)
      production.categoryId = productionCategory.value.id;

    createdProduction = await createProductionMutation.mutate({
      data: production
    });
    if (!createdProduction?.data?.production) {
      error.value = "Failed to create production";
      return;
    }
    const productionId = createdProduction?.data?.production.id;
    for (let i = 0; i < productionTags.value.length; i++)
      await createTagsMutation.mutate({
        data: {
          productionId: productionId,
          tag: productionTags.value[i]
        }
      });

    for (let i = 0; i < productionImages.value.length; i++)
      // DON'T ASK QUESTIONS, JUST TRUST ME
      await createImageMutation.mutate({
        data: {
          imageId: productionImages.value[i].id,
          productionId: productionId,
          priority: parseInt(productionImages.value[i].priority.toString())
        }
      });
    for (let i = 0; i < productionVideos.value.length; i++)
      // DON'T ASK QUESTIONS, JUST TRUST ME
      await createVideoMutation.mutate({
        data: {
          videoId: productionVideos.value[i].id,
          productionId: productionId,
          priority: parseInt(productionVideos.value[i].priority.toString())
        }
      });
  } catch (e) {
    console.error(e);
    error.value = "Failed to create production";
    loading.value = false;
    return;
  }
  emit("save", createdProduction?.data?.production.id);
}

function setThumbnailId(imageId: string, url: string) {
  productionThumbnail.value = {
    id: imageId,
    url: url,
    priority: 0
  }
}

function addImage(imageId: string, url: string) {
  productionImages.value.push({
    id: imageId,
    url: url,
    priority: 0
  });
}

function addVideo(videoId: string, url: string) {
  productionVideos.value.push({
    id: videoId,
    url: url,
    priority: 0
  });
}

function openURL(url: string) {
  window.open(url.replace("embed/", "watch?v="), '_blank', 'noreferrer')
}

</script>

<style scoped lang="scss">

.time-container {
  display: flex;
  flex-direction: column;
}

.search-bar {
  max-width: 70%
}

.button-action {
  font-size: 10px;
}

.flex-container {
  display: flex;
  justify-content: flex-start;
}
</style>
