<template>
  <v-card :title="`Edit Production ${productionId}`">
    <div v-if="currentProduction.loading.value" class="center-screen" >
      <div>
        <v-progress-circular color="error" indeterminate></v-progress-circular>
        <h2 class="mb-10">Loading</h2>
      </div>
    </div>
    <v-stepper v-else :flat="true" v-model="step" :editable="editable">
      <template v-slot:actions="{ prev, next }">
        <v-stepper-header >
          <v-stepper-item :value="1" title="Details" :complete="step > 1" />
          <v-divider />
          <v-stepper-item :value="2" title="More Information"  :complete="step > 2"/>
          <v-divider />
          <v-stepper-item :value="3" title="Set Category" :complete="step > 3" />
          <v-divider />
          <v-stepper-item :value="4" title="Attach Images" :complete="step > 4" />
          <v-divider />
          <v-stepper-item :value="5" title="Attach Videos" :complete="step > 5" />
          <v-divider />
          <v-stepper-item :value="6" title="Credit People" :complete="step > 6" />
          <v-divider />
          <v-stepper-item :value="7" title="Review" />
        </v-stepper-header>
        <v-stepper-window>
          <v-stepper-window-item :value="1" >
            <v-form ref="requiredForm">
                <RequiredInput v-model="productionData" :closet-time-missing="closetTimeMissing"
                 :start-time-missing="startTimeMissing" :end-time-missing="endTimeMissing" />
            </v-form>
          </v-stepper-window-item>
          <v-stepper-window-item :value="2" >
            <OptionalInput v-model="productionData" :tags="newProductionTags" @update:tags="(value: string[]) => newProductionTags = value" />
          </v-stepper-window-item>
          <v-stepper-window-item :value="3">
            <CategoryTable :take="take" :productionCategory="newProductionCategory"
              @setCategory="(category: any) => newProductionCategory = {
                id: category.id,
                name: category.name
              }"/>
            <CategoryRow :productionCategory="newProductionCategory" @close="newProductionCategory = { id: 0, name: ''}" />
          </v-stepper-window-item>
          <v-stepper-window-item :value="4" >
              <ImageTable :take="take" :productionImages="newProductionImages" :thumbnailId="newProductionThumbnail.id"
                          @setThumbnail="setThumbnailId"
                          @addImage="addImage"
              />
            <ImageRow :productionThumbnail="newProductionThumbnail" :productionImages="newProductionImages" />
          </v-stepper-window-item>
          <v-stepper-window-item :value="5">
            <VideoTable :productionVideos="newProductionVideos" :take="take" @addVideo="addVideo" />
            <VideoRow :productionVideos="newProductionVideos" />
          </v-stepper-window-item>
          <v-stepper-window-item :value="6">
            <PeopleTable :take="take" :people="newCreditPeople" @addPerson="addPerson"/>
            <PeopleRow :creditPeople="newCreditPeople" />
          </v-stepper-window-item>
          <v-stepper-window-item :value="7">
            <v-alert v-if="error" color="red">
              {{ error }}
            </v-alert>
            <div style="display: grid; grid-template-columns: 1fr 1fr">
              <ReviewTable :productionData="productionData" :tags="newProductionTags" :category="newProductionCategory" :thumbnail="newProductionThumbnail"
                           :images="newProductionImages" :videos="newProductionVideos" :credits="newCreditPeople" />
              <PriorityEditor v-if="newProductionVideos.length > 0 || newProductionImages.length > 0 || newCreditPeople.length > 0"
                              :productionVideos="newProductionVideos" :productionImages="newProductionImages" :creditPeople="newCreditPeople" />
            </div>
          </v-stepper-window-item>
        </v-stepper-window>
        <v-stepper-actions @click:next="validate(next)" @click:prev="prev" :prev-text="'PREVIOUS'" :next-text="step >= 7 ? 'EDIT' : 'NEXT'"
                   :disabled="loading ? 'next' : step <= 1 ? 'prev' : false">
        </v-stepper-actions>
      </template>
    </v-stepper>
  </v-card>
</template>

