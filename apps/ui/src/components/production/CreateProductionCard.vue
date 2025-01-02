<template>
  <v-card title="Create Production">
    <v-stepper :flat="true" v-model="step" :editable="validation">
      <template v-slot:actions="{ prev, next }">
        <v-stepper-header >
          <v-stepper-item :value="1" title="Details" :editable="true" :complete="step > 1" />
          <v-divider />
          <v-stepper-item :value="2" title="More Information" :complete="step > 2"/>
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
          <v-stepper-window-item :value="1">
            <v-form ref="requiredForm">
              <RequiredInput v-model="productionData" :start-time-missing="startTimeMissing" :end-time-missing="endTimeMissing" />
            </v-form>
          </v-stepper-window-item>
          <v-stepper-window-item :value="2" >
            <OptionalInput v-model="productionData"  v-model:tags="productionTags" />
          </v-stepper-window-item>
          <v-stepper-window-item :value="3">
            <CategoryTable :take="take" :productionCategory="productionData.category as Category"
               @setCategory="(category: Category) => { productionData.category = category; productionData.categoryId = category.id }"
            />
            <CategoryRow :productionCategory="productionData.category as Category" @close="productionData.category = {}; productionData.categoryId = null;" />
          </v-stepper-window-item>
          <v-stepper-window-item :value="4" >
            <ImageTable :take="take" :productionImages="productionImages" :thumbnail="productionData.thumbnail as Image"
              @setThumbnail="setThumbnail"
              @addImage="addImage"
            />
            <ImageRow :productionThumbnail="productionData.thumbnail as Image" :productionImages="productionImages" @close="productionData.thumbnailId = null" />
          </v-stepper-window-item>
          <v-stepper-window-item :value="5">
            <VideoTable :productionVideos="productionVideos" :take="take" @addVideo="addVideo" />
            <VideoRow :productionVideos="productionVideos" />
          </v-stepper-window-item>
          <v-stepper-window-item :value="6">
            <PeopleTable :take="take" :people="creditPeople" @addPerson="addPerson"/>
            <PeopleRow :creditPeople="creditPeople" />
          </v-stepper-window-item>
          <v-stepper-window-item :value="7">
            <v-alert v-if="error" color="red">
              {{ error }}
            </v-alert>
            <div style="display: grid; grid-template-columns: 1fr 1fr">
              <ReviewTable :productionData="productionData" :tags="productionTags" :category="productionData.category as Category" :thumbnail="productionData.thumbnail as Image"
                         :images="productionImages" :videos="productionVideos" :credits="creditPeople" />
              <PriorityEditor v-if="productionVideos.length > 0 || productionImages.length > 0 || creditPeople.length > 0"
                      :productionVideos="productionVideos" :productionImages="productionImages" :creditPeople="creditPeople" />
            </div>
	          <v-checkbox v-model="productionData.useDiscord" label="Post this to Discord?" false-icon="fa-square" />
          </v-stepper-window-item>
        </v-stepper-window>
        <v-stepper-actions @click:next="validate(next)" @click:prev="prev" prev-text="PREVIOUS" :next-text="step >= 7 ? 'CREATE' : 'NEXT'"
                           :disabled="loading ? 'next' : step <= 1 ? 'prev' : false">
        </v-stepper-actions>
      </template>
    </v-stepper>
  </v-card>
</template>

<script setup lang="ts">
import {watch, ref} from "vue";
import type {PropType} from "vue";
import {
  CreateProductionDocument, CreateProductionTagDocument, CreateProductionImageDocument,
  CreateProductionVideoDocument, CreateCreditDocument
} from "@/graphql/types";
import type {
  Category,
  Credit,
  Image,
  Person,
  Production,
  ProductionImage,
  ProductionVideo,
  ProductionTag,
  Video
} from "@/graphql/types";
import {useMutation} from "@vue/apollo-composable";
import RequiredInput from "@/components/production/ProductionDetailsInput/RequiredInput.vue";
import OptionalInput from "@/components/production/ProductionDetailsInput/OptionalInput.vue";
import CategoryTable from "@/components/production/ProductionDetailsInput/CategoryTable.vue";
import ImageTable from "@/components/production/ProductionDetailsInput/ImageTable.vue";
import VideoTable from "@/components/production/ProductionDetailsInput/VideoTable.vue";
import PriorityEditor from "@/components/production/ProductionDetailsInput/PriorityEditor.vue";
import ReviewTable from "@/components/production/ProductionDetailsInput/ReviewTable.vue";
import PeopleTable from "@/components/production/ProductionDetailsInput/PeopleTable.vue";
import PeopleRow from "@/components/production/ProductionDetailsInput/PeopleRow.vue";
import VideoRow from "@/components/production/ProductionDetailsInput/VideoRow.vue";
import ImageRow from "@/components/production/ProductionDetailsInput/ImageRow.vue";
import CategoryRow from "@/components/production/ProductionDetailsInput/CategoryRow.vue";

