<template>
  <v-card :title="`Edit Production ${productionId}`" min-height="500">
    <div v-if="currentProduction.loading.value" class="flex-container" style="justify-content: center; text-align: center; align-items: center" >
      <div>
        <v-progress-circular color="error" indeterminate></v-progress-circular>
        <h2>Loading</h2>
      </div>
    </div>
    <v-stepper v-else :flat="true" v-model="step" :editable="editable">
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
        <v-stepper-window>
          <v-stepper-window-item value="1" >
            <v-form ref="requiredForm">
                <RequiredInput v-model="newProductionData" :closet-time-missing="closetTimeMissing"
                               :start-time-missing="startTimeMissing" :end-time-missing="endTimeMissing" />
            </v-form>
          </v-stepper-window-item>
          <v-stepper-window-item value="2" >
            <OptionalInput v-model="newProductionData" :tags="newProductionTags" @update:tags="(value: string[]) => newProductionTags = value" />
          </v-stepper-window-item>
          <v-stepper-window-item value="3">
            <CategoryTable :take="take" :productionCategory="newProductionCategory" @setCategory="(category: any) => newProductionCategory = category"/>
            <div class="flex-container mt-2" v-if="newProductionCategory.id">
              <h2>Chosen Category: </h2>
              <v-chip-group column>
                <v-chip class="ml-3" closable
                        @click:close="newProductionCategory = { id: '', name: ''}" >
                  Category ID: {{ newProductionCategory.id }}
                </v-chip>
              </v-chip-group>
            </div>
          </v-stepper-window-item>
          <v-stepper-window-item value="4" >
              <ImageTable :take="take" :productionImages="newProductionImages" :thumbnailId="newProductionThumbnail.id"
                          @setThumbnail="setThumbnailId"
                          @addImage="addImage"
              />
            <div class="flex-container mt-2" v-if="newProductionThumbnail.id">
              <h2>Thumbnail: </h2>
              <v-dialog width="400" scrim="black">
                <template v-slot:activator="{ props }" >
                  <v-chip v-bind="props" class="ml-1" closable @click:close="() => {newProductionThumbnail.url = ''; newProductionThumbnail.id = ''}">
                    Image ID: {{ newProductionThumbnail.id }}
                  </v-chip>
                </template>
                <template v-slot:default>
                  <img :src="newProductionThumbnail.url">
                </template>
              </v-dialog>
            </div>
            <div class="flex-container mt-2" v-if="newProductionImages.length">
              <h2>Production Images: </h2>
              <v-chip-group column>
                <v-dialog v-for="(image, i) in newProductionImages" :key="image.id" width="400" scrim="black">
                  <template v-slot:activator="{ props }">
                    <v-chip class="ml-3" closable v-bind="props"
                            @click:close="newProductionImages.splice(i, 1)" >
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
            <VideoTable :productionVideos="newProductionVideos" :take="take" @addVideo="addVideo" />
            <div class="flex-container mt-2" v-if="newProductionVideos.length">
              <h2>Production Videos: </h2>
              <v-chip-group column>
                <v-chip class="ml-3" v-for="(video, i) in newProductionVideos" closable @click="openURL(video.url)"
                        @click:close="newProductionVideos.splice(i, 1)" :key="video.id">
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
                 :style="newProductionVideos.length > 0 || newProductionImages.length > 0 ? 'justify-content: space-evenly' : ''">
              <div>
                <h2>Production Details</h2>
                <p>Name: {{ newProductionData.name }}</p>
                <p>Closet Location: {{ newProductionData.closetLocation }}</p>
                <p>Event Location: {{ newProductionData.eventLocation }}</p>
                <p>Closet Time: {{ new Date(newProductionData.closetTime).toLocaleString() }}</p>
                <p>Start Time: {{ new Date(newProductionData.startTime).toLocaleString() }}</p>
                <p>End Time: {{ new Date(newProductionData.endTime).toLocaleString() }}</p>
                <div class="flex-container" style="align-items: center">
                  <p>Tags: </p>
                  <v-chip-group v-if="newProductionTags.length > 0">
                    <v-chip class="ml-1" v-for="tag in newProductionTags" :key="tag">
                      {{ tag }}
                    </v-chip>
                  </v-chip-group>
                  <p v-else class="ml-1">No tags provided.</p>
                </div>
                <p>Description:
                  {{ newProductionData.description ?? 'No description provided.' }}</p>
                <p>Team Notes: {{ newProductionData.teamNotes ?? 'No notes provided.' }}</p>
                <div class="flex-container" style="align-items: center">
                  <p>Category: </p>
                  <v-hover v-if="newProductionCategory.id" v-slot:default="{ isHovering, props }">
                    <div class="ml-1 mb-1" v-bind="props">
                      <v-chip v-if="isHovering">
                        Category Name: {{ newProductionCategory.name }}
                      </v-chip>
                      <v-chip v-else class="ml-1">
                        Category ID: {{ newProductionCategory.id }}
                      </v-chip>
                    </div>
                  </v-hover>
                  <p class="ml-1" v-else>No category provided.</p>
                </div>
                <div class="flex-container" style="align-items: center">
                  <p>Thumbnail: </p>
                  <v-dialog width="400" scrim="black" v-if="newProductionThumbnail.id">
                    <template v-slot:activator="{ props }" >
                      <v-chip v-bind="props" class="ml-1">
                        Image ID: {{ newProductionThumbnail.id }}
                      </v-chip>
                    </template>
                    <template v-slot:default>
                      <img :src="newProductionThumbnail.url">
                    </template>
                  </v-dialog>
                  <p class="ml-1" v-else>No thumbnail provided.</p>
                </div>
                <div class="flex-container" style="align-items: center">
                  <p>Images: </p>
                  <v-chip-group column v-if="newProductionImages.length">
                    <v-dialog v-for="image in newProductionImages" :key="image.id" width="400" scrim="black">
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
                  <v-chip-group v-if="newProductionVideos.length > 0">
                    <v-chip class="ml-2" v-for="video in newProductionVideos" :key="video.id" @click="openURL(video.url)">
                      Video ID: {{ video.id }}
                    </v-chip>
                  </v-chip-group>
                  <p v-else class="ml-1">No videos provided.</p>
                </div>
              </div>
              <div></div>
                <PriorityEditor v-if="newProductionVideos.length > 0 || newProductionImages.length > 0"
                                :productionVideos="newProductionVideos" :productionImages="newProductionImages" />
            </div>
          </v-stepper-window-item>
        </v-stepper-window>
        <v-stepper-actions @click:next="validate(next)" @click:prev="prev" :next-text="step >= 6 ? 'Edit' : 'Next'"
                   :disabled="loading ? 'next' : step <= 1 ? 'prev' : false">
        </v-stepper-actions>
      </template>
    </v-stepper>
  </v-card>
