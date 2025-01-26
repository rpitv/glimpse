<template>
  <v-card :title="`Edit Production ${productionId}`">
    <div v-if="currentProduction.loading.value" class="center-screen" >
      <div>
        <v-progress-circular color="error" indeterminate></v-progress-circular>
        <h2 class="mb-10">Loading</h2>
      </div>
    </div>
    <v-stepper v-else :flat="true" v-model="step" :editable="validation">
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
                <RequiredInput v-model="productionData" :start-time-missing="startTimeMissing" :end-time-missing="endTimeMissing" />
            </v-form>
          </v-stepper-window-item>
          <v-stepper-window-item :value="2" >
            <OptionalInput v-model="productionData" v-model:tags="newProductionTags" />
          </v-stepper-window-item>
          <v-stepper-window-item :value="3">
            <CategoryTable :take="take" :productionCategory="productionData.category as Category"
              @setCategory="(category: Category) => { productionData.category = category; productionData.categoryId = category.id }"
            />
            <CategoryRow :productionCategory="productionData.category as Category"
             @close="productionData.category = {}; productionData.categoryId = null;" />
          </v-stepper-window-item>
          <v-stepper-window-item :value="4" >
              <ImageTable :take="take" :productionImages="newProductionImages" :thumbnail="productionData.thumbnail as Image"
                @setThumbnail="setThumbnail"
                @addImage="addImage"
              />
            <ImageRow :productionThumbnail="productionData.thumbnail as Image" :productionImages="newProductionImages"
                @close="productionData.thumbnail = {}; productionData.thumbnailId = null" />
          </v-stepper-window-item>
          <v-stepper-window-item :value="5">
            <VideoTable :productionVideos="newProductionVideos" :take="take" :productionName="productionData.name as string" @addVideo="addVideo" />
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
              <ReviewTable :productionData="productionData" :tags="newProductionTags" :category="productionData.category as Category"
                   :thumbnail="productionData.thumbnail as Image" :images="newProductionImages" :videos="newProductionVideos" :credits="newCreditPeople" />
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
import { watch, ref, onMounted } from "vue";
import type { PropType } from "vue";
import {
  UpdateProductionDocument, CreateProductionTagDocument, CreateProductionImageDocument,
  CreateProductionVideoDocument, ProductionDetailsDocument, DeleteProductionImageDocument,
  DeleteProductionTagDocument, DeleteProductionVideoDocument, UpdateProductionImageDocument,
  UpdateProductionVideoDocument, CreateCreditDocument, UpdateCreditDocument, DeleteCreditDocument,
} from "@/graphql/types";
import type {
  Category,
  Credit,
  Image,
  Person,
  Production,
  ProductionImage,
  ProductionTag,
  ProductionVideo,
  Video
} from "@/graphql/types";
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

const step = ref(0);
const loading = ref(false);
const startTimeMissing = ref(false);
const endTimeMissing = ref(false);
const validation = ref(false);
const take = 20;
const oldProductionTags = ref<ProductionTag[]>([]);
const newProductionTags = ref<ProductionTag[]>([]);
const oldProductionImages = ref<ProductionImage[]>([]);
const newProductionImages = ref<ProductionImage[]>([]);
const oldProductionVideos = ref<ProductionVideo[]>([]);
const newProductionVideos = ref<ProductionVideo[]>([]);
const oldCreditPeople = ref<Credit[]>([]);
const newCreditPeople = ref<Credit[]>([]);

currentProduction.onResult((result) => {
  if (result.loading) return;
  const production = result.data?.production;
  oldCreditPeople.value = [];
  newCreditPeople.value = [];

  productionData.value = {
    category: JSON.parse(JSON.stringify(production?.category)) ?? {},
    categoryId: production?.categoryId,
    closetLocation: production?.closetLocation,
    closetTime: production?.closetTime,
    description: production?.description,
    endTime: production?.endTime,
    eventLocation: production?.eventLocation,
    name: production?.name,
    startTime: production?.startTime,
    teamNotes: production?.teamNotes,
    thumbnail: JSON.parse(JSON.stringify(production?.thumbnail)) ?? {},
    thumbnailId: production?.thumbnailId,
  }

  const tags = production?.tags;
  if (tags) {
    for (let i = 0; i < tags.length; i++) {
      oldProductionTags.value[i] = tags[i];
      newProductionTags.value[i] = JSON.parse(JSON.stringify(tags[i]));
    }
  }

  const images = production?.images;
  if (images) {
    for (let i = 0; i < images?.length; i++) {
      oldProductionImages.value[i] = images[i];
      newProductionImages.value[i] = JSON.parse(JSON.stringify(images[i]));
    }
  }
  const videos = production?.videos;
  if (videos) {
    for (let i = 0; i < videos.length; i++) {
      oldProductionVideos.value[i] = videos[i];
      newProductionVideos.value[i] = JSON.parse(JSON.stringify(videos[i]));
    }
  }

  const credits = production?.credits;
  if (credits) {
    for (let i = 0; i < credits.length; i++) {
      oldCreditPeople.value[i] = credits[i];
      // The data we are copying is readonly (i think) so we'll perform a deep copy
      newCreditPeople.value[i] = JSON.parse(JSON.stringify(credits[i]));
    }
  }
})

