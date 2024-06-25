<template>
  <v-card title="Create Production">
    <v-stepper :flat="true" v-model="step" :editable="editable">
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
          <v-stepper-window-item :value="1">
            <v-form ref="requiredForm">
              <RequiredInput v-model="productionData" :closet-time-missing="closetTimeMissing"
                             :start-time-missing="startTimeMissing" :end-time-missing="endTimeMissing" />
            </v-form>
          </v-stepper-window-item>
          <v-stepper-window-item :value="2" >
            <OptionalInput v-model="productionData" :tags="productionTags" @update:tags="(value: string[]) => productionTags = value" />
          </v-stepper-window-item>
          <v-stepper-window-item :value="3">
            <CategoryTable :take="take" :productionCategory="productionCategory"
               @setCategory="
               (category: any) => productionCategory = {
                  id: category.id,
                  name: category.name
                }"
            />
            <CategoryRow :productionCategory="productionCategory" @close="productionCategory = { id: 0, name: ''}" />
          </v-stepper-window-item>
          <v-stepper-window-item :value="4" >
            <ImageTable :take="take" :productionImages="productionImages" :thumbnailId="productionThumbnail.id"
              @setThumbnail="setThumbnailId"
              @addImage="addImage"
            />
            <ImageRow :productionThumbnail="productionThumbnail" :productionImages="productionImages" />
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
              <ReviewTable :productionData="productionData" :tags="productionTags" :category="productionCategory" :thumbnail="productionThumbnail"
                         :images="productionImages" :videos="productionVideos" :credits="creditPeople" />
              <PriorityEditor v-if="productionVideos.length > 0 || productionImages.length > 0 || creditPeople.length > 0"
                      :productionVideos="productionVideos" :productionImages="productionImages" :creditPeople="creditPeople" />
            </div>
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
import {watch, ref, computed} from "vue";
import type {PropType} from "vue";
import {
  CreateProductionDocument, CreateProductionTagDocument, CreateProductionImageDocument,
  CreateProductionVideoDocument, CreateCreditDocument
} from "@/graphql/types";
import type { Production } from "@/graphql/types";
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
  id: number,
  url: string,
  priority: number,
}

interface Credit {
  personId: number,
  name: string,
  title?: string,
  priority?: number
}

const step = ref(1);
let firstTime = true;
const loading = ref(false);
const closetTimeMissing = ref(false);
const startTimeMissing = ref(false);
const endTimeMissing = ref(false);
const productionTags = ref<string[]>([]);
const productionCategory = ref({id: 0, name: ''});
const productionThumbnail = ref<urlInterface>({id: 0, url: '', priority: 0});
const productionImages = ref<urlInterface[]>([]);
const productionVideos = ref<urlInterface[]>([]);
const creditPeople = ref<Credit[]>([]);

const editable = computed(() => {
  return !(!productionData.value.name || !productionData.value.closetLocation || !productionData.value.eventLocation ||
    !productionData.value.closetTime || !productionData.value.startTime || !productionData.value.endTime);
});

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
  if (step.value >= 7) {
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
      await createVideoMutation.mutate({
        data: {
          videoId: productionVideos.value[i].id,
          productionId: productionId,
          // DON'T ASK QUESTIONS, JUST TRUST ME
          priority: parseInt(productionVideos.value[i].priority.toString())
        }
      });
    for (const person of creditPeople.value)
      await createCreditMutation.mutate({
        data: {
          personId: person.personId,
          productionId: productionId,
          priority: person.priority,
          title: person.title
        }
      })
  } catch (e) {
    console.error(e);
    error.value = "Failed to create production";
    loading.value = false;
    return;
  }
  emit("save", createdProduction?.data?.production.id);
}

function setThumbnailId(imageId: number, url: string) {
  productionThumbnail.value = {
    id: imageId,
    url: url,
    priority: 0
  }
}

function addImage(imageId: number, url: string) {
  productionImages.value.push({
    id: imageId,
    url: url,
    priority: 0
  });
}

function addVideo(videoId: number, url: string) {
  productionVideos.value.push({
    id: videoId,
    url: url,
    priority: 0
  });
}

function addPerson(personId: number, name: string) {
  creditPeople.value.push({
    personId: personId,
    name: name,
    priority: 0
  });
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

.missing {
  border-style: solid;
  border-radius: 2.5%;
  border-width: 1px;
  border-color: #FF1744;
}
</style>