</template>

<script setup lang="ts">
import {watch, ref, watchEffect, computed} from "vue";
import type { PropType } from "vue";
import {
  UpdateProductionDocument, CreateProductionTagDocument, CreateProductionImageDocument,
  CreateProductionVideoDocument, ProductionDetailsDocument, DeleteProductionImageDocument,
  DeleteProductionTagDocument, DeleteProductionVideoDocument, UpdateProductionImageDocument,
  UpdateProductionVideoDocument,
} from "@/graphql/types";
import type { Production } from "@/graphql/types";
import {useMutation, useQuery} from "@vue/apollo-composable";
import RequiredInput from "@/components/production/ProductionDetailsInput/RequiredInput.vue";
import OptionalInput from "@/components/production/ProductionDetailsInput/OptionalInput.vue";
import CategoryTable from "@/components/production/ProductionDetailsInput/CategoryTable.vue";
import VideoTable from "@/components/production/ProductionDetailsInput/VideoTable.vue";
import PriorityEditor from "@/components/production/ProductionDetailsInput/PriorityEditor.vue";
import ImageTable from "@/components/production/ProductionDetailsInput/ImageTable.vue";

const props = defineProps({
  productionId: {
    type: BigInt as unknown as PropType<BigInt>,
    required: true,
  },
});

const updateProductionMutation = useMutation(UpdateProductionDocument);
const updateImageMutation = useMutation(UpdateProductionImageDocument);
const updateVideoMutation = useMutation(UpdateProductionVideoDocument);
const createTagMutation = useMutation(CreateProductionTagDocument);
const createImageMutation = useMutation(CreateProductionImageDocument);
const createVideoMutation = useMutation(CreateProductionVideoDocument);
const deleteTagMutation = useMutation(DeleteProductionTagDocument);
const deleteImageMutation = useMutation(DeleteProductionImageDocument);
const deleteVideoMutation = useMutation(DeleteProductionVideoDocument);

const currentProduction = useQuery(ProductionDetailsDocument, {
  id: props.productionId
});

const requiredForm = ref();
const error = ref<string | null>(null);
const emit = defineEmits(["save"]);

const oldProductionData = ref<Partial<Production>>({});
const newProductionData = ref<Partial<Production>>({});

/*
 * prodId is the id of its corresponding type. for example the id of the
 * productionImage. This is so that we can delete the appropriate object
 * if we need to.
 *
 * id is the corresponding type's id. For example, an Image Id.
 *
 * url is the corresponding type's path or url. This is purely used so that
 * users can preview what item this is
 *
 * name is the corresponding type's name. This has similar functions to url
 */
interface urlInterface {
  prodId?: string
  id: string,
  url: string,
  priority: number,
}