async function validate(next: any) {
  if (step.value >= 7) {
    loading.value = true;
    await editProduction();
    loading.value = false;
    return;
  }
  if (validation.value)
    next();
  if (!productionData.value.startTime)
    startTimeMissing.value = true;
  if (!productionData.value.endTime)
    endTimeMissing.value = true;

}

function setThumbnail(image: Image) {
  productionData.value.thumbnail = image;
  productionData.value.thumbnailId = image.id;
}

function addImage(image: Image) {
  newProductionImages.value.push({
    image: image,
    imageId: image.id,
    priority: 0
  });
}

function addVideo(video: Video) {
  newProductionVideos.value.push({
    video: video,
    videoId: video.id,
    priority: 0
  });
}

function addPerson(person: Person) {
  newCreditPeople.value.push({
    person: person,
    personId: person.id,
    priority: 0
  });
}

async function editProduction() {
  try {
    await updateProductionMutation.mutate({
      data: {
        categoryId: productionData.value.categoryId,
        closetLocation: productionData.value.closetLocation,
        closetTime: productionData.value.closetTime,
        description: productionData.value.description,
        endTime: productionData.value.endTime,
        eventLocation: productionData.value.eventLocation,
        name: productionData.value.name,
        startTime: productionData.value.startTime,
        teamNotes: productionData.value.teamNotes,
        thumbnailId: productionData.value.thumbnailId,
      },
      id: props.productionId
    });

    const tagsToCreate = newProductionTags.value.filter((newTag) => !oldProductionTags.value.some((oldTag) => oldTag.tag === newTag.tag));
    const tagsToDelete = oldProductionTags.value.filter((oldTag) => !newProductionTags.value.some((newTag) => oldTag.tag === newTag.tag));

    for (const tag of tagsToCreate)
      await createTagMutation.mutate({
        data: {
          productionId: props.productionId,
          tag: tag.tag
        }
      })
    for (const tag of tagsToDelete)
      await deleteTagMutation.mutate({
        id: tag.id
      })


    const imgsToCreate = newProductionImages.value.filter((newImg) => !oldProductionImages.value.some((oldImg) => oldImg.image?.id === newImg.image?.id));
    const imgsToDelete = oldProductionImages.value.filter((oldImg) => !newProductionImages.value.some((newImg) => oldImg.image?.id === newImg.image?.id));
    const imgsToUpdate = newProductionImages.value.filter((newImg) => !imgsToCreate.includes(newImg)).filter((newImg) => !imgsToDelete.includes(newImg));

    for (const image of imgsToCreate)
      await createImageMutation.mutate({
        data: {
          imageId: image.imageId,
          productionId: props.productionId,
          priority: image.priority || 0
        }
      })
    for (const image of imgsToDelete)
      await deleteImageMutation.mutate({
        id: image.id
      })
    for (const image of imgsToUpdate)
      await updateImageMutation.mutate({
        id: image.id,
        data: {
          priority: parseInt(image.priority?.toString() as string)
        }
      });
    const vidsToCreate = newProductionVideos.value.filter((newVid) => !oldProductionVideos.value.some((oldVid) => oldVid.id === newVid.id));
    const vidsToDelete = oldProductionVideos.value.filter((oldVid) => !newProductionVideos.value.some((newVid) => oldVid.id === newVid.id));
    const vidsToUpdate = newProductionVideos.value.filter((newVid1) => !vidsToCreate.includes(newVid1)).filter((newVid2) => !vidsToDelete.includes(newVid2));

    for (const video of vidsToCreate)
      await createVideoMutation.mutate({
        data: {
          videoId: video.videoId,
          productionId: props.productionId,
          priority: video.priority || 0
        }
      })
    for (const video of vidsToDelete)
      await deleteVideoMutation.mutate({
        id: video.id
      })
    for (const video of vidsToUpdate)
      await updateVideoMutation.mutate({
        id: video.id,
        data: {
          priority: parseInt(video.priority?.toString() as string)
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
        id: credit.id
      });
    for (const credit of creditsToUpdate)
      await updateCreditMutation.mutate({
        id: credit.id,
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

watch(productionData, async () => {
	if (requiredForm.value) {
		const valid = await requiredForm.value.validate();
		validation.value = valid.valid && !!productionData.value.eventLocation && !!productionData.value.startTime && !!productionData.value.endTime;
	}
}, {deep: true});

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