const createProductionMutation = useMutation(CreateProductionDocument);
const createTagsMutation = useMutation(CreateProductionTagDocument);
const createImageMutation = useMutation(CreateProductionImageDocument);
const createVideoMutation = useMutation(CreateProductionVideoDocument);
const createCreditMutation = useMutation(CreateCreditDocument);

const take = 20;
const requiredForm = ref();
const error = ref<string | null>(null);

const emit = defineEmits(["save"]);

const props = defineProps({
  data: {
    type: Object as PropType<Partial<Production>>,
    required: false
  }
})

const productionData = ref<Partial<Production>>({
  category: {},
  categoryId: null,
  closetLocation: "",
  eventLocation: "",
  closetTime: "",
  name: "",
  startTime: "",
  endTime: "",
  description: "",
  teamNotes: "",
  thumbnail: {},
  thumbnailId: null,
	useDiscord: true
});

const step = ref(1);
let firstTime = true;
const loading = ref(false);
const startTimeMissing = ref(false);
const endTimeMissing = ref(false);
const validation = ref(false);
const productionTags = ref<ProductionTag[]>([]);
const productionImages = ref<ProductionImage[]>([]);
const productionVideos = ref<ProductionVideo[]>([]);
const creditPeople = ref<Partial<Credit>[]>([]);

if (props.data) {
  const startTime = new Date(props.data.startTime);
  productionData.value.name = props.data.name;
  productionData.value.eventLocation = props.data.eventLocation;
  productionData.value.closetTime = new Date(startTime.setHours(startTime.getHours() - 3));
  productionData.value.startTime = new Date(props.data.startTime);
  productionData.value.endTime = new Date(props.data.endTime);
  firstTime = false;
}

watch((productionData.value), () => {
  if (productionData.value.closetTime) {
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
  loading.value = false;
  if (step.value >= 7) {
    loading.value = true;
    await createProduction();
    return;
  }
  await requiredForm.value.validate();
  if (validation.value)
    next();
  if (!productionData.value.startTime)
    startTimeMissing.value = true;
  if (!productionData.value.endTime)
    endTimeMissing.value = true;
}

async function createProduction() {
  let createdProduction;
  try {
    let production: Partial<Production> = {
      categoryId: productionData.value.categoryId ?? null,
      closetLocation: productionData.value.closetLocation ?? null,
      closetTime: productionData.value.closetTime ? new Date(productionData.value.closetTime).toISOString() : null,
      description: productionData.value.description,
      endTime: new Date(productionData.value.endTime).toISOString(),
      eventLocation: productionData.value.eventLocation,
      name: productionData.value.name,
      startTime: new Date(productionData.value.startTime).toISOString(),
      teamNotes: productionData.value.teamNotes,
      thumbnailId: productionData.value.thumbnailId ?? null,
	    useDiscord: productionData.value.useDiscord
    }

    createdProduction = await createProductionMutation.mutate({
      data: production
    });
    if (!createdProduction?.data?.production) {
      error.value = "Failed to create production";
      return;
    }
    const productionId = createdProduction?.data?.production.id;
    for (const productionTag of productionTags.value)
      await createTagsMutation.mutate({
        data: {
          productionId: productionId,
          tag: productionTag.tag
        }
      });

    for (const productionImage of productionImages.value) {
      await createImageMutation.mutate({
        data: {
          imageId: productionImage.imageId,
          productionId: productionId,
          priority: productionImage.priority || 0
        }
      });
    }
    for (const productionVideo of productionVideos.value)
      await createVideoMutation.mutate({
        data: {
          videoId: productionVideo.videoId,
          productionId: productionId,
          priority: productionVideo.priority || 0
        }
      });
    for (const person of creditPeople.value)
      await createCreditMutation.mutate({
        data: {
          personId: person.personId,
          productionId: productionId,
          priority: person.priority || 0,
          title: person.title
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

function setThumbnail(image: Image) {
  productionData.value.thumbnail = image;
  productionData.value.thumbnailId = image.id;
}

function addImage(image: Image) {
  productionImages.value.push({
    image: image,
    imageId: image.id,
    priority: 0
  });
}

function addVideo(video: Video) {
  productionVideos.value.push({
    video: video,
    videoId: video.id,
    priority: 0
  });
}

function addPerson(person: Person) {
  creditPeople.value.push({
    person: person,
    personId: person.id,
    priority: 0
  });
}


watch(productionData, async () => {
  if (requiredForm.value) {
    const valid = await requiredForm.value.validate();
    validation.value = valid.valid && !!productionData.value.eventLocation && !!productionData.value.startTime && !!productionData.value.endTime;
  }
}, {deep: true});

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

.missing {
  border-style: solid;
  border-radius: 2.5%;
  border-width: 1px;
  border-color: #FF1744;
}
</style>