const step = ref(0);
const loading = ref(false);
const closetTimeMissing = ref(false);
const startTimeMissing = ref(false);
const endTimeMissing = ref(false);
const take = 20;
const oldProductionTags = ref<{id: string, tag: string}[]>([]);
const newProductionTags = ref<string[]>([]);
const oldProductionCategory = ref({id: '', name: ''});
const newProductionCategory = ref({id: '', name: ''});
const oldProductionThumbnail = ref<urlInterface>({id: '', url: '', priority: 0});
const newProductionThumbnail = ref<urlInterface>({id: '', url: '', priority: 0});
const oldProductionImages = ref<urlInterface[]>([]);
const newProductionImages = ref<urlInterface[]>([]);
const oldProductionVideos = ref<urlInterface[]>([]);
const newProductionVideos = ref<urlInterface[]>([]);

const editable = computed(() => {
  return !(!newProductionData.value.name || !newProductionData.value.closetLocation || !newProductionData.value.eventLocation ||
    !newProductionData.value.closetTime || !newProductionData.value.startTime || !newProductionData.value.endTime);
})

watch(currentProduction.result, () => {
  if (currentProduction.result.value) {
    // Note: we can't simply set the new values equal to the old because it won't be a deep copy
    const production = currentProduction.result.value?.production;
    oldProductionData.value = {
      name: production?.name,
      categoryId: production?.categoryId,
      closetLocation: production?.closetLocation,
      eventLocation: production?.eventLocation,
      closetTime: production?.closetTime,
      startTime: production?.startTime,
      endTime: production?.endTime,
      description: production?.description,
      teamNotes: production?.teamNotes,
    };
    newProductionData.value = {
      name: production?.name,
      categoryId: production?.categoryId,
      closetLocation: production?.closetLocation,
      eventLocation: production?.eventLocation,
      closetTime: production?.closetTime,
      startTime: production?.startTime,
      endTime: production?.endTime,
      description: production?.description,
      teamNotes: production?.teamNotes,
    }
    if (production?.thumbnail) {
      oldProductionThumbnail.value = {
        id: production?.thumbnail?.id,
        url: production?.thumbnail?.path as string,
        priority: 0
      }
      newProductionThumbnail.value = {
        id: production?.thumbnail?.id,
        url: production?.thumbnail?.path as string,
        priority: 0
      }
    }

    const tags = production?.tags;
    if (tags) {
      for (let i = 0; i < tags.length; i++) {
        oldProductionTags.value[i] = {
          tag: tags[i].tag as string,
          id: tags[i].id
        }
        newProductionTags.value[i] = tags[i].tag as string;
      }
    }

    const category = production?.category;
    if (category) {
      oldProductionCategory.value = {
        id: category.id,
        name: category.name as string
      }
      newProductionCategory.value = {
        id: category.id,
        name: category.name as string
      }
    }

    const images = production?.images;
    if (images) {
      for (let i = 0; i < images?.length; i++) {
        oldProductionImages.value[i] = {
          id: images[i].imageId,
          url: images[i].image?.path as string,
          priority: images[i].priority as number,
          prodId: images[i].id
        }
        newProductionImages.value[i] = {
          id: images[i].imageId,
          url: images[i].image?.path as string,
          priority: images[i].priority as number,
          prodId: images[i].id
        }
      }
    }
    const videos = production?.videos;
    if (videos) {
      for (let i = 0; i < videos.length; i++) {
        oldProductionVideos.value[i] = {
          id: videos[i].video?.id,
          url: videos[i].video?.metadata.url,
          priority: videos[i].priority as number,
          prodId: videos[i].id
        }
        newProductionVideos.value[i] = {
          id: videos[i].video?.id,
          url: videos[i].video?.metadata.url,
          priority: videos[i].priority as number,
          prodId: videos[i].id
        }
      }
    }
  }
}, {immediate: true})

async function validate(next: any) {
  const validation = await requiredForm.value.validate();
  if (step.value >= 6) {
    loading.value = true;
    await editProduction();
    loading.value = false;
    return;
  }
  if (validation.valid && newProductionData.value.closetTime && newProductionData.value.startTime && newProductionData.value.endTime)
    next();
  if (!newProductionData.value.closetTime)
    closetTimeMissing.value = true;
  if (!newProductionData.value.startTime)
    startTimeMissing.value = true;
  if (!newProductionData.value.endTime)
    endTimeMissing.value = true;

}

function setThumbnailId(imageId: string, url: string) {
  newProductionThumbnail.value = {
    id: imageId,
    url: url,
    priority: 0
  }
}

function addImage(imageId: string, url: string) {
  newProductionImages.value.push({
    id: imageId,
    url: url,
    priority: 0
  });
}