<script setup lang="ts">
import {watch, ref, computed, onMounted} from "vue";
import type { PropType } from "vue";
import {
  UpdateProductionDocument, CreateProductionTagDocument, CreateProductionImageDocument,
  CreateProductionVideoDocument, ProductionDetailsDocument, DeleteProductionImageDocument,
  DeleteProductionTagDocument, DeleteProductionVideoDocument, UpdateProductionImageDocument,
  UpdateProductionVideoDocument, CreateCreditDocument, UpdateCreditDocument, DeleteCreditDocument,
} from "@/graphql/types";
import type { Production } from "@/graphql/types";
import {useMutation, useQuery} from "@vue/apollo-composable";
import RequiredInput from "@/components/production/ProductionDetailsInput/RequiredInput.vue";
import OptionalInput from "@/components/production/ProductionDetailsInput/OptionalInput.vue";
import CategoryTable from "@/components/production/ProductionDetailsInput/CategoryTable.vue";
import VideoTable from "@/components/production/ProductionDetailsInput/VideoTable.vue";
import PriorityEditor from "@/components/production/ProductionDetailsInput/PriorityEditor.vue";
import ImageTable from "@/components/production/ProductionDetailsInput/ImageTable.vue";
import ReviewTable from "@/components/production/ProductionDetailsInput/ReviewTable.vue";
import CategoryRow from "@/components/production/ProductionDetailsInput/CategoryRow.vue";
import ImageRow from "@/components/production/ProductionDetailsInput/ImageRow.vue";
import VideoRow from "@/components/production/ProductionDetailsInput/VideoRow.vue";
import PeopleTable from "@/components/production/ProductionDetailsInput/PeopleTable.vue";
import PeopleRow from "@/components/production/ProductionDetailsInput/PeopleRow.vue";

const props = defineProps({
  productionId: {
    type: BigInt as unknown as PropType<BigInt>,
    required: true,
  },
});

const updateProductionMutation = useMutation(UpdateProductionDocument);
const updateImageMutation = useMutation(UpdateProductionImageDocument);
const updateVideoMutation = useMutation(UpdateProductionVideoDocument);
const updateCreditMutation = useMutation(UpdateCreditDocument);
const createTagMutation = useMutation(CreateProductionTagDocument);
const createImageMutation = useMutation(CreateProductionImageDocument);
const createVideoMutation = useMutation(CreateProductionVideoDocument);
const createCreditMutation = useMutation(CreateCreditDocument);
const deleteTagMutation = useMutation(DeleteProductionTagDocument);
const deleteImageMutation = useMutation(DeleteProductionImageDocument);
const deleteVideoMutation = useMutation(DeleteProductionVideoDocument);
const deleteCreditMutation = useMutation(DeleteCreditDocument);

const currentProduction = useQuery(ProductionDetailsDocument, {
  id: props.productionId
});

const requiredForm = ref();
const error = ref<string | null>(null);
const emit = defineEmits(["save"]);

const productionData = ref<Partial<Production>>({});

interface urlInterface {
  prodId?: string
  id: number,
  url: string,
  priority: number,
}

interface Credit {
  creditId?: number,
  personId: number,
  name: string,
  title?: string,
  priority?: number
}

const step = ref(0);
const loading = ref(false);
const closetTimeMissing = ref(false);
const startTimeMissing = ref(false);
const endTimeMissing = ref(false);
const take = 20;
const oldProductionTags = ref<{id: string, tag: string}[]>([]);
const newProductionTags = ref<string[]>([]);
const oldProductionCategory = ref<{id: number, name: string}>({id: 0, name: ''});
const newProductionCategory = ref<{id: number, name: string}>({id: 0, name: ''});
const oldProductionThumbnail = ref<urlInterface>({id: 0, url: '', priority: 0});
const newProductionThumbnail = ref<urlInterface>({id: 0, url: '', priority: 0});
const oldProductionImages = ref<urlInterface[]>([]);
const newProductionImages = ref<urlInterface[]>([]);
const oldProductionVideos = ref<urlInterface[]>([]);
const newProductionVideos = ref<urlInterface[]>([]);
const oldCreditPeople = ref<Credit[]>([]);
const newCreditPeople = ref<Credit[]>([]);