function addVideo(videoId: string, url: string) {
  newProductionVideos.value.push({
    id: videoId,
    url: url,
    priority: 0
  });
}

function openURL(url: string) {
  window.open(url.replace("embed/", "watch?v="), '_blank', 'noreferrer')
}

async function editProduction() {
  try {
    let production: Partial<Production> = {}
    // We'll be comparing each individual value since the api is slower than the client.
    if (newProductionData.value.name !== oldProductionData.value.name) production.name = newProductionData.value.name;
    if (newProductionData.value.categoryId !== oldProductionData.value.categoryId) production.categoryId = newProductionData.value.categoryId;
    if (newProductionData.value.closetLocation !== oldProductionData.value.closetLocation) production.closetLocation = newProductionData.value.closetLocation;
    if (newProductionData.value.eventLocation !== oldProductionData.value.eventLocation) production.eventLocation = newProductionData.value.eventLocation;
    if (newProductionData.value.closetTime !== oldProductionData.value.closetTime) production.closetTime = newProductionData.value.closetTime;
    if (newProductionData.value.startTime !== oldProductionData.value.startTime) production.startTime = newProductionData.value.startTime;
    if (newProductionData.value.endTime !== oldProductionData.value.endTime) production.endTime = newProductionData.value.endTime;
    if (newProductionData.value.description !== oldProductionData.value.description) production.description = newProductionData.value.description;
    if (newProductionData.value.teamNotes !== oldProductionData.value.teamNotes) production.teamNotes = newProductionData.value.teamNotes;
    if (newProductionCategory.value.id !== oldProductionCategory.value.id)
      production.categoryId = newProductionCategory.value.id.length ? newProductionCategory.value.id : null;
    if (newProductionThumbnail.value.id !== oldProductionThumbnail.value.id)
      production.thumbnailId = newProductionThumbnail.value.id.length ? newProductionThumbnail.value.id : null

    await updateProductionMutation.mutate({
      data: production,
      id: props.productionId
    });

    const tagsToCreate = newProductionTags.value.filter((newTag) => !oldProductionTags.value.some((oldTag) => oldTag.tag === newTag));
    const tagsToDelete = oldProductionTags.value.filter((oldTag) => !newProductionTags.value.some((newTag) => oldTag.tag === newTag));

    for (const tag of tagsToCreate)
      await createTagMutation.mutate({
        data: {
          productionId: props.productionId,
          tag: tag
        }
      })
    for (const tag of tagsToDelete)
      await deleteTagMutation.mutate({
        id: tag.id
      })


    const imgsToCreate = newProductionImages.value.filter((newImg) => !oldProductionImages.value.some((oldImg) => oldImg.id === newImg.id));
    const imgsToDelete = oldProductionImages.value.filter((oldImg) => !newProductionImages.value.some((newImg) => oldImg.id === newImg.id));
    const imgsToUpdate = newProductionImages.value.filter((newImg) => !imgsToCreate.includes(newImg)).filter((newImg) => !imgsToDelete.includes(newImg));

    for (const image of imgsToCreate)
      await createImageMutation.mutate({
        data: {
          imageId: image.id,
          productionId: props.productionId,
          priority: parseInt(image.priority.toString())
        }
      })
    for (const image of imgsToDelete)
      await deleteImageMutation.mutate({
        id: image.prodId
      })
    for (const image of imgsToUpdate)
      await updateImageMutation.mutate({
        id: image.prodId,
        data: {
          priority: parseInt(image.priority.toString())
        }
      })
    const vidsToCreate = newProductionVideos.value.filter((newVid) => !oldProductionVideos.value.some((oldVid) => oldVid.id === newVid.id));
    const vidsToDelete = newProductionVideos.value.filter((oldVid) => !newProductionVideos.value.some((newVid) => oldVid.id === newVid.id));
    const vidsToUpdate = newProductionVideos.value.filter((newVid) => !vidsToCreate.includes(newVid)).filter((newVid) => !vidsToDelete.includes(newVid));

    for (const video of vidsToCreate)
      await createVideoMutation.mutate({
        data: {
          videoId: video.id,
          productionId: props.productionId,
          priority: parseInt(video.priority.toString())
        }
      })
    for (const video of vidsToDelete)
      await deleteVideoMutation.mutate({
        id: video.prodId
      })
    for (const video of vidsToUpdate)
      await updateVideoMutation.mutate({
        id: video.prodId,
        data: {
          priority: parseInt(video.priority.toString())
        }
      })
  } catch (e) {
    console.error(e);
    error.value = "Failed to edit production";
    return;
  }
  emit("save", props.productionId);

}

</script>

<style scoped lang="scss">
.button-action {
  font-size: 10px;
}

.flex-container {
  display: flex;
  justify-content: flex-start;
}
</style>