const editable = computed(() => {
  return !(!productionData.value.name || !productionData.value.closetLocation || !productionData.value.eventLocation ||
    !productionData.value.closetTime || !productionData.value.startTime || !productionData.value.endTime);
})

currentProduction.onResult((result) => {
  if (result.loading) return;
  const production = result.data?.production;
  oldCreditPeople.value = [];
  newCreditPeople.value = [];

  productionData.value = {
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

  const credits = production?.credits;
  if (credits) {
    for (let i = 0; i < credits.length; i++) {
      oldCreditPeople.value[i] = {
        creditId: credits[i].id,
        personId: credits[i].person?.id,
        name: credits[i].person?.name as string,
        title: credits[i].title as string,
        priority: credits[i].priority as number
      }
      newCreditPeople.value[i] = {
        creditId: credits[i].id,
        personId: credits[i].person?.id,
        name: credits[i].person?.name as string,
        title: credits[i].title as string,
        priority: credits[i].priority as number
      }
    }
  }
})

async function validate(next: any) {
  const validation = await requiredForm.value.validate();
  if (step.value >= 7) {
    loading.value = true;
    await editProduction();
    loading.value = false;
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

function setThumbnailId(imageId: number, url: string) {
  newProductionThumbnail.value = {
    id: imageId,
    url: url,
    priority: 0
  }
}

function addImage(imageId: number, url: string) {
  newProductionImages.value.push({
    id: imageId,
    url: url,
    priority: 0
  });
}

function addVideo(videoId: number, url: string) {
  newProductionVideos.value.push({
    id: videoId,
    url: url,
    priority: 0
  });
}

function addPerson(personId: number, name: string) {
  newCreditPeople.value.push({
    personId: personId,
    name: name,
    priority: 0
  });
}

async function editProduction() {
  try {
    // We'll be comparing each individual value since the api is slower than the client.
    if (newProductionCategory.value.id !== oldProductionCategory.value.id)
      productionData.value.categoryId = newProductionCategory.value.id;
    if (newProductionThumbnail.value.id !== oldProductionThumbnail.value.id)
      productionData.value.thumbnailId = newProductionThumbnail.value.id ?? null;

    await updateProductionMutation.mutate({
      data: productionData.value,
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
      });
    const vidsToCreate = newProductionVideos.value.filter((newVid) => !oldProductionVideos.value.some((oldVid) => oldVid.id === newVid.id));
    const vidsToDelete = oldProductionVideos.value.filter((oldVid) => !newProductionVideos.value.some((newVid) => oldVid.id === newVid.id));
    const vidsToUpdate = newProductionVideos.value.filter((newVid1) => !vidsToCreate.includes(newVid1)).filter((newVid2) => !vidsToDelete.includes(newVid2));

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

    const creditsToCreate = newCreditPeople.value.filter((newCredit) => !oldCreditPeople.value.some((oldCredit) => oldCredit.personId === newCredit.personId));
    const creditsToDelete = oldCreditPeople.value.filter((oldCredit) => !newCreditPeople.value.some((newCredit) => newCredit.personId === oldCredit.personId));
    const creditsToUpdate = newCreditPeople.value.filter((newCredit1) => !creditsToCreate.includes(newCredit1)).filter((newCredit2) => !creditsToDelete.includes(newCredit2));

    for (const credit of creditsToCreate)
      await createCreditMutation.mutate({
        data: {
          personId: credit.personId,
          productionId: props.productionId,
          priority: credit.priority,
          title: credit.title
        }
      });
    for (const credit of creditsToDelete)
      await deleteCreditMutation.mutate({
        id: credit.creditId
      });
    for (const credit of creditsToUpdate)
      await updateCreditMutation.mutate({
        id: credit.creditId,
        data: {
          priority: credit.priority,
          title: credit.title,
        }
      });

  } catch (e) {
    console.error(e);
    error.value = "Failed to edit production";
    return;
  }
  emit("save", props.productionId);
}

onMounted(() => {
  currentProduction.refetch();
})

</script>

<style scoped lang="scss">
.button-action {
  font-size: 10px;
}

.flex-container {
  display: flex;
}

.center-screen {
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
